import { format } from "prettier";
export const prettify = (code: string): string =>
  format(code, { semi: false, parser: "babel" });
