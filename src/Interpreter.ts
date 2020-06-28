import Parser from "./parser";
import Visitor from "./parser/visitor";
import Lexer from "./Lexer";

export default class Interpreter {
  interpret(str: string) {
    const lexer = new Lexer(str);
    const parser = new Parser(lexer);

    const abstractTree = parser.parse();
    return new Visitor().visit(abstractTree);
  }
}
