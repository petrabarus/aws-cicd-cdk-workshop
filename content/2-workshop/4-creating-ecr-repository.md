+++
title = "4. Creating ECR Container Image Repository"
weight = 4
+++

In this part you will create an ECR container image repository. Amazon Elastic Container Registry (ECR) is a fully-managed Docker container registry that makes it easy for developers to store, manage, and deploy Docker container images. Amazon ECR is integrated with Amazon Elastic Container Service (ECS), simplifying your development to production workflow. 

**STEP 1** You are going to need to install ECR construct library. Execute the following command.

```bash
npm i @aws-cdk/aws-ecr
```

**STEP 2** Overwrite file `lib/myapp-stack.ts` with the code below.

```typescript
import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as ecr from '@aws-cdk/aws-ecr';

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
}
```

**STEP 3** To apply the changes, execute the command below.

```
cdk deploy
```

When the deploy finished, you will see the URL of the new ECR repository in the output.

![screenshot-2-4-0](/aws-cicd-cdk-workshop/images/content/screenshot-2-4-0.png)

To see the created ECR repository, visit the [**ECR console**](https://console.aws.amazon.com/ecr/home). You will see a new repository created.

![screenshot-2-4-1](/aws-cicd-cdk-workshop/images/content/screenshot-2-4-1.png)

If you click on the new repository, you will see that there is no image stored yet.

![screenshot-2-4-2](/aws-cicd-cdk-workshop/images/content/screenshot-2-4-2.png)

### Pushing New Image to ECR Repository

Now you are going to try pushing a new image to the ECR repository. 

Click on the **View push commands**, you will see steps and commands to execute to build local image and push it to the ECR repository.

![screenshot-2-4-3](/aws-cicd-cdk-workshop/images/content/screenshot-2-4-3.png)

The execution will look like something below.

![screenshot-2-4-4](/aws-cicd-cdk-workshop/images/content/screenshot-2-4-4.png)

Try refreshing the new ECR repository in the ECR console. Now you will see that you have a new image created.

![screenshot-2-4-5](/aws-cicd-cdk-workshop/images/content/screenshot-2-4-5.png)

Click the orange arrow on the right hand side to continue to next step.