import Token from "../Token";
import Lexer from "../Lexer";
import { FACTORS, TFACTOR } from "../enums";
import {
  Num,
  BinaryOperation,
  UnaryOperation,
  Node,
  Var,
  Assignation,
  Compound
} from "./node";
import { RESERVED_WORDS } from "../enums/RESERVED_WORDS";
import { MATH_FACTOR } from "../enums/MATH_SYMBOLS";

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
      if (type === FACTORS.END_LINE) {
        throw new Error(`missing ${FACTORS.END_LINE}`);
      }
      throw new Error(`Error parsing, wrong type ${type}`);
    }
    this.currentToken = this.lexer.getNextToken();
    return this.currentToken;
  }

  program(): Node {
    this.processToken(FACTORS.BEGIN);
    const node = this.statementList();
    // this.processToken(FACTORS.END);
    return node;
  }

  statementList(): Node {
    const node = this.statement();
    const compoundList = new Compound();
    compoundList.appendNode(node);

    const { currentToken } = this;

    while (currentToken.type === FACTORS.END_LINE) {
      this.processToken(FACTORS.END_LINE);

      if (
        this.currentToken.type === FACTORS.END ||
        this.currentToken.type === FACTORS.EOF
      ) {
        break;
      }
      const newNode = this.statement();
      compoundList.appendNode(newNode);
    }

    if (currentToken.type === FACTORS.ID) {
      throw new Error(
        `Error parsing statement ${currentToken.type} ${currentToken.value}`
      );
    }
    return compoundList;
  }

  statement(): Node {
    const assignmentStatement = this.assignmentStatement();
    return assignmentStatement;
  }

  assignmentStatement(): Node {
    const left = this.variable();
    const token = this.currentToken;
    try {
      this.processToken(FACTORS.ASSIGN);
    } catch (e) {
      throw new Error(
        `the var "${left.verbose()}" needs to have an assignation`
      );
    }
    const right = this.expr();
    // this.processToken(FACTORS.END_LINE);
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
