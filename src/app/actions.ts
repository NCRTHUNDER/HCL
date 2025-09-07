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
import {db} from '@/lib/firebase-admin';
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';

export async function getAnswer(
  input: GenerateAnswerFromDocumentInput | GenerateAnswerInput
): Promise<
  | (GenerateAnswerFromDocumentOutput & {answer: string})
  | (GenerateAnswerOutput & {answer: string})
  | {error: string}
> {
  try {
    let output;
    if ('documentContent' in input && input.documentContent) {
      output = await generateAnswerFromDocument(
        input as GenerateAnswerFromDocumentInput
      );
    } else {
      output = await generateAnswer(input as GenerateAnswerInput);
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

interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export async function submitContactForm(
  input: ContactFormInput
): Promise<{success: boolean; message: string}> {
  try {
    const contactsCollection = collection(db, 'contacts');
    await addDoc(contactsCollection, {
      ...input,
      createdAt: serverTimestamp(),
    });
    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  } catch (error) {
    console.error('Error saving contact form submission:', error);
    return {
      success: false,
      message:
        'Sorry, there was an issue submitting your form. Please try again later.',
    };
  }
}
