export enum RESERVED_WORDS {
  BEGIN = "INICIO",
  END = "FINAL"
}

export const reservedWords: { [key: string]: RESERVED_WORDS } = {
  [RESERVED_WORDS.BEGIN]: RESERVED_WORDS.BEGIN,
  [RESERVED_WORDS.END]: RESERVED_WORDS.END
};
