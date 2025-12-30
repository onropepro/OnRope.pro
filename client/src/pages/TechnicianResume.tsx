import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { getTechnicianNavGroups } from "@/lib/technicianNavigation";
import { 
  FileText, 
  Upload, 
  Loader2, 
  Lock, 
  X,
  LogOut,
  User as UserIcon,
  Menu
} from "lucide-react";

type Language = 'en' | 'fr' | 'es';

const translations = {
  en: {
    title: "Resume / CV",
    subtitle: "Upload and manage your resume or CV",
    uploadResume: "Upload Resume / CV",
    addResume: "Add Another Resume",
    noResume: "No resume uploaded",
    noResumeDesc: "Upload your resume to share with potential employers when applying for jobs.",
    tapToViewPdf: "Tap to view PDF",
    tapToViewDocument: "Tap to view document",
    uploading: "Uploading...",
    plusLockedFeature: "Resume upload is a PLUS feature",
    plusLockedDesc: "Upgrade to PLUS to upload and share your resume with employers",
    deleteConfirmTitle: "Delete Document?",
    deleteConfirmDesc: "This action cannot be undone. The document will be permanently removed.",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    documentDeleted: "Document Deleted",
    documentDeletedDesc: "The document has been removed.",
    deleteFailed: "Delete Failed",
    loading: "Loading...",
    logout: "Logout",
    uploadSuccess: "Resume Uploaded",
    uploadSuccessDesc: "Your resume has been uploaded successfully.",
    uploadFailed: "Upload Failed",
  },
  fr: {
    title: "CV / Curriculum",
    subtitle: "Téléversez et gérez votre CV",
    uploadResume: "Téléverser CV",
    addResume: "Ajouter un autre CV",
    noResume: "Aucun CV téléversé",
    noResumeDesc: "Téléversez votre CV pour le partager avec les employeurs potentiels lors de vos candidatures.",
    tapToViewPdf: "Appuyez pour voir le PDF",
    tapToViewDocument: "Appuyez pour voir le document",
    uploading: "Téléversement...",
    plusLockedFeature: "Le téléversement de CV est une fonctionnalité PLUS",
    plusLockedDesc: "Passez à PLUS pour téléverser et partager votre CV avec les employeurs",
    deleteConfirmTitle: "Supprimer le document?",
    deleteConfirmDesc: "Cette action est irréversible. Le document sera définitivement supprimé.",
    cancel: "Annuler",
    delete: "Supprimer",
    deleting: "Suppression...",
    documentDeleted: "Document supprimé",
    documentDeletedDesc: "Le document a été supprimé.",
    deleteFailed: "Échec de la suppression",
    loading: "Chargement...",
    logout: "Déconnexion",
    uploadSuccess: "CV téléversé",
    uploadSuccessDesc: "Votre CV a été téléversé avec succès.",
    uploadFailed: "Échec du téléversement",
  },
  es: {
    title: "CV / Currículum",
    subtitle: "Sube y gestiona tu currículum",
    uploadResume: "Subir CV",
    addResume: "Agregar otro CV",
    noResume: "No hay CV subido",
    noResumeDesc: "Sube tu currículum para compartirlo con posibles empleadores al solicitar empleo.",
    tapToViewPdf: "Toca para ver el PDF",
    tapToViewDocument: "Toca para ver el documento",
    uploading: "Subiendo...",
    plusLockedFeature: "Subir CV es una función PLUS",
    plusLockedDesc: "Actualiza a PLUS para subir y compartir tu CV con empleadores",
    deleteConfirmTitle: "¿Eliminar documento?",
    deleteConfirmDesc: "Esta acción no se puede deshacer. El documento se eliminará permanentemente.",
    cancel: "Cancelar",
    delete: "Eliminar",
    deleting: "Eliminando...",
    documentDeleted: "Documento eliminado",
    documentDeletedDesc: "El documento ha sido eliminado.",
    deleteFailed: "Error al eliminar",
    loading: "Cargando...",
    logout: "Cerrar sesión",
    uploadSuccess: "CV subido",
    uploadSuccessDesc: "Tu CV se ha subido correctamente.",
    uploadFailed: "Error al subir",
  }
};

export default function TechnicianResume() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('preferredLanguage');
    return (stored as Language) || 'en';
  });
  const t = translations[language];

  const [isUploading, setIsUploading] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userData, isLoading } = useQuery<any>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentUrl: string) => {
      return apiRequest("DELETE", "/api/technician/document", { 
        documentType: 'resumeDocuments', 
        documentUrl 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t.documentDeleted,
        description: t.documentDeletedDesc,
      });
      setDeletingDocument(null);
    },
    onError: (error: any) => {
      toast({
        title: t.deleteFailed,
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
      setDeletingDocument(null);
    },
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      queryClient.clear();
      setLocation("/technician");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', 'resume');

    try {
      const response = await fetch('/api/technician/upload-document', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t.uploadSuccess,
        description: t.uploadSuccessDesc,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: t.uploadFailed,
        description: error.message || 'Failed to upload resume',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const navGroups = getTechnicianNavGroups(language);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/technician");
    return null;
  }

  const resumeDocuments = user.resumeDocuments?.filter((u: string) => u && u.trim()) || [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        currentUser={user}
        activeTab="resume"
        onTabChange={() => {}}
        variant="technician"
        customNavigationGroups={navGroups}
        showDashboardLink={false}
        mobileOpen={sidebarOpen}
        onMobileOpenChange={setSidebarOpen}
      />

      <div className="lg:pl-60">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex flex-1 max-w-xl">
            <DashboardSearch />
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageDropdown />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/technician-portal?tab=profile')}
              data-testid="button-profile"
            >
              <UserIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t.title}
                {!user.hasPlusAccess && (
                  <Badge variant="secondary" className="ml-2 gap-1">
                    <Lock className="w-3 h-3" />
                    PLUS
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{t.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.hasPlusAccess ? (
                <>
                  {resumeDocuments.length > 0 && (
                    <div className="space-y-3">
                      {resumeDocuments.map((url: string, index: number) => {
                        const lowerUrl = url.toLowerCase();
                        const isPdf = lowerUrl.endsWith('.pdf');
                        const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                      lowerUrl.includes('image') || 
                                      (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                        
                        return (
                          <div key={index} className="relative">
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                              data-testid={`link-resume-${index}`}
                            >
                              {isPdf ? (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">{t.tapToViewPdf}</span>
                                </div>
                              ) : isImage ? (
                                <img 
                                  src={url} 
                                  alt={`Resume ${index + 1}`}
                                  className="w-full h-auto max-h-64 object-contain"
                                  data-testid={`img-resume-${index}`}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">{t.tapToViewDocument}</span>
                                </div>
                              )}
                            </a>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-7 w-7"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeletingDocument(url);
                              }}
                              data-testid={`button-delete-resume-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {resumeDocuments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">{t.noResume}</p>
                      <p className="text-sm mt-1">{t.noResumeDesc}</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    data-testid="input-resume-file"
                  />
                  
                  <Button
                    variant="outline"
                    onClick={triggerUpload}
                    disabled={isUploading}
                    data-testid="button-upload-resume"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t.uploading}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {resumeDocuments.length > 0 ? t.addResume : t.uploadResume}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="p-6 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 text-center">
                  <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium text-muted-foreground">{t.plusLockedFeature}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.plusLockedDesc}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <AlertDialog open={!!deletingDocument} onOpenChange={(open) => !open && setDeletingDocument(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteConfirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingDocument) {
                  deleteDocumentMutation.mutate(deletingDocument);
                }
              }}
              className="bg-destructive text-destructive-foreground"
              disabled={deleteDocumentMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteDocumentMutation.isPending ? t.deleting : t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
