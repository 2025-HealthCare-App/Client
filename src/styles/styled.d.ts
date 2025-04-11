import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      background: string;
      text: string;
    };
    fonts: {
      regular: string;
      bold: string;
    };
  }
}
