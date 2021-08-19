import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, LAMBDA } from "../../../cloud-api-constants";
import { Cdk } from "../../../Constructs/Cdk";
import { Imports } from "../../../Constructs/ConstructsImports";
import { lambdaHandlerForAuroradb, lambdaHandlerForDynamodb, lambdaHandlerForNeptunedb, lambdaProperiesHandlerForAuroraDb, lambdaProperiesHandlerForDynoDb, lambdaProperiesHandlerForNeptuneDb, lambdaPropsHandlerForAuroradb, lambdaPropsHandlerForNeptunedb } from "./functions";
const model = require("../../../model.json");

if(model?.api?.lambdaStyle){
Generator.generateFromModel(
    {
      outputFile: `../../../../../lib/${CONSTRUCTS.lambda}/index.ts`,
    },
    (output: TextWriter,model: any) => {
        const { apiName, lambdaStyle, database } = model.api;
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};    
        const mutationsAndQueries = {...mutations,...queries,};
        let lambdaPropsWithName : string | undefined
        let lambdaProps : {name : string,type:string}[] | undefined
        let lambdaProperties:PropertyDefinition[] | undefined
        const cdk = new Cdk(output);
        const imp = new Imports(output)
        imp.importsForStack(output)
        imp.importEc2(output)
        imp.importLambda(output)
        imp.importIam(output)
        if(database===DATABASE.dynamoDb){
          lambdaProps = [{
            name:"tableName",
            type:"string"
          }]
          lambdaPropsWithName = "handlerProps"
          lambdaProperties = lambdaProperiesHandlerForDynoDb(lambdaStyle,apiName,mutationsAndQueries)
        }
        if(database===DATABASE.neptuneDb){
          lambdaPropsWithName="handlerProps"
          lambdaProps = lambdaPropsHandlerForNeptunedb() 
          lambdaProperties = lambdaProperiesHandlerForNeptuneDb(apiName,lambdaStyle,database,mutationsAndQueries)
        }
        if(database===DATABASE.auroraDb){
          lambdaPropsWithName="handlerProps"
          lambdaProps = lambdaPropsHandlerForAuroradb() 
          lambdaProperties = lambdaProperiesHandlerForAuroraDb(apiName,lambdaStyle,database,mutationsAndQueries)
        }
        cdk.initializeConstruct(CONSTRUCTS.lambda,lambdaPropsWithName,()=>{
          if(database===DATABASE.dynamoDb){
            lambdaHandlerForDynamodb(output,apiName,lambdaStyle,database,mutationsAndQueries)
          }
          if(database===DATABASE.neptuneDb){
            lambdaHandlerForNeptunedb(output,apiName,lambdaStyle,database,mutationsAndQueries)
          }
          if(database===DATABASE.auroraDb){
            lambdaHandlerForAuroradb(output,apiName,lambdaStyle,database,mutationsAndQueries)
          }
        },output,lambdaProps,lambdaProperties)
    }
  );
  }
