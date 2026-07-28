/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) return `rgb(var(${variableName}))`;
    return `rgb(var(${variableName}) / ${opacityValue})`;
  };
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        canvas: withOpacity("--color-bg"),
        surface: {
          DEFAULT: withOpacity("--color-surface"),
          alt: withOpacity("--color-surface-alt"),
        },
        line: {
          DEFAULT: withOpacity("--color-border"),
          strong: withOpacity("--color-border-strong"),
          hover: withOpacity("--color-border-hover"),
          dashed: withOpacity("--color-border-dashed"),
        },
        ink: {
          DEFAULT: withOpacity("--color-text"),
          dim: withOpacity("--color-text-dim"),
          mute: withOpacity("--color-text-mute"),
          faint: withOpacity("--color-text-faint"),
        },
        accent: {
          DEFAULT: withOpacity("--color-accent"),
          bg: withOpacity("--color-accent-bg"),
        },
        danger: {
          DEFAULT: withOpacity("--color-danger"),
          dim: withOpacity("--color-danger-dim"),
          bg: withOpacity("--color-danger-bg"),
          "bg-hover": withOpacity("--color-danger-bg-hover"),
          border: withOpacity("--color-danger-border"),
          "border-hover": withOpacity("--color-danger-border-hover"),
        },
        warn: withOpacity("--color-warn"),
        info: withOpacity("--color-info"),
      },
    },
  },
  plugins: [],
};
