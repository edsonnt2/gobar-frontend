import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
 *{
   margin:0;
   padding:0;
   outline:0;
   box-sizing: border-box;
 }

 body{
   background: #373739;
   color: #F9F7F0;
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
