import { useQuery, useMutation } from "@tanstack/react-query";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SubscriptionManagement } from "@/components/SubscriptionManagement";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { COMMON_TIMEZONES } from "@/lib/timezoneUtils";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  unitNumber: z.string().optional(),
  parkingStallNumber: z.string().optional(),
  companyName: z.string().optional(),
  residentCode: z.string().optional(),
  residentLinkCode: z.string().optional(),
  // Company owner fields
  hourlyRate: z.string().optional(),
  streetAddress: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  employeePhoneNumber: z.string().optional(),
  timezone: z.string().optional(),
  smsNotificationsEnabled: z.boolean().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function BrandColorsSection({ user }: { user: any }) {
  const { toast } = useToast();
  const [colors, setColors] = useState<string[]>(user?.brandingColors || ['#3b82f6']);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when user data changes
  useEffect(() => {
    if (user?.brandingColors && user.brandingColors.length > 0) {
      setColors(user.brandingColors);
    }
  }, [user?.brandingColors]);

  const addColor = () => {
    if (colors.length >= 2) {
      toast({
        title: "Limit reached",
        description: "You can only have up to 2 brand colors",
        variant: "destructive"
      });
      return;
    }
    setColors([...colors, '#3b82f6']);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    } else {
      toast({
        title: t('profile.cannotRemove', 'Cannot remove'),
        description: t('profile.mustHaveOneColor', 'You must have at least one color'),
        variant: "destructive"
      });
    }
  };

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const saveColors = async () => {
    try {
      setIsSaving(true);
      await apiRequest('PATCH', '/api/company/branding', {
        colors: colors,
      });
      toast({ title: t('profile.brandColorsUpdated', 'Brand colors updated successfully') });
      // Invalidate BOTH user cache AND branding cache to trigger re-fetch
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/company"] });
      // Force a page reload to apply new colors immediately
      window.location.reload();
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: t('profile.failedToUpdateColors', 'Failed to update colors'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Brand Colors</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Choose up to 2 colors that match your brand identity. These colors will be applied to the resident portal.
        </p>
      </div>

      <div className="space-y-3">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                data-testid={`input-color-${index}`}
                className="h-12 w-20"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="h-12 font-mono text-sm flex-1"
                data-testid={`text-color-value-${index}`}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeColor(index)}
              disabled={colors.length === 1}
              data-testid={`button-remove-color-${index}`}
              className="h-12"
            >
              <span className="material-icons text-lg">delete</span>
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {colors.length < 2 && (
          <Button
            variant="outline"
            onClick={addColor}
            data-testid="button-add-color"
            className="h-12"
          >
            <span className="material-icons mr-2">add</span>
            Add Color
          </Button>
        )}
        <Button
          onClick={saveColors}
          disabled={isSaving}
          data-testid="button-update-colors"
          className="h-12 !bg-primary hover:!bg-primary/90 !text-white"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function LanguagePreferenceCard() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const currentLanguage = i18n.language || userData?.user?.preferredLanguage || 'en';

  const handleLanguageChange = async (language: string) => {
    try {
      setIsUpdating(true);
      await i18n.changeLanguage(language);
      localStorage.setItem('i18nextLng', language);
      
      await apiRequest('PATCH', '/api/user/language', { language });
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: language === 'en' ? "Language Updated" : "Langue mise à jour",
        description: language === 'en' 
          ? "Your language preference has been saved." 
          : "Votre préférence de langue a été enregistrée.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language preference",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="material-icons text-xl">language</span>
          {t('profile.languagePreference', 'Language Preference')}
        </CardTitle>
        <CardDescription>
          {t('profile.languageDescription', 'Choose your preferred language for the application')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={currentLanguage === 'en' ? 'default' : 'outline'}
              className="h-14 flex flex-col items-center justify-center gap-1"
              onClick={() => handleLanguageChange('en')}
              disabled={isUpdating}
              data-testid="button-language-english"
            >
              <span className="text-lg">English</span>
              <span className="text-xs opacity-70">English</span>
            </Button>
            <Button
              variant={currentLanguage === 'fr' ? 'default' : 'outline'}
              className="h-14 flex flex-col items-center justify-center gap-1"
              onClick={() => handleLanguageChange('fr')}
              disabled={isUpdating}
              data-testid="button-language-french"
            >
              <span className="text-lg">Français</span>
              <span className="text-xs opacity-70">French</span>
            </Button>
            <Button
              variant={currentLanguage === 'es' ? 'default' : 'outline'}
              className="h-14 flex flex-col items-center justify-center gap-1"
              onClick={() => handleLanguageChange('es')}
              disabled={isUpdating}
              data-testid="button-language-spanish"
            >
              <span className="text-lg">Español</span>
              <span className="text-xs opacity-70">Spanish</span>
            </Button>
          </div>
          {isUpdating && (
            <div className="text-center text-sm text-muted-foreground">
              {t('common.loading', 'Loading...')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Feature Request Category Options
const FEATURE_CATEGORIES = [
  { value: 'feature', label: 'New Feature' },
  { value: 'job_type', label: 'New Job Type' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const featureRequestSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.string().default('normal'),
  screenshotUrl: z.string().optional(),
});

type FeatureRequestFormData = z.infer<typeof featureRequestSchema>;

function FeatureRequestsSection({ userId, userName }: { userId: string; userName: string }) {
  const { toast } = useToast();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);

  // Fetch feature requests
  const { data: requestsData, isLoading, refetch } = useQuery<{ requests: any[] }>({
    queryKey: ["/api/feature-requests"],
  });

  // Fetch single request when selected (triggers mark-as-read on backend)
  const { data: selectedRequestData } = useQuery<{ request: any }>({
    queryKey: ["/api/feature-requests", selectedRequestId],
    enabled: !!selectedRequestId,
  });
  
  const selectedRequest = selectedRequestData?.request || null;

  // Invalidate both unread count and main list when viewing a request
  useEffect(() => {
    if (selectedRequestId && selectedRequestData?.request) {
      queryClient.invalidateQueries({ queryKey: ["/api/feature-requests/unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["/api/feature-requests"] });
    }
  }, [selectedRequestId, selectedRequestData]);

  const requests = requestsData?.requests || [];

  // Handle screenshot file selection
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, etc.)",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Screenshot must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setScreenshotFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  // Form for creating new requests
  const form = useForm<FeatureRequestFormData>({
    resolver: zodResolver(featureRequestSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      priority: "normal",
      screenshotUrl: "",
    },
  });

  // Create feature request mutation
  const createMutation = useMutation({
    mutationFn: async (data: FeatureRequestFormData) => {
      return apiRequest('POST', '/api/feature-requests', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feature-requests"] });
      form.reset();
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setShowNewRequestForm(false);
      setShowThankYouDialog(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feature request",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ requestId, message }: { requestId: string; message: string }) => {
      return apiRequest('POST', `/api/feature-requests/${requestId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feature-requests"] });
      setNewMessage("");
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FeatureRequestFormData) => {
    let screenshotUrl = "";
    
    // Upload screenshot if present
    if (screenshotFile) {
      setIsUploadingScreenshot(true);
      try {
        const formData = new FormData();
        formData.append('file', screenshotFile);
        formData.append('type', 'feature-request-screenshot');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload screenshot');
        }
        
        const uploadResult = await uploadResponse.json();
        screenshotUrl = uploadResult.url;
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload screenshot. Please try again.",
          variant: "destructive",
        });
        setIsUploadingScreenshot(false);
        return;
      }
      setIsUploadingScreenshot(false);
    }
    
    // Submit the request with screenshot URL
    createMutation.mutate({ ...data, screenshotUrl });
  };

  const handleSendMessage = () => {
    if (!selectedRequestId || !newMessage.trim()) return;
    sendMessageMutation.mutate({
      requestId: selectedRequestId,
      message: newMessage.trim(),
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status] || styles.pending;
  };

  const getCategoryLabel = (value: string) => {
    return FEATURE_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <span className="material-icons animate-spin text-3xl text-muted-foreground">autorenew</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // View single request with messages
  if (selectedRequest) {
    const currentRequest = selectedRequest;
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedRequestId(null)}
              data-testid="button-back-to-requests"
            >
              <span className="material-icons">arrow_back</span>
            </Button>
            <div className="flex-1">
              <CardTitle className="text-lg">{currentRequest.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusBadge(currentRequest.status)}>
                  {currentRequest.status.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {getCategoryLabel(currentRequest.category)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Original Description */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Original Request:</p>
            <p className="text-sm whitespace-pre-wrap">{currentRequest.description}</p>
            {currentRequest.screenshotUrl && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">Attached Screenshot:</p>
                <img 
                  src={currentRequest.screenshotUrl} 
                  alt="Request screenshot" 
                  className="max-h-[200px] rounded-md border object-contain"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Submitted {format(new Date(currentRequest.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>

          {/* Messages */}
          {currentRequest.messages && currentRequest.messages.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Conversation:</p>
              {currentRequest.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.senderRole === 'company'
                      ? 'bg-primary/10 ml-8'
                      : 'bg-muted mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {msg.senderRole === 'company' ? 'You' : 'OnRopePro Team'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {currentRequest.status !== 'completed' && currentRequest.status !== 'declined' && (
            <div className="space-y-2 pt-4 border-t">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('profile.typeMessage', 'Type your message...')}
                className="w-full min-h-[100px] p-3 border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20"
                data-testid="textarea-reply-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                className="h-12"
                data-testid="button-send-reply"
              >
                {sendMessageMutation.isPending ? (
                  <span className="material-icons animate-spin mr-2">autorenew</span>
                ) : (
                  <span className="material-icons mr-2 text-lg">send</span>
                )}
                Send Reply
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // New request form
  if (showNewRequestForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNewRequestForm(false)}
              data-testid="button-cancel-new-request"
            >
              <span className="material-icons">arrow_back</span>
            </Button>
            <div>
              <CardTitle>Submit Feature Request</CardTitle>
              <CardDescription>Share your ideas to help us improve OnRopePro</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('profile.requestSummary', 'Brief summary of your request')}
                        {...field}
                        data-testid="input-request-title"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-12 px-3 rounded-lg border bg-background"
                        data-testid="select-request-category"
                      >
                        <option value="">Select a category...</option>
                        {FEATURE_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-12 px-3 rounded-lg border bg-background"
                        data-testid="select-request-priority"
                      >
                        {PRIORITY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder={t('profile.featureRequestDescription', 'Please describe your feature request in detail. Include any specific use cases or examples that would help us understand your needs.')}
                        className="w-full min-h-[150px] p-3 border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20"
                        data-testid="textarea-request-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Screenshot Upload */}
              <div className="space-y-2">
                <Label>Screenshot (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Attach a screenshot to help illustrate your request
                </p>
                {screenshotPreview ? (
                  <div className="relative border rounded-lg p-2 bg-muted/30">
                    <img 
                      src={screenshotPreview} 
                      alt="Screenshot preview" 
                      className="max-h-[200px] rounded-md mx-auto object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeScreenshot}
                      data-testid="button-remove-screenshot"
                    >
                      <span className="material-icons text-lg">close</span>
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                    <span className="material-icons text-3xl text-muted-foreground mb-2">add_photo_alternate</span>
                    <span className="text-sm text-muted-foreground">Click to upload screenshot</span>
                    <span className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                      data-testid="input-screenshot"
                    />
                  </label>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewRequestForm(false)}
                  className="h-12"
                  data-testid="button-cancel-submit"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || isUploadingScreenshot}
                  className="h-12 flex-1"
                  data-testid="button-submit-request"
                >
                  {createMutation.isPending || isUploadingScreenshot ? (
                    <>
                      <span className="material-icons animate-spin mr-2">autorenew</span>
                      {isUploadingScreenshot ? "Uploading..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2 text-lg">send</span>
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  // List view
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Feature Requests</CardTitle>
              <CardDescription>Share feedback and suggestions with the OnRopePro team</CardDescription>
            </div>
            <Button
              onClick={() => setShowNewRequestForm(true)}
              className="h-12"
              data-testid="button-new-request"
            >
              <span className="material-icons mr-2 text-lg">add</span>
              New Request
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons text-5xl text-muted-foreground mb-4">lightbulb</span>
              <p className="text-muted-foreground mb-4">You haven't submitted any feature requests yet</p>
              <Button
                onClick={() => setShowNewRequestForm(true)}
                variant="outline"
                className="h-12"
                data-testid="button-first-request"
              >
                <span className="material-icons mr-2">add</span>
                Submit Your First Request
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequestId(request.id)}
                  className="p-4 border rounded-lg hover-elevate cursor-pointer"
                  data-testid={`request-item-${request.id}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-sm">{request.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {request.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {request.unreadCount} new
                        </Badge>
                      )}
                      <Badge className={getStatusBadge(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{request.description}</p>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {getCategoryLabel(request.category)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(request.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thank You Dialog */}
      <AlertDialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <span className="material-icons text-5xl text-primary">check_circle</span>
            </div>
            <AlertDialogTitle className="text-center">Thank You!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your feature request has been submitted successfully. We appreciate your feedback and will review it carefully. You'll be notified when we respond.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction
              onClick={() => setShowThankYouDialog(false)}
              className="h-12"
              data-testid="button-close-thank-you"
            >
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function Profile() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const { data: userData, isLoading } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;

  // Fetch employee data for seat usage (company users only)
  const { data: employeesData } = useQuery({
    queryKey: ["/api/employees/all"],
    enabled: user?.role === "company",
  });

  // Fetch projects for company users (for subscription tab) and residents
  const { data: projectsData } = useQuery<{ projects: any[]; projectInfo?: any }>({
    queryKey: ["/api/projects"],
    enabled: user?.role === "resident" || user?.role === "company",
  });

  const allProjects = projectsData?.projects || [];
  const activeProjects = allProjects.filter((p: any) => p.status === 'active');
  const activeProject = activeProjects[0];
  const isParkadeProject = activeProject?.jobType === 'parkade_pressure_cleaning';

  // Fetch company data if resident has linked account
  const { data: companyData } = useQuery({
    queryKey: ["/api/companies", user?.companyId],
    enabled: !!user?.companyId && user?.role === "resident",
  });

  // Re-verify license mutation (with new license key input)
  const [newLicenseKey, setNewLicenseKey] = useState("");
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  
  const reverifyLicenseMutation = useMutation({
    mutationFn: async (licenseKeyToVerify?: string) => {
      return apiRequest("POST", "/api/verify-license", {
        licenseKey: licenseKeyToVerify || user?.licenseKey,
        email: user?.email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: t('profile.licenseVerified', 'License verified successfully') });
      setShowLicenseDialog(false);
      setNewLicenseKey("");
    },
    onError: (error: Error) => {
      toast({ title: t('common.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  // Auto-refresh data when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
      unitNumber: user?.unitNumber || "",
      parkingStallNumber: user?.parkingStallNumber || "",
      companyName: user?.companyName || "",
      residentCode: user?.residentCode || "",
      residentLinkCode: "",
      // Company owner fields
      hourlyRate: user?.hourlyRate?.toString() || "",
      streetAddress: user?.streetAddress || "",
      province: user?.province || "",
      country: user?.country || "",
      zipCode: user?.zipCode || "",
      employeePhoneNumber: user?.employeePhoneNumber || "",
      timezone: user?.timezone || "America/Vancouver",
      smsNotificationsEnabled: user?.smsNotificationsEnabled ?? true,
    },
  });

  // Check for pending resident code from QR code scan
  useEffect(() => {
    if (user?.role === 'resident') {
      const pendingCode = sessionStorage.getItem('pendingResidentCode');
      if (pendingCode) {
        profileForm.setValue('residentLinkCode', pendingCode);
        sessionStorage.removeItem('pendingResidentCode');
        toast({
          title: t('profile.companyCodeDetected', 'Company code detected'),
          description: t('profile.codeAutoFilled', "Code has been auto-filled. Click 'Update Profile' to link your account."),
        });
      }
    }
  }, [user?.role]);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: t('profile.profileUpdated', 'Profile updated successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('common.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      return apiRequest("PATCH", "/api/user/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      passwordForm.reset();
      toast({ title: t('profile.passwordChanged', 'Password changed successfully') });
    },
    onError: (error: Error) => {
      // Clear password fields on error for security - don't leave sensitive data visible
      passwordForm.setValue("currentPassword", "");
      passwordForm.setValue("newPassword", "");
      passwordForm.setValue("confirmPassword", "");
      toast({ title: t('common.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      return apiRequest("DELETE", "/api/user/account", { password });
    },
    onSuccess: () => {
      // Close dialog and clear password on success
      setShowDeleteDialog(false);
      setDeletePassword("");
      toast({ title: t('profile.accountDeleted', 'Account deleted successfully') });
      setLocation("/");
    },
    onError: (error: Error) => {
      // Keep dialog open so user can retry - don't clear password or close dialog
      toast({ title: t('common.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({ title: t('common.error', 'Error'), description: t('profile.pleaseEnterPassword', 'Please enter your password'), variant: "destructive" });
      return;
    }
    try {
      await deleteAccountMutation.mutateAsync(deletePassword);
      // Only close dialog and clear password on success (handled in onSuccess callback)
    } catch (error) {
      // Keep dialog open and password visible so user can retry
      // Error toast is shown by onError callback
    }
  };

  const confirmLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: t('common.error', 'Error'), description: t('profile.failedToLogout', 'Failed to logout'), variant: "destructive" });
    }
  };

  const handleBack = () => {
    if (user?.role === "resident") {
      setLocation("/resident-dashboard");
    } else if (user?.role === "rope_access_tech") {
      setLocation("/tech");
    } else {
      setLocation("/dashboard");
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    // Handle resident company code linking separately
    if (user?.role === "resident" && data.residentLinkCode && data.residentLinkCode.length === 10) {
      try {
        const response = await fetch("/api/link-resident-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ residentCode: data.residentLinkCode }),
          credentials: "include",
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to link account");
        }
        
        const result = await response.json();
        toast({ 
          title: "Success!", 
          description: `Linked to ${result.companyName}. Reloading...` 
        });
        
        // Force full page reload to clear all caches
        setTimeout(() => {
          window.location.href = "/resident-dashboard";
        }, 1500);
        return; // Prevent regular profile update from running
      } catch (error) {
        toast({ 
          title: "Link Failed", 
          description: error instanceof Error ? error.message : "Invalid code", 
          variant: "destructive" 
        });
        return;
      }
    }
    
    // Update regular profile fields
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Determine company ID to fetch branding for logo display
  const companyIdForBranding = user?.role === 'company' ? user.id : user?.companyId;

  // Fetch company branding for logo  
  const { data: brandingData } = useQuery({
    queryKey: ["/api/company", companyIdForBranding, "branding"],
    queryFn: async () => {
      if (!companyIdForBranding) return null;
      const response = await fetch(`/api/company/${companyIdForBranding}/branding`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Failed to fetch branding: ${response.status}`);
      return response.json();
    },
    enabled: !!companyIdForBranding && user?.role !== 'resident' && user?.role !== 'superuser',
    retry: 1,
  });

  const branding = brandingData || {};
  const hasLogo = !!(branding.subscriptionActive && branding.logoUrl);

  useSetHeaderConfig({}, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        {user?.role === "company" ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" data-testid="tab-profile">{t('profile.title', 'Profile')}</TabsTrigger>
              <TabsTrigger value="subscription" data-testid="tab-subscription">{t('profile.subscription', 'Subscription')}</TabsTrigger>
              <TabsTrigger value="branding" data-testid="tab-branding">{t('profile.branding', 'Branding')}</TabsTrigger>
              <TabsTrigger value="feature-requests" data-testid="tab-feature-requests">{t('profile.feedback', 'Feedback')}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile & Security */}
                <div className="lg:col-span-2 space-y-6">
              {/* Profile Information - Glass-morphism container */}
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-icons text-primary">person</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('profile.profileInformation', 'Profile Information')}</h2>
                    <p className="text-sm text-muted-foreground">{t('profile.manageYourAccount', 'Manage your account details')}</p>
                  </div>
                </div>

            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <span className="material-icons text-base">badge</span>
                    {t('profile.basicInfo', 'Basic Information')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.name', 'Name')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('profile.yourName', 'Your name')}
                              {...field}
                              data-testid="input-name"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {user?.role !== "company" && (
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('common.email', 'Email')}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={t('common.placeholders.email', 'your.email@example.com')}
                                {...field}
                                data-testid="input-email"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                {user?.role === "resident" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="unitNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.unitNumber', 'Unit Number')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('resident.placeholders.unitNumber', 'e.g., 101, 1205')}
                                {...field}
                                data-testid="input-unit-number"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="parkingStallNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.parkingStallNumber', 'Parking Stall Number')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('resident.placeholders.parkingStall', 'e.g., 42, A-5, P1-23')}
                                {...field}
                                data-testid="input-parking-stall"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Company Code Linking */}
                    {user?.companyId && companyData?.company ? (
                      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-icons text-success text-lg">check_circle</span>
                          <span className="text-sm font-medium">Linked to Company</span>
                        </div>
                        <p className="text-base font-semibold">{companyData.company.companyName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          To change, enter a new company code below
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-icons text-muted-foreground text-lg">info</span>
                          <span className="text-sm font-medium">Not Linked</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter a company code below to link your account
                        </p>
                      </div>
                    )}
                    
                    <FormField
                      control={profileForm.control}
                      name="residentLinkCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Code {!user?.companyId && "(Required to view projects)"}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('profile.enterCompanyCode', 'Enter 10-character code')}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              maxLength={10}
                              className="h-12 font-mono"
                              data-testid="input-company-code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {user?.role === "company" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.companyName', 'Company Name')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('profile.companyNamePlaceholder', 'Company name')}
                                {...field}
                                data-testid="input-company-name"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="residentCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.residentCode', 'Resident Code')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10-character code for residents"
                                {...field}
                                data-testid="input-resident-code"
                                className="h-12 font-mono"
                                maxLength={10}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Company Information Section */}
                    <div className="pt-6 border-t space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <span className="material-icons text-base">business</span>
                        {t('profile.companyInformation', 'Company Information')}
                      </h3>
                      
                      <FormField
                        control={profileForm.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.streetAddress', 'Street Address')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('common.placeholders.streetAddress', '123 Main St, Suite 100')}
                                {...field}
                                data-testid="input-street-address"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.provinceState', 'Province/State')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('common.placeholders.province', 'BC, ON, etc.')}
                                  {...field}
                                  data-testid="input-province"
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.country', 'Country')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('profile.countryPlaceholder', 'Canada, USA, etc.')}
                                  {...field}
                                  data-testid="input-country"
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.postalZipCode', 'Postal/Zip Code')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('common.placeholders.postalCode', 'V6B 1A1, 90210, etc.')}
                                {...field}
                                data-testid="input-zip-code"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.timezone', 'Company Timezone')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "America/Vancouver"}>
                              <FormControl>
                                <SelectTrigger className="h-12" data-testid="select-timezone">
                                  <SelectValue placeholder={t('profile.selectTimezone', 'Select timezone')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COMMON_TIMEZONES.map((tz) => (
                                  <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="employeePhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.phoneNumber', 'Phone Number')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(604) 555-1234"
                                {...field}
                                data-testid="input-phone-number"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="smsNotificationsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t('profile.smsNotifications', 'SMS Notifications')}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {t('profile.smsNotificationsDescription', 'Receive text messages when employees accept team invitations')}
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-sms-notifications"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.hourlyRateSelf', 'Hourly Rate (for yourself)')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="25.00"
                                {...field}
                                data-testid="input-hourly-rate"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-4" />
                    
                    {/* Employee Seat Usage */}
                    {employeesData?.seatInfo && employeesData.seatInfo.tier > 0 && (
                      <div className="p-4 bg-muted/50 border border-border rounded-lg" data-testid="card-seat-usage">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-primary text-lg">groups</span>
                            <span className="text-sm font-medium">{t('profile.employeeSeats', 'Employee Seats')}</span>
                          </div>
                          <Badge 
                            variant={employeesData.seatInfo.atSeatLimit ? "destructive" : "secondary"}
                            data-testid="badge-tier"
                          >
                            Tier {employeesData.seatInfo.tier}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-base font-semibold" data-testid="text-seat-usage">
                            {employeesData.seatInfo.seatsUsed} of {employeesData.seatInfo.seatLimit === -1 ? '∞' : employeesData.seatInfo.seatLimit} seats used
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {employeesData.seatInfo.seatLimit === -1 
                              ? 'Unlimited employee seats'
                              : employeesData.seatInfo.seatsAvailable > 0 
                                ? `${employeesData.seatInfo.seatsAvailable} seat${employeesData.seatInfo.seatsAvailable === 1 ? '' : 's'} remaining`
                                : 'No seats available - upgrade to add more employees'
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                </div>

                {/* Account Info Section */}
                <div className="pt-6 border-t space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <span className="material-icons text-base">account_circle</span>
                    {t('profile.accountInfo', 'Account Information')}
                  </h3>
                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">{t('profile.role', 'Role')}</div>
                  <div className="text-sm font-medium capitalize">
                    {user?.role.replace(/_/g, " ")}
                  </div>
                </div>

                {user?.techLevel && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">{t('profile.irataLevel', 'IRATA Level')}</div>
                    <div className="text-sm font-medium">{user.techLevel}</div>
                  </div>
                )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-6"
                  data-testid="button-update-profile"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? t('common.updating', 'Updating...') : t('profile.updateProfile', 'Update Profile')}
                </Button>
              </form>
            </Form>
              </div>

              {/* Security Section - Glass-morphism container */}
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="material-icons text-amber-500">lock</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('profile.changePassword', 'Change Password')}</h2>
                    <p className="text-sm text-muted-foreground">{t('profile.updateYourPassword', 'Update your login credentials')}</p>
                  </div>
                </div>

            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.currentPassword', 'Current Password')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('profile.enterCurrentPassword', 'Enter current password')}
                          {...field}
                          data-testid="input-current-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.newPassword', 'New Password')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('profile.enterNewPassword', 'Enter new password')}
                          {...field}
                          data-testid="input-new-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.confirmNewPassword', 'Confirm New Password')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('profile.confirmNewPasswordPlaceholder', 'Confirm new password')}
                          {...field}
                          data-testid="input-confirm-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12"
                  data-testid="button-change-password"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </Form>
              </div>
                </div>

                {/* Right Column - Quick Actions & Danger Zone */}
                <div className="space-y-6">
              {/* Quick Actions - Glass-morphism container */}
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="material-icons text-violet-500">apps</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('profile.quickActions', 'Quick Actions')}</h2>
                    <p className="text-sm text-muted-foreground">{t('profile.additionalSettings', 'Additional settings and tools')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* My Logged Hours */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover-elevate active-elevate-2 cursor-pointer border border-border/50" 
                    onClick={() => setLocation("/my-logged-hours")} 
                    data-testid="card-my-logged-hours"
                  >
                    <div className="p-3 bg-violet-500/10 rounded-xl">
                      <span className="material-icons text-violet-500">assignment</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{t('dashboard.cards.myLoggedHours.label', 'My Logged Hours')}</p>
                      <p className="text-sm text-muted-foreground">{t('dashboard.cards.myLoggedHours.description', 'IRATA logbook')}</p>
                    </div>
                    <span className="material-icons text-muted-foreground">chevron_right</span>
                  </div>

                </div>
              </div>

              {/* Danger Zone - Glass-morphism container */}
              <div className="bg-red-500/5 backdrop-blur-sm rounded-2xl border border-red-500/20 shadow-xl p-6">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="material-icons text-red-500">warning</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400">{t('profile.dangerZone', 'Danger Zone')}</h2>
                    <p className="text-sm text-muted-foreground">{t('profile.irreversibleActions', 'Irreversible account actions')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your company account and all associated data. This action cannot be undone.
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Warning: This will delete all employees, projects, work sessions, drop logs, and feedback.
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full h-12"
                    onClick={() => setShowDeleteDialog(true)}
                    data-testid="button-delete-account"
                  >
                    <span className="material-icons mr-2">delete_forever</span>
                    Delete Company Account
                  </Button>
                </div>
              </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4 mt-4">
              <SubscriptionManagement />
            </TabsContent>

            <TabsContent value="branding" className="space-y-4 mt-4">
              {/* White Label Branding */}
              <Card>
                <CardHeader>
                  <CardTitle>White Label Branding</CardTitle>
                  <CardDescription>
                    Customize your company's branding in the resident portal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subscription Gate */}
                  {!user.whitelabelBrandingActive && (
                    <div className="p-6 border-2 border-dashed rounded-lg bg-muted/30">
                      <div className="text-center space-y-4">
                        <span className="material-icons text-5xl text-muted-foreground">palette</span>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">White Label Branding Subscription</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Customize the resident portal with your company's logo and brand colors for just <strong className="text-foreground">$49/month</strong>
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left max-w-md mx-auto">
                            <li className="flex items-start gap-2">
                              <span className="material-icons text-sm mt-0.5 text-primary">check_circle</span>
                              <span>Upload custom company logo</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="material-icons text-sm mt-0.5 text-primary">check_circle</span>
                              <span>Choose unlimited brand colors</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="material-icons text-sm mt-0.5 text-primary">check_circle</span>
                              <span>Fully branded resident portal experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="material-icons text-sm mt-0.5 text-primary">check_circle</span>
                              <span>Professional appearance for your residents</span>
                            </li>
                          </ul>
                        </div>
                        
                        <p className="text-sm text-muted-foreground px-4">
                          Branding subscription is included in the SubscriptionManagement component. Visit the Subscription tab to enable white label branding.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Branding Controls - Only shown if subscribed */}
                  {user.whitelabelBrandingActive && (
                    <>
                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Company Logo</Label>
                    <p className="text-xs text-muted-foreground">
                      Upload your company logo to display in the resident portal (recommended: square format, PNG with transparent background)
                    </p>
                    {user.brandingLogoUrl && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <img 
                          src={user.brandingLogoUrl} 
                          alt="Company logo" 
                          className="w-16 h-16 object-contain"
                          data-testid="img-current-logo"
                        />
                        <div className="flex-1 text-sm text-muted-foreground">
                          Current logo
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('logo', file);
                          
                          try {
                            const response = await fetch('/api/company/branding/logo', {
                              method: 'POST',
                              body: formData,
                              credentials: 'include',
                            });
                            
                            if (!response.ok) {
                              throw new Error('Failed to upload logo');
                            }
                            
                            const data = await response.json();
                            toast({ title: t('profile.logoUploaded', 'Logo uploaded successfully') });
                            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                          } catch (error) {
                            toast({ 
                              title: t('common.error', 'Error'), 
                              description: error instanceof Error ? error.message : t('profile.failedToUploadLogo', 'Failed to upload logo'),
                              variant: "destructive" 
                            });
                          }
                        }}
                        data-testid="input-logo-upload"
                        className="h-12 border-2 border-dashed border-primary/30 hover:border-primary cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:text-sm file:font-medium hover:file:bg-primary/90"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Color Customization */}
                  <BrandColorsSection user={user} />

                  <Separator />

                  {/* PWA App Icon */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <span className="material-icons text-base">phone_iphone</span>
                      App Icon (for installed app)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      When users install this app on their phone (Add to Home Screen), this icon will appear on their device. 
                    </p>
                    
                    {/* Requirements Card */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                      <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <span className="material-icons text-sm">info</span>
                        Icon Requirements
                      </h4>
                      <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="material-icons text-xs mt-0.5">check_circle</span>
                          <span><strong>Size:</strong> 512 x 512 pixels (will auto-resize smaller versions)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-icons text-xs mt-0.5">check_circle</span>
                          <span><strong>Format:</strong> PNG with solid background (transparent can look odd)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-icons text-xs mt-0.5">check_circle</span>
                          <span><strong>Shape:</strong> Square image (will be cropped to circle on some devices)</span>
                        </li>
                      </ul>
                    </div>

                    {/* Limitation Warning */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                      <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                        <span className="material-icons text-sm">warning</span>
                        Important Limitation
                      </h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Once someone installs the app on their device, changing this icon <strong>won't update automatically</strong>. 
                        They would need to uninstall and reinstall the app to see the new icon. This is a browser limitation, not something we can change.
                      </p>
                    </div>

                    {/* Current Icon Preview */}
                    {user.pwaAppIconUrl && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <img 
                          src={user.pwaAppIconUrl} 
                          alt="Current app icon" 
                          className="w-16 h-16 object-contain rounded-lg border"
                          data-testid="img-current-pwa-icon"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Current App Icon</p>
                          <p className="text-xs text-muted-foreground">This is how your icon appears when installed</p>
                        </div>
                      </div>
                    )}

                    {/* Upload with Resize */}
                    <div className="space-y-2">
                      <input
                        type="file"
                        id="pwa-icon-input"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          // Create canvas for resizing
                          const img = new Image();
                          const reader = new FileReader();
                          
                          reader.onload = (event) => {
                            img.onload = async () => {
                              // Create 512x512 canvas
                              const canvas = document.createElement('canvas');
                              canvas.width = 512;
                              canvas.height = 512;
                              const ctx = canvas.getContext('2d');
                              
                              if (ctx) {
                                // Fill with white background (for transparency)
                                ctx.fillStyle = '#ffffff';
                                ctx.fillRect(0, 0, 512, 512);
                                
                                // Calculate scaling to fit and center
                                const scale = Math.min(512 / img.width, 512 / img.height);
                                const x = (512 - img.width * scale) / 2;
                                const y = (512 - img.height * scale) / 2;
                                
                                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                                
                                // Convert to blob
                                canvas.toBlob(async (blob) => {
                                  if (!blob) {
                                    toast({ title: t('common.error', 'Error'), description: t('profile.failedToProcessImage', 'Failed to process image'), variant: "destructive" });
                                    return;
                                  }
                                  
                                  const formData = new FormData();
                                  formData.append('icon', blob, 'pwa-icon.png');
                                  
                                  try {
                                    const response = await fetch('/api/company/branding/pwa-icon', {
                                      method: 'POST',
                                      body: formData,
                                      credentials: 'include',
                                    });
                                    
                                    if (!response.ok) {
                                      throw new Error('Failed to upload icon');
                                    }
                                    
                                    toast({ title: t('profile.appIconUploaded', 'App icon uploaded successfully'), description: t('profile.appIconActive', 'Your custom icon is now active for new app installations.') });
                                    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                                  } catch (error) {
                                    toast({ 
                                      title: t('common.error', 'Error'), 
                                      description: error instanceof Error ? error.message : t('profile.failedToUploadIcon', 'Failed to upload icon'),
                                      variant: "destructive" 
                                    });
                                  }
                                }, 'image/png', 0.95);
                              }
                            };
                            img.src = event.target?.result as string;
                          };
                          reader.readAsDataURL(file);
                        }}
                        data-testid="input-pwa-icon-upload"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full h-12 gap-2"
                        onClick={() => document.getElementById('pwa-icon-input')?.click()}
                        data-testid="button-upload-pwa-icon"
                      >
                        <span className="material-icons text-base">upload</span>
                        Upload & Auto-Resize to 512x512
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Any image will be automatically resized to the correct 512x512 size
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Preview</Label>
                    <p className="text-xs text-muted-foreground">
                      This is how your branding will appear in the resident portal
                    </p>
                    <div 
                      className="p-6 rounded-lg border-2"
                      style={{
                        backgroundColor: `${user.brandingColors?.[0] || '#3b82f6'}15`,
                        borderColor: user.brandingColors?.[0] || '#3b82f6'
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        {user.brandingLogoUrl && (
                          <img 
                            src={user.brandingLogoUrl} 
                            alt="Logo preview" 
                            className="w-12 h-12 object-contain"
                            data-testid="img-logo-preview"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: user.brandingColors?.[0] || '#3b82f6' }}>
                            {user.companyName || 'Your Company Name'}
                          </h3>
                          <p className="text-sm text-muted-foreground">Resident Portal</p>
                        </div>
                      </div>
                      {user.brandingColors && user.brandingColors.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {user.brandingColors.map((color: string, index: number) => (
                            <div 
                              key={index}
                              className="w-12 h-12 rounded-lg border-2 border-border"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {user.brandingColors?.slice(0, 3).map((color: string, index: number) => (
                          <Button 
                            key={index}
                            style={{ 
                              backgroundColor: color,
                              color: '#ffffff'
                            }}
                            className="h-12"
                            data-testid={`button-preview-${index}`}
                          >
                            Button {index + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feature-requests" className="space-y-4 mt-4">
              <FeatureRequestsSection userId={user.id} userName={user.name || user.email || "Company Owner"} />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* Non-company users - regular layout without tabs */}
            <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('profile.yourName', 'Your name')}
                          {...field}
                          data-testid="input-name"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('common.placeholders.email', 'your.email@example.com')}
                          {...field}
                          data-testid="input-email"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.role === "resident" && (
                  <>
                    <FormField
                      control={profileForm.control}
                      name="unitNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.unitNumber', 'Unit Number')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('resident.placeholders.unitNumber', 'e.g., 101, 1205')}
                              {...field}
                              data-testid="input-unit-number"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="parkingStallNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.parkingStallNumber', 'Parking Stall Number')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('resident.placeholders.parkingStall', 'e.g., 42, A-5, P1-23')}
                              {...field}
                              data-testid="input-parking-stall"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Company Code Linking */}
                    {user?.companyId && companyData?.company ? (
                      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-icons text-success text-lg">check_circle</span>
                          <span className="text-sm font-medium">Linked to Company</span>
                        </div>
                        <p className="text-base font-semibold">{companyData.company.companyName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          To change, enter a new company code below
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-icons text-muted-foreground text-lg">info</span>
                          <span className="text-sm font-medium">Not Linked</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter a company code below to link your account
                        </p>
                      </div>
                    )}
                    
                    <FormField
                      control={profileForm.control}
                      name="residentLinkCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Code {!user?.companyId && "(Required to view projects)"}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('profile.enterCompanyCode', 'Enter 10-character code')}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              maxLength={10}
                              className="h-12 font-mono"
                              data-testid="input-company-code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">{t('profile.role', 'Role')}</div>
                  <div className="text-sm font-medium capitalize">
                    {user?.role.replace(/_/g, " ")}
                  </div>
                </div>

                {user?.techLevel && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">{t('profile.irataLevel', 'IRATA Level')}</div>
                    <div className="text-sm font-medium">{user.techLevel}</div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12"
                  data-testid="button-update-profile"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? t('common.updating', 'Updating...') : t('profile.updateProfile', 'Update Profile')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.changePassword', 'Change Password')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.currentPassword', 'Current Password')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('profile.enterCurrentPassword', 'Enter current password')}
                          {...field}
                          data-testid="input-current-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.newPassword', 'New Password')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('profile.enterNewPassword', 'Enter new password')}
                          {...field}
                          data-testid="input-new-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.confirmNewPassword', 'Confirm New Password')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('profile.confirmNewPasswordPlaceholder', 'Confirm new password')}
                          {...field}
                          data-testid="input-confirm-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12"
                  data-testid="button-change-password"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        {/* My Logged Hours - IRATA Logbook (only for rope access technicians, not ground crew) */}
        {user?.role === 'rope_access_tech' && (
          <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/my-logged-hours")} data-testid="card-my-logged-hours">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-500/10 rounded-xl">
                  <span className="material-icons text-violet-500">assignment</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{t('dashboard.cards.myLoggedHours.label', 'My Logged Hours')}</CardTitle>
                  <CardDescription>{t('dashboard.cards.myLoggedHours.description', 'IRATA logbook')}</CardDescription>
                </div>
                <span className="material-icons text-muted-foreground">chevron_right</span>
              </div>
            </CardHeader>
          </Card>
        )}

          </>
        )}
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company Account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your company account, all employees, projects, work sessions, drop logs, and feedback. This action cannot be undone.
              
              Please enter your password to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder={t('profile.enterPasswordToConfirm', 'Enter your password')}
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="h-12"
              data-testid="input-delete-password"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletePassword("");
              }}
              data-testid="button-cancel-delete-account"
            >
              {t('common.cancel', 'Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-account"
            >
              {t('profile.deleteAccount', 'Delete Account')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('profile.confirmLogout', 'Confirm Logout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('profile.logoutConfirmMessage', 'Are you sure you want to logout?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-logout">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} data-testid="button-confirm-logout">
              {t('profile.logout', 'Logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* License Key Update Dialog */}
      <AlertDialog open={showLicenseDialog} onOpenChange={setShowLicenseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('profile.updateLicenseKey', 'Update License Key')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('profile.licenseKeyDescription', 'Enter your new license key. This is required after upgrading your tier.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="new-license-key">{t('profile.newLicenseKey', 'New License Key')}</Label>
            <Input
              id="new-license-key"
              placeholder={t('profile.enterLicenseKey', 'Enter your new license key')}
              value={newLicenseKey}
              onChange={(e) => setNewLicenseKey(e.target.value)}
              data-testid="input-new-license-key"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowLicenseDialog(false);
              setNewLicenseKey("");
            }}>
              {t('common.cancel', 'Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!newLicenseKey.trim()) {
                  toast({ 
                    title: "Error", 
                    description: "Please enter a license key",
                    variant: "destructive" 
                  });
                  return;
                }
                reverifyLicenseMutation.mutate(newLicenseKey.trim());
              }}
              disabled={reverifyLicenseMutation.isPending}
              data-testid="button-confirm-license-update"
            >
              {reverifyLicenseMutation.isPending ? "Verifying..." : "Update License"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
