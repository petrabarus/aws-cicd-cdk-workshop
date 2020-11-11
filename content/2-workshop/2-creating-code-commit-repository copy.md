+++
title = "2. Creating CodeCommit Repository"
weight = 2
+++

In this part, you are going to create an AWS CodeCommit repository. AWS CodeCommit is a fully-managed source control service that hosts secure Git-based repositories. It makes it easy for teams to collaborate on code in a secure and highly scalable ecosystem.

### Provision AWS CodeCommit Repository

**STEP 1** Install AWS CodeCommit constructs for CDK by executing command below in our project directory.

```
npm i @aws-cdk/aws-codecommit
```

**STEP 2** You are going to provision a new CodeCommit repository using CDK. Overwrite file `lib/myapp-stack.ts` with the follow code.

```typescript
import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';

export class MyappStack extends cdk.Stack {
  private codeRepository: codecommit.Repository;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createCodeCommitRepository();
  }
  
  createCodeCommitRepository() {
    this.codeRepository = new codecommit.Repository(this, 'CodeRepository', {
      repositoryName: 'MyRepository'
    });
  }
}
```

**STEP 3** Deploy the CDK application. Execute command below.
```bash
cdk deploy
```

To check our newly created repository, open [**AWS CodeCommit console**](https://console.aws.amazon.com/codesuite/home).


![screenshot-2-2-1](/aws-cicd-cdk-workshop/images/content/screenshot-2-2-1.png)

If you open the created repository, you will see that the repository is still empty.

![screenshot-2-2-2](/aws-cicd-cdk-workshop/images/content/screenshot-2-2-2.png)

### Committing Code to AWS CodeCommit Repository.

Here you will commit our code to the newly created repository.

**STEP 1** To add the repository as remote repository, execute command below.

```bash
git remote add origin codecommit://MyRepository
```

**STEP 2** To add current code, execute command below.

```bash
git add .
git commit -m "Add codecommit repository."
```

**STEP 3** To push the committed code to the repository, execute command below.

```bash
git push origin master
```

If you reopen the repository again in the console, you will see the committed code is now stored in the repository.

![screenshot-2-2-3](/aws-cicd-cdk-workshop/images/content/screenshot-2-2-3.png)

Click the orange arrow on the right hand side to continue to next step.