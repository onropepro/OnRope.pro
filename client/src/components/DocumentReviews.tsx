import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Eye, PenLine, Check, AlertCircle, Clock, ChevronRight, ChevronDown, FileCheck, FileWarning, Loader2, ExternalLink, Shield, HardHat, Wrench, AlertTriangle, ClipboardList, Phone, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SafeWorkProcedure {
  jobType: string;
  title: string;
  description: string;
  scope: string;
  hazards: string[];
  controlMeasures: string[];
  ppe: string[];
  equipment: string[];
  preWorkChecks: string[];
  workProcedure: string[];
  emergencyProcedures: string[];
  competencyRequirements: string[];
}

const SAFE_WORK_PROCEDURES: SafeWorkProcedure[] = [
  {
    jobType: 'window_cleaning',
    title: 'Window Cleaning - Rope Access',
    description: 'Safe work procedure for exterior window cleaning using rope access techniques on high-rise buildings.',
    scope: 'This procedure applies to all rope access window cleaning operations on building exteriors, including glass panels, frames, and surrounding surfaces.',
    hazards: [
      'Falls from height - primary hazard requiring rope access controls',
      'Falling objects - tools, equipment, or debris dropping to lower levels',
      'Chemical exposure - cleaning solutions and detergents',
      'Weather conditions - wind, rain, lightning, extreme temperatures',
      'Sharp edges - window frames, damaged glass, building protrusions',
      'Electrical hazards - proximity to external electrical installations',
      'Public interaction - pedestrians in work zone below',
      'Structural failure - anchor points, building facade deterioration'
    ],
    controlMeasures: [
      'Dual rope system with independent anchor points tested to minimum 15kN',
      'Exclusion zones established at ground level with barriers and signage',
      'Pre-use inspection of all PPE and equipment before each work session',
      'Weather monitoring - cease work if wind exceeds 40km/h or during electrical storms',
      'Tool lanyards on all equipment to prevent drops',
      'Buddy system - minimum two technicians on site at all times',
      'Communication devices (two-way radio) for all rope access personnel',
      'Rescue plan in place with trained rescue team available'
    ],
    ppe: ['Full body harness (IRATA approved)', 'Safety helmet with chin strap', 'Descender and back-up device', 'Work gloves', 'Safety glasses', 'Safety footwear'],
    equipment: ['Static kernmantle ropes', 'Anchor straps and connectors', 'Descender and ascender devices', 'Karabiners', 'Window cleaning solution', 'Squeegees and scrubbers'],
    preWorkChecks: ['Verify weather conditions', 'Inspect anchor points', 'Check rope condition', 'Inspect harness', 'Test mechanical devices', 'Confirm exclusion zone'],
    workProcedure: ['Establish ground exclusion zone', 'Access roof/anchor location', 'Rig rope systems', 'Conduct buddy-check', 'Descend in controlled manner', 'Complete cleaning systematically', 'Ascend when complete', 'De-rig equipment'],
    emergencyProcedures: ['Initiate rescue within 10 minutes for suspension trauma', 'Contact emergency services for serious injuries', 'Evacuate if structural concerns arise', 'Immediate ascent in severe weather'],
    competencyRequirements: ['IRATA Level 1 minimum', 'Current first aid certification', 'Site-specific induction completed']
  },
  {
    jobType: 'dryer_vent_cleaning',
    title: 'Dryer Vent Cleaning - Rope Access',
    description: 'Safe work procedure for cleaning dryer exhaust vents on building exteriors using rope access.',
    scope: 'This procedure covers the inspection and cleaning of dryer vent terminations and accessible ductwork from building exteriors.',
    hazards: ['Falls from height', 'Falling debris - lint and vent covers', 'Respiratory hazards - lint particles', 'Fire risk - flammable lint', 'Sharp edges', 'Biological hazards - mold, pests'],
    controlMeasures: ['Dual rope access system', 'Ground exclusion zone', 'Respiratory protection', 'Anti-static tools', 'Secure debris containment'],
    ppe: ['Full body harness', 'Safety helmet', 'Descender and back-up device', 'Dust mask/respirator (P2 min)', 'Safety glasses', 'Work gloves', 'Safety footwear'],
    equipment: ['Rope access equipment', 'Rotary brush cleaning system', 'Vacuum with HEPA filtration', 'Inspection camera', 'Collection bags'],
    preWorkChecks: ['Review building vent layout', 'Inspect rope access equipment', 'Confirm vacuum operational', 'Verify ground exclusion zone', 'Check weather conditions'],
    workProcedure: ['Set up exclusion zone', 'Rig rope systems', 'Descend to vent location', 'Inspect and document condition', 'Remove vent cover', 'Vacuum and brush clean', 'Reinstall vent cover', 'Document work completed'],
    emergencyProcedures: ['Suspend work if fire detected', 'Use fire extinguisher only if safe', 'Evacuate and alert building management', 'Initiate rescue plan if needed'],
    competencyRequirements: ['IRATA Level 1 minimum', 'Dryer vent cleaning training', 'Fire hazard awareness', 'First aid certification']
  },
  {
    jobType: 'building_wash',
    title: 'Building Wash / Facade Cleaning - Rope Access',
    description: 'Safe work procedure for pressure washing and cleaning building exteriors using rope access techniques.',
    scope: 'This procedure covers exterior building washing including concrete, brick, metal cladding, and other facade materials.',
    hazards: ['Falls from height', 'High pressure water injuries', 'Chemical exposure', 'Electrical hazards', 'Falling debris', 'Slip hazards', 'Noise exposure'],
    controlMeasures: ['Dual rope system', 'Pressure washer training', 'Maximum pressure limits per surface', 'Electrical isolation if required', 'Extended ground exclusion zones', 'Chemical handling procedures'],
    ppe: ['Full body harness', 'Safety helmet with face shield', 'Waterproof coveralls', 'Chemical resistant gloves', 'Safety boots (waterproof)', 'Hearing protection', 'Respirator if using chemicals'],
    equipment: ['Rope access equipment', 'Pressure washing system', 'Chemical applicators', 'Surface protection materials', 'Spill containment'],
    preWorkChecks: ['Inspect pressure washing equipment', 'Check chemical supplies', 'Identify electrical hazards', 'Establish exclusion zones', 'Confirm weather conditions'],
    workProcedure: ['Establish extended exclusion zone', 'Rig rope systems', 'Connect pressure washing equipment', 'Test on inconspicuous area', 'Work systematically from top down', 'Apply chemicals if required', 'Rinse thoroughly', 'Document completion'],
    emergencyProcedures: ['Stop immediately for pressure injuries', 'Chemical exposure: rinse immediately', 'For electrical concerns: cease all water operations', 'Initiate rescue plan if needed'],
    competencyRequirements: ['IRATA Level 1 minimum', 'Pressure washing certification', 'Chemical handling training', 'First aid certification']
  },
  {
    jobType: 'in_suite_dryer_vent_cleaning',
    title: 'In-Suite Dryer Vent Cleaning',
    description: 'Safe work procedure for cleaning dryer vents from inside residential suites.',
    scope: 'This procedure covers internal dryer vent cleaning and inspection within residential units.',
    hazards: ['Respiratory hazards from lint', 'Fire risk from lint accumulation', 'Electrical hazards', 'Slip/trip hazards', 'Customer property damage'],
    controlMeasures: ['Respiratory protection', 'Anti-static equipment', 'Electrical safety checks', 'Floor protection', 'Property damage prevention'],
    ppe: ['Dust mask/respirator', 'Safety glasses', 'Work gloves', 'Safety footwear', 'Coveralls'],
    equipment: ['Rotary brush system', 'HEPA vacuum', 'Inspection camera', 'Drop cloths', 'Collection bags'],
    preWorkChecks: ['Confirm suite access', 'Inspect equipment', 'Set up floor protection', 'Disconnect dryer safely'],
    workProcedure: ['Protect flooring and surfaces', 'Disconnect dryer safely', 'Inspect vent condition', 'Clean vent with brush system', 'Vacuum all debris', 'Reconnect and test dryer', 'Clean work area'],
    emergencyProcedures: ['If fire detected: evacuate immediately', 'For electrical issues: do not touch, evacuate', 'Report all incidents to supervisor'],
    competencyRequirements: ['Dryer vent cleaning certification', 'Customer service training', 'Fire safety awareness']
  },
  {
    jobType: 'ground_window_cleaning',
    title: 'Ground Level Window Cleaning',
    description: 'Safe work procedure for cleaning windows accessible from ground level.',
    scope: 'This procedure covers window cleaning operations that can be performed from ground level without rope access or elevated platforms.',
    hazards: ['Slip hazards from wet surfaces', 'Chemical exposure', 'Sharp edges', 'Ergonomic strain', 'Public interaction'],
    controlMeasures: ['Wet floor signage', 'PPE for chemical handling', 'Proper lifting techniques', 'Work area barriers'],
    ppe: ['Safety glasses', 'Chemical resistant gloves', 'Safety footwear (non-slip)', 'High visibility vest if near traffic'],
    equipment: ['Window cleaning solution', 'Squeegees and scrubbers', 'Water-fed pole system', 'Ladders (if required)', 'Wet floor signs'],
    preWorkChecks: ['Assess window accessibility', 'Check for hazards', 'Set up barriers if needed', 'Prepare cleaning equipment'],
    workProcedure: ['Set up wet floor signage', 'Prepare cleaning solution', 'Clean windows systematically', 'Squeegee and detail edges', 'Clean up water/solution', 'Remove barriers when dry'],
    emergencyProcedures: ['For chemical exposure: rinse immediately', 'For slip injury: assess and seek medical attention', 'Report all incidents'],
    competencyRequirements: ['Window cleaning training', 'Chemical handling awareness', 'Customer service skills']
  },
  {
    jobType: 'parkade_pressure_cleaning',
    title: 'Parkade / Parking Garage Pressure Cleaning',
    description: 'Safe work procedure for pressure cleaning parking structures.',
    scope: 'This procedure covers pressure washing of parking garage floors, walls, and structures.',
    hazards: ['Slip hazards', 'High pressure injuries', 'Chemical exposure', 'Vehicle traffic', 'Confined space concerns', 'Electrical hazards', 'Noise exposure'],
    controlMeasures: ['Area barricades', 'Traffic control', 'Proper drainage management', 'Ventilation assessment', 'Electrical isolation', 'Hearing protection'],
    ppe: ['Waterproof coveralls', 'Safety boots (non-slip)', 'Face shield', 'Hearing protection', 'Chemical resistant gloves', 'High visibility vest'],
    equipment: ['Pressure washing system', 'Surface cleaners', 'Containment berms', 'Drainage management', 'Traffic cones and barriers'],
    preWorkChecks: ['Coordinate traffic control', 'Check ventilation', 'Identify electrical hazards', 'Set up containment', 'Confirm drainage'],
    workProcedure: ['Establish work zone barriers', 'Set up traffic control', 'Pre-treat heavy stains', 'Pressure wash systematically', 'Manage runoff and drainage', 'Allow drying before reopening'],
    emergencyProcedures: ['For pressure injuries: seek immediate medical attention', 'Vehicle intrusion: stop work immediately', 'Chemical spill: contain and report'],
    competencyRequirements: ['Pressure washing certification', 'Confined space awareness', 'Traffic control training']
  },
  {
    jobType: 'general_pressure_washing',
    title: 'General Pressure Washing',
    description: 'Safe work procedure for general pressure washing operations.',
    scope: 'This procedure covers pressure washing of various surfaces including sidewalks, patios, decks, and equipment.',
    hazards: ['High pressure injuries', 'Slip hazards', 'Chemical exposure', 'Electrical hazards', 'Flying debris', 'Noise exposure'],
    controlMeasures: ['Pressure limits per surface', 'Work area barriers', 'PPE requirements', 'Electrical safety', 'Debris containment'],
    ppe: ['Face shield or safety glasses', 'Hearing protection', 'Waterproof clothing', 'Safety boots (non-slip)', 'Work gloves'],
    equipment: ['Pressure washer (appropriate PSI)', 'Various nozzles', 'Surface cleaners', 'Chemical applicators', 'Containment materials'],
    preWorkChecks: ['Inspect pressure washer', 'Select appropriate nozzle', 'Check chemical requirements', 'Set up barriers', 'Identify hazards'],
    workProcedure: ['Set up work area barriers', 'Test on small area first', 'Maintain safe distance', 'Work systematically', 'Manage runoff', 'Clean up work area'],
    emergencyProcedures: ['For pressure injuries: seek medical attention', 'Equipment malfunction: stop and assess', 'Chemical exposure: rinse and seek help'],
    competencyRequirements: ['Pressure washing training', 'Surface type awareness', 'Chemical handling knowledge']
  }
];

interface DocumentReviewSignature {
  id: string;
  companyId: string;
  employeeId: string;
  documentType: string;
  documentId?: string;
  documentName: string;
  fileUrl?: string;
  viewedAt?: string;
  signedAt?: string;
  signatureDataUrl?: string;
  documentVersion?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentReviewsProps {
  companyDocuments?: any[];
  methodStatements?: any[];
}

export function DocumentReviews({ companyDocuments = [], methodStatements = [] }: DocumentReviewsProps) {
  const { toast } = useToast();
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedReview, setSelectedReview] = useState<DocumentReviewSignature | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [isSWPDialogOpen, setIsSWPDialogOpen] = useState(false);
  const [selectedSWP, setSelectedSWP] = useState<SafeWorkProcedure | null>(null);

  const { data: reviewsData, isLoading } = useQuery<{ reviews: DocumentReviewSignature[] }>({
    queryKey: ['/api/document-reviews/my'],
  });

  const markViewedMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      return apiRequest('POST', `/api/document-reviews/${reviewId}/view`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/document-reviews/my'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to mark document as viewed",
      });
    },
  });

  const signDocumentMutation = useMutation({
    mutationFn: async ({ reviewId, signatureDataUrl }: { reviewId: string; signatureDataUrl: string }) => {
      return apiRequest('POST', `/api/document-reviews/${reviewId}/sign`, { signatureDataUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/document-reviews/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/csr'] });
      setIsSignDialogOpen(false);
      setSelectedReview(null);
      toast({
        title: "Document Signed",
        description: "Your signature has been recorded.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign document",
      });
    },
  });

  const reviews = reviewsData?.reviews || [];
  const pendingReviews = reviews.filter(r => !r.signedAt);
  const signedReviews = reviews.filter(r => r.signedAt);

  const getDocumentUrl = (review: DocumentReviewSignature) => {
    // Use the fileUrl stored in the review record (most reliable)
    if (review.fileUrl) {
      return review.fileUrl;
    }
    
    // Fallback: try to find the document in passed props (for legacy records without fileUrl)
    if (review.documentType === 'health_safety_manual') {
      const doc = companyDocuments.find((d: any) => d.documentType === 'health_safety_manual');
      return doc?.fileUrl;
    }
    if (review.documentType === 'company_policy') {
      const doc = companyDocuments.find((d: any) => d.documentType === 'company_policy');
      return doc?.fileUrl;
    }
    
    return null;
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'health_safety_manual':
        return 'Health & Safety Manual';
      case 'company_policy':
        return 'Company Policy';
      case 'method_statement':
        return 'Method Statement';
      case 'safe_work_procedure':
        return 'Safe Work Procedure';
      default:
        return type;
    }
  };

  const findSWPTemplate = (documentName: string): SafeWorkProcedure | null => {
    return SAFE_WORK_PROCEDURES.find(swp => swp.title === documentName) || null;
  };

  const handleViewDocument = (review: DocumentReviewSignature) => {
    const url = getDocumentUrl(review);
    
    if (url) {
      window.open(url, '_blank');
      markViewedMutation.mutate(review.id);
      setSelectedReview(review);
    } else if (review.documentType === 'safe_work_procedure') {
      const swpTemplate = findSWPTemplate(review.documentName);
      if (swpTemplate) {
        setSelectedSWP(swpTemplate);
        setSelectedReview(review);
        setIsSWPDialogOpen(true);
        markViewedMutation.mutate(review.id);
      } else {
        toast({
          variant: "destructive",
          title: "Document Not Available",
          description: "The safe work procedure template could not be found.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Document Not Available",
        description: "The document file is not available. Please contact your administrator.",
      });
    }
  };

  const handleOpenSignDialog = (review: DocumentReviewSignature, skipViewCheck = false) => {
    if (!skipViewCheck && !review.viewedAt) {
      toast({
        variant: "destructive",
        title: "View Required",
        description: "You must view the document before signing.",
      });
      return;
    }
    setSelectedReview(review);
    setIsSignDialogOpen(true);
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setIsSignatureEmpty(true);
  };

  const handleSignDocument = () => {
    if (!selectedReview || !signatureRef.current) return;
    
    if (signatureRef.current.isEmpty()) {
      toast({
        variant: "destructive",
        title: "Signature Required",
        description: "Please provide your signature before submitting.",
      });
      return;
    }

    const signatureDataUrl = signatureRef.current.toDataURL('image/png');
    signDocumentMutation.mutate({
      reviewId: selectedReview.id,
      signatureDataUrl,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent pb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl ring-1 ring-amber-500/20">
            <FileCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">Document Reviews Required</CardTitle>
            <CardDescription>
              Review and sign the following documents to acknowledge receipt and understanding
            </CardDescription>
          </div>
          {pendingReviews.length > 0 && (
            <Badge variant="destructive" className="text-base font-semibold px-3">
              {pendingReviews.length} Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {pendingReviews.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Awaiting Your Signature
            </h3>
            <div className="space-y-3">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border bg-card"
                  data-testid={`review-pending-${review.id}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                      <FileWarning className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{review.documentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {getDocumentTypeLabel(review.documentType)}
                        {review.viewedAt && (
                          <span className="ml-2 text-emerald-600">
                            <Eye className="h-3 w-3 inline mr-1" />
                            Viewed
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                    {!review.viewedAt ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDocument(review)}
                        data-testid={`button-view-${review.id}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDocument(review)}
                          data-testid={`button-reread-${review.id}`}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Re-read
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenSignDialog(review)}
                          data-testid={`button-sign-${review.id}`}
                        >
                          <PenLine className="h-4 w-4 mr-2" />
                          Sign
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {signedReviews.length > 0 && (
          <Collapsible defaultOpen={pendingReviews.length === 0}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate mb-2">
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Signed Documents ({signedReviews.length})
              </h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 pl-6">
                {signedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border bg-muted/30"
                    data-testid={`review-signed-${review.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                        <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{review.documentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {getDocumentTypeLabel(review.documentType)}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      Signed: {formatDate(review.signedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>

      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Document</DialogTitle>
            <DialogDescription>
              {selectedReview?.documentName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By signing below, you acknowledge that you have read and understood the document.
            </p>
            
            <div className="border rounded-lg p-2 bg-white">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: 'w-full h-40 cursor-crosshair',
                  style: { width: '100%', height: '160px' },
                }}
                backgroundColor="white"
                onBegin={() => setIsSignatureEmpty(false)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSignature}
                data-testid="button-clear-signature"
              >
                Clear
              </Button>
              <p className="text-xs text-muted-foreground">
                Sign with your mouse or touch
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSignDialogOpen(false)}
              data-testid="button-cancel-sign"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSignDocument}
              disabled={signDocumentMutation.isPending || isSignatureEmpty}
              data-testid="button-confirm-sign"
            >
              {signDocumentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4 mr-2" />
                  Submit Signature
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSWPDialogOpen} onOpenChange={setIsSWPDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {selectedSWP?.title || 'Safe Work Procedure'}
            </DialogTitle>
            <DialogDescription>
              {selectedSWP?.description}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedSWP && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Scope</h4>
                  <p className="text-sm text-muted-foreground">{selectedSWP.scope}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Hazards Identified
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedSWP.hazards.map((hazard, idx) => (
                      <li key={idx}>{hazard}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    Control Measures
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedSWP.controlMeasures.map((measure, idx) => (
                      <li key={idx}>{measure}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <HardHat className="h-4 w-4 text-blue-500" />
                    Personal Protective Equipment (PPE)
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedSWP.ppe.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-gray-500" />
                    Equipment Required
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedSWP.equipment.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-purple-500" />
                    Pre-Work Checks
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedSWP.preWorkChecks.map((check, idx) => (
                      <li key={idx}>{check}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Work Procedure
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    {selectedSWP.workProcedure.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    Emergency Procedures
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedSWP.emergencyProcedures.map((procedure, idx) => (
                      <li key={idx}>{procedure}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                    Competency Requirements
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedSWP.competencyRequirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <p className="text-xs text-muted-foreground flex-1">
              Review this document carefully before signing to acknowledge receipt and understanding.
            </p>
            <Button
              onClick={() => {
                setIsSWPDialogOpen(false);
                if (selectedReview) {
                  handleOpenSignDialog(selectedReview, true);
                }
              }}
              data-testid="button-swp-proceed-sign"
            >
              <PenLine className="h-4 w-4 mr-2" />
              Proceed to Sign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
