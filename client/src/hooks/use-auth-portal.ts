import { useAuthPortalContext } from "@/contexts/AuthPortalContext";

export function useAuthPortal() {
  const { openLogin, closePortal, isOpen } = useAuthPortalContext();
  
  return { openLogin, closePortal, isOpen };
}
