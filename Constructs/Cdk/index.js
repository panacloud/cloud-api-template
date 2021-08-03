"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cdk = void 0;
const core_1 = require("@yellicode/core");
class Cdk extends core_1.CodeWriter {
    tagAdd(source, name, value) {
        this.writeLine(`Tags.of(${source}).add("${name}", "${value}");`);
    }
}
exports.Cdk = Cdk;
