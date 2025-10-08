/* eslint-disable @typescript-eslint/no-empty-object-type */
export type ClassKey =
  | "root"
  | "content"
  | "button"
  | "icon"
  | "card"
  | "avatar";

export type StyleComponent = StyledComponent<
  MUIStyledCommonProps<Theme>,
  Pick<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    | keyof React.ClassAttributes<HTMLDivElement>
    | keyof React.HTMLAttributes<HTMLDivElement>
  >,
  {}
>;
