+++
title = "2. Environment Check and Set Up"
weight = 2
+++

## Check NPM version

To check NPM version execute command below in the terminal.
```bash
$ npm --version
```

The output should look like this.
```text
6.14.6
```

## Check and Update CDK

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

To initiate the CDK bootstrap asset, execute command below.
```bash
cdk bootstrap
```

## Installing Git helper for CodeCommit

Check whether PIP is already installed in the system, execute command below.
```bash
pip --version
```

The output should look like below.
```text
pip 9.0.3 from /usr/lib/python3.6/dist-packages (python 3.6)
```

To install the git helper for CodeCommit, execute command below.
```bash
pip install git-remote-codecommit
```