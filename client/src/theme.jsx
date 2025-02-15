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
    mainBackground : "#121212",
    lightBackground: "#242424",
    mediumBackground: "#161515",
    darkBackground: "#0a0a0a",
    accent: "#007BFF",
    textDark: "#36424f",
    text: '#ffffff',
    red: "#FF4D4D",
    win: "#FFD700",
  },
  fonts: ["Rubik", "JetBrains Mono"],
  fontSizes: {
    typingText: "1rem",
    label: "1rem",
    largeLabel: "2rem",
    logo: {
      default: "2.4rem",
      sm: "2rem"
    },
    text: "0.75rem",
    navIcons: "0.9rem",
    mainText: {
      default: "5rem",
      md: "4rem",
      sm: "2.5rem",
      xs: "2rem"

    },
  },
  breakpoints: {
    xs: "480px",
    sm: "768px",
    md: "1024px",
    lg: "1440px",
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

