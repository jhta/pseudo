import { TYPES } from "./TYPES";
import { MATH_FACTOR } from "./MATH_SYMBOLS";
import { RESERVED_WORDS } from "./RESERVED_WORDS";

export const FACTORS = {
  ...TYPES,
  ...MATH_FACTOR,
  ...RESERVED_WORDS
};

export type TFACTOR = TYPES | MATH_FACTOR | RESERVED_WORDS;
