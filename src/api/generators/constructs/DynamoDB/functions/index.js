"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamodbPropsHandler = exports.dynamodbAccessHandler = void 0;
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../../../utils/constant");
const DynamoDB_1 = require("../../../../lib/DynamoDB");
const dynamodbAccessHandler = (apiName, output, lambdaStyle, mutationsAndQueries) => {
    const dynamoDB = new DynamoDB_1.DynamoDB(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
        dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle);
    }
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle, key);
            ts.writeLine();
        });
    }
};
exports.dynamodbAccessHandler = dynamodbAccessHandler;
const dynamodbPropsHandler = (apiName, output, lambdaStyle, mutationsAndQueries) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle && lambdaStyle === constant_1.LAMBDASTYLE.single) {
        const props = {
            name: `${apiName}_lambdaFn`,
            type: "lambda.Function",
        };
    }
    if (lambdaStyle && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            const props = {
                name: `${apiName}_lambdaFn_${key}`,
                type: "lambda.Function",
            };
            ts.writeLine(`${props}`);
        });
    }
};
exports.dynamodbPropsHandler = dynamodbPropsHandler;
