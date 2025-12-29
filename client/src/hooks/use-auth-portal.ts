import { useAuthPortalContext } from "@/contexts/AuthPortalContext";

export function useAuthPortal() {
  const { openLogin, openRegister, closePortal, isOpen } = useAuthPortalContext();
  
  return { openLogin, openRegister, closePortal, isOpen };
}
