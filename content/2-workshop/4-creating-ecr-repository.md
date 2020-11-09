+++
title = "4. Creating ECS Cluster"
weight = 4
+++


```bash
npm i @aws-cdk/aws-ecr
```

Overwrite file `myapp-stack.ts` with the code below.

```typescript
import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';

export class MyappStack extends cdk.Stack {
  private codeRepository: codecommit.Repository;
  private cluster: ecs.Cluster;
  private service: ecs.IService;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createCodeCommitRepository();
    this.createECSApplication();
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
}
```

```
cdk deploy
```