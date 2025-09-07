'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating answers to questions about a document.
 *
 * - generateAnswerFromDocument - A function that takes a question and document content and returns an answer.
 * - GenerateAnswerFromDocumentInput - The input type for the generateAnswerFromDocument function.
 * - GenerateAnswerFromDocumentOutput - The return type for the generateAnswerFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerFromDocumentInputSchema = z.object({
  question: z.string().describe('The question to answer about the document.'),
  documentContent: z
    .string()
    .describe('The content of the document to answer the question from.'),
  researchMode: z
    .boolean()
    .optional()
    .describe('Whether to provide a more detailed, research-oriented answer.'),
});
export type GenerateAnswerFromDocumentInput = z.infer<
  typeof GenerateAnswerFromDocumentInputSchema
>;

const GenerateAnswerFromDocumentOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the question based on the document content.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0 to 100 representing the confidence in the answer.'
    ),
  citations: z
    .array(z.string())
    .describe(
      'A list of direct quotes from the document that support the answer.'
    ),
});
export type GenerateAnswerFromDocumentOutput = z.infer<
  typeof GenerateAnswerFromDocumentOutputSchema
>;

export async function generateAnswerFromDocument(
  input: GenerateAnswerFromDocumentInput
): Promise<GenerateAnswerFromDocumentOutput> {
  return generateAnswerFromDocumentFlow(input);
}

const generateAnswerFromDocumentPrompt = ai.definePrompt({
  name: 'generateAnswerFromDocumentPrompt',
  input: {schema: GenerateAnswerFromDocumentInputSchema},
  output: {schema: GenerateAnswerFromDocumentOutputSchema},
  prompt: `You are an expert at answering questions based on document content.
  Analyze the document provided and answer the user's question.
  Provide a confidence score for your answer based on how well the document supports your conclusion.
  Extract direct quotes from the document that serve as citations for your answer.

  {{#if researchMode}}
  You are in research mode. Provide a detailed, in-depth, and comprehensive answer.
  {{/if}}

  Question: {{{question}}}

  Document Content: {{{documentContent}}}
  `,
});

const generateAnswerFromDocumentFlow = ai.defineFlow(
  {
    name: 'generateAnswerFromDocumentFlow',
    inputSchema: GenerateAnswerFromDocumentInputSchema,
    outputSchema: GenerateAnswerFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await generateAnswerFromDocumentPrompt(input);
    return output!;
  }
);
