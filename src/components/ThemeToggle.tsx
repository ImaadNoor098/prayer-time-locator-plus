
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ThemeToggleProps {
  variant?: "button" | "toggle" | "switch";
  className?: string;
}

export function ThemeToggle({ variant = "switch", className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={className}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
  
  if (variant === "toggle") {
    return (
      <Toggle
        pressed={theme === "dark"}
        onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={className}
      >
        {theme === "dark" ? <Moon className="h-4 w-4 mr-1" /> : <Sun className="h-4 w-4 mr-1" />}
        {theme === "dark" ? "Dark" : "Light"}
      </Toggle>
    );
  }
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id="theme-mode"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
      <Label htmlFor="theme-mode" className="cursor-pointer">
        {theme === "dark" ? (
          <Moon className="h-4 w-4 inline-block mr-1" />
        ) : (
          <Sun className="h-4 w-4 inline-block mr-1" />
        )}
        {theme === "dark" ? "Dark" : "Light"}
      </Label>
    </div>
  );
}
