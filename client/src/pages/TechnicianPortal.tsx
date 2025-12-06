import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate } from "@/lib/dateUtils";
import { 
  User, 
  LogOut, 
  Edit2, 
  Save, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Heart, 
  Building, 
  CreditCard,
  Calendar,
  AlertCircle,
  HardHat,
  Clock,
  FileText,
  Image as ImageIcon,
  Shield,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  employeePhoneNumber: z.string().min(1, "Phone is required"),
  employeeStreetAddress: z.string().optional(),
  employeeCity: z.string().optional(),
  employeeProvinceState: z.string().optional(),
  employeeCountry: z.string().optional(),
  employeePostalCode: z.string().optional(),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().optional(),
  socialInsuranceNumber: z.string().optional(),
  bankTransitNumber: z.string().optional(),
  bankInstitutionNumber: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseExpiry: z.string().optional(),
  birthday: z.string().optional(),
  specialMedicalConditions: z.string().optional(),
  irataBaselineHours: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function TechnicianPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  const { data: userData, isLoading } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      employeePhoneNumber: "",
      employeeStreetAddress: "",
      employeeCity: "",
      employeeProvinceState: "",
      employeeCountry: "",
      employeePostalCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      socialInsuranceNumber: "",
      bankTransitNumber: "",
      bankInstitutionNumber: "",
      bankAccountNumber: "",
      driversLicenseNumber: "",
      driversLicenseExpiry: "",
      birthday: "",
      specialMedicalConditions: "",
      irataBaselineHours: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("PATCH", "/api/technician/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      queryClient.clear();
      setLocation("/technician-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const startEditing = () => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        employeePhoneNumber: user.employeePhoneNumber || "",
        employeeStreetAddress: user.employeeStreetAddress || "",
        employeeCity: user.employeeCity || "",
        employeeProvinceState: user.employeeProvinceState || "",
        employeeCountry: user.employeeCountry || "",
        employeePostalCode: user.employeePostalCode || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        emergencyContactRelationship: user.emergencyContactRelationship || "",
        socialInsuranceNumber: user.socialInsuranceNumber || "",
        bankTransitNumber: user.bankTransitNumber || "",
        bankInstitutionNumber: user.bankInstitutionNumber || "",
        bankAccountNumber: user.bankAccountNumber || "",
        driversLicenseNumber: user.driversLicenseNumber || "",
        driversLicenseExpiry: user.driversLicenseExpiry || "",
        birthday: user.birthday || "",
        specialMedicalConditions: user.specialMedicalConditions || "",
        irataBaselineHours: user.irataBaselineHours || "",
      });
    }
    setIsEditing(true);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
            <Button onClick={() => setLocation("/technician-login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={onRopeProLogo} 
              alt="OnRopePro" 
              className="h-8 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm">Technician Portal</h1>
              <p className="text-xs text-muted-foreground">{user.name}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                  <HardHat className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl">{user.name}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                    {user.irataLevel && (
                      <Badge variant="secondary" className="gap-1">
                        <Award className="w-3 h-3" />
                        IRATA {user.irataLevel}
                      </Badge>
                    )}
                    {user.spratLevel && (
                      <Badge variant="secondary" className="gap-1">
                        <Award className="w-3 h-3" />
                        SPRAT {user.spratLevel}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={startEditing}
                className="w-full sm:w-auto gap-2 h-11"
                data-testid="button-edit-profile"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-none h-11"
                  data-testid="button-cancel-edit"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={updateMutation.isPending}
                  className="flex-1 sm:flex-none gap-2 h-11"
                  data-testid="button-save-profile"
                >
                  <Save className="w-4 h-4" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeePhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birthday</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" data-testid="input-birthday" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employeeStreetAddress"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-street" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeProvinceState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/State</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-province" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-country" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeePostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-postal" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-emergency-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" data-testid="input-emergency-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContactRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Spouse, Parent" data-testid="input-emergency-relationship" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Payroll Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="socialInsuranceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Insurance Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Optional" data-testid="input-sin" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="bankTransitNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Transit #</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="5 digits" data-testid="input-bank-transit" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bankInstitutionNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution #</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="3 digits" data-testid="input-bank-institution" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bankAccountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account #</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="7-12 digits" data-testid="input-bank-account" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Driver's License
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="driversLicenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Optional" data-testid="input-license-number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="driversLicenseExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" data-testid="input-license-expiry" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Logbook Hours
                    </h3>
                    <FormField
                      control={form.control}
                      name="irataBaselineHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baseline Logbook Hours</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.5" placeholder="e.g., 1500" data-testid="input-baseline-hours" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            This is a personal tracking tool only, not an official IRATA/SPRAT record.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Medical Conditions
                    </h3>
                    <FormField
                      control={form.control}
                      name="specialMedicalConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Medical Conditions</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Optional - Any conditions your employer should be aware of"
                              className="min-h-[80px]"
                              data-testid="input-medical"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Email" value={user.email} icon={<Mail className="w-4 h-4" />} />
                    <InfoItem label="Phone" value={user.employeePhoneNumber} icon={<Phone className="w-4 h-4" />} />
                    <InfoItem label="Birthday" value={user.birthday ? formatLocalDate(user.birthday) : null} icon={<Calendar className="w-4 h-4" />} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    Address
                  </h3>
                  <p className="text-sm">
                    {user.employeeStreetAddress && (
                      <>
                        {user.employeeStreetAddress}<br />
                        {user.employeeCity}, {user.employeeProvinceState} {user.employeePostalCode}<br />
                        {user.employeeCountry}
                      </>
                    )}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    Certifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.irataLevel && (
                      <InfoItem label="IRATA" value={`${user.irataLevel} - ${user.irataLicenseNumber || 'N/A'}`} />
                    )}
                    {user.spratLevel && (
                      <InfoItem label="SPRAT" value={`${user.spratLevel} - ${user.spratLicenseNumber || 'N/A'}`} />
                    )}
                    {user.irataBaselineHours && parseFloat(user.irataBaselineHours) > 0 && (
                      <InfoItem label="Baseline Hours" value={`${user.irataBaselineHours} hours`} icon={<Clock className="w-4 h-4" />} />
                    )}
                  </div>
                  {user.irataDocuments && user.irataDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                    <div className="pt-3">
                      <p className="text-sm text-muted-foreground mb-3">Certification Card</p>
                      <div className="space-y-3">
                        {user.irataDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                          const lowerUrl = url.toLowerCase();
                          const isPdf = lowerUrl.endsWith('.pdf');
                          const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                        lowerUrl.includes('image') || 
                                        (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                          
                          return (
                            <a 
                              key={index} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                            >
                              {isPdf ? (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">Tap to view PDF</span>
                                </div>
                              ) : isImage ? (
                                <img 
                                  src={url} 
                                  alt={`IRATA certification ${index + 1}`}
                                  className="w-full object-contain"
                                  style={{ maxHeight: '300px', minHeight: '100px' }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const div = document.createElement('div');
                                      div.className = 'flex flex-col items-center justify-center py-8 gap-2';
                                      div.innerHTML = '<span class="text-sm text-muted-foreground">Tap to view document</span>';
                                      parent.appendChild(div);
                                    }
                                  }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">Tap to view document</span>
                                </div>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* License Verification Section */}
                  {(user.irataLevel || user.spratLevel) && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Verify Your License Validity</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Employers require verified certification status to ensure compliance with safety regulations and insurance requirements. 
                            Verifying your license helps your employer confirm you're qualified for rope access work.
                          </p>
                          <div className="text-xs text-muted-foreground space-y-1 pt-1">
                            <p className="font-medium">How it works:</p>
                            <ol className="list-decimal list-inside space-y-0.5 pl-1">
                              <li>Click the button below to open the verification page</li>
                              <li>Enter your last name and license number</li>
                              <li>Take a screenshot of the verification result</li>
                              <li>Upload the screenshot when prompted</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        className="w-full mt-2"
                        onClick={() => window.open('https://techconnect.irata.org/check-certificate', '_blank')}
                        data-testid="button-verify-license"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Verify My Rope Access License
                      </Button>
                    </div>
                  )}
                </div>

                {user.hasFirstAid && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        First Aid Certification
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem label="Type" value={user.firstAidType} />
                        <InfoItem 
                          label="Expiry" 
                          value={user.firstAidExpiry ? formatLocalDate(user.firstAidExpiry) : "No expiry set"} 
                        />
                      </div>
                      {user.firstAidDocuments && user.firstAidDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                        <div className="pt-3">
                          <p className="text-sm text-muted-foreground mb-3">Certificate</p>
                          <div className="space-y-3">
                            {user.firstAidDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                              const lowerUrl = url.toLowerCase();
                              const isPdf = lowerUrl.endsWith('.pdf');
                              const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                            lowerUrl.includes('image') || 
                                            (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                              
                              return (
                                <a 
                                  key={index} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                                >
                                  {isPdf ? (
                                    <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                      <FileText className="w-12 h-12 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground font-medium">Tap to view PDF</span>
                                    </div>
                                  ) : isImage ? (
                                    <img 
                                      src={url} 
                                      alt={`First aid certificate ${index + 1}`}
                                      className="w-full object-contain"
                                      style={{ maxHeight: '300px', minHeight: '100px' }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const div = document.createElement('div');
                                          div.className = 'flex flex-col items-center justify-center py-8 gap-2';
                                          div.innerHTML = '<span class="text-sm text-muted-foreground">Tap to view document</span>';
                                          parent.appendChild(div);
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                      <FileText className="w-12 h-12 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground font-medium">Tap to view document</span>
                                    </div>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem label="Name" value={user.emergencyContactName} />
                    <InfoItem label="Phone" value={user.emergencyContactPhone} />
                    <InfoItem label="Relationship" value={user.emergencyContactRelationship} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    Payroll Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="SIN" value={user.socialInsuranceNumber ? "••• ••• •••" : null} masked />
                    <InfoItem 
                      label="Bank Account" 
                      value={user.bankTransitNumber ? `Transit: ${user.bankTransitNumber}` : null} 
                      masked
                    />
                  </div>
                </div>

                {user.driversLicenseNumber && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        Driver's License
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem label="License #" value="••••••••" masked />
                        <InfoItem 
                          label="Expiry" 
                          value={user.driversLicenseExpiry ? formatLocalDate(user.driversLicenseExpiry) : null} 
                        />
                      </div>
                      {user.driversLicenseDocuments && user.driversLicenseDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                        <div className="pt-3">
                          <p className="text-sm text-muted-foreground mb-3">Uploaded Documents</p>
                          <div className="space-y-3">
                            {user.driversLicenseDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                              const lowerUrl = url.toLowerCase();
                              const isPdf = lowerUrl.endsWith('.pdf');
                              const isAbstract = lowerUrl.includes('abstract');
                              const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                            lowerUrl.includes('image') || 
                                            (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                              
                              const documentLabel = isAbstract 
                                ? "Driver's Abstract" 
                                : (isImage ? "License Photo" : "License Document");
                              
                              return (
                                <div key={index} className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">{documentLabel}</p>
                                  <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                                  >
                                    {isPdf ? (
                                      <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                        <FileText className="w-12 h-12 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground font-medium">Tap to view PDF</span>
                                      </div>
                                    ) : isImage ? (
                                      <img 
                                        src={url} 
                                        alt={documentLabel}
                                        className="w-full object-contain"
                                        style={{ maxHeight: '300px', minHeight: '100px' }}
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.onerror = null;
                                          target.style.display = 'none';
                                          const parent = target.parentElement;
                                          if (parent) {
                                            const div = document.createElement('div');
                                            div.className = 'flex flex-col items-center justify-center py-8 gap-2';
                                            div.innerHTML = '<span class="text-sm text-muted-foreground">Tap to view document</span>';
                                            parent.appendChild(div);
                                          }
                                        }}
                                      />
                                    ) : (
                                      <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                        <FileText className="w-12 h-12 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground font-medium">Tap to view document</span>
                                      </div>
                                    )}
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {user.bankDocuments && user.bankDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        Banking Documents (Void Cheque)
                      </h3>
                      <div className="space-y-3">
                        {user.bankDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                          const lowerUrl = url.toLowerCase();
                          const isPdf = lowerUrl.endsWith('.pdf');
                          const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                        lowerUrl.includes('image') || 
                                        (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                          
                          return (
                            <a 
                              key={index} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                            >
                              {isPdf ? (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">Tap to view PDF</span>
                                </div>
                              ) : isImage ? (
                                <img 
                                  src={url} 
                                  alt={`Banking document ${index + 1}`}
                                  className="w-full object-contain"
                                  style={{ maxHeight: '300px', minHeight: '100px' }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const div = document.createElement('div');
                                      div.className = 'flex flex-col items-center justify-center py-8 gap-2';
                                      div.innerHTML = '<span class="text-sm text-muted-foreground">Tap to view document</span>';
                                      parent.appendChild(div);
                                    }
                                  }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">Tap to view document</span>
                                </div>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {user.specialMedicalConditions && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="w-4 h-4" />
                        Medical Conditions
                      </h3>
                      <p className="text-sm">{user.specialMedicalConditions}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function InfoItem({ 
  label, 
  value, 
  icon, 
  masked 
}: { 
  label: string; 
  value: string | null | undefined; 
  icon?: React.ReactNode;
  masked?: boolean;
}) {
  if (!value) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-muted-foreground/50 italic">Not provided</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
