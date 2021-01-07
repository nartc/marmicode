import { lexer, Token, Tokens } from 'marked';

export type MarkdownToken = Token;
export namespace MarkdownTokens {
  export type Code = Tokens.Code;
  export type Codespan = Tokens.Codespan;
  export type Em = Tokens.Em;
  export type Link = Tokens.Link;
  export type List = Tokens.List;
  export type ListItem = Tokens.ListItem;
  export type Paragraph = Tokens.Paragraph;
  export type Strong = Tokens.Strong;
  export type Text = Tokens.Text;
}

/**
 * @hack stupid hack because there is a `Tokens.Def` type
 * that doesn't have a type.
 */
export function getMarkdownTokenType(token: MarkdownToken) {
  return 'type' in token ? token.type : null;
}

export function parseMarkdown(text: string): MarkdownToken[] {
  return lexer(text);
}
