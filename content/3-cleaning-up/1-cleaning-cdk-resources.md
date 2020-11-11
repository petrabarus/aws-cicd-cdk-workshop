+++
title = "1. Cleaning Provisioned Resources"
weight = 1
+++

In this part you will remove all resources that provisioned by AWS CDK.

**STEP 1** In the terminal execute the command below. This will remove the stack that you created previously.

```bash
cdk destroy
```

Input `y` when prompted "Are you sure you want to delete: MyappStack (y/n)?".

The process will take a while.

**STEP 2** Execute the command below to delete the CDK assets resources.

```bash
aws s3 rm --recursive s3://$(aws s3 ls | grep cdktoolkit | head -n 1 | cut -d' ' -f3)
aws cloudformation delete-stack --stack-name CDKToolkit
```

Click the orange arrow on the right hand side to continue.