import { WORD_ENDPOINT } from '../config/env';
import { FALLBACK_WORD } from '../data/fallbackWord';
import { withDefaultStyle } from '../constants/theme';

export async function fetchRandomWord() {
  try {
    const response = await fetch(WORD_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Word API responded with status ${response.status}`);
    }

    const payload = await response.json();
    return withDefaultStyle(payload);
  } catch (error) {
    console.error('Error while fetching random word:', error);
    return withDefaultStyle(FALLBACK_WORD);
  }
}
