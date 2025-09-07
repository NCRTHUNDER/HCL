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
  documentContent: z.string().describe('The content of the document to answer the question from.'),
});
export type GenerateAnswerFromDocumentInput = z.infer<
  typeof GenerateAnswerFromDocumentInputSchema
>;

const GenerateAnswerFromDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the document content.'),
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

  Answer the following question based on the content of the document provided.

  Question: {{{question}}}

  Document Content: {{{documentContent}}}

  Answer:`,
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
