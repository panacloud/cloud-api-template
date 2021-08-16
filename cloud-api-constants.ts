export enum APITYPE {
  graphql = "GraphQL",
  rest = "REST OpenAPI",
}

export enum LAMBDA {
  single = "Single",
  multiple = "Multiple",
}

export enum DATABASE {
  dynamoDb = "DynamoDB (NoSQL)",
  neptuneDb = "Neptune (Graph)",
  auroraDb = "Aurora Serverless (Relational)",
  document = "DocumentDB (NoSQL MongoDB)",
}

export enum SAASTYPE {
  app = "App",
  api = "API",
}

export enum CONSTRUCTS {
  appsync = "AppsyncConstruct",
  dynamodb = "DynamodbConstruct",
  lambda = "LambdaConstruct",
  neptuneDb = "VpcNeptuneConstruct",
  auroradb = "AuroraDbConstruct",
}
