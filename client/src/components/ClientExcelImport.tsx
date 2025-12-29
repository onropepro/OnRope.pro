import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Download } from "lucide-react";

interface ImportResult {
  message: string;
  imported: number;
  skipped: number;
  details: {
    success: Array<{ row: number; firstName: string; lastName: string; email: string }>;
    skipped: Array<{ row: number; reason: string; data?: Record<string, any> }>;
  };
}

interface ClientExcelImportProps {
  disabled?: boolean;
  onImportComplete?: () => void;
}

export function ClientExcelImport({ disabled, onImportComplete }: ClientExcelImportProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/clients/import-excel", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to import clients");
      }
      
      return response.json() as Promise<ImportResult>;
    },
    onSuccess: (data) => {
      setImportResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      
      if (data.imported > 0) {
        toast({
          title: "Import Successful",
          description: `${data.imported} clients imported successfully`,
        });
        onImportComplete?.();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setImportResult(null);
  };

  const downloadTemplate = () => {
    const csvContent = "First Name,Last Name,Property Management Company,Email,Phone,Address,Billing Address\nJohn,Smith,ABC Property Management,john@example.com,555-1234,123 Main St,456 Billing Ave\nJane,Doe,XYZ Strata Services,jane@example.com,555-5678,789 Oak Rd,";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "client_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 h-12 gap-2"
          disabled={disabled}
          data-testid="button-import-excel"
        >
          <FileSpreadsheet className="h-5 w-5" />
          Import Clients
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="dialog-import-excel">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Clients from Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx or .xls) to import multiple clients at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {!importResult ? (
            <>
              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="text-center">
                      <p className="font-medium">
                        {selectedFile ? selectedFile.name : "Select an Excel file"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports .xlsx and .xls files up to 10MB
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="input-excel-file"
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-select-file"
                      >
                        {selectedFile ? "Change File" : "Choose File"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadTemplate}
                        className="gap-1"
                        data-testid="button-download-template"
                      >
                        <Download className="h-4 w-4" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Supported Columns:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    First Name, Last Name, Property Management Company, Email, Phone, Address, Billing Address
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  All columns are optional - you can edit client details later.
                  Column names are flexible (e.g., "First Name", "firstname", "First" all work).
                  Empty rows will be skipped.
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || importMutation.isPending}
                  data-testid="button-start-import"
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Clients
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className={`p-3 rounded-full ${importResult.imported > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-amber-100 dark:bg-amber-900'}`}>
                  {importResult.imported > 0 ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{importResult.message}</p>
                  <div className="flex gap-3 mt-1 text-sm">
                    <span className="text-green-600 dark:text-green-400">
                      {importResult.imported} imported
                    </span>
                    {importResult.skipped > 0 && (
                      <span className="text-amber-600 dark:text-amber-400">
                        {importResult.skipped} skipped
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {importResult.details.skipped.length > 0 && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Skipped Rows
                  </h4>
                  <ScrollArea className="flex-1 border rounded-lg">
                    <div className="p-3 space-y-2">
                      {importResult.details.skipped.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-2 rounded bg-muted/50 text-sm"
                          data-testid={`skipped-row-${item.row}`}
                        >
                          <Badge variant="outline" className="shrink-0">
                            Row {item.row}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-amber-600 dark:text-amber-400">{item.reason}</p>
                            {item.data && (
                              <p className="text-muted-foreground text-xs mt-1">
                                {item.data.firstName || '-'} {item.data.lastName || '-'} ({item.data.email || 'no email'})
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {importResult.details.success.length > 0 && (
                <div className="flex-1 overflow-hidden flex flex-col max-h-48">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Successfully Imported ({importResult.details.success.length})
                  </h4>
                  <ScrollArea className="flex-1 border rounded-lg">
                    <div className="p-3 space-y-1">
                      {importResult.details.success.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded bg-muted/50 text-sm"
                          data-testid={`success-row-${item.row}`}
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{item.firstName} {item.lastName}</span>
                          <span className="text-muted-foreground">({item.email})</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setImportResult(null);
                    setSelectedFile(null);
                  }}
                  data-testid="button-import-another"
                >
                  Import Another File
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
