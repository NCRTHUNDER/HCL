
'use server';

import {
  generateAnswerFromDocument,
  GenerateAnswerFromDocumentInput,
  GenerateAnswerFromDocumentOutput,
} from '@/ai/flows/generate-answer-from-document';
import {
  generateAnswer,
  GenerateAnswerInput,
  GenerateAnswerOutput,
} from '@/ai/flows/generate-answer';
import {
  generateSuggestions,
  GenerateSuggestionsInput,
} from '@/ai/flows/generate-suggestions';

// Define a union type for the inputs to make handling them easier.
type AnswerInput = 
  | ({ type: 'document' } & GenerateAnswerFromDocumentInput)
  | ({ type: 'general' } & GenerateAnswerInput);

// Define a union type for the outputs.
type AnswerOutput = 
  | (GenerateAnswerFromDocumentOutput & { answer: string })
  | (GenerateAnswerOutput & { answer: string });

export async function getAnswer(
  input: AnswerInput
): Promise<AnswerOutput | { error: string }> {
  try {
    let output;
    if (input.type === 'document') {
      // The input is for answering from a document.
      const { type, ...docInput } = input;
      output = await generateAnswerFromDocument(docInput);
    } else {
      // The input is for a general question.
      const { type, ...generalInput } = input;
      output = await generateAnswer(generalInput);
    }

    return {
      ...output,
      answer: output.answer,
    };
  } catch (e: any) {
    console.error(e);
    return {
      error:
        'Sorry, there was an issue generating an answer. Please check your input and try again.',
    };
  }
}

export async function getSuggestions(
  input: GenerateSuggestionsInput
): Promise<{suggestions?: string[]; error?: string}> {
  try {
    const {suggestions} = await generateSuggestions(input);
    return {suggestions};
  } catch (e: any) {
    console.error(e);
    return {
      error: 'Sorry, there was an issue generating suggestions.',
    };
  }
}

export async function submitContactForm(data: { name: string; email: string; message: string; }) {
  try {
    console.log("New contact form submission:", data);
    // Here you would typically save to a database.
    // e.g., await db.collection('contacts').add(data);
    return { success: true, message: "Thank you for your message! We'll get back to you soon." };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, message: "Sorry, there was an error submitting your form. Please try again later." };
  }
}
