"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

const passwordFormSchema = z.object({
  length: z.number().min(8).max(128).default(12),
  customChars: z.string().optional(),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface PasswordGeneratorFormProps {
  onSubmit: (data: PasswordFormValues) => Promise<void>;
  isLoading: boolean;
  defaultLength?: number;
}

export function PasswordGeneratorForm({
  onSubmit,
  isLoading,
  defaultLength = 12,
}: PasswordGeneratorFormProps) {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      length: defaultLength,
      customChars: "",
    },
  });

  const currentLength = form.watch("length");

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-accent" />
          Customize Your Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="length-slider">Password Length: {currentLength}</FormLabel>
                  <FormControl>
                    <Slider
                      id="length-slider"
                      min={8}
                      max={128}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={isLoading}
                      aria-valuemin={8}
                      aria-valuemax={128}
                      aria-valuenow={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a length between 8 and 128 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customChars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="customChars">Custom Characters (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      id="customChars"
                      placeholder="e.g., !@#$%^&*"
                      {...field}
                      disabled={isLoading}
                      className="font-code"
                    />
                  </FormControl>
                  <FormDescription>
                    Specify any characters you want to include.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-accent hover:bg-accent/90">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Generate Passwords
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
