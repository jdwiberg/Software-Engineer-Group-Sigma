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
    const loginAdminResource = api_endpoint.root.addResource('loginAdmin')
    const getShopperListsResource = api_endpoint.root.addResource('showShopperDash')
    const getReceiptItems = api_endpoint.root.addResource('getReceiptItems')
    const getListResource = api_endpoint.root.addResource('getList')
    const addStoreChainsResource = api_endpoint.root.addResource('addStoreChain')
    const getStoreChainsResource = api_endpoint.root.addResource('getStoreChains')
    const addShoppingListResource = api_endpoint.root.addResource('addShoppingList')
    const createReceiptResource = api_endpoint.root.addResource('creatReceipt')
    const addReceiptItemsResource = api_endpoint.root.addResource('addReceiptItems')

    
    // All lambda functions will get a config here that references the handler function in its folder
    // Add methods below each configuration
    const createReceipt_fn = new lambdaNodejs.NodejsFunction(this, 'createReceipt', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'createReceipt.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'createReceipt')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    createReceiptResource.addMethod('POST', new apigw.LambdaIntegration(createReceipt_fn, integration_parameters), response_parameters)
    
    const addReceiptItems_fn = new lambdaNodejs.NodejsFunction(this, 'addReceiptItems', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'addReceiptItems.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'addReceiptItems')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    addReceiptItemsResource.addMethod('POST', new apigw.LambdaIntegration(addReceiptItems_fn, integration_parameters), response_parameters)
    
    const registerShopper_fn = new lambdaNodejs.NodejsFunction(this, 'registerShopper', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'registerShopper.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'registerShopper')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(6)
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

    const loginAdmin_fn = new lambdaNodejs.NodejsFunction(this, 'loginAdmin', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'loginAdmin.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'loginAdmin')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    loginAdminResource.addMethod('POST', new apigw.LambdaIntegration(loginAdmin_fn, integration_parameters), response_parameters)

    const getShopperLists_fn = new lambdaNodejs.NodejsFunction(this, 'getShopperLists', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getShopperLists.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'getShopperLists')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    getShopperListsResource.addMethod('POST', new apigw.LambdaIntegration(getShopperLists_fn, integration_parameters), response_parameters)

    const getReceiptItems_fn = new lambdaNodejs.NodejsFunction(this, 'getReceiptItems', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getReceiptItems.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'getReceiptItems')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    getReceiptItems.addMethod('POST', new apigw.LambdaIntegration(getReceiptItems_fn, integration_parameters), response_parameters)

    const getList_fn = new lambdaNodejs.NodejsFunction(this, 'getList', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getList.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'getList')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    getListResource.addMethod('POST', new apigw.LambdaIntegration(getList_fn, integration_parameters), response_parameters)
    
    const addStoreChain_fn = new lambdaNodejs.NodejsFunction(this, 'addStoreChain', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'addStoreChain.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'addStoreChain')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    addStoreChainsResource.addMethod('POST', new apigw.LambdaIntegration(addStoreChain_fn, integration_parameters), response_parameters)

    const getStoreChains_fn = new lambdaNodejs.NodejsFunction(this, 'getStoreChains', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getStoreChains.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'getStoreChains')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    getStoreChainsResource.addMethod('GET', new apigw.LambdaIntegration(getStoreChains_fn, integration_parameters), response_parameters)

    const addShoppingList_fn = new lambdaNodejs.NodejsFunction(this, 'addShoppingList', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'addShoppingList.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'addShoppingList')),
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: environment,
      timeout: Duration.seconds(3)
    })
    addShoppingListResource.addMethod('POST', new apigw.LambdaIntegration(addShoppingList_fn, integration_parameters), response_parameters)
  }

}