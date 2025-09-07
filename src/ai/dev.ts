'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-answer-from-document.ts';
import '@/ai/flows/generate-answer.ts';
import '@/ai/flows/generate-suggestions.ts';
