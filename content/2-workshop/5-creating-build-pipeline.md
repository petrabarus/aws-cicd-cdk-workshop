+++
title = "5. Creating Build Pipeline"
weight = 5
+++

Install CodePipeline and CodeBuild dependencies.
```
npm i @aws-cdk/aws-iam @aws-cdk/aws-codebuild @aws-cdk/aws-codepipeline  @aws-cdk/aws-codepipeline-actions
```

Create file `buildspec.yml` in the root directory of the application.
```yml
version: '0.2'
phases:
  pre_build:
    commands:
    - aws --version
    - $(aws ecr get-login --region ${AWS_DEFAULT_REGION} --no-include-email |  sed 's|https://||')
    - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
    - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
    - docker build -t $REPOSITORY_URI:latest .
    - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
  post_build:
    commands:
    - docker push $REPOSITORY_URI:latest
    - docker push $REPOSITORY_URI:$IMAGE_TAG
    - printf "[{\"name\":\"${CONTAINER_NAME}\",\"imageUri\":\"${REPOSITORY_URI}:latest\"}]" > imagedefinitions.json
artifacts:
  files:
  - imagedefinitions.json

```

Overwrite file `myapp-stack.ts` with this.
```typescript
import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as ecr from '@aws-cdk/aws-ecr';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';

export class MyappStack extends cdk.Stack {
  private codeRepository: codecommit.Repository;
  private cluster: ecs.Cluster;
  private service: ecs.IService;
  private imageRepository: ecr.Repository;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createCodeCommitRepository();
    this.createECSApplication();
    this.createECRRepository();
    this.createPipeline();
  }
  
  createCodeCommitRepository() {
    this.codeRepository = new codecommit.Repository(this, 'Repository', {
      repositoryName: 'MyRepository'
    });
  }
  
  createECSApplication() {
    this.cluster = new ecs.Cluster(this, 'Cluster');
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster: this.cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('.'),
        containerName: 'web',
      },
    });
    
    this.service = fargateService.service;
  }
  
  createECRRepository() {
    this.imageRepository = new ecr.Repository(this, 'ImageRepository');
    new cdk.CfnOutput(this, 'ImageRepositoryURI', { value: this.imageRepository.repositoryUri });
  }
  
  createPipeline() {
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      stages: this.createPipelineStages(),
    });
  }
  
  createPipelineStages() {
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    return [
      this.createStageSource(sourceOutput),
      this.createStageBuild(sourceOutput, buildOutput),
    ];
  }
  
  createStageSource(output: codepipeline.Artifact): codepipeline.StageOptions {    
    return {
      stageName: 'Source',
      actions: [
        new codepipelineActions.CodeCommitSourceAction({
            actionName: 'CodeCommit',
            repository: this.codeRepository,
            output: output,
        })
      ]
    };
  }
  
  createStageBuild(input: codepipeline.Artifact, output: codepipeline.Artifact): codepipeline.StageOptions {
    const project = new codebuild.PipelineProject(this, 'ImageBuildProject', {
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged: true,
            },
            buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
            environmentVariables: {
                REPOSITORY_URI: {value: this.imageRepository.repositoryUri},
                CONTAINER_NAME: {value: "web"},
            }
        });

    this.imageRepository.grantPullPush(project.grantPrincipal);
    return {
      stageName: 'Build',
      actions: [
        new codepipelineActions.CodeBuildAction({
            actionName: 'ImageBuildAction',
            input: input,
            outputs: [output],
            project: project,
        })
      ]
    };
  }
}

```

Execute following line to apply the change.
```bash
cdk deploy
```

Now we commit the change.
```bash
git add .
git commit -m "Add build pipeline."
git push origin master
```