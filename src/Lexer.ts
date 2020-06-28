import Token from "./Token";
// import { FACTORS } from "./enums";
import { MATH_FACTOR } from "./enums/MATH_SYMBOLS";
import { reservedWords, RESERVED_WORDS } from "./enums/RESERVED_WORDS";
import { TYPES } from "./enums/TYPES";

const removeMultipleSpaces = (str: string) =>
  str
    .replace("\t", "")
    .replace(/(?:\r\n|\r|\n)/g, " ")
    .replace(/\s\s+/g, " ")
    .trim()
    .split("")
    .join("");

const isNumber = (num: string) => Number.isInteger(parseInt(num, 10));
const isLetter = (str: string) =>
  str && str.length === 1 && str.match(/[a-z]/i);

export default class Lexer {
  private readonly text: string;
  private pos: number;
  private currentChar: string;
  constructor(text: string) {
    this.text = removeMultipleSpaces(text);
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }
  advance(): void {
    this.pos++;
    this.currentChar = this.text[this.pos];
  }

  peek(): undefined | string {
    const peekPosition = this.pos + 1;
    if (this.text.length - 1 < peekPosition) return undefined;
    return this.text[peekPosition];
  }

  private tokenizeNumber(): Token {
    let value: string = "";
    while (true) {
      const { currentChar } = this;
      if (!isNumber(currentChar)) break;
      value = value + "" + currentChar;
      this.advance();
    }
    return new Token(TYPES.INTEGER, value);
  }

  private tokenizeVarIdOrReserverWord(): Token {
    let value = "";
    while (true) {
      const { currentChar } = this;
      if (!isLetter(currentChar)) break;
      value = value + "" + currentChar;
      this.advance();
    }
    value = value.toUpperCase();
    if (reservedWords[value]) {
      return new Token(reservedWords[value]);
    }

    return new Token(TYPES.ID, value);
  }

  private tokenizer() {
    const { currentChar } = this;
    const isCharacterANumber = isNumber(currentChar);

    if (isCharacterANumber) return this.tokenizeNumber();

    if (isLetter(currentChar)) return this.tokenizeVarIdOrReserverWord();

    switch (currentChar) {
      case MATH_FACTOR.END_LINE:
        this.advance();
        return new Token(MATH_FACTOR.END_LINE);
      case MATH_FACTOR.ASSIGN:
        this.advance();
        return new Token(MATH_FACTOR.ASSIGN);
      case MATH_FACTOR.PLUS:
        this.advance();
        return new Token(MATH_FACTOR.PLUS);
      case MATH_FACTOR.MINUS:
        this.advance();
        return new Token(MATH_FACTOR.MINUS);
      case MATH_FACTOR.MULT:
        this.advance();
        return new Token(MATH_FACTOR.MULT);
      case MATH_FACTOR.DIV:
        this.advance();
        return new Token(MATH_FACTOR.DIV);
      case MATH_FACTOR.LEFT_BRACKET:
        this.advance();
        return new Token(MATH_FACTOR.LEFT_BRACKET);
      case MATH_FACTOR.RIGHT_BRACKET:
        this.advance();
        return new Token(MATH_FACTOR.RIGHT_BRACKET);
      default:
        this.advance();
        throw new Error(`invalid charcter '${currentChar}'`);
    }
  }
  getNextToken(): Token {
    const { currentChar } = this;
    if (typeof currentChar === "undefined") return new Token(TYPES.EOF);

    if (currentChar === " " || currentChar.charCodeAt(0) === 10) {
      this.advance();
      return this.getNextToken();
    }
    return this.tokenizer();
  }

  getAllTheTokens(): Token[] {
    const tokens = [];
    while (true) {
      const currentToken = this.getNextToken();
      if (!currentToken || currentToken.type === TYPES.EOF) break;
      tokens.push(currentToken);
    }
    return tokens;
  }
}
