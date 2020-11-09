#!/usr/bin/env node
import 'source-map-support/register';

import { App as AmplifyApp, GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify';
import { App, Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';

class WorkshopWebStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const oauthToken = SecretValue.secretsManager('GITHUB_OAUTH_TOKEN');
        const codeProvider = new GitHubSourceCodeProvider({
            owner: 'petrabarus',
            repository: 'aws-cicd-cdk-workshop',
            oauthToken: oauthToken,
        });
        const app = new AmplifyApp(this, 'AWS CI/CD Workshop', {
            sourceCodeProvider: codeProvider,
        });
        app.addBranch('main');
    }
}

const app = new App();
new WorkshopWebStack(app, 'WorkshopWebStack');
