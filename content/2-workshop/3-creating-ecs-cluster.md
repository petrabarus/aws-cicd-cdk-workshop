+++
title = "3. Creating ECS Cluster"
weight = 3
+++

In this part, you are going to deploy a simple "Hello World" application to ECS cluster. Amazon ECS is a fully managed container orchestration service.

**STEP 1** You are going to need ECS construct library and ECS Patterns L3 constructs library. ECS Patterns library provides higher-level Amazon ECS constructs which follow common architectural patterns. 

Execute command below.

```bash
npm i @aws-cdk/aws-ecs @aws-cdk/aws-ecs-patterns
```

**STEP 2** Add `Dockerfile` in the project root. This will define our container that serves a "Hello World" HTML file. The file will contain definition below.

```Dockerfile
#########
# Simple Dockerfile for running HTML file.
# To run execute
# docker build -t webserver .
# docker run -it --rm -d -p 8080:80 --name web webserver
#########
FROM nginx:latest
COPY ./src/index.html /usr/share/nginx/html/index.html
```

**STEP 3** Create a new directory `src` in the project directory and create new file `index.html` in that new directory. The HTML file should contain text below.

```html
<h1>Hello World!</h1>
```

**STEP 4** Now create a new file `.dockerignore` in the project root directory. You need this to prevent unnecessary files to be compiled in our docker container image to keep the image small. The file should look like below.

```
cdk.out
node_modules
```

**STEP 5**  Overwrite file `lib/myapp-stack.ts` with this.

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
}
```

**STEP 6** Now to deploy the application, execute command below.

```
cdk deploy
```

In this step, the CDK will show a list of permissions change to approve. Input `Y` to approve and continue.

![screenshot-2-3-1](/aws-cicd-cdk-workshop/images/content/screenshot-2-3-1.png)

Please wait for a while for CDK to complete the command. By the end of the command, you will see output a bit similar to below.

![screenshot-2-3-2](/aws-cicd-cdk-workshop/images/content/screenshot-2-3-2.png)

The `ServiceServiceURL` will contain the URL where you can check the application.

![screenshot-2-3-6](/aws-cicd-cdk-workshop/images/content/screenshot-2-3-6.png)

Open the URL to check the application.

![screenshot-2-3-4](/aws-cicd-cdk-workshop/images/content/screenshot-2-3-4.png)

To see the created ECS cluster, open the [**ECS console**](https://console.aws.amazon.com/ecs/home) and see you have new ECS cluster.

![screenshot-2-3-5](/aws-cicd-cdk-workshop/images/content/screenshot-2-3-5.png)

Click the orange arrow on the right hand side to continue to next step.