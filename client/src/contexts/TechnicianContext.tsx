import { createContext, useContext } from "react";
import { useTechnicianContext, type TechnicianContextValue } from "@/hooks/use-technician-context";

const TechnicianContext = createContext<TechnicianContextValue | null>(null);

interface TechnicianProviderProps {
  children: React.ReactNode;
}

export function TechnicianProvider({ children }: TechnicianProviderProps) {
  const contextValue = useTechnicianContext();

  return (
    <TechnicianContext.Provider value={contextValue}>
      {children}
    </TechnicianContext.Provider>
  );
}

export function useTechnician(): TechnicianContextValue {
  const context = useContext(TechnicianContext);
  
  if (!context) {
    throw new Error("useTechnician must be used within a TechnicianProvider");
  }
  
  return context;
}

export function useTechnicianOptional(): TechnicianContextValue | null {
  return useContext(TechnicianContext);
}
