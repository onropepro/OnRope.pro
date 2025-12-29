import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export default function ResidentLink() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  // Get user info to determine if they're logged in and their role
  const { data: userData } = useQuery({
    queryKey: ['/api/user'],
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      // No code provided, redirect to home
      setLocation('/');
      return;
    }

    // Check user status
    if (!userData) {
      // Still loading
      return;
    }

    const user = (userData as any).user;

    if (!user) {
      // Not logged in - store code and redirect to home where they can sign up
      // Store code in sessionStorage so we can use it after they register/login
      sessionStorage.setItem('pendingResidentCode', code);
      // Redirect to home page - user can use Sign Up button there
      setLocation('/?signup=true');
      return;
    }

    if (user.role === 'resident') {
      // Logged in as resident - store code and redirect to profile to link
      sessionStorage.setItem('pendingResidentCode', code);
      setLocation('/profile');
    } else {
      // Logged in as non-resident - can't use this link
      setLocation('/dashboard');
    }
  }, [userData, setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-muted-foreground">
        {t('residentLink.loading', 'Loading...')}
      </div>
    </div>
  );
}
