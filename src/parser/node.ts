import Token from "../Token";

export class AbstractTreeSyntax {}

export class Compound extends AbstractTreeSyntax {
  public children: Node[];
  constructor() {
    super();
    this.children = [];
  }
  public appendNode(node: Node) {
    this.children.push(node);
  }
  verbose() {
    return this.children.map(c => c.verbose());
  }
}

export class Assignation extends AbstractTreeSyntax {
  readonly left: any;
  readonly right: any;
  readonly operation: Token;
  constructor(left: any, right: any, operation: Token) {
    super();
    this.left = left;
    this.right = right;
    this.operation = operation;
  }
  verbose() {
    return {
      left: this.left.verbose(),
      operation: this.operation.value,
      right: this.right.verbose()
    };
  }
}

export class Var extends AbstractTreeSyntax {
  readonly token: Token;
  readonly value: any;
  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.value;
  }
  verbose() {
    return this.value;
  }
}

export class Num {
  readonly token: Token;
  readonly value: string;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value;
  }
  verbose() {
    return this.value;
  }
}

export class UnaryOperation {
  readonly operation: Token;
  readonly expr: any;
  constructor(operation: Token, expr: any) {
    this.operation = operation;
    this.expr = expr;
  }
  verbose(): any {
    return {
      operation: this.operation.value,
      right: this.expr.verbose()
    };
  }
}

export class BinaryOperation {
  readonly left: any;
  readonly operation: Token;
  readonly right: any;
  constructor(left: any, operation: Token, right: any) {
    this.left = left;
    this.operation = operation;
    this.right = right;
  }
  verbose(): any {
    return {
      left: this.left.verbose(),
      right: this.right.verbose(),
      operation: this.operation.value
    };
  }
}

export type Node =
  | Num
  | BinaryOperation
  | UnaryOperation
  | Var
  | Assignation
  | Compound;
