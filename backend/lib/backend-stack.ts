import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as apigw from "aws-cdk-lib/aws-apigateway"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'node:path'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as dotenv from "dotenv"
import { Duration } from 'aws-cdk-lib'
dotenv.config()

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --------- Stuff we don't need to change ----------------
    // Virtual Private Cloud
    const vpc = ec2.Vpc.fromVpcAttributes(this, "VPC", {
      vpcId: "vpc-04874411a4f0ea21f",
      availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
      privateSubnetIds: ['subnet-0fe87254840356b46', 'subnet-0c43e1b2d3d91508c', 'subnet-0636a7faa253625e9']
    })

    // Security group
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-08cfbc10a886847a9', { 
      mutable: false
    })

    // Set up in .env file
    const environment = {    
      rdsUser: process.env.rdsUser!,
      rdsPassword: process.env.rdsPassword!,
      rdsDatabase: process.env.rdsDatabase!,
      rdsHost: process.env.rdsHost!
    }

    // generic default handler for any API function that doesn't get its own Lambda method
    const default_fn = new lambdaNodejs.NodejsFunction(this, 'LambdaDefaultFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'default.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'default')),
      vpc: vpc,                                                             
      securityGroups: [securityGroup],                                      
      timeout: Duration.seconds(3),                                         
    })


    // API Endpoint
    const api_endpoint = new apigw.LambdaRestApi(this, 'shopcomp', {
      handler: default_fn,
      restApiName: 'shopcomp',
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    })
    
    // Integration and Response Parameters (CONSTANT)
    const integration_parameters = { 
      proxy: false,
      passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,
      
      integrationResponses: [
        {
          // Successful response from the Lambda function, no filter defined
          statusCode: '200',
          responseTemplates: {
            'application/json': '$input.json(\'$\')',       // should just pass JSON through untouched
          },
          responseParameters: {
              'method.response.header.Content-Type':                      "'application/json'",
              'method.response.header.Access-Control-Allow-Origin':       "'*'",
              'method.response.header.Access-Control-Allow-Credentials':  "'true'"
          },
        },
        {
          // For errors, we check if the error message is not empty, get the error data
          selectionPattern: '(\n|.)+',
          statusCode: "400",
          responseTemplates: {
            'application/json': JSON.stringify({ state: 'error', message: "$util.escapeJavaScript($input.path('$.errorMessage'))" })
        },
          responseParameters: {
              'method.response.header.Content-Type':                      "'application/json'",
              'method.response.header.Access-Control-Allow-Origin':       "'*'",
              'method.response.header.Access-Control-Allow-Credentials':  "'true'"
          },
        }
      ]
    }
    const response_parameters =  {
      methodResponses: [
      {
        // Successful response from the integration
        statusCode: '200',
        // Define what parameters 
        responseParameters: {
          'method.response.header.Content-Type': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Credentials': true
        },

      },
      {
        // Same thing for the error responses
        statusCode: '400',
        responseParameters: {
          'method.response.header.Content-Type': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Credentials': true
        },
  
      }
    ]}

    // ----------------- Stuff we will add to ----------------
    // All lambda funcitons will get a new resource
    const registerShopperResource = api_endpoint.root.addResource('registerShopper')
    const loginShopperResource = api_endpoint.root.addResource('loginShopper')
    
    // All lambda functions will get a config here that references the handler function in its folder
    // Add methods below each configuration
    const registerShopper_fn = new lambdaNodejs.NodejsFunction(this, 'registerShopper', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'registerShopper.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'registerShopper')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    registerShopperResource.addMethod('POST', new apigw.LambdaIntegration(registerShopper_fn, integration_parameters), response_parameters)
      
    const loginShopper_fn = new lambdaNodejs.NodejsFunction(this, 'loginShopper', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'loginShopper.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'loginShopper')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    loginShopperResource.addMethod('POST', new apigw.LambdaIntegration(loginShopper_fn, integration_parameters), response_parameters)

  }
}
