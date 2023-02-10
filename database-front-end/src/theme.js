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
        light: "#8b1fd8",
        main: "#8b1fd8",
        dark: "#8b1fd8",
        contrastText: "#fff"
      },
      secondary: {
        main: "#d3e245",
        light: "#d3e245",
        dark: "#d3e245",
        contrastText: "#000"
      }
    }
  });

export default theme;