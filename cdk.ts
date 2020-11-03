#!/usr/bin/env node
import 'source-map-support/register';
import { App, Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { StaticWebsite } from '@cloudcomponents/cdk-static-website';

class WorkshopWebStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    
        const site = new StaticWebsite(this, 'StaticWebsite', {
            bucketConfiguration: {
                source: './public/',
                removalPolicy: RemovalPolicy.DESTROY,
            },
        });
    }
}

const app = new App();
new WorkshopWebStack(app, 'WorkshopWebStack');
