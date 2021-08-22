import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition } from "@yellicode/typescript";
import {
  CONSTRUCTS,
  DATABASE,
  LAMBDASTYLE,
  PATH,
} from "../../../cloud-api-constants";
import { Cdk } from "../../../Constructs/Cdk";
import { Ec2 } from "../../../Constructs/Ec2";
import { Iam } from "../../../Constructs/Iam";
import { Lambda } from "../../../Constructs/Lambda";
import {
  lambdaHandlerForAuroradb,
  lambdaHandlerForDynamodb,
  lambdaHandlerForNeptunedb,
  lambdaProperiesHandlerForAuroraDb,
  lambdaProperiesHandlerForDynoDb,
  lambdaProperiesHandlerForNeptuneDb,
  lambdaPropsHandlerForAuroradb,
  lambdaPropsHandlerForNeptunedb,
} from "./functions";
const model = require("../../../model.json");
const { lambdaStyle, database } = model.api;

Generator.generate(
  {
    outputFile: `${PATH.lib}${CONSTRUCTS.lambda}/index.ts`,
  },
  (output: TextWriter) => {
    const lambda = new Lambda(output);

    let lambdaPropsWithName: string | undefined;
    let lambdaProps: { name: string; type: string }[] | undefined;
    let lambdaProperties: PropertyDefinition[] | undefined;

    const cdk = new Cdk(output);
    const iam = new Iam(output);
    const ec2 = new Ec2(output);

    cdk.importsForStack(output);
    ec2.importEc2(output);
    lambda.importLambda(output);
    iam.importIam(output);

    if (database === DATABASE.dynamo) {
      lambdaProps = [
        {
          name: "tableName",
          type: "string",
        },
      ];
      lambdaPropsWithName = "handlerProps";
      lambdaProperties = lambdaProperiesHandlerForDynoDb(output);
    }
    if (database === DATABASE.neptune) {
      lambdaPropsWithName = "handlerProps";
      lambdaProps = lambdaPropsHandlerForNeptunedb();
      lambdaProperties = lambdaProperiesHandlerForNeptuneDb(output);
    }
    if (database === DATABASE.aurora) {
      lambdaPropsWithName = "handlerProps";
      lambdaProps = lambdaPropsHandlerForAuroradb();
      lambdaProperties = lambdaProperiesHandlerForAuroraDb(output);
    }
    cdk.initializeConstruct(
      CONSTRUCTS.lambda,
      lambdaPropsWithName,
      () => {
        if (database === DATABASE.dynamo) {
          lambdaHandlerForDynamodb(output);
        }
        if (database === DATABASE.neptune) {
          lambdaHandlerForNeptunedb(output, lambdaStyle, database);
        }
        if (database === DATABASE.aurora) {
          lambdaHandlerForAuroradb(output, lambdaStyle, database);
        }
      },
      output,
      lambdaProps,
      lambdaProperties
    );
  }
);
