import { useLocation } from "wouter";

export function useAuthPortal() {
  const [, setLocation] = useLocation();
  
  const openLogin = () => {
    setLocation("/login");
  };
  
  return { openLogin };
}
