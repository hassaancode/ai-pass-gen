"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordListItemProps {
  password: string;
}

type PasswordStrength = {
  label: "Weak" | "Medium" | "Strong" | "Very Strong";
  color: string;
  level: 1 | 2 | 3 | 4;
};

export function PasswordListItem({ password }: PasswordListItemProps) {
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);

  useEffect(() => {
    const calculateStrength = (pwd: string): PasswordStrength => {
      let score = 0;
      if (pwd.length >= 8) score++;
      if (pwd.length >= 12) score++;
      if (pwd.length >= 16) score++;

      const hasLowerCase = /[a-z]/.test(pwd);
      const hasUpperCase = /[A-Z]/.test(pwd);
      const hasNumbers = /[0-9]/.test(pwd);
      const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);

      let types = 0;
      if (hasLowerCase) types++;
      if (hasUpperCase) types++;
      if (hasNumbers) types++;
      if (hasSymbols) types++;
      
      score += types;

      if (score < 3) return { label: "Weak", color: "bg-red-500", level: 1 };
      if (score < 5) return { label: "Medium", color: "bg-yellow-500", level: 2 };
      if (score < 7) return { label: "Strong", color: "bg-green-500", level: 3 };
      return { label: "Very Strong", color: "bg-emerald-500", level: 4 };
    };
    setStrength(calculateStrength(password));
  }, [password]);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy password: ", err);
      // Optionally, show an error toast to the user
    }
  };

  if (!strength) {
    return (
      <li className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg shadow-sm animate-pulse">
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="w-8 h-8 bg-muted rounded-md"></div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
      <div className="flex items-center space-x-3 flex-grow min-w-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1 cursor-default">
                {[1,2,3,4].map(level => (
                  <span
                    key={level}
                    className={cn(
                      "w-2 h-3 rounded-sm",
                      level <= strength.level ? strength.color : "bg-muted/50"
                    )}
                    aria-hidden="true"
                  ></span>
                ))}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Password strength: {strength.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <code className="font-code text-sm md:text-base text-foreground break-all flex-shrink min-w-0">{password}</code>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        aria-label={copied ? "Password copied to clipboard" : "Copy password to clipboard"}
        className="text-accent-foreground hover:text-primary transition-colors duration-150 flex-shrink-0 ml-2"
        title={copied ? "Copied!" : "Copy password"}
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-600 transform scale-110 transition-transform duration-200" />
        ) : (
          <Clipboard className="h-5 w-5 text-black" />
        )}
      </Button>
    </li>
  );
}

// ShadCN Tooltip components - if not already globally available, include them here or ensure they are imported
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
