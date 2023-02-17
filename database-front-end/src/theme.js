import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      mode: "light" ,
      common: {
        black: "#000",
        white: "#fff"
      },
      background: {
        light: "#fff",
        dark: "#000"
      },
      primary: {
        light: "#5C80BC",
        main: "#5C80BC",
        dark: "#5C80BC",
        contrastText: "#fff"
      },
      secondary: {
        main: "#0BAE41",
        light: "#0BAE41",
        dark: "#0BAE41",
        contrastText: "#fff"
      }
    }
  });

export default theme;