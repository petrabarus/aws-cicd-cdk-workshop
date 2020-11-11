+++
title = "2. Environment Check and Set Up"
weight = 2
+++

Now you are going to check your environment to make sure you can use it to do the worksho.

### Check NPM version

You are going to need Node Package Manager to install CDK construct libraries in our project.

To check NPM version execute command below in the terminal.
```bash
npm --version
```

The output should look a bit similar to this.
```text
6.14.6
```
### Check and Update CDK

Now you need to make sure CDK is installed in our environment and update it to latest version.

To check CDK version execute command below in the terminal.
```bash
cdk --version
```

The output should look like this.
```text
1.70.0 (build c145314)
```

To update the CDK version to latest, execute command below in the terminal.
```bash
npm i -g -f aws-cdk@latest
```

### Installing Git helper for CodeCommit

To commit code to AWS CodeCommit using AWS credentials you are going to need to have Git helper for CodeCommit installed in our environment.

Check whether PIP is already installed in the system, execute command below.

```bash
pip --version
```

The output should look a bit simlar to below.
```text
pip 9.0.3 from /usr/lib/python3.6/dist-packages (python 3.6)
```

To install the git helper for CodeCommit, execute command below.
```bash
sudo pip install git-remote-codecommit
```

Now your environment is ready for the workshop. Click the orange arrow on the right hand side to continue to next step.