'use server';
/**
 * @fileOverview A Genkit flow for generating a mind map from a document.
 *
 * - generateMindMap - A function that takes document content and returns a mind map structure.
 * - GenerateMindMapInput - The input type for the generateMindMap function.
 * - GenerateMindMapOutput - The return type for the generateMindMap function.
 * - MindMapNodeSchema - The schema for a single node in the mind map.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MindMapNodeSchema = z.object({
  topic: z.string().describe('The main topic of this node.'),
  children: z.array(z.lazy(() => MindMapNodeSchema)).optional().describe('An array of child nodes.'),
});
export type MindMapNode = z.infer<typeof MindMapNodeSchema>;


const GenerateMindMapInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to create a mind map from.'),
});
export type GenerateMindMapInput = z.infer<
  typeof GenerateMindMapInputSchema
>;

const GenerateMindMapOutputSchema = z.object({
  mindMap: MindMapNodeSchema.describe('The root node of the generated mind map.'),
});
export type GenerateMindMapOutput = z.infer<
  typeof GenerateMindMapOutputSchema
>;

export async function generateMindMap(
  input: GenerateMindMapInput
): Promise<GenerateMindMapOutput> {
  return generateMindMapFlow(input);
}

const generateMindMapPrompt = ai.definePrompt({
  name: 'generateMindMapPrompt',
  input: {schema: GenerateMindMapInputSchema},
  output: {schema: GenerateMindMapOutputSchema},
  prompt: `You are an expert at creating mind maps from documents. Analyze the following document and generate a hierarchical mind map of its key concepts. The mind map should have a central root topic and branching sub-topics.

  Document Content: {{{documentContent}}}
  
  Generate the mind map based on the content.`,
});

const generateMindMapFlow = ai.defineFlow(
  {
    name: 'generateMindMapFlow',
    inputSchema: GenerateMindMapInputSchema,
    outputSchema: GenerateMindMapOutputSchema,
  },
  async input => {
    const {output} = await generateMindMapPrompt(input);
    return output!;
  }
);
