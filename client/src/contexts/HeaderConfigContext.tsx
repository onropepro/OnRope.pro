import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface HeaderConfig {
  pageTitle?: string;
  pageDescription?: string;
  actionButtons?: ReactNode;
  onBackClick?: (() => void) | null;
  showSearch?: boolean;
  showNotifications?: boolean;
  showLanguageDropdown?: boolean;
  showProfile?: boolean;
  showLogout?: boolean;
}

interface HeaderConfigContextValue {
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
  resetConfig: () => void;
}

const defaultConfig: HeaderConfig = {
  showSearch: true,
  showNotifications: true,
  showLanguageDropdown: true,
  showProfile: true,
  showLogout: true,
};

const HeaderConfigContext = createContext<HeaderConfigContextValue | null>(null);

export function HeaderConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<HeaderConfig>(defaultConfig);

  const setConfig = useCallback((newConfig: HeaderConfig) => {
    setConfigState({ ...defaultConfig, ...newConfig });
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(defaultConfig);
  }, []);

  return (
    <HeaderConfigContext.Provider value={{ config, setConfig, resetConfig }}>
      {children}
    </HeaderConfigContext.Provider>
  );
}

export function useHeaderConfig() {
  const context = useContext(HeaderConfigContext);
  if (!context) {
    throw new Error("useHeaderConfig must be used within HeaderConfigProvider");
  }
  return context;
}

export function useSetHeaderConfig(config: HeaderConfig, deps: any[] = []) {
  const { setConfig, resetConfig } = useHeaderConfig();
  
  useEffect(() => {
    setConfig(config);
    return () => resetConfig();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, setConfig, resetConfig]);
}
