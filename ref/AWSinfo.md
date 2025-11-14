This is the login information for our group AWS console

## Link to sign in:
- https://252056599169.signin.aws.amazon.com/console

## Password for all: 
- groupsigma69!
- (it will make you change this upon first login)

## Adreas
- Username: AndreasK
- ID: 252056599169

## Tim
- Username: TimGallica
- ID: 252056599169

## Tyler
- Username: TylerGillman
- ID: 252056599169


# AWS Notes
### Frontend
Just displays information
- Just a static website
- Served up on an S3 bucket
- sends https requests to API gateway endpoints
    - does this in JSON format
- recieves JSON from backend

## API Gateway
**API is the front door to the backend**
- Provides public HTTPS endpoints like: https://abcd1234.execute-api.us-east-1.amazonaws.com/login
- Recieves requests from your frontend
- Can validate/authorize input if configured to do so
- Passes requests along to lambda functions
Lambda functions are attached to API routes like:
- POST /login -> loginLambda
- GET /item -> listItemsLambda

## Lambda Functions
**Your backend code (Typescript)**
- Takes input from API gateway in the form of JSON object
- Validates and processes it
- Connects to RDS with SQL queries
- Sends a JSON response back to the frontend

## MySQL RDS
**Where information is stored**
- Lives inside your VPC (your spot in Ohio/Virginia)
- Lambda is given permission and network access to reach it
- You connect to it locally
- Make a different table for all your classes
    - Attributes become columns
    - Use foreign keys to relate it to another object

## S3 buckets
**Simple object storage**
- Can host a frontend or whatever information you put in them




