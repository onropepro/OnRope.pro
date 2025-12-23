import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserType = "technician" | "property_manager" | "building_manager" | "resident" | "company";
export type AuthMode = "login" | "register";

interface AuthPortalOptions {
  mode?: AuthMode;
  initialUserType?: UserType;
  redirectAfterAuth?: string;
}

interface AuthPortalContextType {
  isOpen: boolean;
  mode: AuthMode;
  userType: UserType;
  redirectAfterAuth: string | null;
  openAuthPortal: (options?: AuthPortalOptions) => void;
  closeAuthPortal: () => void;
  setMode: (mode: AuthMode) => void;
  setUserType: (type: UserType) => void;
}

const AuthPortalContext = createContext<AuthPortalContextType | null>(null);

export function AuthPortalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [userType, setUserType] = useState<UserType>("technician");
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);

  const openAuthPortal = useCallback((options?: AuthPortalOptions) => {
    if (options?.mode) setMode(options.mode);
    if (options?.initialUserType) setUserType(options.initialUserType);
    if (options?.redirectAfterAuth) setRedirectAfterAuth(options.redirectAfterAuth);
    setIsOpen(true);
  }, []);

  const closeAuthPortal = useCallback(() => {
    setIsOpen(false);
    setRedirectAfterAuth(null);
  }, []);

  return (
    <AuthPortalContext.Provider
      value={{
        isOpen,
        mode,
        userType,
        redirectAfterAuth,
        openAuthPortal,
        closeAuthPortal,
        setMode,
        setUserType,
      }}
    >
      {children}
    </AuthPortalContext.Provider>
  );
}

export function useAuthPortal() {
  const context = useContext(AuthPortalContext);
  if (!context) {
    throw new Error("useAuthPortal must be used within an AuthPortalProvider");
  }
  return context;
}
