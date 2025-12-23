import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { SUPPORTED_LANGUAGES, normalizeLanguageCode, type Language } from '@/i18n/config';

interface User {
  id: string;
  preferredLanguage?: string;
  [key: string]: unknown;
}

export function useLanguage() {
  const { i18n, t } = useTranslation();

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: false,
    staleTime: Infinity,
  });

  const updateLanguageMutation = useMutation({
    mutationFn: async (language: string) => {
      const response = await apiRequest('PATCH', '/api/user/language', { language });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  useEffect(() => {
    if (user?.preferredLanguage && user.preferredLanguage !== i18n.language) {
      i18n.changeLanguage(user.preferredLanguage);
    }
  }, [user?.preferredLanguage, i18n]);

  const changeLanguage = useCallback(async (language: string) => {
    const normalizedLang = normalizeLanguageCode(language);
    i18n.changeLanguage(normalizedLang);
    localStorage.setItem('i18nextLng', normalizedLang);
    
    if (user?.id) {
      try {
        await updateLanguageMutation.mutateAsync(normalizedLang);
      } catch (error) {
        console.error('Failed to update language preference:', error);
      }
    }
  }, [i18n, user?.id, updateLanguageMutation]);

  const currentLanguage = normalizeLanguageCode(i18n.language);

  return {
    t,
    i18n,
    currentLanguage,
    changeLanguage,
    isUpdating: updateLanguageMutation.isPending,
    supportedLanguages: SUPPORTED_LANGUAGES as Language[],
  };
}
