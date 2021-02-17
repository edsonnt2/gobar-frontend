import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  :root {
    --color-yellow-primary: #e6a43a;
    --color-white-primary: #F9F7F0;
    --color-gray-primary: #979797;
    --color-red-primary: #f00;

    --color-red-secondary: #e63a3a;
    --color-gray-secondary: #2f2f31;
    --color-border-gray: #242426;

    --color-gray-tertiary: #2a2a2c;
    --color-gray-quaternary: #DEDCD5;

    --color-input: #23211f;
    --color-text-input: #fff;
    --color-select: #A6A4A2;
    --color-text-select: #464646;
  }

 *{
   margin:0;
   padding:0;
   outline:0;
   box-sizing: border-box;
 }

 body{
   background: #373739;
   color: var(--color-white-primary);
   -webkit-font-smoothing: antialiased;
    display: flex;
    height: 100vh;
    flex-direction: column;
 }

 body, input, button{
   font: 16px 'Roboto', sans-serif;
 }

 h1, h2, h3, h4, h5, h6, strong{
    font-weight:500;
  }

  button{
    cursor:pointer;
  }
`;
