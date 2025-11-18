import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as apigw from "aws-cdk-lib/aws-apigateway"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'node:path'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Duration } from 'aws-cdk-lib'


export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BackendQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const vpc = ec2.Vpc.fromVpcAttributes(this, "VPC", {
      vpcID: "vpc-04874411a4f0ea21f",
      availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
      privateSubnetIds: ['subnet-0fe87254840356b46', 'subnet-0c43e1b2d3d91508c', 'subnet-0636a7faa253625e9']
    })

    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-08cfbc10a886847a9 ', {             // Find your security group
        mutable: false
    })

    const default_fn = ;

    const api_endpoint = new apigw.LambdaRestApi(this, 'shopcomp', {
      handler: default_fn,
      restApiName: 'shopcomp',
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    })


  }
}
