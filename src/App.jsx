import { Outlet } from "react-router-dom";
import useTheme from "./hooks/useTheme";
import Header from "./components/Header";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-canvas text-ink-dim font-mono selection:bg-accent/30 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-5 py-6 lg:px-8">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <div className="mt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
