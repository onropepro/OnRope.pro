import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  EditableField,
  EditableTextarea,
  EditableSelect,
  EditableSwitch,
  EditableDateField,
  EditableAddressField
} from "@/components/profile";
import { User, Mail, Phone, CreditCard, Car, Calendar, MapPin, FileText, Shield, Truck } from "lucide-react";

interface TestFormData {
  fullName: string;
  email: string;
  phone: string;
  sin: string;
  bio: string;
  licenseClass: string;
  hasTwic: boolean;
  expiryDate: string;
  employeeStreetAddress: string;
  employeeCity: string;
  employeeProvinceState: string;
  employeeCountry: string;
  employeePostalCode: string;
}

const sampleData: TestFormData = {
  fullName: "John Smith",
  email: "john.smith@example.com",
  phone: "(604) 555-1234",
  sin: "123456789",
  bio: "Experienced rope access technician with 5+ years in high-rise building maintenance. IRATA Level 3 certified.",
  licenseClass: "class_5",
  hasTwic: true,
  expiryDate: "2025-06-15",
  employeeStreetAddress: "123 Main Street",
  employeeCity: "Vancouver",
  employeeProvinceState: "BC",
  employeeCountry: "Canada",
  employeePostalCode: "V6B 2W2",
};

const licenseOptions = [
  { value: "class_1", label: "Class 1 - Semi-trailer trucks" },
  { value: "class_2", label: "Class 2 - Buses" },
  { value: "class_3", label: "Class 3 - Large trucks" },
  { value: "class_4", label: "Class 4 - Taxis, ambulances" },
  { value: "class_5", label: "Class 5 - Cars, light trucks" },
  { value: "class_7", label: "Class 7 - Learner" },
];

export default function ProfileTest() {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<TestFormData>({
    defaultValues: sampleData,
  });

  const onSubmit = (data: TestFormData) => {
    console.log("Form submitted:", data);
    setIsEditing(false);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">EditableField Component Test Page</h1>
        <p className="text-muted-foreground mb-4">
          This page demonstrates all 6 EditableField components. Toggle edit mode to see the difference between view and edit states.
        </p>
        
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <Switch
            id="edit-mode"
            checked={isEditing}
            onCheckedChange={setIsEditing}
            data-testid="switch-edit-mode"
          />
          <Label htmlFor="edit-mode" className="font-medium">
            {isEditing ? "Edit Mode (forms visible)" : "View Mode (display only)"}
          </Label>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                1. EditableField (Text, Email, Tel, Masked)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  isEditing={isEditing}
                  name="fullName"
                  label="Full Name"
                  value={form.watch("fullName")}
                  control={form.control}
                  icon={<User className="w-4 h-4" />}
                  placeholder="Enter your name"
                  required
                  testId="fullName"
                />
                
                <EditableField
                  isEditing={isEditing}
                  name="email"
                  label="Email Address"
                  value={form.watch("email")}
                  control={form.control}
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="email@example.com"
                  testId="email"
                />
                
                <EditableField
                  isEditing={isEditing}
                  name="phone"
                  label="Phone Number"
                  value={form.watch("phone")}
                  control={form.control}
                  type="tel"
                  icon={<Phone className="w-4 h-4" />}
                  placeholder="(555) 555-5555"
                  testId="phone"
                />
                
                <EditableField
                  isEditing={isEditing}
                  name="sin"
                  label="Social Insurance Number"
                  value={form.watch("sin")}
                  control={form.control}
                  icon={<CreditCard className="w-4 h-4" />}
                  masked={true}
                  showLastN={4}
                  maskChar="*"
                  helpText="Your SIN is encrypted and secure"
                  testId="sin"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                2. EditableTextarea
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditableTextarea
                isEditing={isEditing}
                name="bio"
                label="Professional Bio"
                value={form.watch("bio")}
                control={form.control}
                icon={<FileText className="w-4 h-4" />}
                placeholder="Tell us about your experience..."
                rows={4}
                helpText="Describe your qualifications and experience"
                testId="bio"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                3. EditableSelect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditableSelect
                isEditing={isEditing}
                name="licenseClass"
                label="Driver's License Class"
                value={form.watch("licenseClass")}
                options={licenseOptions}
                control={form.control}
                icon={<Truck className="w-4 h-4" />}
                placeholder="Select license class"
                helpText="Select your current driver's license classification"
                testId="licenseClass"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                4. EditableSwitch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditableSwitch
                isEditing={isEditing}
                name="hasTwic"
                label="TWIC Card Holder"
                value={form.watch("hasTwic")}
                control={form.control}
                icon={<Shield className="w-4 h-4" />}
                enabledText="Yes"
                disabledText="No"
                helpText="Transportation Worker Identification Credential"
                testId="hasTwic"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                5. EditableDateField
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditableDateField
                isEditing={isEditing}
                name="expiryDate"
                label="License Expiry Date"
                value={form.watch("expiryDate")}
                control={form.control}
                helpText="When does your license expire?"
                testId="expiryDate"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                6. EditableAddressField (Composite)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditableAddressField
                isEditing={isEditing}
                control={form.control}
                addressData={{
                  employeeStreetAddress: form.watch("employeeStreetAddress"),
                  employeeCity: form.watch("employeeCity"),
                  employeeProvinceState: form.watch("employeeProvinceState"),
                  employeeCountry: form.watch("employeeCountry"),
                  employeePostalCode: form.watch("employeePostalCode"),
                }}
                labels={{
                  address: "Home Address",
                  streetAddress: "Street Address",
                  city: "City",
                  provinceState: "Province/State",
                  country: "Country",
                  postalCode: "Postal Code",
                  helpText: "Your mailing address for official documents",
                  emptyText: "No address provided",
                }}
                testIdPrefix="homeAddress"
              />
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex gap-3">
              <Button type="submit" data-testid="button-save">
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset(sampleData);
                  setIsEditing(false);
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
