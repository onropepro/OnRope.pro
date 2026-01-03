import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const BYPASS_KEY = "onropepro_prelaunch_bypass";
const PRELAUNCH_PIN = "2026";

interface PreLaunchContextType {
  isBypassed: boolean;
  isPreLaunchActive: boolean;
  attemptBypass: (pin: string) => boolean;
  clearBypass: () => void;
}

const PreLaunchContext = createContext<PreLaunchContextType | null>(null);

export function PreLaunchProvider({ children }: { children: ReactNode }) {
  const [isBypassed, setIsBypassed] = useState(false);
  const isPreLaunchActive = true;

  useEffect(() => {
    const stored = localStorage.getItem(BYPASS_KEY);
    if (stored === "true") {
      setIsBypassed(true);
    }
  }, []);

  const attemptBypass = (pin: string): boolean => {
    if (pin === PRELAUNCH_PIN) {
      localStorage.setItem(BYPASS_KEY, "true");
      setIsBypassed(true);
      return true;
    }
    return false;
  };

  const clearBypass = () => {
    localStorage.removeItem(BYPASS_KEY);
    setIsBypassed(false);
  };

  return (
    <PreLaunchContext.Provider value={{ isBypassed, isPreLaunchActive, attemptBypass, clearBypass }}>
      {children}
    </PreLaunchContext.Provider>
  );
}

export function usePreLaunch() {
  const context = useContext(PreLaunchContext);
  if (!context) {
    throw new Error("usePreLaunch must be used within a PreLaunchProvider");
  }
  return context;
}
