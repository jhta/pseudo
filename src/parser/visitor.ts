import { FACTORS } from "../enums";
import {
  Node,
  Num,
  BinaryOperation,
  UnaryOperation,
  Assignation,
  Compound
} from "./node";

declare global {
  interface Window {
    GLOBAL_SCOPE: Map<string, any>;
  }
}

const GLOBAL_SCOPE = new Map();
window.GLOBAL_SCOPE = GLOBAL_SCOPE;

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

    if (node instanceof Compound) {
      return this.visitCompound(node as Compound);
    }

    if (node instanceof Assignation) {
      return this.visitAssignation(node as Assignation);
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

  visitAssignation(node: Assignation): void {
    const { left, right } = node;
    const name = left.value;
    const value = this.visit(right);
    window.GLOBAL_SCOPE.set(name, value);
    return name;
  }

  visitCompound(node: Compound): any {
    const visitedNodes = node.children.map(childNode => this.visit(childNode));
    return visitedNodes.filter(n => n);
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
