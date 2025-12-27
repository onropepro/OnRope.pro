import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Eye, PenLine, Check, AlertCircle, Clock, ChevronRight, ChevronDown, FileCheck, FileWarning, Loader2, ExternalLink, Shield, HardHat, Wrench, AlertTriangle, ClipboardList, Phone, GraduationCap, Package, Thermometer, HeartPulse, MessageCircle, Lightbulb, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDateTime } from "@/lib/dateUtils";

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
    ppe: ['Full body harness (irata approved)', 'Safety helmet with chin strap', 'Descender and back-up device', 'Work gloves', 'Safety glasses', 'Safety footwear'],
    equipment: ['Static kernmantle ropes', 'Anchor straps and connectors', 'Descender and ascender devices', 'Karabiners', 'Window cleaning solution', 'Squeegees and scrubbers'],
    preWorkChecks: ['Verify weather conditions', 'Inspect anchor points', 'Check rope condition', 'Inspect harness', 'Test mechanical devices', 'Confirm exclusion zone'],
    workProcedure: ['Establish ground exclusion zone', 'Access roof/anchor location', 'Rig rope systems', 'Conduct buddy-check', 'Descend in controlled manner', 'Complete cleaning systematically', 'Ascend when complete', 'De-rig equipment'],
    emergencyProcedures: ['Initiate rescue within 10 minutes for suspension trauma', 'Contact emergency services for serious injuries', 'Evacuate if structural concerns arise', 'Immediate ascent in severe weather'],
    competencyRequirements: ['irata Level 1 minimum', 'Current first aid certification', 'Site-specific induction completed']
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
    competencyRequirements: ['irata Level 1 minimum', 'Dryer vent cleaning training', 'Fire hazard awareness', 'First aid certification']
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
    competencyRequirements: ['irata Level 1 minimum', 'Pressure washing certification', 'Chemical handling training', 'First aid certification']
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
  },
  {
    jobType: 'gutter_cleaning',
    title: 'Gutter Cleaning - Rope Access',
    description: 'Safe work procedure for cleaning gutters, downspouts, and drainage systems using rope access techniques.',
    scope: 'This procedure applies to all rope access gutter cleaning operations including debris removal, flushing, and minor repairs.',
    hazards: ['Falls from height', 'Sharp edges on gutters', 'Biological hazards - mold, bird droppings', 'Structural instability', 'Falling debris', 'Insects and pests'],
    controlMeasures: ['Dual rope system', 'Gutter structural assessment', 'Debris containment bags', 'Ground-level exclusion zone', 'Respiratory protection', 'Heavy-duty gloves'],
    ppe: ['Full body harness', 'Helmet with face shield option', 'Cut-resistant gloves', 'Respiratory protection (N95 minimum)', 'Safety glasses', 'Waterproof outer layer'],
    equipment: ['Static kernmantle ropes', 'Debris collection bags', 'Gutter scoops and hand tools', 'Garden hose or water supply', 'Downspout clearing tools', 'Inspection mirror'],
    preWorkChecks: ['Assess gutter structural condition', 'Identify electrical hazards', 'Check weather conditions', 'Confirm anchor points', 'Prepare exclusion zone'],
    workProcedure: ['Establish exclusion zone', 'Rig rope systems', 'Visual inspection before loading', 'Remove debris by hand', 'Clear downspout inlets', 'Flush gutter runs', 'Document concerns'],
    emergencyProcedures: ['Structural failure: transfer to backup rope', 'Electrical contact: do not touch victim, call 911', 'Bee/wasp encounter: withdraw slowly', 'Cut injury: apply first aid'],
    competencyRequirements: ['irata Level 1 minimum', 'First aid certification', 'Biological hazard awareness', 'Tool handling procedures']
  },
  {
    jobType: 'lighting_maintenance',
    title: 'Lighting and Signage Maintenance - Rope Access',
    description: 'Safe work procedure for maintaining, repairing, and replacing exterior lighting and signage using rope access.',
    scope: 'This procedure applies to all rope access lighting and signage maintenance including bulb replacement, fixture cleaning, and electrical connections.',
    hazards: ['Falls from height', 'Electrical shock', 'Burns from hot elements', 'Broken glass', 'Heavy loads', 'Weather conditions'],
    controlMeasures: ['Lock-out/tag-out procedures', 'Voltage testing before touching', 'Dual rope system', 'Tool lanyards', 'Allow fixtures to cool', 'Insulated tools'],
    ppe: ['Full body harness', 'Helmet', 'Insulated gloves', 'Safety glasses or face shield', 'Arc-rated clothing if needed', 'Electrical hazard footwear'],
    equipment: ['Static kernmantle ropes', 'Insulated tools and voltage testers', 'Lock-out/tag-out equipment', 'Replacement bulbs in cases', 'Lifting/lowering bag', 'Multi-meter'],
    preWorkChecks: ['Confirm LOTO in place', 'Test for absence of voltage', 'Verify anchor points', 'Check weather forecast', 'Inspect tool insulation'],
    workProcedure: ['Implement LOTO', 'Verify no voltage', 'Rig rope systems', 'Allow cooling', 'Perform maintenance', 'Reassemble', 'Test operation', 'Remove LOTO'],
    emergencyProcedures: ['Electrical shock: cut power, call 911', 'Arc flash: evacuate, first aid for burns', 'Fall or suspension: initiate rescue', 'Dropped fixture: clear area'],
    competencyRequirements: ['irata Level 1 minimum', 'Electrical safety training', 'LOTO certification', 'First aid certification']
  },
  {
    jobType: 'caulking_sealing',
    title: 'Caulking and Sealing - Rope Access',
    description: 'Safe work procedure for applying, repairing, and replacing caulking and sealants on building exteriors.',
    scope: 'This procedure applies to all rope access caulking and sealing operations including window perimeters, expansion joints, and weatherproofing.',
    hazards: ['Falls from height', 'Chemical exposure - solvents, primers', 'Respiratory hazards - VOCs', 'Skin sensitization', 'Sharp tools', 'Eye hazards'],
    controlMeasures: ['Dual rope system', 'Respiratory protection for VOCs', 'Chemical-resistant gloves', 'Tool lanyards', 'Temperature monitoring', 'Eye protection mandatory'],
    ppe: ['Full body harness', 'Helmet', 'Chemical-resistant nitrile gloves', 'Safety glasses or goggles', 'Respiratory protection', 'Protective coveralls'],
    equipment: ['Static kernmantle ropes', 'Caulking guns', 'Sealant materials', 'Joint preparation tools', 'Backer rod', 'Primer and cleaner', 'Masking tape'],
    preWorkChecks: ['Review product SDS', 'Verify temperature/humidity in spec', 'Check weather - no rain during cure', 'Inspect substrate', 'Confirm products'],
    workProcedure: ['Establish exclusion zone', 'Rig rope system', 'Prepare joint', 'Clean surfaces', 'Apply primer', 'Install backer rod', 'Apply sealant', 'Tool to profile', 'Inspect work'],
    emergencyProcedures: ['Eye contact: flush 15 minutes, seek medical', 'Skin reaction: wash, remove clothing', 'Respiratory distress: move to fresh air', 'Cut injury: apply first aid'],
    competencyRequirements: ['irata Level 1 minimum', 'Sealant application training', 'Chemical handling awareness', 'First aid certification']
  },
  {
    jobType: 'bird_deterrent',
    title: 'Bird Deterrent Installation - Rope Access',
    description: 'Safe work procedure for installing, maintaining, and repairing bird deterrent systems using rope access.',
    scope: 'This procedure applies to all rope access bird deterrent operations including spike installation, netting, and wire systems.',
    hazards: ['Falls from height', 'Biological hazards - bird droppings, diseases', 'Sharp materials - spikes, wire', 'Respiratory hazards', 'Drilling debris', 'Netting entanglement'],
    controlMeasures: ['Dual rope system', 'Respiratory protection for bird waste', 'Heavy-duty gloves for spikes', 'Pre-cleaning and disinfection', 'Netting handling procedures'],
    ppe: ['Full body harness', 'Helmet', 'N95 or P100 respirator', 'Puncture-resistant gloves', 'Safety glasses', 'Disposable coveralls', 'Boot covers'],
    equipment: ['Static kernmantle ropes', 'Bird deterrent materials', 'Fastening tools', 'Cleaning and disinfecting supplies', 'Waste bags', 'HEPA vacuum'],
    preWorkChecks: ['Survey bird presence and contamination', 'Check for protected species', 'Ensure cleaning supplies ready', 'Confirm deterrent materials', 'Check weather for netting'],
    workProcedure: ['Establish exclusion zone', 'Rig rope systems', 'Document conditions', 'Remove nests if appropriate', 'Clean and disinfect', 'Install deterrent per specs', 'Inspect for gaps'],
    emergencyProcedures: ['Puncture injury: clean immediately, check tetanus', 'Respiratory distress: move to fresh air', 'Netting entanglement: cut free carefully', 'Bird attack: protect face, withdraw'],
    competencyRequirements: ['irata Level 1 minimum', 'Bird deterrent training', 'Biological hazard handling', 'First aid certification']
  },
  {
    jobType: 'anchor_inspection',
    title: 'Anchor Point Inspection and Certification',
    description: 'Safe work procedure for inspecting, testing, and certifying permanent anchor points for rope access.',
    scope: 'This procedure applies to all anchor point inspection activities including visual examination, non-destructive testing, and load testing.',
    hazards: ['Falls from height', 'Anchor failure during testing', 'Working on roofs - unprotected edges', 'Tool drops', 'Weather conditions', 'Structural deterioration'],
    controlMeasures: ['Use only verified anchors until tested', 'Safe distance during load testing', 'Barricade test area', 'Dual rope from known-good anchors', 'Progressive loading'],
    ppe: ['Full body harness', 'Helmet', 'Safety glasses', 'Work gloves', 'Safety footwear', 'High visibility vest', 'Hearing protection during testing'],
    equipment: ['Static kernmantle ropes from verified anchors', 'Anchor pull test equipment (calibrated)', 'NDT equipment as specified', 'Torque wrenches (calibrated)', 'Inspection mirrors', 'Camera', 'Anchor ID tags'],
    preWorkChecks: ['Review previous inspection records', 'Identify all anchors for inspection', 'Verify equipment calibration', 'Check weather suitable', 'Confirm access route using verified anchors'],
    workProcedure: ['Access using verified anchors', 'Locate and identify anchors', 'Visual inspection', 'Document concerns', 'Check fastener torque', 'Perform NDT if specified', 'Load test', 'Record results', 'Tag anchor'],
    emergencyProcedures: ['Anchor failure during test: ensure personnel clear', 'Anchor showing failure signs: tag out immediately', 'Fall or suspension: rescue using verified anchors only'],
    competencyRequirements: ['irata Level 2 or higher', 'Anchor inspection certification', 'NDT qualifications as required', 'First aid certification']
  }
];

// Safe Work Practice Template Interface
interface SafeWorkPractice {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  keyPrinciples: string[];
  requirements: string[];
  doList: string[];
  dontList: string[];
  emergencyActions: string[];
}

// Safe Work Practice Templates
const SAFE_WORK_PRACTICES: SafeWorkPractice[] = [
  {
    id: 'general_ppe',
    title: 'Personal Protective Equipment (PPE)',
    description: 'Guidelines for proper selection, use, and maintenance of personal protective equipment.',
    category: 'General Safety',
    icon: Shield,
    keyPrinciples: ['PPE is the last line of defense', 'All PPE must be inspected before each use', 'PPE must be appropriate for the specific hazard', 'Damaged or expired PPE must never be used'],
    requirements: ['Full body harness inspected within 12 months', 'Hard hat with chin strap rated to EN 397', 'Safety glasses or goggles as required', 'Appropriate gloves for the task'],
    doList: ['Inspect all PPE before each use', 'Store PPE properly when not in use', 'Report any damage immediately', 'Replace PPE according to manufacturer guidelines'],
    dontList: ['Never use damaged or expired PPE', 'Never modify PPE from original design', 'Never share personal PPE without sanitization'],
    emergencyActions: ['If PPE fails during work, immediately move to safe position', 'Report all PPE failures to supervisor']
  },
  {
    id: 'fall_protection',
    title: 'Fall Protection',
    description: 'Essential practices for preventing falls from height during rope access operations.',
    category: 'Working at Heights',
    icon: AlertTriangle,
    keyPrinciples: ['Falls from height are the leading cause of fatalities', 'Dual rope systems provide redundancy', 'Anchor points must be independently tested', '100% tie-off at all times when at height'],
    requirements: ['Minimum irata Level 1 certification', 'Dual rope system with independent anchors', 'Anchor points rated to minimum 15kN', 'Fall arrester device properly engaged'],
    doList: ['Verify anchor point integrity before use', 'Maintain 100% tie-off at all times', 'Use backup device in addition to descender', 'Communicate clearly with team members'],
    dontList: ['Never work at height alone', 'Never trust unverified anchor points', 'Never remove fall protection while at height', 'Never work in severe weather conditions'],
    emergencyActions: ['In case of fall arrest, immediately call for rescue', 'Suspended worker rescue must occur within 15 minutes', 'Activate emergency services if rescue not possible']
  },
  {
    id: 'chemical_safety',
    title: 'Chemical Safety',
    description: 'Safe handling, storage, and disposal of chemicals used in cleaning operations.',
    category: 'Hazardous Materials',
    icon: Zap,
    keyPrinciples: ['Know the hazards before using any chemical', 'Always read and follow SDS information', 'Use appropriate PPE for each chemical', 'Never mix chemicals unless approved'],
    requirements: ['SDS available for all chemicals on site', 'Chemical-specific PPE available', 'Proper storage containers and areas', 'Spill containment materials on hand'],
    doList: ['Read SDS before first use of any chemical', 'Use in well-ventilated areas', 'Store chemicals in designated areas', 'Label all containers clearly'],
    dontList: ['Never mix different chemicals', 'Never transfer to unlabeled containers', 'Never use chemicals near ignition sources', 'Never dispose of chemicals in drains'],
    emergencyActions: ['For chemical exposure: rinse immediately with water', 'For inhalation: move to fresh air', 'For spills: contain and refer to SDS', 'Seek medical attention if symptoms persist']
  },
  {
    id: 'communication_protocols',
    title: 'Communication Protocols',
    description: 'Effective communication practices for rope access team operations.',
    category: 'Team Operations',
    icon: MessageCircle,
    keyPrinciples: ['Clear communication prevents accidents', 'All team members must have working radios', 'Use standard signals and terminology', 'Confirm all critical messages'],
    requirements: ['Two-way radios for all rope access personnel', 'Pre-work communication check', 'Emergency contact numbers available', 'Hand signals for backup communication'],
    doList: ['Check radio functionality before work', 'Use clear, concise language', 'Confirm receipt of critical messages', 'Report all safety concerns immediately'],
    dontList: ['Never work without means of communication', 'Never ignore calls or messages', 'Never use phones while on rope', 'Never assume message was received'],
    emergencyActions: ['Use emergency channel for urgent situations', 'Three short whistle blasts = emergency', 'Maintain line of sight when possible', 'Have backup communication methods ready']
  },
  {
    id: 'manual_handling',
    title: 'Manual Handling',
    description: 'Safe lifting and carrying techniques to prevent musculoskeletal injuries.',
    category: 'Ergonomics',
    icon: Shield,
    keyPrinciples: ['Plan the lift before starting', 'Use mechanical aids when possible', 'Get help for heavy or awkward loads', 'Keep loads close to body'],
    requirements: ['Team lift for loads over 25kg', 'Mechanical aids available', 'Clear pathways maintained', 'Training in safe lifting techniques'],
    doList: ['Assess the load before lifting', 'Keep back straight, bend at knees', 'Grip firmly and lift smoothly', 'Take breaks during repetitive tasks'],
    dontList: ['Never twist while lifting', 'Never lift beyond your capacity', 'Never carry loads that block your view', 'Never rush lifting operations'],
    emergencyActions: ['If back injury occurs, stop work immediately', 'Apply ice and seek medical attention', 'Report all manual handling injuries']
  },
  {
    id: 'heat_cold_stress',
    title: 'Heat and Cold Stress Prevention',
    description: 'Protecting workers from temperature-related hazards during outdoor operations.',
    category: 'Environmental',
    icon: AlertTriangle,
    keyPrinciples: ['Monitor weather conditions continuously', 'Recognize early symptoms of heat/cold stress', 'Hydration is critical in all conditions', 'Rest breaks are essential'],
    requirements: ['Water readily available at all times', 'Shade or warming shelters accessible', 'Weather monitoring equipment', 'Emergency response plan for temperature emergencies'],
    doList: ['Drink water regularly throughout shift', 'Take scheduled rest breaks', 'Wear appropriate clothing for conditions', 'Monitor team members for symptoms'],
    dontList: ['Never ignore symptoms of heat/cold stress', 'Never work through excessive discomfort', 'Never skip rest breaks in extreme conditions', 'Never consume alcohol during extreme weather work'],
    emergencyActions: ['Heat stroke: cool immediately, call 911', 'Hypothermia: warm gradually, seek medical help', 'Move affected worker to appropriate shelter']
  },
  {
    id: 'tool_equipment',
    title: 'Tool and Equipment Safety',
    description: 'Safe use, handling, and maintenance of tools and equipment in rope access operations.',
    category: 'Equipment',
    icon: Shield,
    keyPrinciples: ['Use the right tool for the job', 'Inspect tools before each use', 'Maintain tools in good condition', 'Secure tools when working at height'],
    requirements: ['Tool lanyards for all equipment at height', 'Regular tool inspection program', 'Proper storage and maintenance', 'Training in tool use'],
    doList: ['Inspect tools before use', 'Use tool lanyards at height', 'Store tools properly after use', 'Report damaged tools immediately'],
    dontList: ['Never use damaged tools', 'Never leave tools unsecured at height', 'Never modify tools from original design', 'Never use tools for unintended purposes'],
    emergencyActions: ['Dropped tool: alert ground crew immediately', 'Tool failure: stop work, assess situation', 'Report all tool-related incidents']
  },
  {
    id: 'emergency_response',
    title: 'Emergency Response',
    description: 'Preparedness and procedures for responding to workplace emergencies.',
    category: 'Emergency Preparedness',
    icon: AlertTriangle,
    keyPrinciples: ['Know emergency procedures before starting work', 'Maintain clear access to emergency equipment', 'Practice emergency drills regularly', 'Never delay calling for help'],
    requirements: ['Emergency response plan for each site', 'First aid kit readily accessible', 'Emergency contact numbers posted', 'Trained first aiders on site'],
    doList: ['Know emergency assembly points', 'Keep emergency routes clear', 'Report all emergencies immediately', 'Assist others if safe to do so'],
    dontList: ['Never block emergency exits', 'Never ignore alarms or warnings', 'Never attempt rescues beyond your training', 'Never delay reporting emergencies'],
    emergencyActions: ['Call emergency services immediately for serious incidents', 'Provide first aid if trained', 'Evacuate area if directed', 'Account for all personnel']
  },
  {
    id: 'fatigue_wellbeing',
    title: 'Fatigue and Wellbeing',
    description: 'Managing fatigue and maintaining mental and physical wellbeing for safe work.',
    category: 'Health',
    icon: Shield,
    keyPrinciples: ['Fatigue impairs judgment and reaction time', 'Rest is essential for safe work', 'Mental health affects safety performance', 'Report fitness for duty concerns'],
    requirements: ['Adequate rest between shifts', 'Breaks during work periods', 'Support for mental health available', 'Fit for duty assessment'],
    doList: ['Get adequate sleep before shifts', 'Take scheduled breaks', 'Stay hydrated and eat properly', 'Speak up if feeling unwell'],
    dontList: ['Never work while impaired', 'Never hide fatigue or illness', 'Never skip breaks during long shifts', 'Never pressure others to work when unfit'],
    emergencyActions: ['Stop work if feeling unwell', 'Report concerns to supervisor', 'Seek medical attention if needed']
  },
  {
    id: 'worksite_housekeeping',
    title: 'Worksite Housekeeping',
    description: 'Maintaining clean and organized work areas for safety and efficiency.',
    category: 'General Safety',
    icon: Shield,
    keyPrinciples: ['Good housekeeping prevents slips, trips, and falls', 'Organized work areas improve efficiency', 'Everyone is responsible for housekeeping', 'Clean up as you go'],
    requirements: ['Designated storage areas for equipment', 'Waste disposal containers available', 'Clear walkways and access routes', 'Adequate lighting in work areas'],
    doList: ['Keep work areas clean and organized', 'Store tools and equipment properly', 'Dispose of waste in designated containers', 'Clean up spills immediately'],
    dontList: ['Never leave tools or materials on walkways', 'Never leave extension cords across paths', 'Never pile materials unsafely', 'Never ignore slip or trip hazards'],
    emergencyActions: ['Trip hazard causing injury: provide first aid, report', 'Spill on work surface: clean immediately', 'Cluttered emergency route: clear immediately']
  },
  {
    id: 'confined_space',
    title: 'Confined Space Entry',
    description: 'Safety practices for entering and working in confined spaces.',
    category: 'Specialized Operations',
    icon: AlertTriangle,
    keyPrinciples: ['Never enter without proper authorization', 'Atmospheric testing is mandatory', 'A trained attendant must be present', 'Rescue plans must be in place'],
    requirements: ['Confined space entry permit completed', 'Atmospheric testing equipment calibrated', 'Rescue equipment immediately available', 'Trained attendant at entry point'],
    doList: ['Obtain proper entry permit', 'Test atmosphere for oxygen, flammables, toxics', 'Continuously monitor atmosphere', 'Maintain communication with attendant'],
    dontList: ['Never enter without a valid permit', 'Never enter if atmospheric testing incomplete', 'Never work alone in a confined space', 'Never remove ventilation without authorization'],
    emergencyActions: ['Atmospheric alarm: evacuate immediately', 'Worker collapse: do not enter, call rescue team', 'Loss of communication: treat as emergency']
  },
  {
    id: 'electrical_safety',
    title: 'Working Near Electrical Hazards',
    description: 'Safety practices for working near electrical installations and power lines.',
    category: 'Hazard Awareness',
    icon: Zap,
    keyPrinciples: ['Electricity can kill or cause severe burns instantly', 'Maintain safe distances from all power sources', 'Assume all equipment is energized until verified', 'Arc flash can occur without direct contact'],
    requirements: ['Electrical hazard survey before work', 'Minimum safe approach distances established', 'Lock-out/tag-out procedures for controlled work', 'Insulated tools when working near electricity'],
    doList: ['Conduct electrical hazard survey before starting', 'Maintain minimum safe distances', 'Use insulated tools and equipment', 'Test before touch - verify de-energization'],
    dontList: ['Never approach closer than minimum safe distance', 'Never assume power is off without verification', 'Never use metal ladders near electrical hazards', 'Never work near power lines in wet conditions'],
    emergencyActions: ['Electrical contact: do not touch victim, isolate power, call 911', 'Arc flash burn: cool burns, call emergency services', 'Fallen power line: stay clear, keep others away']
  },
  {
    id: 'rescue_procedures',
    title: 'Rescue Procedures',
    description: 'Emergency rescue practices for rope access technicians in distress.',
    category: 'Emergency Response',
    icon: AlertTriangle,
    keyPrinciples: ['Prevention is better than rescue', 'Suspension trauma can be fatal within 30 minutes', 'Self-rescue is the first option when possible', 'Never delay calling emergency services'],
    requirements: ['Written rescue plan for each work site', 'Rescue-trained personnel on site', 'Rescue equipment immediately accessible', 'Regular rescue drills (minimum annually)'],
    doList: ['Develop site-specific rescue plan before work', 'Ensure rescue equipment is checked and ready', 'Practice rescue scenarios regularly', 'Monitor team members for signs of distress'],
    dontList: ['Never work without a rescue plan in place', 'Never delay rescue - suspension trauma is time-critical', 'Never attempt complex rescue without training', 'Never ignore signs of distress in team members'],
    emergencyActions: ['Unconscious worker on rope: initiate rescue immediately, call 911', 'Suspension trauma: lower to ground ASAP', 'Equipment failure: transfer to backup system, evacuate']
  },
  {
    id: 'environmental_protection',
    title: 'Environmental Protection',
    description: 'Practices for protecting the environment during rope access operations.',
    category: 'General Safety',
    icon: Shield,
    keyPrinciples: ['Prevent pollution at the source', 'Contain and properly dispose of all waste', 'Chemicals must never enter storm drains', 'Report all spills immediately'],
    requirements: ['Spill containment materials on site', 'Proper waste disposal containers', 'Knowledge of local environmental regulations', 'Material Safety Data Sheets for all chemicals'],
    doList: ['Use drip trays and containment when handling fluids', 'Block storm drains when using cleaning chemicals', 'Collect and properly dispose of all wash water', 'Report any environmental concerns immediately'],
    dontList: ['Never pour chemicals down drains or on ground', 'Never leave waste materials on site', 'Never use more chemical than necessary', 'Never ignore spills or leaks'],
    emergencyActions: ['Chemical spill: contain immediately, prevent entering drains', 'Large spill: evacuate area, call environmental emergency line', 'Spill into water: report to authorities immediately']
  },
  {
    id: 'public_safety',
    title: 'Public Interface Safety',
    description: 'Practices for ensuring public safety during rope access operations.',
    category: 'General Safety',
    icon: Shield,
    keyPrinciples: ['Public safety is always the first priority', 'Exclusion zones protect the public from falling objects', 'Clear communication prevents public confusion', 'Anticipate public behavior and protect accordingly'],
    requirements: ['Ground-level exclusion zones properly barricaded', 'Warning signs in place and visible', 'Ground support personnel when public present', 'Tool lanyards on all equipment at height'],
    doList: ['Establish and maintain exclusion zones at all times', 'Post clear warning signage', 'Have ground support monitor public access areas', 'Respond professionally to public inquiries'],
    dontList: ['Never leave exclusion zones unattended when public present', 'Never drop anything from height without ground clear', 'Never argue with members of the public', 'Never work over pedestrians without proper controls'],
    emergencyActions: ['Object dropped toward public: alert ground crew immediately', 'Injury to member of public: provide first aid, call 911, report', 'Public enters exclusion zone: stop work, redirect politely']
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
  const { t } = useTranslation();
  const { toast } = useToast();
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedReview, setSelectedReview] = useState<DocumentReviewSignature | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [isSWPDialogOpen, setIsSWPDialogOpen] = useState(false);
  const [selectedSWP, setSelectedSWP] = useState<SafeWorkProcedure | null>(null);
  const [isPracticeDialogOpen, setIsPracticeDialogOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<SafeWorkPractice | null>(null);
  const [isUnifiedDialogOpen, setIsUnifiedDialogOpen] = useState(false);
  const [unifiedDocumentUrl, setUnifiedDocumentUrl] = useState<string | null>(null);

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
      queryClient.invalidateQueries({ queryKey: ['/api/document-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/document-reviews/pending-check'] });
      queryClient.invalidateQueries({ queryKey: ['/api/csr'] });
      queryClient.invalidateQueries({ queryKey: ['/api/company-safety-rating'] });
      setIsSignDialogOpen(false);
      setIsUnifiedDialogOpen(false);
      setSelectedReview(null);
      setUnifiedDocumentUrl(null);
      setSelectedSWP(null);
      setSelectedPractice(null);
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
      case 'safe_work_practice':
        return 'Safe Work Practice';
      default:
        return type;
    }
  };

  const findSWPTemplate = (documentName: string): SafeWorkProcedure | null => {
    return SAFE_WORK_PROCEDURES.find(swp => swp.title === documentName) || null;
  };

  const findPracticeTemplate = (documentName: string): SafeWorkPractice | null => {
    return SAFE_WORK_PRACTICES.find(practice => practice.title === documentName) || null;
  };

  const handleViewDocument = (review: DocumentReviewSignature) => {
    const url = getDocumentUrl(review);
    
    // Always open the unified dialog - shows document + signing in one place
    setSelectedReview(review);
    markViewedMutation.mutate(review.id);
    
    if (url) {
      // PDF or uploaded document - show in unified dialog with iframe
      setUnifiedDocumentUrl(url);
      setSelectedSWP(null);
      setSelectedPractice(null);
      setIsUnifiedDialogOpen(true);
    } else if (review.documentType === 'safe_work_procedure') {
      const swpTemplate = findSWPTemplate(review.documentName);
      if (swpTemplate) {
        setSelectedSWP(swpTemplate);
        setUnifiedDocumentUrl(null);
        setSelectedPractice(null);
        setIsUnifiedDialogOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Document Not Available",
          description: "The safe work procedure template could not be found.",
        });
      }
    } else if (review.documentType === 'safe_work_practice') {
      const practiceTemplate = findPracticeTemplate(review.documentName);
      if (practiceTemplate) {
        setSelectedPractice(practiceTemplate);
        setUnifiedDocumentUrl(null);
        setSelectedSWP(null);
        setIsUnifiedDialogOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Document Not Available",
          description: "The safe work practice template could not be found.",
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
    return formatDateTime(dateString);
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
            <CardTitle className="text-xl mb-1">{t('documents.reviewsRequired', 'Document Reviews Required')}</CardTitle>
            <CardDescription>
              {t('documents.reviewAndSign', 'Review and sign the following documents to acknowledge receipt and understanding')}
            </CardDescription>
          </div>
          {pendingReviews.length > 0 && (
            <Badge variant="destructive" className="text-base font-semibold px-3">
              {pendingReviews.length} {t('documents.pending', 'Pending')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {pendingReviews.length > 0 && (
          <Collapsible defaultOpen={true} className="mb-6">
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate mb-2 group">
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                {t('documents.awaitingSignature', 'Awaiting Your Signature')} ({pendingReviews.length})
              </h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-3 pl-6">
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
                              {t('documents.viewed', 'Viewed')}
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
                          {t('documents.viewDocument', 'View Document')}
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
                            {t('documents.reread', 'Re-read')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleOpenSignDialog(review)}
                            data-testid={`button-sign-${review.id}`}
                          >
                            <PenLine className="h-4 w-4 mr-2" />
                            {t('documents.sign', 'Sign')}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {signedReviews.length > 0 && (
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate mb-2 group">
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                {t('documents.signedDocuments', 'Signed Documents')} ({signedReviews.length})
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
                      {t('documents.signed', 'Signed')}: {formatDate(review.signedAt)}
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
            <DialogTitle>{t('documents.signDocument', 'Sign Document')}</DialogTitle>
            <DialogDescription>
              {selectedReview?.documentName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('documents.signingAcknowledgment', 'By signing below, you acknowledge that you have read and understood the document.')}
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
                {t('common.clear', 'Clear')}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t('documents.signWithMouse', 'Sign with your mouse or touch')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSignDialogOpen(false)}
              data-testid="button-cancel-sign"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleSignDocument}
              disabled={signDocumentMutation.isPending || isSignatureEmpty}
              data-testid="button-confirm-sign"
            >
              {signDocumentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('documents.signing', 'Signing...')}
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4 mr-2" />
                  {t('documents.submitSignature', 'Submit Signature')}
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
              {selectedSWP?.title || t('documents.safeWorkProcedure', 'Safe Work Procedure')}
            </DialogTitle>
            <DialogDescription>
              {selectedSWP?.description}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedSWP && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-2">{t('documents.scope', 'Scope')}</h4>
                  <p className="text-sm text-muted-foreground">{selectedSWP.scope}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    {t('documents.hazardsIdentified', 'Hazards Identified')}
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
                    {t('documents.controlMeasures', 'Control Measures')}
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
                    {t('documents.ppe', 'Personal Protective Equipment (PPE)')}
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
                    {t('documents.equipmentRequired', 'Equipment Required')}
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
                    {t('documents.preWorkChecks', 'Pre-Work Checks')}
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
                    {t('documents.workProcedure', 'Work Procedure')}
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
                    {t('documents.emergencyProcedures', 'Emergency Procedures')}
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
                    {t('documents.competencyRequirements', 'Competency Requirements')}
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
              {t('documents.reviewBeforeSigning', 'Review this document carefully before signing to acknowledge receipt and understanding.')}
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
              {t('documents.proceedToSign', 'Proceed to Sign')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safe Work Practice Dialog */}
      <Dialog open={isPracticeDialogOpen} onOpenChange={setIsPracticeDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              {selectedPractice?.title || t('documents.safeWorkPractice', 'Safe Work Practice')}
            </DialogTitle>
            <DialogDescription>
              {selectedPractice?.description}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedPractice && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Key Principles
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedPractice.keyPrinciples.map((principle, idx) => (
                      <li key={idx}>{principle}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-blue-500" />
                    Requirements
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedPractice.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      Do
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      {selectedPractice.doList.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Don't
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      {selectedPractice.dontList.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    Emergency Actions
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedPractice.emergencyActions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <p className="text-xs text-muted-foreground flex-1">
              {t('documents.reviewBeforeSigning', 'Review this document carefully before signing to acknowledge receipt and understanding.')}
            </p>
            <Button
              onClick={() => {
                setIsPracticeDialogOpen(false);
                if (selectedReview) {
                  handleOpenSignDialog(selectedReview, true);
                }
              }}
              data-testid="button-practice-proceed-sign"
            >
              <PenLine className="h-4 w-4 mr-2" />
              {t('documents.proceedToSign', 'Proceed to Sign')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unified Document View + Sign Dialog */}
      <Dialog open={isUnifiedDialogOpen} onOpenChange={(open) => {
        setIsUnifiedDialogOpen(open);
        if (!open) {
          setSelectedReview(null);
          setUnifiedDocumentUrl(null);
          setSelectedSWP(null);
          setSelectedPractice(null);
          signatureRef.current?.clear();
          setIsSignatureEmpty(true);
        }
      }}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {selectedReview?.documentName || t('documents.document', 'Document')}
            </DialogTitle>
            <DialogDescription>
              {getDocumentTypeLabel(selectedReview?.documentType || '')}
              {' - '}
              {t('documents.reviewAndSign', 'Review the document below, then sign at the bottom to complete.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Document Content Area */}
            <div className="flex-1 min-h-0 mb-4 overflow-auto" style={{ maxHeight: 'calc(50vh - 50px)' }}>
              {unifiedDocumentUrl ? (
                <iframe
                  src={unifiedDocumentUrl}
                  className="w-full h-full min-h-[300px] border rounded-lg bg-white"
                  style={{ height: 'calc(50vh - 100px)' }}
                  title={selectedReview?.documentName || 'Document'}
                />
              ) : selectedSWP ? (
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('documents.scope', 'Scope')}</h4>
                      <p className="text-sm text-muted-foreground">{selectedSWP.scope}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        {t('documents.hazardsIdentified', 'Hazards Identified')}
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
                        {t('documents.controlMeasures', 'Control Measures')}
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
                        {t('documents.ppe', 'PPE Required')}
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        {selectedSWP.ppe.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-purple-500" />
                        {t('documents.workProcedure', 'Work Procedure')}
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
                        {t('documents.emergencyProcedures', 'Emergency Procedures')}
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        {selectedSWP.emergencyProcedures.map((proc, idx) => (
                          <li key={idx}>{proc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              ) : selectedPractice ? (
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        Key Principles
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        {selectedPractice.keyPrinciples.map((principle, idx) => (
                          <li key={idx}>{principle}</li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-blue-500" />
                        Requirements
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        {selectedPractice.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          Do
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          {selectedPractice.doList.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          Don't
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          {selectedPractice.dontList.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-red-500" />
                        Emergency Actions
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        {selectedPractice.emergencyActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                  {t('documents.noDocumentContent', 'Document content not available')}
                </div>
              )}
            </div>

            {/* Signature Section - Always at bottom */}
            {selectedReview && !selectedReview.signedAt && (
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t('documents.signingAcknowledgment', 'By signing below, you acknowledge that you have read and understood the document.')}
                </p>
                
                <div className="border rounded-lg p-2 bg-white">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'w-full h-32 cursor-crosshair',
                      style: { width: '100%', height: '128px' },
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
                    data-testid="button-clear-signature-unified"
                  >
                    {t('common.clear', 'Clear')}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t('documents.signWithMouse', 'Sign with your mouse or touch')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUnifiedDialogOpen(false)}
              data-testid="button-close-unified"
            >
              {t('common.close', 'Close')}
            </Button>
            {selectedReview && !selectedReview.signedAt && (
              <Button
                onClick={handleSignDocument}
                disabled={signDocumentMutation.isPending || isSignatureEmpty}
                data-testid="button-sign-unified"
              >
                {signDocumentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('documents.signing', 'Signing...')}
                  </>
                ) : (
                  <>
                    <PenLine className="h-4 w-4 mr-2" />
                    {t('documents.submitSignature', 'Submit Signature')}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
