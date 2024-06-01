import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`

* {
    margin: 0;
    padding: 0;
    font-family: 'poppins', sans-serif;
}

html, body, #root {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    background-color: #f2f2f2;
    overflow-x: hidden;
}
`;
 
export default Global;