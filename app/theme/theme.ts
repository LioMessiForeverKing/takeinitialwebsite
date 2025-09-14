
/**
 * ----------------------------------------------------------------------------
 * Theme Definition
 * ----------------------------------------------------------------------------
 * This file centralizes the design tokens for the application, including
 * colors, fonts, and other stylistic elements.
 */

// -----------------------------------------------------------------------------
// Colors
// -----------------------------------------------------------------------------
// Each color is defined with a main shade, along with light and dark variants.
// Accent colors are provided for highlights, and button colors are specified
// for interactive elements.
// -----------------------------------------------------------------------------

const colors = {
  // --- Red ---
  red: {
    main: "#e57373",      // A softer, primary red
    light: "#ffcdd2",     // A very light, pastel red
    dark: "#d32f2f",      // A classic, strong red
    accent: "#ffcdd2",    // A pale red for subtle highlights
    button: {
      background: "#e57373",
      text: "#ffffff",
      hover: "#d32f2f",
    },
  },

  // --- Pink ---
  pink: {
    main: "#f06292",      // A gentler, primary pink
    light: "#f8bbd0",     // A very light, pastel pink
    dark: "#e91e63",      // A classic, vibrant pink
    accent: "#f8bbd0",    // A soft pink for accents
    button: {
      background: "#f06292",
      text: "#ffffff",
      hover: "#e91e63",
    },
  },

  // --- Blue ---
  blue: {
    main: "#64b5f6",      // A friendly, primary blue
    light: "#bbdefb",     // A very light, sky blue
    dark: "#1976d2",      // A classic, reliable blue
    accent: "#bbdefb",    // A light blue for backgrounds or highlights
    button: {
      background: "#64b5f6",
      text: "#ffffff",
      hover: "#1976d2",
    },
  },

  // --- Orange ---
  orange: {
    main: "#ffb74d",      // A softer, primary orange
    light: "#ffe0b2",     // A very light, pastel orange
    dark: "#f57c00",      // A classic, warm orange
    accent: "#ffe0b2",    // A pale orange for a gentle touch
    button: {
      background: "#ffb74d",
      text: "#ffffff",
      hover: "#f57c00",
    },
  },

  // --- Green ---
  green: {
    main: "#81c784",      // A fresh, primary green
    light: "#c8e6c9",     // A very light, minty green
    dark: "#388e3c",      // A classic, earthy green
    accent: "#c8e6c9",    // A minty green for accents
    button: {
      background: "#81c784",
      text: "#ffffff",
      hover: "#388e3c",
    },
  },

  // --- Yellow ---
  yellow: {
    main: "#fff176",      // A cheerful, primary yellow
    light: "#fff9c4",     // A very light, creamy yellow
    dark: "#fbc02d",      // A classic, sunny yellow
    accent: "#fff9c4",    // A creamy yellow for backgrounds
    button: {
      background: "#fff176",
      text: "#000000",
      hover: "#fbc02d",
    },
  },
};

// -----------------------------------------------------------------------------
// Typography
// -----------------------------------------------------------------------------
// Defines the font families to be used throughout the application.
// - "Pixelify Sans" is the primary font for a retro, digital feel.
// - "Delius Swash Caps" is the secondary font for headings or special text.
// -----------------------------------------------------------------------------

const fonts = {
  primary: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
  secondary: "var(--font-inter), 'Inter', sans-serif",
};

// -----------------------------------------------------------------------------
// Theme Export
// -----------------------------------------------------------------------------
// The final theme object that combines all design tokens.
// -----------------------------------------------------------------------------

export const theme = {
  colors,
  fonts,
};
