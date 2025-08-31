import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      className="transition-colors p-2 rounded-full bg-background/70 hover:bg-primary/10 border border-border shadow-md focus:outline-none"
      aria-label="Alternar tema"
      onClick={() => setDark(d => !d)}
    >
      {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-primary" />}
    </button>
  );
}
