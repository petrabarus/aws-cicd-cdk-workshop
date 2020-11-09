+++
title = "6. Creating Deploy Stage"
weight = 6
+++

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
  private service: ecs.BaseService;
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
        image: ecs.ContainerImage.fromRegistry('nginx:latest'),
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
      this.createStageDeploy(buildOutput)
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
  
  createStageDeploy(input: codepipeline.Artifact): codepipeline.StageOptions {
    this.imageRepository.grantPull(this.service.taskDefinition.executionRole!);
    return {
        stageName: 'DeployToProduction',
        actions: [
          new codepipelineActions.EcsDeployAction({
            actionName: 'ProductionEcsDeployAction',
            input: input,
            service: this.service,
          })
        ],
    };
  }
}
```

Apply the change.
```bash
cdk deploy
```

Try editing the `src/index.html` to new value.

```html
<h1>Hello all!</h1>
```

Now we commit and push the change
```
git add .
git commit -m "add deploy."
git push origin master
```

