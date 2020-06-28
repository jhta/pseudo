import { TFACTOR } from "./enums";

export default class Token {
  public readonly type: TFACTOR;
  public readonly value: any;
  constructor(type: TFACTOR, value?: any) {
    this.type = type;
    this.value = value || type;
  }
  verbose() {
    return `Token ${this.type}: ${this.value}`;
  }
}
