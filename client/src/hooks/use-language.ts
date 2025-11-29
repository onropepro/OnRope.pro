import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';

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
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
    
    if (user?.id) {
      try {
        await updateLanguageMutation.mutateAsync(language);
      } catch (error) {
        console.error('Failed to update language preference:', error);
      }
    }
  }, [i18n, user?.id, updateLanguageMutation]);

  const currentLanguage = i18n.language || 'en';

  return {
    t,
    i18n,
    currentLanguage,
    changeLanguage,
    isUpdating: updateLanguageMutation.isPending,
    supportedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
    ],
  };
}
