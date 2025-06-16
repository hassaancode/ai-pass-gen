// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview Password generation flow.
 *
 * generatePasswords - Generates a list of passwords based on user specified criteria.
 * GeneratePasswordsInput - Input schema for the password generation.
 * GeneratePasswordsOutput - Output schema for the generated passwords.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePasswordsInputSchema = z.object({
  passwordLength: z.number().min(8).max(128).describe('The desired length of the password.  Must be between 8 and 128 characters.'),
  customCharacters: z.string().optional().describe('Custom characters to include in the password. If not provided, a default set of characters will be used.'),
  numberOfPasswords: z.number().min(1).max(10).default(5).describe('The number of passwords to generate. Must be between 1 and 10.'),
});
export type GeneratePasswordsInput = z.infer<typeof GeneratePasswordsInputSchema>;

const GeneratePasswordsOutputSchema = z.object({
  passwords: z.array(
    z.string().describe('A generated password.')
  ).describe('An array of generated passwords.'),
});
export type GeneratePasswordsOutput = z.infer<typeof GeneratePasswordsOutputSchema>;

export async function generatePasswords(input: GeneratePasswordsInput): Promise<GeneratePasswordsOutput> {
  return generatePasswordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePasswordsPrompt',
  input: {schema: GeneratePasswordsInputSchema},
  output: {schema: GeneratePasswordsOutputSchema},
  prompt: `You are a password generator expert. Generate {{numberOfPasswords}} secure passwords based on the following criteria:

Password Length: {{passwordLength}}

Ensure at least two of the generated passwords are "strong". A strong password must incorporate a mix of uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and symbols (e.g., !@#$%^&*()).

Custom Characters:
{{#if customCharacters}}
Use these custom characters for all passwords: {{customCharacters}} and randomize it with special characters. example: if{{customCharacters}} is gamerzlife47ever, then return something like g@m3rZ#47_ever
{{else}}
For passwords not designated as "strong", and to supplement characters for "strong" passwords if needed, use a diverse and randomized selection of characters from the following comprehensive set: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':",./<>?
{{/if}}

Ensure each password meets the length requirement.
Return the passwords as a JSON array. Do not include any additional text or explanations.`,
});

const generatePasswordsFlow = ai.defineFlow(
  {
    name: 'generatePasswordsFlow',
    inputSchema: GeneratePasswordsInputSchema,
    outputSchema: GeneratePasswordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
