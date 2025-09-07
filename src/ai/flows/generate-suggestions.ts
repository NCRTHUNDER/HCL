'use server';
/**
 * @fileOverview A Genkit flow for generating conversation suggestions.
 *
 * - generateSuggestions - Generates a list of questions based on document content or general topics.
 * - GenerateSuggestionsInput - The input type for the flow.
 * - GenerateSuggestionsOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSuggestionsInputSchema = z.object({
  documentContent: z
    .string()
    .optional()
    .describe('Optional content of a document to base suggestions on.'),
});
export type GenerateSuggestionsInput = z.infer<
  typeof GenerateSuggestionsInputSchema
>;

const GenerateSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of 3-4 suggested questions.'),
});
export type GenerateSuggestionsOutput = z.infer<
  typeof GenerateSuggestionsOutputSchema
>;

export async function generateSuggestions(
  input: GenerateSuggestionsInput
): Promise<GenerateSuggestionsOutput> {
  return generateSuggestionsFlow(input);
}

const generateSuggestionsPrompt = ai.definePrompt({
  name: 'generateSuggestionsPrompt',
  input: {schema: GenerateSuggestionsInputSchema},
  output: {schema: GenerateSuggestionsOutputSchema},
  prompt: `You are an expert at generating interesting questions.
    Generate a list of 3 to 4 insightful questions.

    {{#if documentContent}}
    Base the questions on the following document content:
    {{{documentContent}}}
    {{else}}
    The questions should be general conversation starters for an AI assistant.
    {{/if}}
    `,
});

const generateSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSuggestionsFlow',
    inputSchema: GenerateSuggestionsInputSchema,
    outputSchema: GenerateSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await generateSuggestionsPrompt(input);
    return output!;
  }
);
