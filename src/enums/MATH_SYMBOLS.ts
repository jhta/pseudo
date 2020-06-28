export enum MATH_FACTOR {
  PLUS = "+",
  MINUS = "-",
  DIV = "/",
  MULT = "*",
  LEFT_BRACKET = "(",
  RIGHT_BRACKET = ")",
  ASSIGN = "=",
  END_LINE = ";"
}

const values = (Object as any).values(MATH_FACTOR);
const keys: string[] = (Object as any).keys(MATH_FACTOR);

export const MATH_FACTOR_VALUES: { [value: string]: string } = Object.freeze(
  values.reduce(
    (acc: object, value: string, index: number) => ({
      ...acc,
      [value]: keys[index]
    }),
    {}
  )
);
