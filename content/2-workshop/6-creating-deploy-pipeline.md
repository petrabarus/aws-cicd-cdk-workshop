+++
title = "6. Creating Deploy Stage"
weight = 6
+++

In this part you are going to create a final stage of the pipeline "Deploy" where the newly created image will be deployed to the ECS cluster.

We already have required CDK constructs, so there will be no construct library installation steps here.

**STEP 1** `lib/myapp-stack.ts` with this.

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
    this.codeRepository = new codecommit.Repository(this, 'CodeRepository', {
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
      this.createStageDeploy(buildOutput)
    ];
  }
  
  createStageSource(output: codepipeline.Artifact): codepipeline.StageOptions {    
    const action = new codepipelineActions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: this.codeRepository,
      output: output,
    });
    return {
      stageName: 'Source',
      actions: [
        action    
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
    
    const action = new codepipelineActions.CodeBuildAction({
      actionName: 'ImageBuildAction',
      input: input,
      outputs: [output],
      project: project,
    });
    
    return {
      stageName: 'Build',
      actions: [
        action
      ]
    };
  }
  
  createStageDeploy(input: codepipeline.Artifact): codepipeline.StageOptions {
    this.imageRepository.grantPull(this.service.taskDefinition.executionRole!);

    const action = new codepipelineActions.EcsDeployAction({
      actionName: 'ProductionEcsDeployAction',
      input: input,
      service: this.service,
    });

    return {
        stageName: 'DeployToProduction',
        actions: [
          action
        ],
    };
  }
}
```

**STEP 2** To apply the change, execute the command below.

```bash
cdk deploy
```

Input `y` on the prompt.

When the progess finishes, check the pipeline again and you will see that now you have one additional stage "DeployToProduction". 

![screenshot-2-6-1](/aws-cicd-cdk-workshop/images/content/screenshot-2-6-1.png)

Next you will commit a code to deploy to the Amazon ECS cluster.

### Committing Code to Trigger Deploy

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

Open the pipeline again and you will see the build started.

![screenshot-2-6-3](/aws-cicd-cdk-workshop/images/content/screenshot-2-6-3.png)

You wait for few minutes for the deploy to finish. When the pipeline finish, open the load balancer URL.

You will see the new HTML code deployed. If it hasn't yet, wait for few more minutes, it takes some time for the cluster to deploy.

![screenshot-2-6-2](/aws-cicd-cdk-workshop/images/content/screenshot-2-6-2.png)

Congratulations, you now have successfully build a new CI/CD Pipeline using AWS CDK!

Click the orange arrow on the right hand side to continue to clean up all the resources.