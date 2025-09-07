
'use server';

import {
  generateAnswerFromDocument,
  GenerateAnswerFromDocumentInput,
} from '@/ai/flows/generate-answer-from-document';
import { generateAnswer, GenerateAnswerInput } from '@/ai/flows/generate-answer';

export async function getAnswer(
  input: GenerateAnswerFromDocumentInput
): Promise<{ answer: string } | { error: string }>;
export async function getAnswer(
  input: GenerateAnswerInput
): Promise<{ answer: string } | { error: string }>;
export async function getAnswer(
  input: GenerateAnswerFromDocumentInput | GenerateAnswerInput
): Promise<{ answer: string } | { error: string }> {
  try {
    if ('documentContent' in input && input.documentContent) {
       const output = await generateAnswerFromDocument(input as GenerateAnswerFromDocumentInput);
       return { answer: output.answer };
    } else {
        const output = await generateAnswer(input as GenerateAnswerInput);
        return { answer: output.answer };
    }
  } catch (e: any) {
    console.error(e);
    return { error: 'Sorry, there was an issue generating an answer. Please check your input and try again.' };
  }
}
