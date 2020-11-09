+++
title = "2. Creating CodeCommit Repository"
weight = 2
+++

To install AWS CodeCommit constructs for CDK, execute command below.
```
npm i @aws-cdk/aws-codecommit
```

Overwrite file `lib/myapp-stack.ts` with the follow code.

```typescript
import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';

export class MyappStack extends cdk.Stack {
  private codeRepository: codecommit.Repository;
  
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
}
```

Now we can deploy the CDK application.
```bash
cdk deploy
```

To add the 
```bash
git remote add origin codecommit://MyRepository
```

```bash
git add .
git commit -m "Add codecommit repository."
```

```bash
git push origin master
```