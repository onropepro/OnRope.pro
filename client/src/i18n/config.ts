export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

export const DEFAULT_LANGUAGE = 'en';

export const FALLBACK_LANGUAGE = 'en';

export function getLanguageByCode(code: string): Language | undefined {
  const normalizedCode = code?.split('-')[0]?.toLowerCase();
  return SUPPORTED_LANGUAGES.find(lang => lang.code === normalizedCode);
}

export function getSupportedLanguageCodes(): string[] {
  return SUPPORTED_LANGUAGES.map(lang => lang.code);
}

export function isLanguageSupported(code: string): boolean {
  const normalizedCode = code?.split('-')[0]?.toLowerCase();
  return SUPPORTED_LANGUAGES.some(lang => lang.code === normalizedCode);
}

export function normalizeLanguageCode(code: string): string {
  if (!code) return DEFAULT_LANGUAGE;
  const normalizedCode = code.split('-')[0].toLowerCase();
  return isLanguageSupported(normalizedCode) ? normalizedCode : DEFAULT_LANGUAGE;
}
