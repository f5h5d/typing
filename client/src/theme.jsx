import React from "react";
import { ThemeProvider } from "styled-components";

const lightTheme = {
  colors: {
    background : "#F8F9FA",
    text: '#212529',
    blue: '#3B82F6',
    orange: '#FFA500',
    white: '#FFFFFF',
    gray: '#E5E7EB',
    darkGray: '#111827',
    sidebar: "#f9f9f9",
    // sidebarHover: "#f9f9f9",
    sidebarBorder: "#efefef"
  },
  fonts: ["sans-serif", "Roboto"],
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em"
  }
};

// const darkTheme = {
//   colors: {
//     background : "#121212",
//     lightBackground: "#242424",
//     text: '#dfebf8',
//     textDark: "#36424f",
//     blue: '#007BFF',
//     orange: '#FFA500',
//     green: "#4CAF50",
//     purple: "#8A2BE2",
//     red: "#FF4D4D",
//     white: '#FFFFFF',
//     black: "#000",
//     gray: '#E5E7EB',
//     darkGray: '#111827',
//     sidebar: "#1f1e1e",
//     sidebarHover: "#0a0a0a",
//     sidebarBorder: '#000'
//   },
//   fonts: ["sans-serif", "Roboto"],
//   fontSizes: {
//     small: "1em",
//     medium: "2em",
//     large: "3em"
//   }
// };


const darkTheme = {
  colors: {
    background : "#121212",
    mediumBackground: "#161515",
    lightBackground: "#242424",
    darkBackground: "#0a0a0a",
    text: '#dfebf8',
    textDark: "#36424f",
    blue: '#007BFF',
    orange: '#FFA500',
    green: "#4CAF50",
    purple: "#8A2BE2",
    red: "#FF4D4D",
    white: '#FFFFFF',
    black: "#000",
    gray: '#E5E7EB',
    darkGray: '#111827',
    sidebar: "#1f1e1e",
    sidebarHover: "#0a0a0a",
    sidebarBorder: '#000',
    trophy: "#FFD700",
    trophyBackground: "#b09709"
  },
  fonts: ["sans-serif", "Roboto"],
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em"
  }
};

// og
// const darkTheme = {
//   colors: {
//     background : "#1A1F36",
//     lightBackground: "#242424",
//     text: '#ffffff',
//     textDark: "#43496d",
//     blue: '#007BFF',
//     orange: '#FFA500',
//     green: "#4CAF50",
//     purple: "#8A2BE2",
//     red: "#FF4D4D",
//     white: '#FFFFFF',
//     gray: '#E5E7EB',
//     darkGray: '#111827',
//     sidebar: "#1f1e1e",
//     sidebarHover: "#0a0a0a",
//     sidebarBorder: '#000'
//   },
//   fonts: ["sans-serif", "Roboto"],
//   fontSizes: {
//     small: "1em",
//     medium: "2em",
//     large: "3em"
//   }
// };

const Theme = ({ children }) => (
  <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
);

export default Theme;

