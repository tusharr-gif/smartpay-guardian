import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[68px] h-[36px] rounded-full bg-muted/30 animate-pulse" />;
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex items-center justify-between w-[68px] h-[36px] p-1.5 transition-colors duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 overflow-hidden ${
        isDark ? "bg-slate-800/80 border border-slate-700/50" : "bg-sky-100/80 border border-sky-200/50"
      }`}
      aria-label="Toggle Dark Mode"
    >
      <div className="z-10 flex items-center justify-center w-6 h-6">
        <Sun className={`w-4 h-4 transition-colors duration-300 ${isDark ? "text-slate-500" : "text-amber-500"}`} />
      </div>
      <div className="z-10 flex items-center justify-center w-6 h-6">
        <Moon className={`w-4 h-4 transition-colors duration-300 ${isDark ? "text-sky-300" : "text-slate-400"}`} />
      </div>
      
      <motion.div
        className={`absolute w-7 h-7 rounded-full shadow-md ${
          isDark ? "bg-slate-900 shadow-sky-900/50" : "bg-white shadow-amber-200/50"
        }`}
        layout
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        initial={false}
        animate={{
          x: isDark ? 32 : 0,
        }}
      />
    </button>
  );
}
