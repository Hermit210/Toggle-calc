/**
 * Theme configuration utilities for LexMint AI Legal Assistant
 * Provides consistent color usage and theme management
 */

export const mintColors = {
  50: "var(--color-mint-50)",
  100: "var(--color-mint-100)",
  200: "var(--color-mint-200)",
  300: "var(--color-mint-300)",
  400: "var(--color-mint-400)",
  500: "var(--color-mint-500)", // Primary brand color #A4F9C8
  600: "var(--color-mint-600)",
  700: "var(--color-mint-700)",
  800: "var(--color-mint-800)",
  900: "var(--color-mint-900)",
} as const;

export const semanticColors = {
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  primary: "var(--color-primary)",
  primaryForeground: "var(--color-primary-foreground)",
  secondary: "var(--color-secondary)",
  secondaryForeground: "var(--color-secondary-foreground)",
  accent: "var(--color-accent)",
  accentForeground: "var(--color-accent-foreground)",
  muted: "var(--color-muted)",
  mutedForeground: "var(--color-muted-foreground)",
  card: "var(--color-card)",
  cardForeground: "var(--color-card-foreground)",
  border: "var(--color-border)",
  input: "var(--color-input)",
  ring: "var(--color-ring)",
} as const;

/**
 * Theme utility functions
 */
export const theme = {
  /**
   * Get mint color by shade
   */
  mint: (shade: keyof typeof mintColors = 500) => mintColors[shade],

  /**
   * Get semantic color
   */
  color: (name: keyof typeof semanticColors) => semanticColors[name],

  /**
   * Generate mint gradient classes
   */
  mintGradient: {
    primary: "bg-gradient-to-r from-mint-400 to-mint-600",
    secondary: "bg-gradient-to-r from-mint-200 to-mint-400",
    subtle: "bg-gradient-to-r from-mint-50 to-mint-200",
    dark: "bg-gradient-to-r from-mint-600 to-mint-800",
  },

  /**
   * Common mint-themed component styles
   */
  components: {
    button: {
      primary: "bg-mint-500 hover:bg-mint-600 text-white border-mint-500 hover:border-mint-600",
      secondary: "bg-mint-100 hover:bg-mint-200 text-mint-800 border-mint-200 hover:border-mint-300",
      outline: "border-mint-500 text-mint-600 hover:bg-mint-50 hover:text-mint-700",
      ghost: "text-mint-600 hover:bg-mint-50 hover:text-mint-700",
    },
    card: {
      default: "bg-card border-border shadow-sm",
      highlighted: "bg-card border-mint-300 shadow-lg",
    },
    input: {
      default: "border-border focus:border-mint-500 focus:ring-mint-500",
      error: "border-destructive focus:border-destructive focus:ring-destructive",
    },
  },

  /**
   * Animation classes
   */
  animations: {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    slideDown: "animate-slide-down",
    pulseMint: "animate-pulse-mint",
  },

  /**
   * Responsive breakpoints
   */
  breakpoints: {
    mobile: "max-width: 767px",
    tablet: "min-width: 768px and max-width: 1023px",
    desktop: "min-width: 1024px",
  },
} as const;

/**
 * CSS-in-JS style objects for components that need inline styles
 */
export const inlineStyles = {
  mintGlow: {
    boxShadow: `0 0 20px ${mintColors[300]}`,
  },
  mintSoftShadow: {
    boxShadow: `0 2px 10px ${mintColors[200]}`,
  },
  mintBorder: {
    borderColor: mintColors[500],
  },
} as const;

/**
 * Theme mode utilities
 */
export const themeMode = {
  /**
   * Toggle between light and dark mode
   */
  toggle: () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
  },

  /**
   * Set theme mode
   */
  set: (mode: "light" | "dark") => {
    const html = document.documentElement;
    if (mode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", mode);
  },

  /**
   * Get current theme mode
   */
  get: (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  },

  /**
   * Initialize theme from localStorage or system preference
   */
  init: () => {
    if (typeof window === "undefined") return;
    
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  },
} as const;

export default theme;