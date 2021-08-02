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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBNkM7QUFFN0MsTUFBYSxHQUFJLFNBQVEsaUJBQVU7SUFDMUIsTUFBTSxDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsTUFBTSxVQUFVLElBQUksT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FDRjtBQUpELGtCQUlDIn0=
