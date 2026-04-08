const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://logicoh.com';

export const WORD_ENDPOINT = `${API_BASE_URL.replace(/\/$/, '')}/api/get-word`;
