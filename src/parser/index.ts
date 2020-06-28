import Token from "../Token";
import Lexer from "../Lexer";
import { FACTORS, TFACTOR } from "../enums";
import {
  Num,
  BinaryOperation,
  UnaryOperation,
  Node,
  Var,
  Assignation
} from "./node";

/** 
expr   : term ((PLUS | MINUS) term)*
term   : factor ((MUL | DIV) factor)*
factor : (PLUS | MINUS) factor | INTEGER | LPAREN expr RPAREN
**/
export default class Parser {
  protected lexer: Lexer;
  protected currentToken: Token;
  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  processToken(type: TFACTOR): Token | never {
    console.log(this.currentToken, type);
    if (this.currentToken.type !== type) {
      throw new Error(`Error parsing, wrong type ${type}`);
    }
    this.currentToken = this.lexer.getNextToken();
    return this.currentToken;
  }

  program(): Node {
    return this.assignmentStatement();
  }

  assignmentStatement(): Node {
    const left = this.variable();
    const token = this.currentToken;
    this.processToken(FACTORS.ASSIGN);
    const right = this.expr();
    return new Assignation(left, right, token);
  }

  variable(): Node {
    const { currentToken } = this;
    let node: Node = new Var(currentToken);
    this.processToken(FACTORS.ID);
    return node;
  }

  expr(): Node {
    let node: Node = this.term();
    while (
      this.currentToken.type === FACTORS.PLUS ||
      this.currentToken.type === FACTORS.MINUS
    ) {
      const token = this.currentToken;
      if (token.type === FACTORS.MINUS) {
        this.processToken(FACTORS.MINUS);
      } else if (token.type === FACTORS.PLUS) {
        this.processToken(FACTORS.PLUS);
      }

      node = new BinaryOperation(node, token, this.term());
    }
    return node;
  }

  term(): Node {
    let node: Node = this.factor();

    while (
      this.currentToken.type === FACTORS.DIV ||
      this.currentToken.type === FACTORS.MULT
    ) {
      const token = this.currentToken;
      if (token.type === FACTORS.DIV) {
        this.processToken(FACTORS.DIV);
      } else if (token.type === FACTORS.MULT) {
        this.processToken(FACTORS.MULT);
      }
      node = new BinaryOperation(node, token, this.factor());
    }
    return node;
  }

  factor(): Node {
    const { currentToken } = this;

    switch (currentToken.type) {
      case FACTORS.MINUS:
        this.processToken(FACTORS.MINUS);
        return new UnaryOperation(currentToken, this.factor());
      case FACTORS.PLUS:
        this.processToken(FACTORS.PLUS);
        return new UnaryOperation(currentToken, this.factor());
      case FACTORS.INTEGER:
        this.processToken(FACTORS.INTEGER);
        return new Num(currentToken);
      // case FACTORS.LEFT_BRACKET:
      case FACTORS.LEFT_BRACKET:
        this.processToken(FACTORS.LEFT_BRACKET);
        const node = this.expr();
        this.processToken(FACTORS.RIGHT_BRACKET);
        return node;
      default:
        return this.variable();
    }
  }
  verbose() {
    const node: Node = this.parse();
    return node.verbose();
  }

  parse(): Node {
    const node: Node = this.program();
    if (this.currentToken.type === FACTORS.EOF) {
      // throw new Error("error parsering");
      console.log("eof");
    }
    return node;
  }
}
