export enum LAMBDA {
  single = "SINGLE",
  multiple = "MULTIPLE",
}

export enum DATABASE {
  dynamoDb = "DYNAMODB",
  auroraDb = "AURORASERVERLESS",
  neptuneDb = "NEPTUNE",
}

export enum APITYPE {
  graphql = "GRAPHQL API",
  rest = "REST API",
}

export enum CONSTRUCTS {
  appsync = "AppsyncConstruct",
  dynamodb = "DynamodbConstruct",
  lambda = "LambdaConstruct",
  neptuneDb = "VpcNeptuneConstruct",
  auroradb = "AuroraDbConstruct",
  apigateway = "ApiGatewayConstruct"
}