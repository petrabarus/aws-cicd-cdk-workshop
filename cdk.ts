#!/usr/bin/env node
import 'source-map-support/register';

import { App as AmplifyApp, GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify';
import { BuildSpec } from '@aws-cdk/aws-codebuild';
import { App, Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';

class WorkshopWebStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const oauthToken = SecretValue.secretsManager('GITHUB_OAUTH_TOKEN');
        const codeProvider = new GitHubSourceCodeProvider({
            owner: 'petrabarus',
            repository: 'aws-cicd-cdk-workshop',
            oauthToken: oauthToken
        });
        const buildspec = BuildSpec.fromSourceFilename('buildspec.yml');

        const app = new AmplifyApp(this, 'AWS CI/CD Workshop', {
            sourceCodeProvider: codeProvider,
            buildSpec: buildspec
        });
        app.addBranch('master');
    }
}

const app = new App();
new WorkshopWebStack(app, 'WorkshopWebStack');
