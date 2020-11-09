+++
title = "1. Creating new CDK Application"
weight = 1
+++

Now we are creating a new directory for the application.

```bash
mkdir myapp && cd myapp
```

To initiate the CDK application, execute command below.
```bash
cdk init app --language typescript
```

Run the command below in a new terminal to watch modification to Typescript files.
```
npm run watch
```

To see the generate CloudFormation template, execute command below.
```
cdk synth
```

To deploy the CDK application, execute command below.
```
cdk deploy
```