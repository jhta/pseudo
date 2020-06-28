import { FACTORS } from "../enums";
import { Node, Num, BinaryOperation, UnaryOperation } from "./node";

export default class Visitor {
  visit(node: Node): any {
    const name = node.constructor.name;
    if (node instanceof BinaryOperation) {
      return this.visitBinaryOperation(node as BinaryOperation);
    }

    if (node instanceof Num) {
      return this.visitNum(node as Num);
    }

    if (node instanceof UnaryOperation) {
      return this.visitorUnaryOperator(node as UnaryOperation);
    }

    throw new Error(`cannot visit node type ${name}`);
  }
  visitBinaryOperation(node: BinaryOperation): any {
    const { operation, left, right } = node;

    switch (operation.type) {
      case FACTORS.PLUS:
        return this.visit(left) + this.visit(right);
      case FACTORS.MINUS:
        return this.visit(left) - this.visit(right);
      case FACTORS.MULT:
        return this.visit(left) * this.visit(right);
      case FACTORS.DIV:
        return this.visit(left) / this.visit(right);
    }
    throw new Error(
      `${operation.type} doesn't has any visitor operator asigned`
    );
  }

  visitorUnaryOperator(node: UnaryOperation): any {
    const { operation, expr } = node;

    switch (operation.type) {
      case FACTORS.PLUS:
        return +this.visit(expr);
      case FACTORS.MINUS:
        return -this.visit(expr);
    }

    throw new Error(
      `${operation.type} doesn't has any unary operation visitor`
    );
  }

  visitNum(node: Num) {
    return Number(node.value);
  }
}
