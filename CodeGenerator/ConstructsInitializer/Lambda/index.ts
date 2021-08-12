import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, LAMBDA } from "../../../cloud-api-constants";
import { Cdk } from "../../../Constructs/Cdk";
import { Ec2 } from "../../../Constructs/Ec2";
import { Iam } from "../../../Constructs/Iam";
import { Lambda } from "../../../Constructs/Lambda";
import { lambdaHandlerForAuroradb, lambdaHandlerForDynamodb, lambdaHandlerForNeptunedb, lambdaProperiesHandlerForAuroraDb, lambdaProperiesHandlerForDynoDb, lambdaProperiesHandlerForNeptuneDb, lambdaPropsHandlerForAuroradb, lambdaPropsHandlerForNeptunedb } from "./functions";
const model = require("../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { apiName, lambdaStyle, database } = model.api;

Generator.generateFromModel(
    {
      outputFile: `../../../../../lib/${CONSTRUCTS.lambda}/index.ts`,
    },
    (output: TextWriter,model: any) => {
        // const { apiName, lambdaStyle, database } = model.api;
        // const mutations = model.type.Mutation ? model.type.Mutation : {};
        // const queries = model.type.Query ? model.type.Query : {};    
        // const mutationsAndQueries = {...mutations,...queries,};
        const lambda = new Lambda(output);
        let lambdaPropsWithName : string | undefined
        let lambdaProps : {name : string,type:string}[] | undefined
        let lambdaProperties:PropertyDefinition[] | undefined
        const cdk = new Cdk(output);
        const iam = new Iam(output)
        const ec2 = new Ec2(output);
        cdk.importsForStack(output)
        ec2.importEc2(output)
        lambda.importLambda(output)
        iam.importIam(output)
        if(database===DATABASE.dynamoDb){
          lambdaProps = undefined
          lambdaPropsWithName = undefined
          lambdaProperties = lambdaProperiesHandlerForDynoDb(output)
        }
        if(database===DATABASE.neptuneDb){
          lambdaPropsWithName="handlerProps"
          lambdaProps = lambdaPropsHandlerForNeptunedb() 
          lambdaProperties = lambdaProperiesHandlerForNeptuneDb(output)
        }
        if(database===DATABASE.auroraDb){
          lambdaPropsWithName="handlerProps"
          lambdaProps = lambdaPropsHandlerForAuroradb() 
          lambdaProperties = lambdaProperiesHandlerForAuroraDb(output)
        }
        cdk.initializeConstruct(CONSTRUCTS.lambda,lambdaPropsWithName,()=>{
          if(database===DATABASE.dynamoDb){
            lambdaHandlerForDynamodb(output)
          }
          if(database===DATABASE.neptuneDb){
            lambdaHandlerForNeptunedb(output,lambdaStyle,database)
          }
          if(database===DATABASE.auroraDb){
            lambdaHandlerForAuroradb(output,lambdaStyle,database)
          }
        },output,lambdaProps,lambdaProperties)
    }
  );

