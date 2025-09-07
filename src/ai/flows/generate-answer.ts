'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating answers to questions.
 *
 * - generateAnswer - A function that takes a question and returns an answer.
 * - GenerateAnswerInput - The input type for the generateAnswer function.
 * - GenerateAnswerOutput - The return type for the generateAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  researchMode: z
    .boolean()
    .optional()
    .describe('Whether to provide a more detailed, research-oriented answer.'),
});
export type GenerateAnswerInput = z.infer<typeof GenerateAnswerInputSchema>;

const GenerateAnswerOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0 to 100 representing the confidence in the answer.'
    ),
});
export type GenerateAnswerOutput = z.infer<typeof GenerateAnswerOutputSchema>;

export async function generateAnswer(
  input: GenerateAnswerInput
): Promise<GenerateAnswerOutput> {
  return generateAnswerFlow(input);
}

const generateAnswerPrompt = ai.definePrompt({
  name: 'generateAnswerPrompt',
  input: {schema: GenerateAnswerInputSchema},
  output: {schema: GenerateAnswerOutputSchema},
  prompt: `You are a helpful AI assistant.
  Provide a confidence score for your answer based on how certain you are about the information.

  {{#if researchMode}}
  You are in research mode. Provide a detailed, in-depth, and comprehensive answer.
  {{/if}}
  
  Answer the following question.

Question: {{{question}}}
`,
});

const generateAnswerFlow = ai.defineFlow(
  {
    name: 'generateAnswerFlow',
    inputSchema: GenerateAnswerInputSchema,
    outputSchema: GenerateAnswerOutputSchema,
  },
  async input => {
    const {output} = await generateAnswerPrompt(input);
    return output!;
  }
);
