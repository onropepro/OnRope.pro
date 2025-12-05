import { useQuery } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";

interface ChangelogLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function ChangelogLayout({ children, title = "Changelog" }: ChangelogLayoutProps) {
  const { data: userData, isLoading, isFetching } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const isAuthenticated = !!userData?.user;
  const isSuperUser = userData?.user?.role === 'superuser';

  if (isLoading && !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isSuperUser) {
    return (
      <SuperUserLayout title={title}>
        {children}
      </SuperUserLayout>
    );
  }

  return <>{children}</>;
}
