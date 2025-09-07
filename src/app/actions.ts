
'use server';

import {
  generateAnswerFromDocument,
  GenerateAnswerFromDocumentInput,
} from '@/ai/flows/generate-answer-from-document';

export async function getAnswer(
  input: GenerateAnswerFromDocumentInput
): Promise<{ answer: string } | { error: string }> {
  try {
    const output = await generateAnswerFromDocument(input);
    return { answer: output.answer };
  } catch (e: any) {
    console.error(e);
    return { error: 'Sorry, there was an issue generating an answer. Please check your input and try again.' };
  }
}
