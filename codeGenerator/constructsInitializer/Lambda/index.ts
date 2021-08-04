import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, LAMBDA } from "../../../cloud-api-constants";
import { Cdk } from "../../../Constructs/Cdk";
import { Lambda } from "../../../Constructs/Lambda";
import { LambdaFunction } from "../../../Constructs/Lambda/lambdaFunction";
import { lambdaHandlerForDynamodb, lambdaProperiesHandlerForDynoDb } from "./functions";
const model = require("../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { apiName, lambdaStyle, database } = model.api;

Generator.generateFromModel(
    {
      outputFile: `../../../../../lib/LambdaConstructs/index.ts`,
    },
    (output: TextWriter,model: any) => {
        const { apiName, lambdaStyle, database } = model.api;
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};    
        const mutationsAndQueries = {...mutations,...queries,};
        const lambda = new Lambda(output);
        const cdk = new Cdk(output);
        cdk.importsForStack(output)
        lambda.importLambda(output)

        const lambdaProperties = lambdaProperiesHandlerForDynoDb(output)

        cdk.initializeConstruct(CONSTRUCTS.lambda,undefined,()=>{
            lambdaHandlerForDynamodb(output)
        },output,undefined,lambdaProperties)

    }
  );

