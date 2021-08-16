export enum APITYPE {
  graphql = "GraphQL",
  rest = "REST OpenAPI",
}

export enum LAMBDA {
  single = "Single",
  multi = "Multiple",
}

export enum DATABASE {
  dynamo = "DynamoDB (NoSQL)",
  neptune = "Neptune (Graph)",
  aurora = "Aurora Serverless (Relational)",
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
