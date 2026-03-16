import type { Config } from "tailwindcss";

export default {
    content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",   // Esto cubre  page.tsx y layout.tsx
  "./src/**/*.{js,ts,jsx,tsx,mdx}",   // Esto cubre  habitsSlice.ts
  "./components/**/*.{js,ts,jsx,tsx,mdx}", //  si creas componentes más adelante
],
  
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;