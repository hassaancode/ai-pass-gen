"use client";

import { useState } from "react";
import { generatePasswords, GeneratePasswordsInput } from "@/ai/flows/generate-passwords";
import { PasswordGeneratorForm } from "@/components/password-generator-form";
import { PasswordListItem } from "@/components/password-list-item";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Settings2 } from "lucide-react";

export default function PasskeyAiPage() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGeneratePasswords = async (data: { length: number; customChars?: string }) => {
    setIsLoading(true);
    setError(null);
    setPasswords([]);

    const input: GeneratePasswordsInput = {
      passwordLength: data.length,
      customCharacters: data.customChars || "",
      numberOfPasswords: 5, // As per requirement: "at least 5 passwords"
    };

    try {
      const result = await generatePasswords(input);
      if (result && result.passwords) {
        setPasswords(result.passwords);
      } else {
        throw new Error("No passwords were generated or the format was incorrect.");
      }
    } catch (e: any) {
      console.error("Error generating passwords:", e);
      const errorMessage = e.message || "An unexpected error occurred while generating passwords.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-8 px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto max-w-3xl">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary tracking-tight">
            Passkey AI
          </h1>
          <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Craft strong, unique passwords effortlessly with the power of AI.
            Secure your digital life, one key at a time.
          </p>
        </header>

        <PasswordGeneratorForm onSubmit={handleGeneratePasswords} isLoading={isLoading} />

        {error && !isLoading && (
          <Alert variant="destructive" className="mt-8 shadow-lg">
            <AlertTitle className="font-headline">Oops! Something went wrong.</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && passwords.length === 0 && (
          <Card className="mt-8 shadow-xl animate-pulse">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center">
                <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
                Generating Your Secure Passwords...
              </CardTitle>
              <CardDescription>Please wait a moment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded-md"></div>
              ))}
            </CardContent>
          </Card>
        )}

        {!isLoading && passwords.length > 0 && (
          <Card className="mt-8 shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center">
                <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
                Your Generated Passwords
              </CardTitle>
              <CardDescription>
                Copy your new secure passwords. Remember to store them safely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {passwords.map((pwd, index) => (
                  <PasswordListItem key={index} password={pwd} />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
         <footer className="mt-16 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Passkey AI. Securely generated for you.</p>
          <p className="mt-1">Powered by Gemini AI & Next.js</p>
        </footer>
      </main>
    </div>
  );
}
