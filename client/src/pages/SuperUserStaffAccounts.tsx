import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Shield, User, Mail, Calendar } from "lucide-react";

interface StaffAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string | null;
  permissions: string[];
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

const PERMISSION_OPTIONS = [
  { id: 'view_dashboard', label: 'View Dashboard', description: 'Access to main dashboard' },
  { id: 'view_companies', label: 'View Companies', description: 'View all registered companies' },
  { id: 'view_technicians', label: 'View Technicians', description: 'Access technician database' },
  { id: 'view_buildings', label: 'View Buildings', description: 'View global buildings database' },
  { id: 'view_job_board', label: 'View Job Board', description: 'Access job board listings' },
  { id: 'view_tasks', label: 'View Tasks', description: 'View task management' },
  { id: 'view_feature_requests', label: 'View Feature Requests', description: 'Access feature request submissions' },
  { id: 'view_future_ideas', label: 'View Future Ideas', description: 'View future ideas board' },
  { id: 'view_metrics', label: 'View Metrics', description: 'Access platform metrics' },
  { id: 'view_goals', label: 'View Goals', description: 'View goals and KPIs' },
  { id: 'view_changelog', label: 'View Changelog', description: 'Access documentation changelog' },
  { id: 'view_founder_resources', label: 'View Founder Resources', description: 'Access founder resources' },
  { id: 'manage_staff_accounts', label: 'Manage Staff Accounts', description: 'Create, edit, delete staff accounts' },
];

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
  isActive: boolean;
}

const defaultFormData: StaffFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: '',
  permissions: [],
  isActive: true,
};

export default function SuperUserStaffAccounts() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<StaffAccount | null>(null);
  const [formData, setFormData] = useState<StaffFormData>(defaultFormData);

  const { data: staffData, isLoading } = useQuery<{ staffAccounts: StaffAccount[] }>({
    queryKey: ["/api/staff-accounts"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      const response = await apiRequest('POST', '/api/staff-accounts', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Staff account created successfully" });
      setCreateDialogOpen(false);
      setFormData(defaultFormData);
      queryClient.invalidateQueries({ queryKey: ['/api/staff-accounts'] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create staff account", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StaffFormData> }) => {
      const response = await apiRequest('PATCH', `/api/staff-accounts/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Staff account updated successfully" });
      setEditDialogOpen(false);
      setSelectedAccount(null);
      setFormData(defaultFormData);
      queryClient.invalidateQueries({ queryKey: ['/api/staff-accounts'] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update staff account", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/staff-accounts/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Staff account deleted successfully" });
      setDeleteDialogOpen(false);
      setSelectedAccount(null);
      queryClient.invalidateQueries({ queryKey: ['/api/staff-accounts'] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete staff account", variant: "destructive" });
    },
  });

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const toggleAllPermissions = () => {
    const allPermissionIds = PERMISSION_OPTIONS.map(p => p.id);
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.length === allPermissionIds.length ? [] : allPermissionIds,
    }));
  };

  const openEditDialog = (account: StaffAccount) => {
    setSelectedAccount(account);
    setFormData({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      password: '',
      role: account.role || '',
      permissions: account.permissions || [],
      isActive: account.isActive,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (account: StaffAccount) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!selectedAccount) return;
    
    const updates: Partial<StaffFormData> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      permissions: formData.permissions,
      isActive: formData.isActive,
    };
    
    if (formData.password) {
      updates.password = formData.password;
    }
    
    updateMutation.mutate({ id: selectedAccount.id, data: updates });
  };

  const staffAccounts = staffData?.staffAccounts || [];

  return (
    <SuperUserLayout title="Staff Accounts">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Staff Accounts</h2>
            <p className="text-sm text-muted-foreground">
              Manage internal staff accounts for platform administration
            </p>
          </div>
          <Button 
            onClick={() => {
              setFormData(defaultFormData);
              setCreateDialogOpen(true);
            }}
            data-testid="button-create-staff"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Account
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : staffAccounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No Staff Accounts</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first staff account to delegate platform management
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {staffAccounts.map((account) => (
              <Card key={account.id} data-testid={`card-staff-${account.id}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-foreground">
                            {account.firstName} {account.lastName}
                          </h3>
                          <Badge variant={account.isActive ? "default" : "secondary"} className="text-xs">
                            {account.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                          <Mail className="h-3 w-3" />
                          <span>{account.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Last login: {account.lastLoginAt 
                              ? new Date(account.lastLoginAt).toLocaleDateString()
                              : 'Never'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {account.permissions.slice(0, 4).map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                          {account.permissions.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{account.permissions.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(account)}
                        data-testid={`button-edit-staff-${account.id}`}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(account)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-delete-staff-${account.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Staff Account</DialogTitle>
            <DialogDescription>
              Add a new internal staff account for platform management
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                  data-testid="input-firstName"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                  data-testid="input-lastName"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter a secure password"
                data-testid="input-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Admin, Developer, Support"
                data-testid="input-role"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all-create"
                    checked={formData.permissions.length === PERMISSION_OPTIONS.length}
                    onCheckedChange={toggleAllPermissions}
                    data-testid="checkbox-select-all"
                  />
                  <Label htmlFor="select-all-create" className="text-sm cursor-pointer">
                    Select All
                  </Label>
                </div>
              </div>
              <div className="grid gap-3 border rounded-lg p-4 max-h-64 overflow-y-auto">
                {PERMISSION_OPTIONS.map((perm) => (
                  <div key={perm.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`perm-${perm.id}`}
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                      data-testid={`checkbox-perm-${perm.id}`}
                    />
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor={`perm-${perm.id}`} className="text-sm font-medium cursor-pointer">
                        {perm.label}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {perm.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={createMutation.isPending}
              data-testid="button-submit-create"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Account</DialogTitle>
            <DialogDescription>
              Update staff account details and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name *</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  data-testid="input-edit-firstName"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name *</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  data-testid="input-edit-lastName"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                data-testid="input-edit-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Leave blank to keep current password"
                data-testid="input-edit-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Input
                id="edit-role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Admin, Developer, Support"
                data-testid="input-edit-role"
              />
            </div>
            <div className="flex items-center gap-3 py-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                data-testid="switch-isActive"
              />
              <Label htmlFor="edit-isActive">Account Active</Label>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all-edit"
                    checked={formData.permissions.length === PERMISSION_OPTIONS.length}
                    onCheckedChange={toggleAllPermissions}
                    data-testid="checkbox-edit-select-all"
                  />
                  <Label htmlFor="select-all-edit" className="text-sm cursor-pointer">
                    Select All
                  </Label>
                </div>
              </div>
              <div className="grid gap-3 border rounded-lg p-4 max-h-64 overflow-y-auto">
                {PERMISSION_OPTIONS.map((perm) => (
                  <div key={perm.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`edit-perm-${perm.id}`}
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                      data-testid={`checkbox-edit-perm-${perm.id}`}
                    />
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor={`edit-perm-${perm.id}`} className="text-sm font-medium cursor-pointer">
                        {perm.label}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {perm.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={updateMutation.isPending}
              data-testid="button-submit-edit"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the staff account for{' '}
              <strong>{selectedAccount?.firstName} {selectedAccount?.lastName}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedAccount && deleteMutation.mutate(selectedAccount.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SuperUserLayout>
  );
}
