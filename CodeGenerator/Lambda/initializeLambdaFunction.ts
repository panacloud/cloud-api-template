import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LambdaFunction } from "../../Constructs/Lambda/lambdaFunction";
import { LAMBDASTYLE, APITYPE, PATH } from "../../constant";
import { Imports } from "../../Constructs/ConstructsImports";
const SwaggerParser = require("@apidevtools/swagger-parser");
const model = require("../../model.json");
const _ = require("lodash");
const { lambdaStyle, apiType } = model.api;

if (apiType === APITYPE.graphql) {
  if (lambdaStyle === LAMBDASTYLE.single) {
    Generator.generate(
      { outputFile: `${PATH.lambda}main.ts` },
      (output: TextWriter) => {
        const ts = new TypeScriptWriter(output);
        const lambda = new LambdaFunction(output);
        const imp = new Imports(output)
        for (var key in model.type.Query) {
          lambda.importIndividualFunction(output, key, `./${key}`);
        }

        for (var key in model.type.Mutation) {
          lambda.importIndividualFunction(output, key, `./${key}`);
        }
        imp.importAxios()
        ts.writeLine();
        ts.writeLineIndented(`
        type Event = {
            info: {
              fieldName: string
            }
        }`);
        ts.writeLine();
        lambda.initializeLambdaFunction(output, lambdaStyle, () => {
          for (var key in model.type.Query) {
            ts.writeLineIndented(`
            case "${key}":
                return await ${key}();
            `);
          }
          for (var key in model.type.Mutation) {
            ts.writeLineIndented(`
            case "${key}":
                return await ${key}();
            `);
          }
        });
      }
    );
  } else if (lambdaStyle === LAMBDASTYLE.multi) {
    if (model.type.Mutation) {
      Object.keys(model.type.Mutation).forEach((key) => {
        Generator.generate(
          { outputFile: `${PATH.lambda}/${key}/${key}.ts`},
          (writer: TextWriter) => {
            const imp = new Imports(writer)
            const lambda = new LambdaFunction(writer);
            imp.importAxios()    
            lambda.initializeLambdaFunction(writer, lambdaStyle);
          }
        );
      });
    }

    if (model.type.Query) {
      Object.keys(model.type.Query).forEach((key) => {
        Generator.generate(
          { outputFile: `${PATH.lambda}/${key}/${key}.ts` },
          (writer: TextWriter) => {
            const lambda = new LambdaFunction(writer);
            const imp = new Imports(writer)
            imp.importAxios()    
            lambda.initializeLambdaFunction(writer, lambdaStyle);
          }
        );
      });
    }
  }
} else {
  SwaggerParser.validate(model.openApiDef, (err: any, api: any) => {
    if (err) {
      console.error(err);
    } else {
      Generator.generate(
        { outputFile: `${PATH.lambda}main.ts` },
        (output: TextWriter) => {
          const ts = new TypeScriptWriter(output);
          const lambda = new LambdaFunction(output);
          const imp = new Imports(output)
          imp.importAxios()    
          /* import all lambda files */
          Object.keys(api.paths).forEach((path) => {
            for (var methodName in api.paths[`${path}`]) {
              let lambdaFunctionFile =
                api.paths[`${path}`][`${methodName}`][`operationId`];
              lambda.importIndividualFunction(
                output,
                lambdaFunctionFile,
                `./${lambdaFunctionFile}`
              );
            }
          });
          ts.writeLine();

          let isFirstIf: boolean = true;
          lambda.initializeLambdaFunction(output, lambdaStyle, () => {
            Object.keys(api.paths).forEach((path) => {
              for (var methodName in api.paths[`${path}`]) {
                let lambdaFunctionFile =
                  api.paths[`${path}`][`${methodName}`][`operationId`];
                isFirstIf
                  ? ts.writeLineIndented(`
                  if (method === "${_.upperCase(
                    methodName
                  )}" && requestName === "${path.substring(1)}") {
                    return await ${lambdaFunctionFile}();
                  }
                `)
                  : ts.writeLineIndented(`
                  else if (method === "${_.upperCase(
                    methodName
                  )}" && requestName === "${path.substring(1)}") {
                    return await ${lambdaFunctionFile}();
                  }
                `);
                isFirstIf = false;
              }
            });
          });
        }
      );
    }
  });
}
