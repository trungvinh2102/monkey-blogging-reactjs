import React from "react";
import "./styles/index.scss";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./utils/constants";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ThemeProvider theme={theme}>
    <GlobalStyles></GlobalStyles>
    <BrowserRouter>
      <App />
      <ToastContainer></ToastContainer>
    </BrowserRouter>
  </ThemeProvider>
);
