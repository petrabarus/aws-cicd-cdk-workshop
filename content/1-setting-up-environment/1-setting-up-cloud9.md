+++
title = "1. Setting Up AWS Cloud9"
weight = 1
+++

Now you are going to provision your AWS Cloud9 Integrated Development Environment.

**STEP 1** Go to [AWS Cloud9 Console](https://console.aws.amazon.com/cloud9/home).

![screenshot-1-1](/aws-cicd-cdk-workshop/images/content/screenshot-1-1.png)

**STEP 2** Click [**Create environment**](https://console.aws.amazon.com/cloud9/home/create)

**STEP 3** Put "CICD-CDK-Workshop" or any name you like in the **Name** field. You can leave the description empty. Click **Next step** to proceed.

![screenshot-1-2](/aws-cicd-cdk-workshop/images/content/screenshot-1-2.png)

**STEP 4** In the **Environment settings**, choose below configuration

1. "Create a new EC2 instance for environment (direct access)" in the **Environment type**
2. "t2.micro (1 GiB RAM + 1 vCPU)" in the **Instance type**
3. "Amazon Linux 2" in the **Platform**

Leave everything else as default.
Click **Next step** to proceed.

![screenshot-1-3](/aws-cicd-cdk-workshop/images/content/screenshot-1-3.png)

![screenshot-1-4](/aws-cicd-cdk-workshop/images/content/screenshot-1-4.png)

**STEP 5** In the step **Review**, make sure the configurations are correct. Click **Create environment** to proceed.

![screenshot-1-5](/aws-cicd-cdk-workshop/images/content/screenshot-1-5.png)

**STEP 6** Please wait for a couple of minutes while an instance of AWS Cloud9 is being set up.

![screenshot-1-6](/aws-cicd-cdk-workshop/images/content/screenshot-1-6.png)

**FINAL** Now the new AWS Cloud9 IDE is ready to use.

![screenshot-1-7](/aws-cicd-cdk-workshop/images/content/screenshot-1-7.png)

Click the orange arrow on the right hand side to continue to next step.