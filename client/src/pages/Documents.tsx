import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, DollarSign, Upload, Trash2, Shield, BookOpen, ArrowLeft, AlertTriangle, Plus, FileCheck, ChevronDown, ChevronRight, FolderOpen, CalendarRange, Package, Loader2, Users, Eye, PenLine, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import { hasFinancialAccess, canViewSafetyDocuments } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { downloadMethodStatement } from "@/pages/MethodStatementForm";
import { formatLocalDate, formatLocalDateLong, formatLocalDateMedium, parseLocalDate } from "@/lib/dateUtils";
import { format } from "date-fns";
import { DocumentReviews } from "@/components/DocumentReviews";

// Standard job types for method statements - use translation keys
const STANDARD_JOB_TYPES = [
  { value: 'window_cleaning', labelKey: 'dashboard.jobTypes.window_cleaning' },
  { value: 'dryer_vent_cleaning', labelKey: 'dashboard.jobTypes.dryer_vent_cleaning' },
  { value: 'building_wash', labelKey: 'dashboard.jobTypes.building_wash' },
  { value: 'in_suite_dryer_vent_cleaning', labelKey: 'dashboard.jobTypes.in_suite_dryer_vent_cleaning' },
  { value: 'parkade_pressure_cleaning', labelKey: 'dashboard.jobTypes.parkade_pressure_cleaning' },
  { value: 'ground_window_cleaning', labelKey: 'dashboard.jobTypes.ground_window_cleaning' },
  { value: 'general_pressure_washing', labelKey: 'dashboard.jobTypes.general_pressure_washing' },
  { value: 'other', labelKey: 'dashboard.jobTypes.other' },
];

// Safe Work Procedure Templates for each job type
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
    ppe: [
      'Full body harness (IRATA approved, inspected within 12 months)',
      'Helmet with chin strap (EN 397 rated)',
      'Descender device (certified for rope access)',
      'Back-up device (fall arrester)',
      'Work positioning lanyard',
      'Gloves (appropriate for rope work and cleaning)',
      'Safety glasses or goggles',
      'Safety footwear with non-slip soles',
      'High visibility vest when working near traffic'
    ],
    equipment: [
      'Static kernmantle ropes (minimum 10.5mm diameter)',
      'Anchor straps and connectors (certified load rated)',
      'Descender and ascender devices',
      'Karabiners (screw-gate, minimum 25kN)',
      'Rope protectors for edge work',
      'Window cleaning solution (approved, biodegradable preferred)',
      'Squeegees, scrubbers, and applicators',
      'Water-fed pole system (if applicable)',
      'Bucket or solution container with secure attachment',
      'Drop sheets for ground protection'
    ],
    preWorkChecks: [
      'Verify weather conditions are suitable for rope access work',
      'Inspect all anchor points and confirm load ratings',
      'Check rope condition - no cuts, abrasions, or chemical damage',
      'Inspect harness webbing, stitching, and hardware',
      'Test all mechanical devices (descenders, ascenders, back-up devices)',
      'Confirm ground exclusion zone is properly established',
      'Verify rescue equipment is available and accessible',
      'Brief all team members on work plan and emergency procedures',
      'Confirm communication devices are charged and working',
      'Check chemical safety data sheets are available on site'
    ],
    workProcedure: [
      '1. Establish ground-level exclusion zone with barriers and warning signs',
      '2. Access roof/anchor location following building access protocols',
      '3. Rig primary and secondary rope systems to approved anchor points',
      '4. Conduct buddy-check of all PPE and attachments before going over edge',
      '5. Descend in controlled manner maintaining three points of contact',
      '6. Position at work area and secure work positioning system',
      '7. Attach all tools and equipment with lanyards before use',
      '8. Apply cleaning solution using appropriate applicator',
      '9. Use squeegee with proper technique, collecting excess solution',
      '10. Progress systematically across facade, maintaining rope management',
      '11. Communicate with ground team regarding progress and any issues',
      '12. Ascend using approved technique when section complete',
      '13. De-rig equipment following proper procedures',
      '14. Inspect and store all equipment appropriately'
    ],
    emergencyProcedures: [
      'In case of technician suspension trauma: initiate rescue within 10 minutes',
      'Rescue team to use pre-rigged rescue system or hauling technique',
      'For medical emergency: lower casualty to safe location if possible',
      'Contact emergency services immediately for serious injuries',
      'Evacuate work area if structural concerns arise',
      'In case of severe weather: immediate controlled ascent to safety',
      'Report all incidents to supervisor and complete incident documentation'
    ],
    competencyRequirements: [
      'IRATA Level 1 minimum (Level 2+ for complex operations)',
      'Current first aid certification',
      'Site-specific induction completed',
      'Familiarity with building layout and anchor system',
      'Training in specific cleaning chemicals being used'
    ]
  },
  {
    jobType: 'dryer_vent_cleaning',
    title: 'Dryer Vent Cleaning - Rope Access',
    description: 'Safe work procedure for cleaning dryer exhaust vents on building exteriors using rope access.',
    scope: 'This procedure covers the inspection and cleaning of dryer vent terminations and accessible ductwork from building exteriors.',
    hazards: [
      'Falls from height during rope access operations',
      'Falling debris - lint, vent covers, cleaning tools',
      'Respiratory hazards - lint particles and accumulated dust',
      'Fire risk - highly flammable lint accumulation',
      'Sharp edges - metal vent covers and ductwork',
      'Biological hazards - mold, bird nests, pest infestations',
      'Weather conditions affecting safe rope access',
      'Confined space hazards if accessing ductwork'
    ],
    controlMeasures: [
      'Dual rope access system with tested anchor points',
      'Ground exclusion zone to protect from falling debris',
      'Respiratory protection when disturbing lint accumulation',
      'Anti-static tools to minimize fire ignition risk',
      'Secure containment for removed lint and debris',
      'Pest assessment before accessing vents',
      'Weather monitoring with defined work limits',
      'Proper ventilation assessment before duct entry'
    ],
    ppe: [
      'Full body harness (IRATA approved)',
      'Safety helmet with chin strap',
      'Descender and back-up device',
      'Dust mask or respirator (P2 minimum)',
      'Safety glasses with dust protection',
      'Work gloves (cut resistant)',
      'Safety footwear',
      'Coveralls or disposable suit'
    ],
    equipment: [
      'Rope access equipment (ropes, connectors, devices)',
      'Rotary brush cleaning system',
      'Vacuum system with HEPA filtration',
      'Inspection camera/borescope',
      'Hand brushes and scrapers',
      'Collection bags for debris',
      'Vent cover removal tools',
      'Replacement vent covers and fasteners',
      'Tool lanyards and equipment bags'
    ],
    preWorkChecks: [
      'Review building vent layout and access requirements',
      'Inspect rope access equipment and PPE',
      'Confirm vacuum system is operational with clean filters',
      'Verify ground exclusion zone is established',
      'Check weather conditions are within safe limits',
      'Brief team on specific vent locations and building features',
      'Confirm fire extinguisher available on site',
      'Verify communication systems are operational'
    ],
    workProcedure: [
      '1. Set up ground exclusion zone with barriers and signage',
      '2. Access anchor points and rig rope systems',
      '3. Conduct pre-descent equipment and buddy checks',
      '4. Descend to vent location maintaining rope control',
      '5. Inspect vent condition and document with photos',
      '6. Remove vent cover carefully, securing with lanyard',
      '7. Vacuum loose lint before using brushes',
      '8. Use rotary brush system to clean duct interior',
      '9. Continue vacuuming while brushing to capture debris',
      '10. Inspect cleaned duct with camera to confirm cleanliness',
      '11. Replace or reinstall vent cover securely',
      '12. Document work completed with photos',
      '13. Progress to next vent or ascend when complete',
      '14. Properly dispose of collected lint and debris'
    ],
    emergencyProcedures: [
      'Suspend work immediately if fire is detected',
      'Use fire extinguisher only if safe to do so',
      'Evacuate area and alert building management',
      'For rope access emergency: initiate rescue plan',
      'Contact emergency services for fire or medical emergency',
      'Report all incidents and near-misses'
    ],
    competencyRequirements: [
      'IRATA Level 1 minimum certification',
      'Training in dryer vent cleaning techniques',
      'Understanding of fire hazards related to lint',
      'Current first aid certification',
      'Site-specific induction'
    ]
  },
  {
    jobType: 'building_wash',
    title: 'Building Wash / Facade Cleaning - Rope Access',
    description: 'Safe work procedure for pressure washing and cleaning building exteriors using rope access techniques.',
    scope: 'This procedure covers exterior building washing including concrete, brick, metal cladding, and other facade materials using pressure washing equipment.',
    hazards: [
      'Falls from height during rope access',
      'High pressure water injection injuries',
      'Chemical exposure from cleaning agents',
      'Electrical hazards - water near electrical installations',
      'Falling debris dislodged by pressure washing',
      'Slip hazards from wet surfaces',
      'Noise exposure from pressure equipment',
      'Building material damage from incorrect pressure',
      'Weather conditions affecting operations'
    ],
    controlMeasures: [
      'Dual rope system with appropriate anchor points',
      'Pressure washer training and competency verification',
      'Maximum pressure limits set for each surface type',
      'Electrical isolation of external fittings if required',
      'Extended ground exclusion zones for water spray',
      'Chemical handling procedures and spill containment',
      'Hearing protection when operating pressure equipment',
      'Surface assessment before pressure application',
      'Weather limits for wind and electrical storms'
    ],
    ppe: [
      'Full body harness (IRATA approved)',
      'Safety helmet with face shield option',
      'Descender and back-up device',
      'Waterproof coveralls or rain suit',
      'Chemical resistant gloves',
      'Safety boots (waterproof, non-slip)',
      'Hearing protection',
      'Safety glasses or goggles',
      'Respirator if using chemical treatments'
    ],
    equipment: [
      'Rope access equipment (full set)',
      'Pressure washer with adjustable PSI',
      'Various nozzle tips (15, 25, 40 degree)',
      'Extension wands and lances',
      'Chemical injection system',
      'Approved cleaning solutions',
      'Water supply hoses and connections',
      'Spill containment materials',
      'Ground protection sheeting'
    ],
    preWorkChecks: [
      'Test pressure washer operation and adjust settings',
      'Verify water supply is adequate and connected',
      'Inspect all hoses for damage or wear',
      'Confirm chemical dilution ratios are correct',
      'Check rope access equipment condition',
      'Establish extended exclusion zone for spray',
      'Protect windows, vents, and electrical items',
      'Brief team on surface types and pressure limits',
      'Verify environmental controls in place'
    ],
    workProcedure: [
      '1. Establish ground exclusion zone (larger than normal due to spray)',
      '2. Protect adjacent areas, vehicles, and landscaping',
      '3. Set up pressure washing equipment and test operation',
      '4. Rig rope access systems at appropriate anchor points',
      '5. Conduct buddy check and descend to work area',
      '6. Begin washing from top of section, working down',
      '7. Maintain consistent distance from surface (30-60cm typical)',
      '8. Use appropriate nozzle angle for surface type',
      '9. Apply detergent if required, allow dwell time',
      '10. Rinse thoroughly from top to bottom',
      '11. Check work quality before moving to next section',
      '12. Manage hose runs to prevent tangles with ropes',
      '13. Complete section systematically before repositioning',
      '14. Shut down equipment properly when complete'
    ],
    emergencyProcedures: [
      'Stop immediately if injection injury occurs - seek medical attention',
      'Shut down equipment for any malfunction',
      'Chemical spill - contain and neutralize per SDS',
      'Initiate rope rescue for suspended casualty',
      'Evacuate area if structural concerns arise',
      'Report all incidents to supervisor'
    ],
    competencyRequirements: [
      'IRATA Level 1 minimum (Level 2 for complex facades)',
      'Pressure washer operation training',
      'Chemical handling certification',
      'Current first aid certification',
      'Site-specific induction'
    ]
  },
  {
    jobType: 'in_suite_dryer_vent_cleaning',
    title: 'In-Suite Dryer Vent Cleaning',
    description: 'Safe work procedure for cleaning dryer vents from inside residential units, working with building residents.',
    scope: 'This procedure covers interior access to dryer vents within residential units, including duct cleaning from the dryer connection to the exterior termination.',
    hazards: [
      'Electrical hazards - working near appliances',
      'Fire risk - accumulated lint in ductwork',
      'Respiratory hazards - dust and lint particles',
      'Manual handling - moving appliances',
      'Slip/trip hazards in residential spaces',
      'Working in occupied premises - personal security',
      'Damage to resident property',
      'Biological hazards - mold or pest presence'
    ],
    controlMeasures: [
      'Disconnect dryer from power before work begins',
      'Use anti-static tools and equipment',
      'Respiratory protection during cleaning',
      'Two-person team for appliance handling',
      'Protective floor coverings in work area',
      'Professional conduct and identification',
      'Document pre-existing conditions',
      'Pest assessment before disturbing ducts'
    ],
    ppe: [
      'Safety footwear (non-marking soles)',
      'Dust mask or respirator (P2)',
      'Safety glasses',
      'Work gloves',
      'Knee pads for floor work',
      'Company uniform and ID badge'
    ],
    equipment: [
      'Rotary brush cleaning system',
      'Vacuum with HEPA filter',
      'Inspection camera',
      'Hand brushes and scrapers',
      'Lint collection bags',
      'Floor protection sheets',
      'Basic hand tools for vent access',
      'Appliance moving equipment if needed',
      'Cleaning supplies for spills'
    ],
    preWorkChecks: [
      'Confirm resident access and appointment time',
      'Verify unit location and access requirements',
      'Check equipment is clean and operational',
      'Review building policies for contractor access',
      'Ensure vehicle parking is arranged',
      'Confirm team has required identification',
      'Check emergency contact numbers available',
      'Review any resident special requirements'
    ],
    workProcedure: [
      '1. Introduce yourself and show identification to resident',
      '2. Explain work to be performed and estimated duration',
      '3. Lay protective covering on floor in work area',
      '4. Photograph existing conditions before starting',
      '5. Disconnect dryer from power (unplug or isolate)',
      '6. Carefully move dryer away from wall if needed',
      '7. Disconnect duct from dryer outlet',
      '8. Inspect duct condition and document any damage',
      '9. Vacuum loose lint from accessible areas',
      '10. Use rotary brush system through duct length',
      '11. Vacuum while brushing to capture all debris',
      '12. Inspect with camera to confirm cleanliness',
      '13. Reconnect duct ensuring secure, sealed connection',
      '14. Move dryer back into position',
      '15. Reconnect power and test operation briefly',
      '16. Clean up work area and remove all debris',
      '17. Have resident confirm satisfactory completion'
    ],
    emergencyProcedures: [
      'If fire detected: evacuate unit immediately, call 911',
      'For electrical shock: do not touch victim, isolate power, call for help',
      'If pest infestation found: stop work, notify resident and supervisor',
      'For injury: administer first aid, seek medical attention as needed',
      'Report all incidents to supervisor and complete documentation'
    ],
    competencyRequirements: [
      'Training in dryer vent cleaning procedures',
      'Customer service skills',
      'Basic electrical safety awareness',
      'Manual handling training',
      'Company policies and procedures training'
    ]
  },
  {
    jobType: 'parkade_pressure_cleaning',
    title: 'Parkade / Parking Garage Pressure Cleaning',
    description: 'Safe work procedure for pressure cleaning parking structures including floors, walls, and drainage systems.',
    scope: 'This procedure covers pressure washing of parkade floors, walls, columns, and drainage infrastructure in underground or multi-level parking structures.',
    hazards: [
      'Vehicle traffic in active parking areas',
      'Slip hazards on wet concrete surfaces',
      'High pressure water injection injuries',
      'Chemical exposure from degreasers and cleaners',
      'Confined space conditions - limited ventilation',
      'Carbon monoxide from vehicle exhaust',
      'Electrical hazards from standing water',
      'Noise exposure in enclosed spaces',
      'Poor lighting in underground areas'
    ],
    controlMeasures: [
      'Traffic management plan with barriers and signage',
      'Section closure during cleaning operations',
      'Non-slip footwear and controlled work pace',
      'Pressure washer training and distance controls',
      'Ventilation assessment and CO monitoring',
      'GFCI protection on all electrical equipment',
      'Hearing protection mandatory',
      'Supplementary lighting if needed',
      'Spill containment for chemical use'
    ],
    ppe: [
      'Safety helmet',
      'High visibility vest',
      'Hearing protection',
      'Safety glasses or face shield',
      'Waterproof coveralls',
      'Chemical resistant gloves',
      'Non-slip safety boots (steel toe)',
      'Respirator if using chemicals in enclosed area'
    ],
    equipment: [
      'Commercial pressure washer',
      'Surface cleaner attachment for floors',
      'Various spray nozzles',
      'Water reclamation/vacuum system if required',
      'Degreaser and cleaning chemicals',
      'Traffic cones and barrier tape',
      'Warning signs (multiple languages)',
      'Lighting equipment if needed',
      'CO monitor for enclosed areas',
      'Spill kit'
    ],
    preWorkChecks: [
      'Coordinate with building management for section closures',
      'Review traffic management plan with team',
      'Test pressure washer and all attachments',
      'Verify chemical supplies and dilutions',
      'Check CO monitor is calibrated',
      'Confirm drainage is clear and functional',
      'Assess ventilation in work area',
      'Establish equipment staging area',
      'Brief team on communication signals'
    ],
    workProcedure: [
      '1. Set up traffic barriers and warning signs',
      '2. Notify building management work is commencing',
      '3. Set up pressure washing equipment in safe location',
      '4. Begin at highest point, working toward drains',
      '5. Apply degreaser to oil-stained areas, allow dwell time',
      '6. Use surface cleaner for large floor areas',
      '7. Detail walls and columns with appropriate wand',
      '8. Flush debris toward drains continuously',
      '9. Monitor drainage to prevent flooding',
      '10. Check air quality regularly with CO monitor',
      '11. Complete each section before moving barriers',
      '12. Allow adequate drying time before reopening',
      '13. Final inspection for missed areas',
      '14. Remove all equipment and barriers',
      '15. Report any damage or issues to management'
    ],
    emergencyProcedures: [
      'Vehicle incident: stop work, ensure scene safety, call emergency services',
      'High pressure injection injury: seek immediate medical attention',
      'CO alarm: evacuate area immediately, ventilate space',
      'Chemical spill: contain with spill kit, ventilate area',
      'Electrical issue: shut down equipment, report to electrician',
      'Report all incidents and near-misses'
    ],
    competencyRequirements: [
      'Pressure washer operation training',
      'Traffic management awareness',
      'Chemical handling certification',
      'First aid certification',
      'Site-specific induction'
    ]
  },
  {
    jobType: 'ground_window_cleaning',
    title: 'Ground Level Window Cleaning',
    description: 'Safe work procedure for cleaning windows at ground level and low heights using ladders or water-fed poles.',
    scope: 'This procedure covers window cleaning at ground level and heights accessible by ladder (up to 6m) or water-fed pole systems.',
    hazards: [
      'Falls from ladders',
      'Struck by ladder during setup/movement',
      'Manual handling - carrying equipment',
      'Traffic hazards when working near roadways',
      'Chemical exposure from cleaning solutions',
      'Slip hazards on wet surfaces',
      'Public interaction - pedestrian traffic',
      'Cuts from damaged glass or frames',
      'Weather conditions'
    ],
    controlMeasures: [
      'Ladder inspection before each use',
      'Three points of contact maintained on ladders',
      'Ladder footed by second person or secured',
      'Traffic cones and barriers near roadways',
      'Use of eco-friendly cleaning solutions',
      'Wet floor signs around work area',
      'Polite engagement with public, maintain clearance',
      'Gloves when handling damaged elements',
      'Weather assessment before starting work'
    ],
    ppe: [
      'Safety footwear with non-slip soles',
      'Work gloves',
      'Safety glasses when required',
      'High visibility vest near traffic',
      'Sun protection (hat, sunscreen) in summer',
      'Wet weather gear as needed'
    ],
    equipment: [
      'Extension ladder (inspected, rated for use)',
      'Water-fed pole system (if applicable)',
      'Squeegees (various sizes)',
      'Scrubbers and applicators',
      'Bucket with secure carrying handle',
      'Window cleaning solution',
      'Microfiber cloths',
      'Scrapers for stubborn deposits',
      'Tool belt or apron',
      'Drop sheets for interior work'
    ],
    preWorkChecks: [
      'Inspect ladder for damage or defects',
      'Check all cleaning equipment condition',
      'Verify solution is properly diluted',
      'Assess ground conditions for ladder setup',
      'Identify any access restrictions',
      'Note any damaged windows to report',
      'Check weather conditions',
      'Plan work sequence for efficiency',
      'Confirm vehicle parking location'
    ],
    workProcedure: [
      '1. Assess work area and identify any hazards',
      '2. Set up ladder on firm, level ground at correct angle',
      '3. Place wet floor signs and barriers as needed',
      '4. Begin cleaning at highest accessible point',
      '5. Wet window with solution using applicator',
      '6. Scrub to remove dirt, pay attention to edges',
      '7. Squeegee from top to bottom in overlapping strokes',
      '8. Wipe edges and sills with cloth',
      '9. Descend ladder safely before moving to next window',
      '10. Reposition ladder ensuring stable placement',
      '11. Continue systematic progression through all windows',
      '12. For water-fed poles: rinse from top, allow to dry',
      '13. Final check of all completed windows',
      '14. Pack equipment and leave site clean'
    ],
    emergencyProcedures: [
      'Fall from ladder: do not move casualty if spinal injury suspected, call 911',
      'Cut injury: apply pressure, first aid, seek medical attention if serious',
      'Chemical in eyes: flush with clean water for 15+ minutes, seek medical attention',
      'Traffic incident: ensure safety, call emergency services',
      'Report all incidents to supervisor'
    ],
    competencyRequirements: [
      'Ladder safety training',
      'Window cleaning technique training',
      'Manual handling training',
      'First aid awareness',
      'Water-fed pole operation (if applicable)'
    ]
  },
  {
    jobType: 'general_pressure_washing',
    title: 'General Pressure Washing',
    description: 'Safe work procedure for pressure washing various surfaces including sidewalks, driveways, patios, and exterior surfaces.',
    scope: 'This procedure covers ground-level pressure washing operations on horizontal and vertical surfaces at accessible heights.',
    hazards: [
      'High pressure water injection injuries',
      'Slip hazards on wet surfaces',
      'Flying debris dislodged by water pressure',
      'Electrical hazards near water',
      'Chemical exposure from cleaning agents',
      'Noise exposure from equipment',
      'Manual handling of heavy equipment',
      'Surface damage from incorrect settings',
      'Public safety - spray and debris'
    ],
    controlMeasures: [
      'Maintain safe distance from spray nozzle (30cm minimum)',
      'Never point wand at people or animals',
      'Wear non-slip footwear, maintain stable stance',
      'Safety glasses and face shield for close work',
      'GFCI protection on all electrical connections',
      'Chemical handling per safety data sheets',
      'Hearing protection during operation',
      'Correct lifting technique for equipment',
      'Test pressure on inconspicuous area first',
      'Barrier and signage for public areas'
    ],
    ppe: [
      'Safety glasses or face shield',
      'Hearing protection',
      'Non-slip safety boots (waterproof)',
      'Waterproof coveralls or rain suit',
      'Chemical resistant gloves',
      'High visibility vest in public areas'
    ],
    equipment: [
      'Pressure washer (gas or electric)',
      'Various nozzle tips (0-65 degree)',
      'Surface cleaner attachment',
      'Extension wands',
      'Trigger gun with safety lock',
      'High pressure hoses',
      'Chemical injection system',
      'Approved cleaning solutions',
      'Warning signs and barriers',
      'Water supply connections'
    ],
    preWorkChecks: [
      'Inspect pressure washer for damage or leaks',
      'Check all hose connections are secure',
      'Verify fuel/oil levels for gas units',
      'Test GFCI protection on electric units',
      'Inspect nozzles for wear or damage',
      'Confirm chemical dilution ratios',
      'Assess work area for hazards',
      'Protect adjacent areas and landscaping',
      'Brief anyone in area about work being done'
    ],
    workProcedure: [
      '1. Set up barriers and warning signs around work area',
      '2. Connect water supply and test flow',
      '3. Start pressure washer following manufacturer procedures',
      '4. Select appropriate nozzle for surface type',
      '5. Test pressure on small inconspicuous area',
      '6. Adjust pressure/distance as needed for surface',
      '7. Work systematically in overlapping passes',
      '8. Apply detergent from bottom up if using',
      '9. Allow dwell time for detergent to work',
      '10. Rinse from top down thoroughly',
      '11. Direct water toward drains or collection',
      '12. Check work quality before moving on',
      '13. Shut down equipment per procedures',
      '14. Drain hoses and store equipment properly'
    ],
    emergencyProcedures: [
      'High pressure injection injury: seek IMMEDIATE medical attention - life threatening',
      'Electrical shock: do not touch victim if still in contact, isolate power, call 911',
      'Chemical spill: contain, refer to SDS for cleanup procedures',
      'Equipment malfunction: shut down immediately, do not attempt repairs',
      'Public injury: provide first aid, call emergency services, report to supervisor'
    ],
    competencyRequirements: [
      'Pressure washer operation training',
      'Chemical handling awareness',
      'First aid certification',
      'Equipment maintenance basics',
      'Customer service skills'
    ]
  }
];

// Safe Work Practice Template Structure
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

// Helper to get topics from a practice template
const getPracticeTopics = (practice: SafeWorkPractice): string[] => {
  return practice.keyPrinciples.slice(0, 5);
};

// Helper to generate content from a practice template
const getPracticeContent = (practice: SafeWorkPractice): string => {
  let content = `KEY PRINCIPLES:\n`;
  practice.keyPrinciples.forEach(p => content += `- ${p}\n`);
  content += `\nREQUIREMENTS:\n`;
  practice.requirements.forEach(r => content += `- ${r}\n`);
  content += `\nDO:\n`;
  practice.doList.forEach(d => content += `- ${d}\n`);
  content += `\nDON'T:\n`;
  practice.dontList.forEach(d => content += `- ${d}\n`);
  content += `\nEMERGENCY ACTIONS:\n`;
  practice.emergencyActions.forEach(e => content += `- ${e}\n`);
  return content;
};

// Safe Work Practice Templates
const SAFE_WORK_PRACTICES: SafeWorkPractice[] = [
  {
    id: 'general_ppe',
    title: 'Personal Protective Equipment (PPE)',
    description: 'Guidelines for proper selection, use, and maintenance of personal protective equipment in rope access operations.',
    category: 'General Safety',
    icon: Shield,
    keyPrinciples: [
      'PPE is the last line of defense - engineering controls come first',
      'All PPE must be inspected before each use',
      'PPE must be appropriate for the specific hazard',
      'Damaged or expired PPE must never be used',
      'PPE must fit correctly to provide protection'
    ],
    requirements: [
      'Full body harness inspected within 12 months',
      'Hard hat with chin strap rated to EN 397',
      'Safety glasses or goggles as required',
      'Appropriate gloves for the task',
      'Safety footwear with non-slip soles',
      'High visibility clothing when near traffic',
      'Hearing protection when noise exceeds 85dB'
    ],
    doList: [
      'Inspect all PPE before each use',
      'Store PPE properly when not in use',
      'Report any damage immediately',
      'Replace PPE according to manufacturer guidelines',
      'Ensure proper fit of all equipment',
      'Keep PPE clean and maintained'
    ],
    dontList: [
      'Never use damaged or expired PPE',
      'Never modify PPE from original design',
      'Never share personal PPE without sanitization',
      'Never use PPE for purposes other than intended',
      'Never remove PPE while in hazardous areas'
    ],
    emergencyActions: [
      'If PPE fails during work, immediately move to safe position',
      'Report all PPE failures to supervisor',
      'Document equipment failures for investigation',
      'Do not continue work with compromised PPE'
    ]
  },
  {
    id: 'fall_protection',
    title: 'Fall Protection',
    description: 'Essential practices for preventing falls from height during rope access operations.',
    category: 'Working at Heights',
    icon: AlertTriangle,
    keyPrinciples: [
      'Falls from height are the leading cause of fatalities in construction',
      'Dual rope systems provide redundancy for safety',
      'Anchor points must be independently tested and certified',
      '100% tie-off at all times when at height',
      'Fall arrest systems must limit fall distance'
    ],
    requirements: [
      'Minimum IRATA Level 1 certification',
      'Dual rope system with independent anchors',
      'Anchor points rated to minimum 15kN',
      'Fall arrester device properly engaged at all times',
      'Work positioning lanyard when hands-free work needed',
      'Edge protection for rope at sharp edges'
    ],
    doList: [
      'Verify anchor point integrity before use',
      'Maintain 100% tie-off at all times at height',
      'Use backup device in addition to descender',
      'Keep work area clear of trip hazards',
      'Communicate clearly with team members',
      'Plan escape routes before starting work'
    ],
    dontList: [
      'Never work at height alone',
      'Never trust unverified anchor points',
      'Never remove fall protection while at height',
      'Never exceed equipment weight limits',
      'Never work in severe weather conditions'
    ],
    emergencyActions: [
      'In case of fall arrest, immediately call for rescue',
      'Suspended worker rescue must occur within 15 minutes',
      'Activate emergency services if rescue not possible',
      'Document all fall incidents for investigation'
    ]
  },
  {
    id: 'manual_handling',
    title: 'Manual Handling',
    description: 'Safe practices for lifting, carrying, and moving materials during work operations.',
    category: 'Ergonomics',
    icon: Package,
    keyPrinciples: [
      'Back injuries are often preventable with proper technique',
      'Use mechanical aids whenever possible',
      'Team lifts for loads over 25kg',
      'Plan the lift before starting',
      'Never twist while lifting'
    ],
    requirements: [
      'Risk assessment before manual handling tasks',
      'Mechanical aids available where practical',
      'Clear pathways for carrying materials',
      'Appropriate footwear for grip and stability',
      'Training in proper lifting techniques'
    ],
    doList: [
      'Assess the load weight before lifting',
      'Keep loads close to your body',
      'Bend at the knees, not the waist',
      'Use leg muscles to lift, not back',
      'Ask for help with heavy or awkward loads',
      'Take rest breaks during repetitive handling'
    ],
    dontList: [
      'Never lift loads beyond your capacity',
      'Never twist your body while carrying loads',
      'Never carry loads that block your vision',
      'Never rush when handling materials',
      'Never ignore pain or discomfort'
    ],
    emergencyActions: [
      'Stop immediately if you feel pain',
      'Report all injuries no matter how minor',
      'Seek medical attention for persistent pain',
      'Document the incident and contributing factors'
    ]
  },
  {
    id: 'heat_cold_stress',
    title: 'Heat and Cold Stress Prevention',
    description: 'Managing environmental temperature extremes to protect worker health and safety.',
    category: 'Environmental',
    icon: Calendar,
    keyPrinciples: [
      'Both heat and cold can cause serious medical emergencies',
      'Acclimatization takes time - build up exposure gradually',
      'Hydration is critical in both hot and cold environments',
      'Know the signs of heat exhaustion and hypothermia',
      'Work schedules may need adjustment for extreme temperatures'
    ],
    requirements: [
      'Access to shade or shelter from elements',
      'Adequate hydration supplies available',
      'Appropriate clothing for conditions',
      'Work/rest cycles in extreme temperatures',
      'First aid trained personnel on site'
    ],
    doList: [
      'Monitor weather conditions throughout the day',
      'Take regular hydration breaks',
      'Wear appropriate clothing layers',
      'Watch coworkers for signs of distress',
      'Schedule heavy work for cooler periods',
      'Acclimatize gradually to temperature changes'
    ],
    dontList: [
      'Never ignore signs of heat exhaustion or hypothermia',
      'Never continue working if feeling unwell',
      'Never restrict water intake',
      'Never remove safety PPE due to heat discomfort',
      'Never underestimate wind chill effects'
    ],
    emergencyActions: [
      'Heat exhaustion: Move to cool area, hydrate, cool with water',
      'Heat stroke: Call emergency services, cool victim rapidly',
      'Hypothermia: Move to warm shelter, remove wet clothing, warm gradually',
      'Frostbite: Warm affected area gradually, seek medical attention'
    ]
  },
  {
    id: 'chemical_safety',
    title: 'Chemical Safety',
    description: 'Safe handling, storage, and use of cleaning chemicals and hazardous substances.',
    category: 'Hazardous Materials',
    icon: AlertCircle,
    keyPrinciples: [
      'All chemicals can be hazardous if misused',
      'Safety Data Sheets (SDS) contain critical safety information',
      'Never mix chemicals unless specifically authorized',
      'Proper ventilation is essential when using chemicals',
      'Storage and disposal must follow regulations'
    ],
    requirements: [
      'SDS available for all chemicals on site',
      'Appropriate PPE for chemicals being used',
      'Chemical-resistant gloves and eye protection',
      'Ventilation or respiratory protection as needed',
      'Spill containment materials available'
    ],
    doList: [
      'Read and understand SDS before using chemicals',
      'Wear required PPE at all times',
      'Use chemicals only for intended purposes',
      'Store chemicals in original containers',
      'Dispose of chemicals according to regulations',
      'Wash hands thoroughly after chemical contact'
    ],
    dontList: [
      'Never mix different chemicals together',
      'Never eat or drink near chemicals',
      'Never transfer chemicals to unmarked containers',
      'Never use chemicals in confined spaces without ventilation',
      'Never ignore chemical exposure symptoms'
    ],
    emergencyActions: [
      'Eye contact: Flush with water for 15 minutes, seek medical help',
      'Skin contact: Remove contaminated clothing, wash affected area',
      'Inhalation: Move to fresh air, seek medical attention if symptomatic',
      'Spill: Contain using appropriate materials, follow SDS procedures'
    ]
  },
  {
    id: 'tool_safety',
    title: 'Tool and Equipment Safety',
    description: 'Safe practices for using hand tools, power tools, and equipment at height.',
    category: 'Equipment',
    icon: Package,
    keyPrinciples: [
      'Tools can become deadly projectiles if dropped from height',
      'All tools must be tethered when working at height',
      'Power tools require additional safety precautions',
      'Proper tool selection prevents injuries',
      'Regular maintenance keeps tools safe to use'
    ],
    requirements: [
      'Tool lanyards for all equipment at height',
      'Exclusion zones below work areas',
      'Tools inspected before use',
      'Power tools with safety guards in place',
      'Appropriate tool for the task'
    ],
    doList: [
      'Tether all tools when working at height',
      'Inspect tools before each use',
      'Use the right tool for the job',
      'Keep cutting tools sharp',
      'Store tools properly when not in use',
      'Report damaged tools immediately'
    ],
    dontList: [
      'Never use damaged tools',
      'Never remove safety guards from power tools',
      'Never carry tools in pockets at height',
      'Never throw tools between workers',
      'Never leave tools unattended at height'
    ],
    emergencyActions: [
      'Dropped object: Alert workers below immediately',
      'Tool injury: Apply first aid, seek medical attention',
      'Power tool malfunction: Stop immediately, isolate power',
      'Report all near-misses involving tools'
    ]
  },
  {
    id: 'emergency_response',
    title: 'Emergency Response',
    description: 'Procedures for responding to emergencies during rope access operations.',
    category: 'Emergency',
    icon: AlertTriangle,
    keyPrinciples: [
      'Every site must have an emergency response plan',
      'All workers must know the rescue procedure',
      'Time is critical in suspended worker emergencies',
      'Communication is essential during emergencies',
      'Regular drills maintain emergency readiness'
    ],
    requirements: [
      'Site-specific emergency plan in place',
      'Rescue equipment readily accessible',
      'First aid kit on site',
      'Emergency contact numbers posted',
      'Communication devices operational',
      'At least one rescue-trained person on site'
    ],
    doList: [
      'Know the emergency plan before starting work',
      'Identify assembly points and escape routes',
      'Keep emergency equipment accessible',
      'Practice rescue procedures regularly',
      'Report all incidents to supervisor',
      'Maintain calm and follow procedures'
    ],
    dontList: [
      'Never start work without knowing emergency procedures',
      'Never block emergency equipment access',
      'Never ignore alarms or emergency signals',
      'Never attempt rescue without proper training',
      'Never leave the scene of an incident without authorization'
    ],
    emergencyActions: [
      'Raise the alarm immediately',
      'Call emergency services if required',
      'Begin rescue procedures if trained and safe to do so',
      'Administer first aid if qualified',
      'Secure the scene for investigators',
      'Document the incident as soon as practical'
    ]
  },
  {
    id: 'communication_protocols',
    title: 'Communication Protocols',
    description: 'Effective communication practices for safe rope access operations.',
    category: 'Operations',
    icon: Users,
    keyPrinciples: [
      'Clear communication prevents accidents',
      'Standardized signals ensure understanding',
      'Two-way radios are essential for rope access',
      'Never assume your message was received',
      'Language barriers must be addressed'
    ],
    requirements: [
      'Two-way radios for all rope access personnel',
      'Backup communication method available',
      'Standardized hand signals known by all',
      'Communication check before work starts',
      'Clear line of sight or radio contact maintained'
    ],
    doList: [
      'Test communication equipment before use',
      'Use clear, concise language',
      'Confirm receipt of critical messages',
      'Use standardized terminology',
      'Keep radio channels clear for safety communication',
      'Report communication failures immediately'
    ],
    dontList: [
      'Never assume your message was understood',
      'Never use personal phones for critical communication',
      'Never ignore calls from team members',
      'Never use unfamiliar signals or codes',
      'Never continue work if communication is lost'
    ],
    emergencyActions: [
      'Lost communication: Return to safe position immediately',
      'Emergency signal: Stop work and respond according to plan',
      'Equipment failure: Use backup communication method',
      'If no communication possible: Evacuate to assembly point'
    ]
  },
  {
    id: 'fatigue_management',
    title: 'Fatigue and Wellbeing',
    description: 'Managing fatigue and maintaining physical and mental wellbeing for safe work.',
    category: 'Health',
    icon: Clock,
    keyPrinciples: [
      'Fatigue significantly increases risk of accidents',
      'Physical and mental health affect work performance',
      'Rest breaks are essential for safety',
      'Personal problems can impact work safety',
      'Speak up if you are not fit for work'
    ],
    requirements: [
      'Adequate rest before work shifts',
      'Regular breaks during work',
      'Access to drinking water and rest facilities',
      'Reasonable work hours and schedules',
      'Fitness for duty assessment if concerns arise'
    ],
    doList: [
      'Get adequate sleep before work',
      'Take scheduled rest breaks',
      'Stay hydrated throughout the day',
      'Report if feeling unwell or fatigued',
      'Support colleagues who appear fatigued',
      'Maintain work-life balance'
    ],
    dontList: [
      'Never work while impaired by drugs or alcohol',
      'Never hide fatigue or illness',
      'Never skip breaks when doing demanding work',
      'Never pressure colleagues to work when unfit',
      'Never ignore signs of fatigue in yourself or others'
    ],
    emergencyActions: [
      'If severely fatigued: Stop work immediately',
      'If colleague appears unwell: Notify supervisor',
      'Medical emergency: Call for first aid assistance',
      'Mental health crisis: Access employee support services'
    ]
  },
  {
    id: 'housekeeping',
    title: 'Worksite Housekeeping',
    description: 'Maintaining clean and organized work areas for safety and efficiency.',
    category: 'General Safety',
    icon: FolderOpen,
    keyPrinciples: [
      'Good housekeeping prevents slips, trips, and falls',
      'Organized work areas improve efficiency',
      'Everyone is responsible for housekeeping',
      'Clean up as you go, not just at the end',
      'Proper storage prevents damage and injuries'
    ],
    requirements: [
      'Designated storage areas for equipment',
      'Waste disposal containers available',
      'Clear walkways and access routes',
      'Adequate lighting in work areas',
      'Spill cleanup materials available'
    ],
    doList: [
      'Keep work areas clean and organized',
      'Store tools and equipment properly',
      'Dispose of waste in designated containers',
      'Clean up spills immediately',
      'Maintain clear access and egress routes',
      'Report housekeeping hazards'
    ],
    dontList: [
      'Never leave tools or materials on walkways',
      'Never leave extension cords across paths',
      'Never pile materials unsafely',
      'Never ignore slip or trip hazards',
      'Never leave rubbish on site'
    ],
    emergencyActions: [
      'Trip hazard causing injury: Provide first aid, report incident',
      'Spill on work surface: Clean immediately, mark area until dry',
      'Cluttered emergency route: Clear immediately, report to supervisor'
    ]
  }
];

// Generate PDF for Safe Work Practice with translation support
const generateSafeWorkPracticePDF = (
  practice: SafeWorkPractice, 
  companyName?: string, 
  translations?: {
    header: string;
    category: string;
    keyPrinciples: string;
    requirements: string;
    do: string;
    doNot: string;
    emergencyActions: string;
    pageOf: (page: number, total: number) => string;
    generated: string;
  }
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = 20;

  // Default translations for fallback
  const t = translations || {
    header: 'SAFE WORK PRACTICE',
    category: 'Category',
    keyPrinciples: 'Key Principles',
    requirements: 'Requirements',
    do: 'Do',
    doNot: 'Do Not',
    emergencyActions: 'Emergency Actions',
    pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
    generated: 'Generated'
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addSection = (title: string, items: string[], bulletStyle: boolean = true) => {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 34, 34);
    doc.text(title, margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    items.forEach((item, index) => {
      const prefix = bulletStyle ? '  - ' : `  ${index + 1}. `;
      const lines = doc.splitTextToSize(prefix + item, contentWidth - 10);
      checkPageBreak(lines.length * 5 + 2);
      lines.forEach((line: string) => {
        doc.text(line, margin + 5, yPos);
        yPos += 5;
      });
      yPos += 1;
    });
    yPos += 5;
  };

  // Header
  doc.setFillColor(59, 130, 246); // Blue for practices
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company name if provided
  if (companyName) {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName.toUpperCase(), pageWidth / 2, 10, { align: 'center' });
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(t.header, pageWidth / 2, 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(practice.title, pageWidth / 2, 32, { align: 'center' });

  yPos = 50;

  // Category badge
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`${t.category}: ${practice.category}`, margin, yPos);
  yPos += 10;

  // Description
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(practice.description, contentWidth);
  descLines.forEach((line: string) => {
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 10;

  // Sections
  addSection(t.keyPrinciples, practice.keyPrinciples);
  addSection(t.requirements, practice.requirements);
  addSection(t.do, practice.doList);
  addSection(t.doNot, practice.dontList);
  addSection(t.emergencyActions, practice.emergencyActions);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(t.pageOf(i, totalPages), pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`${t.generated}: ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
  }

  // Download
  const fileName = `SWPractice_${practice.id}.pdf`;
  doc.save(fileName);
};

// Generate PDF for Safe Work Procedure with translation support
const generateSafeWorkProcedurePDF = (
  procedure: SafeWorkProcedure, 
  companyName?: string,
  translations?: {
    header: string;
    scope: string;
    hazardsIdentified: string;
    controlMeasures: string;
    ppe: string;
    equipmentRequired: string;
    preWorkChecks: string;
    workProcedure: string;
    emergencyProcedures: string;
    competencyRequirements: string;
    pageOf: (page: number, total: number) => string;
    generated: string;
  }
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = 20;

  // Default translations for fallback
  const t = translations || {
    header: 'SAFE WORK PROCEDURE',
    scope: 'Scope',
    hazardsIdentified: 'Hazards Identified',
    controlMeasures: 'Control Measures',
    ppe: 'Personal Protective Equipment (PPE)',
    equipmentRequired: 'Equipment Required',
    preWorkChecks: 'Pre-Work Checks',
    workProcedure: 'Work Procedure',
    emergencyProcedures: 'Emergency Procedures',
    competencyRequirements: 'Competency Requirements',
    pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
    generated: 'Generated'
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addSection = (title: string, items: string[], bulletStyle: boolean = true) => {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 34, 34);
    doc.text(title, margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    items.forEach((item, index) => {
      const prefix = bulletStyle ? '  - ' : `  ${index + 1}. `;
      const lines = doc.splitTextToSize(prefix + item, contentWidth - 10);
      checkPageBreak(lines.length * 5 + 2);
      lines.forEach((line: string) => {
        doc.text(line, margin + 5, yPos);
        yPos += 5;
      });
      yPos += 1;
    });
    yPos += 5;
  };

  // Header
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company name if provided
  if (companyName) {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName.toUpperCase(), pageWidth / 2, 10, { align: 'center' });
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(t.header, pageWidth / 2, 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(procedure.title, pageWidth / 2, 32, { align: 'center' });

  yPos = 50;

  // Description
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(procedure.description, contentWidth);
  descLines.forEach((line: string) => {
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 5;

  // Scope
  checkPageBreak(20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 34, 34);
  doc.text(t.scope, margin, yPos);
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const scopeLines = doc.splitTextToSize(procedure.scope, contentWidth);
  scopeLines.forEach((line: string) => {
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 8;

  // Sections
  addSection(t.hazardsIdentified, procedure.hazards);
  addSection(t.controlMeasures, procedure.controlMeasures);
  addSection(t.ppe, procedure.ppe);
  addSection(t.equipmentRequired, procedure.equipment);
  addSection(t.preWorkChecks, procedure.preWorkChecks);
  addSection(t.workProcedure, procedure.workProcedure, false);
  addSection(t.emergencyProcedures, procedure.emergencyProcedures);
  addSection(t.competencyRequirements, procedure.competencyRequirements);

  // Footer on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(t.pageOf(i, totalPages), pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`${t.generated}: ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
  }

  // Download
  const fileName = `SWP_${procedure.jobType.replace(/_/g, '_')}.pdf`;
  doc.save(fileName);
};

interface DateGroupedItem {
  year: number;
  month: number;
  monthName: string;
  day: number;
  date: string;
  items: any[];
}

interface YearGroup {
  year: number;
  months: MonthGroup[];
  totalCount: number;
}

interface MonthGroup {
  month: number;
  monthName: string;
  days: DayGroup[];
  totalCount: number;
}

interface DayGroup {
  day: number;
  date: string;
  formattedDate: string;
  items: any[];
}

function groupDocumentsByDate<T>(
  items: T[],
  getDateFn: (item: T) => string | Date
): YearGroup[] {
  const grouped = new Map<number, Map<number, Map<number, T[]>>>();
  
  items.forEach(item => {
    const dateValue = getDateFn(item);
    let year: number, month: number, day: number;
    
    if (typeof dateValue === 'string') {
      const dateStr = dateValue.split('T')[0];
      const [y, m, d] = dateStr.split('-').map(Number);
      if (isNaN(y) || isNaN(m) || isNaN(d)) return;
      year = y;
      month = m - 1;
      day = d;
    } else {
      if (isNaN(dateValue.getTime())) return;
      year = dateValue.getFullYear();
      month = dateValue.getMonth();
      day = dateValue.getDate();
    }
    
    if (!grouped.has(year)) {
      grouped.set(year, new Map());
    }
    const yearMap = grouped.get(year)!;
    
    if (!yearMap.has(month)) {
      yearMap.set(month, new Map());
    }
    const monthMap = yearMap.get(month)!;
    
    if (!monthMap.has(day)) {
      monthMap.set(day, []);
    }
    monthMap.get(day)!.push(item);
  });
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const result: YearGroup[] = [];
  
  const sortedYears = Array.from(grouped.keys()).sort((a, b) => b - a);
  
  for (const year of sortedYears) {
    const yearMap = grouped.get(year)!;
    const months: MonthGroup[] = [];
    
    const sortedMonths = Array.from(yearMap.keys()).sort((a, b) => b - a);
    
    for (const month of sortedMonths) {
      const monthMap = yearMap.get(month)!;
      const days: DayGroup[] = [];
      
      const sortedDays = Array.from(monthMap.keys()).sort((a, b) => b - a);
      
      for (const day of sortedDays) {
        const dayItems = monthMap.get(day)!;
        const paddedMonth = String(month + 1).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');
        const localDateStr = `${year}-${paddedMonth}-${paddedDay}`;
        
        days.push({
          day,
          date: localDateStr,
          formattedDate: new Date(year, month, day).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          items: dayItems
        });
      }
      
      months.push({
        month,
        monthName: monthNames[month],
        days,
        totalCount: days.reduce((sum, d) => sum + d.items.length, 0)
      });
    }
    
    result.push({
      year,
      months,
      totalCount: months.reduce((sum, m) => sum + m.totalCount, 0)
    });
  }
  
  return result;
}

// Date range export state type
interface DateRangeState {
  from: Date | undefined;
  to: Date | undefined;
  isExporting: boolean;
}

// DateRangeExport component for each document section
function DateRangeExport({
  documents,
  getDateFn,
  generatePdf,
  documentType,
  colorClass,
}: {
  documents: any[];
  getDateFn: (item: any) => string | Date;
  generatePdf: (item: any) => Promise<{ blob: Blob; filename: string }>;
  documentType: string;
  colorClass: string;
}) {
  const [dateRange, setDateRange] = useState<DateRangeState>({
    from: undefined,
    to: undefined,
    isExporting: false,
  });
  const { toast } = useToast();

  const getDocumentsInRange = () => {
    if (!dateRange.from || !dateRange.to) return [];
    
    return documents.filter((doc) => {
      const dateValue = getDateFn(doc);
      let docDate: Date;
      
      if (typeof dateValue === 'string') {
        // Use parseLocalDate for string dates to handle timezone correctly
        const parsed = parseLocalDate(dateValue);
        if (!parsed || isNaN(parsed.getTime())) return false;
        docDate = parsed;
      } else {
        // For Date objects, clone and use local date components
        docDate = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
      }
      
      // Set time to start of day for comparison
      const fromDate = new Date(dateRange.from!);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(dateRange.to!);
      toDate.setHours(23, 59, 59, 999);
      docDate.setHours(12, 0, 0, 0);
      
      return docDate >= fromDate && docDate <= toDate;
    });
  };

  const handleExport = async () => {
    const docsInRange = getDocumentsInRange();
    
    if (docsInRange.length === 0) {
      toast({
        title: "No documents found",
        description: "There are no documents in the selected date range.",
        variant: "destructive",
      });
      return;
    }

    setDateRange(prev => ({ ...prev, isExporting: true }));

    try {
      const zip = new JSZip();
      
      for (let i = 0; i < docsInRange.length; i++) {
        const doc = docsInRange[i];
        const { blob, filename } = await generatePdf(doc);
        zip.file(filename, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Create download link with local date formatting
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      const formatDateForFilename = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const fromStr = dateRange.from ? formatDateForFilename(dateRange.from) : '';
      const toStr = dateRange.to ? formatDateForFilename(dateRange.to) : '';
      link.download = `${documentType}_${fromStr}_to_${toStr}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export complete",
        description: `Successfully exported ${docsInRange.length} ${documentType.toLowerCase()} documents.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error generating the export. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDateRange(prev => ({ ...prev, isExporting: false }));
    }
  };

  const docsInRange = getDocumentsInRange();

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border border-dashed">
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <CalendarRange className={`h-4 w-4 ${colorClass}`} />
        <span>Export Range:</span>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="min-w-[120px] justify-start" data-testid={`export-${documentType.toLowerCase()}-from-date`}>
            <Calendar className="h-3 w-3 mr-2" />
            {dateRange.from ? dateRange.from.toLocaleDateString() : "From date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={dateRange.from}
            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">to</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="min-w-[120px] justify-start" data-testid={`export-${documentType.toLowerCase()}-to-date`}>
            <Calendar className="h-3 w-3 mr-2" />
            {dateRange.to ? dateRange.to.toLocaleDateString() : "To date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={dateRange.to}
            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {dateRange.from && dateRange.to && (
        <Badge variant="secondary" className="text-xs">
          {docsInRange.length} document{docsInRange.length !== 1 ? 's' : ''}
        </Badge>
      )}

      <Button 
        size="sm" 
        onClick={handleExport}
        disabled={!dateRange.from || !dateRange.to || docsInRange.length === 0 || dateRange.isExporting}
        className="ml-auto"
        data-testid={`export-${documentType.toLowerCase()}-zip`}
      >
        {dateRange.isExporting ? (
          <>
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Package className="h-3 w-3 mr-2" />
            Export ZIP
          </>
        )}
      </Button>
    </div>
  );
}

export default function Documents() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [uploadingHealthSafety, setUploadingHealthSafety] = useState(false);
  const [uploadingPolicy, setUploadingPolicy] = useState(false);
  const [uploadingInsurance, setUploadingInsurance] = useState(false);
  const [uploadingSWP, setUploadingSWP] = useState(false);
  const [uploadingMethodStatement, setUploadingMethodStatement] = useState(false);
  const [methodStatementJobType, setMethodStatementJobType] = useState("");
  const [methodStatementCustomJobType, setMethodStatementCustomJobType] = useState("");
  const [showMethodStatementUploadDialog, setShowMethodStatementUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("health-safety");
  const [downloadingComplianceReport, setDownloadingComplianceReport] = useState(false);

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: meetingsData } = useQuery<{ meetings: any[] }>({
    queryKey: ["/api/toolbox-meetings"],
  });

  const { data: flhaFormsData } = useQuery<{ flhaForms: any[] }>({
    queryKey: ["/api/flha-forms"],
  });

  const { data: inspectionsData } = useQuery<{ inspections: any[] }>({
    queryKey: ["/api/harness-inspections"],
  });

  const { data: incidentReportsData } = useQuery<{ reports: any[] }>({
    queryKey: ["/api/incident-reports"],
  });

  const { data: methodStatementsData } = useQuery<{ statements: any[] }>({
    queryKey: ["/api/method-statements"],
  });

  const { data: quotesData } = useQuery<{ quotes: any[] }>({
    queryKey: ["/api/quotes"],
  });

  const { data: companyDocsData } = useQuery<{ documents: any[] }>({
    queryKey: ["/api/company-documents"],
  });

  const { data: workSessionsData } = useQuery<{ sessions: any[] }>({
    queryKey: ["/api/all-work-sessions"],
  });

  const { data: customJobTypesData } = useQuery<{ customJobTypes: { id: string; name: string }[] }>({
    queryKey: ["/api/custom-job-types"],
  });

  // Admin view: all document review signatures for the company
  const { data: allDocumentReviewsData } = useQuery<{ reviews: any[] }>({
    queryKey: ["/api/document-reviews"],
    enabled: userData?.user?.role === 'company' || userData?.user?.role === 'operations_manager',
  });

  // Fetch all employees for document compliance calculation
  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
    enabled: userData?.user?.role === 'company' || userData?.user?.role === 'operations_manager',
  });

  // Fetch equipment damage reports
  const { data: damageReportsData } = useQuery<{ reports: any[] }>({
    queryKey: ["/api/equipment-damage-reports"],
  });

  const customJobTypes = customJobTypesData?.customJobTypes || [];
  const damageReports = damageReportsData?.reports || [];
  const currentUser = userData?.user;
  const canViewFinancials = hasFinancialAccess(currentUser);
  const canViewSafety = canViewSafetyDocuments(currentUser);
  const canUploadDocuments = currentUser?.role === 'company' || currentUser?.role === 'operations_manager';
  const projects = projectsData?.projects || [];
  const meetings = meetingsData?.meetings || [];
  const flhaForms = flhaFormsData?.flhaForms || [];
  const inspections = inspectionsData?.inspections || [];
  const incidentReports = incidentReportsData?.reports || [];
  const methodStatements = methodStatementsData?.statements || [];
  const quotes = quotesData?.quotes || [];
  const companyDocuments = companyDocsData?.documents || [];

  const healthSafetyDocs = companyDocuments.filter((doc: any) => doc.documentType === 'health_safety_manual');
  const policyDocs = companyDocuments.filter((doc: any) => doc.documentType === 'company_policy');
  const insuranceDocs = companyDocuments.filter((doc: any) => doc.documentType === 'certificate_of_insurance');
  const methodStatementDocs = companyDocuments.filter((doc: any) => doc.documentType === 'method_statement');
  const safeWorkProcedureDocs = companyDocuments.filter((doc: any) => doc.documentType === 'safe_work_procedure' && !doc.isTemplate);
  const templateSWPDocs = companyDocuments.filter((doc: any) => doc.documentType === 'safe_work_procedure' && doc.isTemplate);
  const workSessions = workSessionsData?.sessions || [];

  // Calculate toolbox meeting compliance rating
  // For each project on each day with work sessions, at least one toolbox meeting should exist
  // "Other" meetings (off-site, office, training) count for ALL work sessions on that date
  const toolboxMeetingCompliance = (() => {
    // Get unique (projectId, date) combinations where work sessions occurred
    const workSessionDays = new Set<string>();
    const workSessionDates = new Set<string>(); // Just dates for "Other" matching
    workSessions.forEach((session: any) => {
      if (session.projectId && session.workDate) {
        workSessionDays.add(`${session.projectId}|${session.workDate}`);
        workSessionDates.add(session.workDate);
      }
    });

    // Create a map of (projectId, date) to check if toolbox meeting exists
    const toolboxMeetingDays = new Set<string>();
    const otherMeetingDates = new Set<string>(); // Dates with "Other" meetings
    meetings.forEach((meeting: any) => {
      if (meeting.meetingDate) {
        if (meeting.projectId === 'other') {
          // "Other" meetings cover all work sessions on that date
          otherMeetingDates.add(meeting.meetingDate);
        } else if (meeting.projectId) {
          toolboxMeetingDays.add(`${meeting.projectId}|${meeting.meetingDate}`);
        }
      }
    });

    // Count how many work session days have a corresponding toolbox meeting
    // A work session day is covered if:
    // 1. There's a project-specific meeting for that (projectId, date) combo, OR
    // 2. There's an "Other" meeting on that date
    let daysWithMeeting = 0;
    let totalDays = 0;
    workSessionDays.forEach((dayKey) => {
      totalDays++;
      const date = dayKey.split('|')[1];
      if (toolboxMeetingDays.has(dayKey) || otherMeetingDates.has(date)) {
        daysWithMeeting++;
      }
    });

    const percentage = totalDays > 0 ? Math.round((daysWithMeeting / totalDays) * 100) : 0;
    return { daysWithMeeting, totalDays, percentage };
  })();

  // Collect all rope access plan PDFs - only if user has permission
  const allDocuments = canViewSafety ? projects.flatMap(project => 
    (project.documentUrls || []).map((url: string) => ({
      type: 'pdf',
      url,
      projectName: project.buildingName,
      date: project.createdAt
    }))
  ) : [];

  // Helper function to add company branding to PDFs when active
  const addCompanyBranding = (doc: jsPDF, pageWidth: number): number => {
    // Check if branding is active
    if (!currentUser?.whitelabelBrandingActive || !currentUser?.companyName) {
      return 0; // No branding, return 0 additional height
    }

    const companyName = currentUser?.companyName || '';

    // Add company name at top of header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName.toUpperCase(), pageWidth / 2, 8, { align: 'center' });

    return 5; // Return additional height used by branding
  };

  // PDF generation for damage reports
  const downloadDamageReportPdf = (report: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add multi-line text with pagination
    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header - Orange for damage report
    doc.setFillColor(251, 146, 60); // Orange
    
    // Add company branding if active (using shared helper)
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('EQUIPMENT DAMAGE REPORT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(report.equipmentRetired ? 'Equipment Retirement Document' : 'Damage Documentation Record', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Equipment Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Equipment Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Equipment Type: ${report.equipmentType || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Brand: ${report.equipmentBrand || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Model: ${report.equipmentModel || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    if (report.serialNumber) {
      doc.text(`Serial Number: ${report.serialNumber}`, 20, yPosition);
      yPosition += 6;
    }
    yPosition += 4;

    // Damage Details Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Damage Details', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const discoveredDateStr = report.discoveredDate 
      ? format(new Date(report.discoveredDate), 'MMMM d, yyyy') 
      : 'N/A';
    doc.text(`Date Discovered: ${discoveredDateStr}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Reported By: ${report.reporterName || 'Unknown'}`, 20, yPosition);
    yPosition += 6;
    
    // Severity badge
    const severityColors: Record<string, [number, number, number]> = {
      minor: [34, 197, 94],
      moderate: [251, 191, 36],
      severe: [249, 115, 22],
      critical: [239, 68, 68]
    };
    const severityColor = severityColors[report.damageSeverity] || [100, 100, 100];
    doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Severity: ${(report.damageSeverity || 'unknown').toUpperCase()}`, 20, yPosition);
    yPosition += 8;

    // Damage description
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Description of Damage:', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(report.damageDescription || 'No description provided.', pageWidth - 40);
    yPosition = addMultilineText(descLines, yPosition);
    yPosition += 4;

    if (report.damageLocation) {
      doc.setFont('helvetica', 'bold');
      doc.text('Location on Equipment:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const locationLines = doc.splitTextToSize(report.damageLocation, pageWidth - 40);
      yPosition = addMultilineText(locationLines, yPosition);
      yPosition += 4;
    }

    if (report.correctiveAction) {
      doc.setFont('helvetica', 'bold');
      doc.text('Corrective Action Taken:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const actionLines = doc.splitTextToSize(report.correctiveAction, pageWidth - 40);
      yPosition = addMultilineText(actionLines, yPosition);
      yPosition += 4;
    }

    // Retirement Section (if applicable)
    if (report.equipmentRetired) {
      yPosition += 4;
      doc.setFillColor(254, 226, 226); // Light red
      doc.rect(15, yPosition - 5, pageWidth - 30, 30, 'F');
      
      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EQUIPMENT RETIRED', 20, yPosition + 3);
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Reason for Retirement:', 20, yPosition);
      yPosition += 6;
      const retireLines = doc.splitTextToSize(report.retirementReason || 'No reason provided.', pageWidth - 40);
      yPosition = addMultilineText(retireLines, yPosition);
      yPosition += 8;
    }

    if (report.notes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Additional Notes:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(report.notes, pageWidth - 40);
      yPosition = addMultilineText(notesLines, yPosition);
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Equipment Damage Report - Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        `Generated: ${format(new Date(), 'MMM d, yyyy')}`,
        pageWidth - 20,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    // Save
    const dateStr = report.discoveredDate 
      ? format(new Date(report.discoveredDate), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd');
    const typeStr = (report.equipmentType || 'equipment').toLowerCase().replace(/\s+/g, '-');
    const filename = `damage-report-${typeStr}-${dateStr}.pdf`;
    doc.save(filename);

    toast({
      title: "PDF Downloaded",
      description: "The damage report has been downloaded.",
    });
  };

  const downloadToolboxMeeting = async (meeting: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add multi-line text with pagination
    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header - Title
    doc.setFillColor(14, 165, 233); // Ocean blue
    
    // Add company branding if active
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight; // Dynamic height based on branding
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DAILY TOOLBOX MEETING RECORD', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Safety Meeting Documentation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Meeting Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Meeting Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${formatLocalDate(meeting.meetingDate, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Conducted By: ${meeting.conductedByName}`, 20, yPosition);
    yPosition += 6;

    // Attendees with wrapping
    const attendeesText = Array.isArray(meeting.attendees) ? meeting.attendees.join(', ') : meeting.attendees;
    const attendeesLines = doc.splitTextToSize(`Attendees: ${attendeesText}`, pageWidth - 40);
    yPosition = addMultilineText(attendeesLines, yPosition);
    yPosition += 8;

    // Topics Discussed Section
    const topics = [];
    if (meeting.topicFallProtection) topics.push('Fall Protection and Rescue Procedures');
    if (meeting.topicAnchorPoints) topics.push('Anchor Point Selection and Inspection');
    if (meeting.topicRopeInspection) topics.push('Rope Inspection and Maintenance');
    if (meeting.topicKnotTying) topics.push('Knot Tying and Verification');
    if (meeting.topicPPECheck) topics.push('Personal Protective Equipment (PPE) Check');
    if (meeting.topicWeatherConditions) topics.push('Weather Conditions and Work Stoppage');
    if (meeting.topicCommunication) topics.push('Communication Signals and Procedures');
    if (meeting.topicEmergencyEvacuation) topics.push('Emergency Evacuation Procedures');
    if (meeting.topicHazardAssessment) topics.push('Work Area Hazard Assessment');
    if (meeting.topicLoadCalculations) topics.push('Load Calculations and Weight Limits');
    if (meeting.topicEquipmentCompatibility) topics.push('Equipment Compatibility Check');
    if (meeting.topicDescenderAscender) topics.push('Descender and Ascender Use');
    if (meeting.topicEdgeProtection) topics.push('Edge Protection Requirements');
    if (meeting.topicSwingFall) topics.push('Swing Fall Hazards');
    if (meeting.topicMedicalFitness) topics.push('Medical Fitness and Fatigue Management');
    if (meeting.topicToolDropPrevention) topics.push('Tool Drop Prevention');
    if (meeting.topicRegulations) topics.push('Working at Heights Regulations');
    if (meeting.topicRescueProcedures) topics.push('Rescue Procedures and Equipment');
    if (meeting.topicSiteHazards) topics.push('Site-Specific Hazards');
    if (meeting.topicBuddySystem) topics.push('Buddy System and Supervision');

    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Topics Discussed', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    topics.forEach((topic, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${topic}`, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 4;

    // Custom Topic
    if (meeting.customTopic) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('Custom Topic:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const customTopicLines = doc.splitTextToSize(meeting.customTopic, pageWidth - 40);
      yPosition = addMultilineText(customTopicLines, yPosition);
      yPosition += 8;
    }

    // Additional Notes
    if (meeting.additionalNotes) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Notes:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(meeting.additionalNotes, pageWidth - 40);
      yPosition = addMultilineText(notesLines, yPosition);
      yPosition += 8;
    }

    // Signatures Section
    if (meeting.signatures && meeting.signatures.length > 0) {
      yPosition += 10;
      
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Attendee Signatures', 20, yPosition);
      yPosition += 10;

      for (const sig of meeting.signatures) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        // Employee name
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(sig.employeeName, 20, yPosition);
        yPosition += 5;

        // Add signature image
        try {
          doc.addImage(sig.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
        } catch (error) {
          console.error('Error adding signature image:', error);
        }
        yPosition += 25;

        // Line under signature
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 80, yPosition);
        yPosition += 10;
      }
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an official safety meeting record. Keep for compliance purposes.', pageWidth / 2, footerY, { align: 'center' });

    // Save PDF
    doc.save(`Toolbox_Meeting_${meeting.meetingDate}.pdf`);
  };

  const downloadFlhaForm = async (flha: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header
    doc.setFillColor(251, 146, 60); // Orange
    
    // Add company branding if active
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight; // Dynamic height based on branding
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FIELD LEVEL HAZARD ASSESSMENT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Rope Access Safety Documentation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Assessment Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(flha.assessmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Assessor: ${flha.assessorName}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Location: ${flha.location}`, 20, yPosition);
    yPosition += 6;

    if (flha.workArea) {
      doc.text(`Work Area: ${flha.workArea}`, 20, yPosition);
      yPosition += 6;
    }

    yPosition += 4;

    // Job Description
    doc.setFont('helvetica', 'bold');
    doc.text('Job Description:', 20, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    const jobDescLines = doc.splitTextToSize(flha.jobDescription, pageWidth - 40);
    yPosition = addMultilineText(jobDescLines, yPosition);
    yPosition += 10;

    // Identified Hazards
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Identified Hazards', 20, yPosition);
    yPosition += 8;

    const hazardsList = [];
    if (flha.hazardFalling) hazardsList.push('Falls from Height');
    if (flha.hazardSwingFall) hazardsList.push('Swing Fall Hazard');
    if (flha.hazardSuspendedRescue) hazardsList.push('Suspension Trauma / Rescue Required');
    if (flha.hazardWeather) hazardsList.push('Adverse Weather Conditions');
    if (flha.hazardElectrical) hazardsList.push('Electrical Hazards');
    if (flha.hazardFallingObjects) hazardsList.push('Falling Tools/Objects');
    if (flha.hazardChemical) hazardsList.push('Chemical Exposure');
    if (flha.hazardConfined) hazardsList.push('Confined Spaces');
    if (flha.hazardSharpEdges) hazardsList.push('Sharp Edges / Rope Damage');
    if (flha.hazardUnstableAnchors) hazardsList.push('Unstable Anchor Points');
    if (flha.hazardPowerTools) hazardsList.push('Power Tool Operation at Height');
    if (flha.hazardPublic) hazardsList.push('Public Interaction / Access');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    hazardsList.forEach((hazard, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${hazard}`, 25, yPosition);
      yPosition += 6;
    });

    if (flha.additionalHazards) {
      yPosition += 4;
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Hazards:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const additionalHazardsLines = doc.splitTextToSize(flha.additionalHazards, pageWidth - 40);
      yPosition = addMultilineText(additionalHazardsLines, yPosition);
    }

    yPosition += 10;

    // Controls Implemented
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Controls Implemented', 20, yPosition);
    yPosition += 8;

    const controlsList = [];
    if (flha.controlPPE) controlsList.push('Proper PPE (Harness, Helmet, etc.)');
    if (flha.controlBackupSystem) controlsList.push('Backup Safety Systems');
    if (flha.controlEdgeProtection) controlsList.push('Edge Protection Installed');
    if (flha.controlBarricades) controlsList.push('Barricades / Signage');
    if (flha.controlWeatherMonitoring) controlsList.push('Weather Monitoring');
    if (flha.controlRescuePlan) controlsList.push('Emergency Rescue Plan');
    if (flha.controlCommunication) controlsList.push('Communication System');
    if (flha.controlToolTethering) controlsList.push('Tool Tethering / Drop Prevention');
    if (flha.controlPermits) controlsList.push('Work Permits Obtained');
    if (flha.controlInspections) controlsList.push('Pre-work Equipment Inspections');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    controlsList.forEach((control) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${control}`, 25, yPosition);
      yPosition += 6;
    });

    if (flha.additionalControls) {
      yPosition += 4;
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Controls:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const additionalControlsLines = doc.splitTextToSize(flha.additionalControls, pageWidth - 40);
      yPosition = addMultilineText(additionalControlsLines, yPosition);
    }

    yPosition += 10;

    // Risk Assessment
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Risk Assessment', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (flha.riskLevelBefore) {
      doc.text(`Risk Level (Before Controls): ${flha.riskLevelBefore.toUpperCase()}`, 20, yPosition);
      yPosition += 6;
    }
    if (flha.riskLevelAfter) {
      doc.text(`Risk Level (After Controls): ${flha.riskLevelAfter.toUpperCase()}`, 20, yPosition);
      yPosition += 6;
    }

    yPosition += 4;

    // Emergency Contacts
    if (flha.emergencyContacts) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Emergency Contacts:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const emergencyContactsLines = doc.splitTextToSize(flha.emergencyContacts, pageWidth - 40);
      yPosition = addMultilineText(emergencyContactsLines, yPosition);
      yPosition += 10;
    }

    // Signatures
    if (flha.signatures && flha.signatures.length > 0) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Team Member Signatures', 20, yPosition);
      yPosition += 10;

      for (const sig of flha.signatures) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(sig.employeeName, 20, yPosition);
        yPosition += 5;

        try {
          doc.addImage(sig.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
        } catch (error) {
          console.error('Error adding signature image:', error);
        }
        yPosition += 25;

        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 80, yPosition);
        yPosition += 10;
      }
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an official FLHA record. Keep for compliance purposes.', pageWidth / 2, footerY, { align: 'center' });

    doc.save(`FLHA_${new Date(flha.assessmentDate).toISOString().split('T')[0]}.pdf`);
  };

  const downloadHarnessInspection = async (inspection: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add multi-line text with pagination
    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header - Title
    doc.setFillColor(14, 165, 233); // Ocean blue
    
    // Add company branding if active
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight; // Dynamic height based on branding
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ROPE ACCESS EQUIPMENT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.text('INSPECTION RECORD', pageWidth / 2, 23 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Safety Equipment Documentation', pageWidth / 2, 30 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Inspection Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Inspection Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Inspection Date: ${new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Inspector: ${inspection.inspectorName}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Manufacturer: ${inspection.manufacturer || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Equipment ID: ${inspection.equipmentId || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Date in Service: ${inspection.dateInService || 'N/A'}`, 20, yPosition);
    yPosition += 12;

    // Inspection Result
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const status = inspection.overallStatus?.toUpperCase() || 'N/A';
    if (status === 'PASS') {
      doc.setTextColor(34, 197, 94); // Green
    } else if (status === 'FAIL') {
      doc.setTextColor(239, 68, 68); // Red
    } else {
      doc.setTextColor(234, 179, 8); // Yellow
    }
    doc.text(`INSPECTION RESULT: ${status}`, 20, yPosition);
    yPosition += 12;

    // Comments
    if (inspection.comments) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Comments:', 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const commentsLines = doc.splitTextToSize(inspection.comments, pageWidth - 40);
      yPosition = addMultilineText(commentsLines, yPosition);
      yPosition += 8;
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an official equipment inspection record. Keep for compliance purposes.', pageWidth / 2, footerY, { align: 'center' });

    // Save PDF
    doc.save(`Equipment_Inspection_${new Date(inspection.inspectionDate).toISOString().split('T')[0]}.pdf`);
  };

  const downloadIncidentReport = async (report: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header
    doc.setFillColor(239, 68, 68); // Red for incidents
    
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INCIDENT REPORT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Incident Documentation and Investigation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Basic Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Incident Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(report.incidentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Time: ${report.incidentTime || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Location: ${report.location || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    if (report.projectName) {
      doc.text(`Project: ${report.projectName}`, 20, yPosition);
      yPosition += 6;
    }

    doc.text(`Reported By: ${report.reportedByName}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Report Date: ${new Date(report.reportDate).toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;

    // Description
    if (report.description) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('Incident Description:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(report.description, pageWidth - 40);
      yPosition = addMultilineText(descLines, yPosition);
      yPosition += 10;
    }

    // Incident Classification
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Incident Classification', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${report.incidentType || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Severity: ${report.severity || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Immediate Cause: ${report.immediateCause || 'N/A'}`, 20, yPosition);
    yPosition += 10;

    // People Involved
    if (report.peopleInvolved && report.peopleInvolved.length > 0) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('People Involved', 20, yPosition);
      yPosition += 8;

      report.peopleInvolved.forEach((person: any, index: number) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`Person ${index + 1}:`, 25, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${person.name}`, 30, yPosition);
        yPosition += 5;
        doc.text(`Role: ${person.role}`, 30, yPosition);
        yPosition += 5;

        if (person.injuryType && person.injuryType !== 'none') {
          doc.text(`Injury Type: ${person.injuryType}`, 30, yPosition);
          yPosition += 5;
        }

        if (person.bodyPartAffected) {
          doc.text(`Body Part Affected: ${person.bodyPartAffected}`, 30, yPosition);
          yPosition += 5;
        }

        if (person.medicalTreatment) {
          doc.text(`Medical Treatment: ${person.medicalTreatment}`, 30, yPosition);
          yPosition += 5;
        }

        yPosition += 3;
      });

      yPosition += 5;
    }

    // Root Cause Analysis
    if (report.rootCause) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Root Cause Analysis:', 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      const rootCauseLines = doc.splitTextToSize(report.rootCause, pageWidth - 40);
      yPosition = addMultilineText(rootCauseLines, yPosition);
      yPosition += 10;
    }

    // Contributing Factors
    if (report.contributingFactors) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Contributing Factors:', 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      const factorsLines = doc.splitTextToSize(report.contributingFactors, pageWidth - 40);
      yPosition = addMultilineText(factorsLines, yPosition);
      yPosition += 10;
    }

    // Corrective Actions
    if (report.correctiveActionItems && report.correctiveActionItems.length > 0) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Corrective Actions', 20, yPosition);
      yPosition += 8;

      report.correctiveActionItems.forEach((action: any, index: number) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`Action ${index + 1}:`, 25, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const actionLines = doc.splitTextToSize(action.action, pageWidth - 50);
        actionLines.forEach((line: string) => {
          doc.text(line, 30, yPosition);
          yPosition += 5;
        });

        doc.text(`Assigned To: ${action.assignedTo}`, 30, yPosition);
        yPosition += 5;
        doc.text(`Due Date: ${new Date(action.dueDate).toLocaleDateString()}`, 30, yPosition);
        yPosition += 5;
        doc.text(`Status: ${action.status}`, 30, yPosition);
        yPosition += 8;
      });
    }

    // Regulatory Information
    if (report.reportableToRegulator || report.regulatorNotificationDate) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Regulatory Reporting', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.text(`Reportable to Regulator: ${report.reportableToRegulator ? 'Yes' : 'No'}`, 20, yPosition);
      yPosition += 6;

      if (report.regulatorNotificationDate) {
        doc.text(`Notification Date: ${new Date(report.regulatorNotificationDate).toLocaleDateString()}`, 20, yPosition);
        yPosition += 6;
      }

      if (report.regulatorReferenceNumber) {
        doc.text(`Reference Number: ${report.regulatorReferenceNumber}`, 20, yPosition);
        yPosition += 6;
      }

      yPosition += 5;
    }

    // Supervisor Review
    if (report.supervisorReviewDate) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Supervisor Review', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.text(`Reviewed By: ${report.supervisorReviewedBy || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Review Date: ${new Date(report.supervisorReviewDate).toLocaleDateString()}`, 20, yPosition);
      yPosition += 6;

      if (report.supervisorComments) {
        doc.setFont('helvetica', 'bold');
        doc.text('Comments:', 20, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const commentsLines = doc.splitTextToSize(report.supervisorComments, pageWidth - 40);
        yPosition = addMultilineText(commentsLines, yPosition);
        yPosition += 8;
      }
    }

    // Management Review
    if (report.managementReviewDate) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Management Review', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.text(`Reviewed By: ${report.managementReviewedBy || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Review Date: ${new Date(report.managementReviewDate).toLocaleDateString()}`, 20, yPosition);
      yPosition += 6;

      if (report.managementComments) {
        doc.setFont('helvetica', 'bold');
        doc.text('Comments:', 20, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const commentsLines = doc.splitTextToSize(report.managementComments, pageWidth - 40);
        yPosition = addMultilineText(commentsLines, yPosition);
        yPosition += 8;
      }
    }

    // Signatures Section
    if (report.signatures && report.signatures.length > 0) {
      yPosition += 10;

      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Signatures', 20, yPosition);
      yPosition += 10;

      for (const sig of report.signatures) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`${sig.role}: ${sig.name}`, 20, yPosition);
        yPosition += 5;

        try {
          doc.addImage(sig.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
        } catch (error) {
          console.error('Error adding signature image:', error);
        }
        yPosition += 25;

        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 80, yPosition);
        yPosition += 10;
      }
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an official incident report. Keep for compliance and regulatory purposes.', pageWidth / 2, footerY, { align: 'center' });

    doc.save(`Incident_Report_${new Date(report.incidentDate).toISOString().split('T')[0]}.pdf`);
  };

  // ============ BULK EXPORT PDF GENERATORS (return blob instead of saving) ============
  
  const generateInspectionPdfBlob = async (inspection: any): Promise<{ blob: Blob; filename: string }> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header
    doc.setFillColor(14, 165, 233);
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ROPE ACCESS EQUIPMENT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.text('INSPECTION RECORD', pageWidth / 2, 23 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Safety Equipment Documentation', pageWidth / 2, 30 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Inspection Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Inspection Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Inspection Date: ${new Date(inspection.inspectionDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Inspector: ${inspection.inspectorName}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Manufacturer: ${inspection.manufacturer || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Equipment ID: ${inspection.equipmentId || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Date in Service: ${inspection.dateInService || 'N/A'}`, 20, yPosition);
    yPosition += 12;

    // Result
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const resultText = `Overall Status: ${inspection.overallStatus?.toUpperCase() || 'N/A'}`;
    doc.text(resultText, 20, yPosition);
    yPosition += 10;

    if (inspection.comments) {
      doc.setFont('helvetica', 'bold');
      doc.text('Comments:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const commentLines = doc.splitTextToSize(inspection.comments, pageWidth - 40);
      yPosition = addMultilineText(commentLines, yPosition);
    }

    const filename = `Equipment_Inspection_${new Date(inspection.inspectionDate).toISOString().split('T')[0]}_${inspection.id}.pdf`;
    const blob = doc.output('blob');
    return { blob, filename };
  };

  const generateMeetingPdfBlob = async (meeting: any): Promise<{ blob: Blob; filename: string }> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header
    doc.setFillColor(14, 165, 233);
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DAILY TOOLBOX MEETING RECORD', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Safety Meeting Documentation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Meeting Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Meeting Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${formatLocalDate(meeting.meetingDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Conducted By: ${meeting.conductedByName}`, 20, yPosition);
    yPosition += 6;

    const attendeesText = Array.isArray(meeting.attendees) ? meeting.attendees.join(', ') : meeting.attendees;
    const attendeesLines = doc.splitTextToSize(`Attendees: ${attendeesText}`, pageWidth - 40);
    yPosition = addMultilineText(attendeesLines, yPosition);
    yPosition += 8;

    // Topics
    const topics = [];
    if (meeting.topicFallProtection) topics.push('Fall Protection and Rescue Procedures');
    if (meeting.topicAnchorPoints) topics.push('Anchor Point Selection and Inspection');
    if (meeting.topicEquipmentInspection) topics.push('Equipment Inspection');
    if (meeting.topicWeatherConditions) topics.push('Weather Conditions');
    if (meeting.topicCommunication) topics.push('Communication Procedures');
    if (meeting.topicEmergencyProcedures) topics.push('Emergency Procedures');
    if (meeting.topicSiteHazards) topics.push('Site-Specific Hazards');
    if (meeting.topicPpe) topics.push('PPE Requirements');

    if (topics.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Topics Discussed:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      topics.forEach(topic => {
        doc.text(`- ${topic}`, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }

    if (meeting.otherTopics) {
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Topics:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const otherLines = doc.splitTextToSize(meeting.otherTopics, pageWidth - 40);
      yPosition = addMultilineText(otherLines, yPosition);
    }

    const filename = `Toolbox_Meeting_${meeting.meetingDate}_${meeting.id}.pdf`;
    const blob = doc.output('blob');
    return { blob, filename };
  };

  const generateFlhaPdfBlob = async (flha: any): Promise<{ blob: Blob; filename: string }> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header
    doc.setFillColor(251, 146, 60);
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FIELD LEVEL HAZARD ASSESSMENT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Rope Access Safety Documentation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Assessment Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(flha.assessmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Assessor: ${flha.assessorName}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Location: ${flha.location}`, 20, yPosition);
    yPosition += 6;

    if (flha.workArea) {
      doc.text(`Work Area: ${flha.workArea}`, 20, yPosition);
      yPosition += 6;
    }
    yPosition += 4;

    // Job Description
    doc.setFont('helvetica', 'bold');
    doc.text('Job Description:', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const jobDescLines = doc.splitTextToSize(flha.jobDescription, pageWidth - 40);
    yPosition = addMultilineText(jobDescLines, yPosition);
    yPosition += 10;

    // Hazards
    if (flha.identifiedHazards && flha.identifiedHazards.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Identified Hazards:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      flha.identifiedHazards.forEach((hazard: string) => {
        doc.text(`- ${hazard}`, 25, yPosition);
        yPosition += 5;
      });
    }

    const filename = `FLHA_${new Date(flha.assessmentDate).toISOString().split('T')[0]}_${flha.id}.pdf`;
    const blob = doc.output('blob');
    return { blob, filename };
  };

  const generateIncidentPdfBlob = async (report: any): Promise<{ blob: Blob; filename: string }> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header
    doc.setFillColor(239, 68, 68);
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INCIDENT REPORT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Incident Documentation and Investigation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Basic Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Incident Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(report.incidentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Time: ${report.incidentTime || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Location: ${report.location || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    if (report.projectName) {
      doc.text(`Project: ${report.projectName}`, 20, yPosition);
      yPosition += 6;
    }
    doc.text(`Reported By: ${report.reportedByName}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Report Date: ${new Date(report.reportDate).toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;

    // Description
    if (report.description) {
      doc.setFont('helvetica', 'bold');
      doc.text('Incident Description:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(report.description, pageWidth - 40);
      yPosition = addMultilineText(descLines, yPosition);
      yPosition += 8;
    }

    // Severity
    if (report.severity) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Severity: ${report.severity.toUpperCase()}`, 20, yPosition);
      yPosition += 10;
    }

    const filename = `Incident_Report_${new Date(report.incidentDate).toISOString().split('T')[0]}_${report.id}.pdf`;
    const blob = doc.output('blob');
    return { blob, filename };
  };

  const generateMethodStatementPdfBlob = async (statement: any): Promise<{ blob: Blob; filename: string }> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      return y;
    };

    // Header
    doc.setFillColor(16, 185, 129);
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('METHOD STATEMENT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Rope Access Work Procedure', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Document Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Title: ${statement.title}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Date Created: ${new Date(statement.dateCreated).toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    if (statement.projectName) {
      doc.text(`Project: ${statement.projectName}`, 20, yPosition);
      yPosition += 6;
    }
    yPosition += 4;

    // Scope
    if (statement.scopeOfWork) {
      doc.setFont('helvetica', 'bold');
      doc.text('Scope of Work:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const scopeLines = doc.splitTextToSize(statement.scopeOfWork, pageWidth - 40);
      yPosition = addMultilineText(scopeLines, yPosition);
      yPosition += 8;
    }

    // Equipment
    if (statement.equipmentRequired) {
      doc.setFont('helvetica', 'bold');
      doc.text('Equipment Required:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const equipLines = doc.splitTextToSize(statement.equipmentRequired, pageWidth - 40);
      yPosition = addMultilineText(equipLines, yPosition);
      yPosition += 8;
    }

    // Procedures
    if (statement.workProcedures) {
      doc.setFont('helvetica', 'bold');
      doc.text('Work Procedures:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const procLines = doc.splitTextToSize(statement.workProcedures, pageWidth - 40);
      yPosition = addMultilineText(procLines, yPosition);
    }

    const filename = `Method_Statement_${new Date(statement.dateCreated).toISOString().split('T')[0]}_${statement.id}.pdf`;
    const blob = doc.output('blob');
    return { blob, filename };
  };

  // ============ END BULK EXPORT PDF GENERATORS ============

  // Same professional HTML download function as Quotes.tsx
  const downloadQuote = (quote: any) => {
    const serviceNames: Record<string, string> = {
      window_cleaning: "Window Cleaning",
      dryer_vent_cleaning: "Exterior Dryer Vent Cleaning",
      building_wash: "Building Wash - Pressure washing",
      general_pressure_washing: "General Pressure Washing",
      gutter_cleaning: "Gutter Cleaning",
      parkade: "Parkade Cleaning",
      ground_windows: "Ground Windows",
      in_suite: "In-Suite Dryer Vent"
    };

    const grandTotal = quote.services?.reduce((sum: number, s: any) => sum + Number(s.totalCost || 0), 0) || 0;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Quote - ${quote.strataPlanNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 60px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 3px solid #3B82F6; padding-bottom: 30px; margin-bottom: 40px; }
        .header h1 { color: #3B82F6; font-size: 32px; margin-bottom: 8px; }
        .header .subtitle { color: #71717A; font-size: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .info-section h3 { color: #3B82F6; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .info-section p { color: #333; margin-bottom: 5px; }
        .info-section strong { font-weight: 600; }
        .services-section { margin: 40px 0; }
        .services-section h2 { color: #0A0A0A; font-size: 24px; margin-bottom: 25px; border-bottom: 2px solid #E4E4E7; padding-bottom: 10px; }
        .service-item { background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 8px; padding: 25px; margin-bottom: 20px; }
        .service-item h3 { color: #0A0A0A; font-size: 18px; margin-bottom: 15px; }
        .service-details { color: #71717A; font-size: 14px; }
        .service-details p { margin: 8px 0; padding-left: 10px; }
        .pricing-row { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E4E4E7; }
        .pricing-row strong { color: #0A0A0A; }
        .total-section { background: #3B82F6; color: white; padding: 30px; border-radius: 8px; text-align: right; margin-top: 30px; }
        .total-section h3 { font-size: 16px; margin-bottom: 10px; font-weight: 500; opacity: 0.9; }
        .total-section .amount { font-size: 36px; font-weight: bold; }
        .footer { margin-top: 50px; padding-top: 30px; border-top: 2px solid #E4E4E7; text-align: center; color: #71717A; font-size: 14px; }
        @media print { body { background: white; margin: 0; padding: 0; } .container { box-shadow: none; padding: 40px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SERVICE QUOTE</h1>
            <p class="subtitle">Rope Access & High-Rise Maintenance Services</p>
        </div>

        <div class="info-grid">
            <div class="info-section">
                <h3>Quote Information</h3>
                <p><strong>Quote Date:</strong> ${quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                <p><strong>Quote Number:</strong> ${quote.strataPlanNumber}</p>
                <p><strong>Status:</strong> ${quote.status.toUpperCase()}</p>
            </div>
            <div class="info-section">
                <h3>Property Information</h3>
                <p><strong>Building:</strong> ${quote.buildingName}</p>
                <p><strong>Address:</strong> ${quote.buildingAddress}</p>
                <p><strong>Floors:</strong> ${quote.floorCount}</p>
            </div>
        </div>

        ${quote.strataManagerName || quote.strataManagerAddress ? `
        <div class="info-grid">
            <div class="info-section">
                <h3>Strata Property Manager</h3>
                ${quote.strataManagerName ? `<p><strong>Name:</strong> ${quote.strataManagerName}</p>` : ''}
                ${quote.strataManagerAddress ? `<p><strong>Address:</strong> ${quote.strataManagerAddress}</p>` : ''}
            </div>
        </div>
        ` : ''}

        <div class="services-section">
            <h2>Services Proposed</h2>
            ${quote.services?.map((service: any, index: number) => {
              const serviceName = serviceNames[service.serviceType] || service.serviceType;
              let details = [];

              if (service.dropsNorth || service.dropsEast || service.dropsSouth || service.dropsWest) {
                details.push(`<p><strong>Elevation Drops:</strong> North: ${service.dropsNorth || 0}, East: ${service.dropsEast || 0}, South: ${service.dropsSouth || 0}, West: ${service.dropsWest || 0}</p>`);
                if (service.dropsPerDay) details.push(`<p><strong>Drops per Day:</strong> ${service.dropsPerDay}</p>`);
              }

              if (service.parkadeStalls) details.push(`<p><strong>Parking Stalls:</strong> ${service.parkadeStalls}</p>`);
              if (service.groundWindowHours) details.push(`<p><strong>Estimated Hours:</strong> ${service.groundWindowHours}</p>`);
              if (service.suitesPerDay) details.push(`<p><strong>Suites per Day:</strong> ${service.suitesPerDay}</p>`);
              if (service.floorsPerDay) details.push(`<p><strong>Floors per Day:</strong> ${service.floorsPerDay}</p>`);

              return `
                <div class="service-item">
                    <h3>${index + 1}. ${serviceName}</h3>
                    <div class="service-details">
                        ${details.join('')}
                        ${canViewFinancials && service.totalHours ? `<p><strong>Total Hours:</strong> ${service.totalHours}</p>` : ''}
                        ${canViewFinancials && service.pricePerHour ? `<p><strong>Hourly Rate:</strong> $${Number(service.pricePerHour).toFixed(2)}/hour</p>` : ''}
                        ${canViewFinancials && service.pricePerStall ? `<p><strong>Price per Stall:</strong> $${Number(service.pricePerStall).toFixed(2)}</p>` : ''}
                    </div>
                    ${canViewFinancials && service.totalCost ? `
                    <div class="pricing-row">
                        <strong>Service Total</strong>
                        <strong>$${Number(service.totalCost).toFixed(2)}</strong>
                    </div>
                    ` : ''}
                </div>
              `;
            }).join('') || ''}
        </div>

        ${canViewFinancials ? `
        <div class="total-section">
            <h3>TOTAL INVESTMENT</h3>
            <div class="amount">$${grandTotal.toFixed(2)}</div>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>Professional Rope Access Services</strong></p>
            <p>High-Rise Maintenance & Building Services</p>
            <p style="margin-top: 15px; font-size: 12px;">This quote is valid for 30 days from the date of issue. All work will be completed in accordance with IRATA standards and local safety regulations.</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quote_${quote.strataPlanNumber}_${new Date(quote.createdAt || Date.now()).toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download Document Signature Compliance Report as PDF
  const downloadComplianceReport = async () => {
    setDownloadingComplianceReport(true);
    try {
      const response = await fetch('/api/document-reviews/compliance-report', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch compliance data');
      }
      
      const data = await response.json();
      
      // Create PDF - Portrait for better readability
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;
      
      const checkNewPage = (neededSpace: number) => {
        if (yPos + neededSpace > pageHeight - 20) {
          doc.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };
      
      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Document Compliance Report', pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(data.companyName, pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;
      
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date(data.generatedAt).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })}`, pageWidth / 2, yPos, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      yPos += 12;
      
      // Summary Cards Row
      const cardWidth = (pageWidth - margin * 2 - 15) / 4;
      const cardHeight = 22;
      const cards = [
        { label: 'Staff Members', value: data.summary.totalEmployees.toString(), color: [59, 130, 246] },
        { label: 'Documents', value: data.summary.totalDocuments.toString(), color: [139, 92, 246] },
        { label: 'Signed', value: `${data.summary.completedSignatures}/${data.summary.totalSignaturesRequired}`, color: [34, 197, 94] },
        { label: 'Compliance', value: `${data.summary.overallCompliancePercent}%`, color: data.summary.overallCompliancePercent >= 80 ? [34, 197, 94] : data.summary.overallCompliancePercent >= 50 ? [234, 179, 8] : [239, 68, 68] },
      ];
      
      cards.forEach((card, idx) => {
        const xStart = margin + idx * (cardWidth + 5);
        doc.setFillColor(card.color[0], card.color[1], card.color[2]);
        doc.roundedRect(xStart, yPos, cardWidth, cardHeight, 2, 2, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(card.value, xStart + cardWidth / 2, yPos + 10, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(card.label, xStart + cardWidth / 2, yPos + 17, { align: 'center' });
      });
      
      doc.setTextColor(0, 0, 0);
      yPos += cardHeight + 12;
      
      // Employee Sections
      for (const employee of data.employees) {
        const signedDocs = employee.documents.filter((d: any) => d.status === 'signed');
        const pendingDocs = employee.documents.filter((d: any) => d.status !== 'signed');
        const employeeBlockHeight = 18 + (employee.documents.length * 7);
        
        checkNewPage(employeeBlockHeight);
        
        // Employee Header
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, yPos, pageWidth - margin * 2, 14, 2, 2, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(employee.employeeName, margin + 4, yPos + 9);
        
        // Status badge
        const isComplete = signedDocs.length === employee.documents.length;
        const badgeText = isComplete ? 'COMPLETE' : `${signedDocs.length}/${employee.documents.length} Signed`;
        const badgeWidth = doc.getTextWidth(badgeText) + 8;
        const badgeX = pageWidth - margin - badgeWidth - 4;
        
        if (isComplete) {
          doc.setFillColor(34, 197, 94);
        } else {
          doc.setFillColor(234, 179, 8);
        }
        doc.roundedRect(badgeX, yPos + 3, badgeWidth, 8, 1.5, 1.5, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(badgeText, badgeX + badgeWidth / 2, yPos + 8.5, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        
        yPos += 16;
        
        // Document list with two columns
        const colWidth = (pageWidth - margin * 2 - 10) / 2;
        let leftCol = margin;
        let rightCol = margin + colWidth + 10;
        let currentCol = 'left';
        let leftY = yPos;
        let rightY = yPos;
        
        employee.documents.forEach((docItem: any, idx: number) => {
          const xStart = currentCol === 'left' ? leftCol : rightCol;
          const currentY = currentCol === 'left' ? leftY : rightY;
          
          // Check if we need new page
          if (currentY > pageHeight - 20) {
            doc.addPage();
            yPos = margin;
            leftY = margin;
            rightY = margin;
          }
          
          // Status indicator
          if (docItem.status === 'signed') {
            doc.setFillColor(220, 252, 231);
            doc.setDrawColor(34, 197, 94);
          } else if (docItem.status === 'viewed') {
            doc.setFillColor(254, 249, 195);
            doc.setDrawColor(234, 179, 8);
          } else {
            doc.setFillColor(254, 226, 226);
            doc.setDrawColor(239, 68, 68);
          }
          doc.roundedRect(xStart, currentY, colWidth, 6.5, 1, 1, 'FD');
          
          // Document name (truncate if needed)
          let docName = docItem.documentName;
          if (docItem.documentType === 'health_safety_manual') docName = 'Health & Safety Manual';
          else if (docItem.documentType === 'company_policy') docName = 'Company Policy';
          if (docName.length > 35) docName = docName.substring(0, 32) + '...';
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(50, 50, 50);
          doc.text(docName, xStart + 2, currentY + 4.5);
          
          // Status text
          const statusText = docItem.status === 'signed' 
            ? `Signed ${new Date(docItem.signedAt).toLocaleDateString()}` 
            : docItem.status === 'viewed' ? 'Viewed' : 'Pending';
          doc.setFontSize(6);
          doc.setTextColor(100, 100, 100);
          doc.text(statusText, xStart + colWidth - 2, currentY + 4.5, { align: 'right' });
          
          // Alternate columns
          if (currentCol === 'left') {
            leftY += 7.5;
            currentCol = 'right';
          } else {
            rightY += 7.5;
            currentCol = 'left';
          }
        });
        
        yPos = Math.max(leftY, rightY) + 6;
      }
      
      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Generated by OnRopePro Document Management System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Save the PDF
      doc.save(`Document_Compliance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Success",
        description: "Compliance report downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download compliance report",
        variant: "destructive",
      });
    } finally {
      setDownloadingComplianceReport(false);
    }
  };

  const handleDocumentUpload = async (file: File, documentType: 'health_safety_manual' | 'company_policy' | 'certificate_of_insurance' | 'safe_work_procedure' | 'safe_work_practice') => {
    const setUploading = documentType === 'health_safety_manual' 
      ? setUploadingHealthSafety 
      : documentType === 'company_policy' 
        ? setUploadingPolicy 
        : documentType === 'certificate_of_insurance'
          ? setUploadingInsurance
          : documentType === 'safe_work_procedure'
            ? setUploadingSWP
            : setUploadingSWP; // Reuse SWP state for Safe Work Practices
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const response = await fetch('/api/company-documents', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      toast({
        title: "Success",
        description: `Document uploaded successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/company-documents"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle method statement document upload with job type
  const handleMethodStatementUpload = async (file: File, jobType: string, customJobTypeName?: string) => {
    if (!jobType) {
      toast({
        title: "Error",
        description: "Please select a job type for this method statement",
        variant: "destructive",
      });
      return;
    }

    // If job type is "other", require custom job type name
    if (jobType === 'other' && !customJobTypeName?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom job type name",
        variant: "destructive",
      });
      return;
    }

    setUploadingMethodStatement(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', 'method_statement');
      
      // Handle custom job types from saved list (prefixed with custom:)
      if (jobType.startsWith('custom:')) {
        formData.append('jobType', 'other');
        formData.append('customJobType', jobType.replace('custom:', ''));
      } else if (jobType === 'other' && customJobTypeName) {
        formData.append('jobType', 'other');
        formData.append('customJobType', customJobTypeName.trim());
      } else {
        formData.append('jobType', jobType);
      }

      const response = await fetch('/api/company-documents', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      toast({
        title: "Success",
        description: `Method statement uploaded successfully`,
      });

      setShowMethodStatementUploadDialog(false);
      setMethodStatementJobType("");
      setMethodStatementCustomJobType("");
      queryClient.invalidateQueries({ queryKey: ["/api/company-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/csr"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload method statement",
        variant: "destructive",
      });
    } finally {
      setUploadingMethodStatement(false);
    }
  };

  // Format job type for display
  const formatJobType = (jobType: string, customJobType?: string) => {
    if (!jobType) return 'N/A';
    if (jobType === 'other' && customJobType) return customJobType;
    if (jobType.startsWith('custom:')) return jobType.replace('custom:', '');
    const labels: Record<string, string> = {
      'window_cleaning': 'Window Cleaning',
      'dryer_vent_cleaning': 'Dryer Vent Cleaning',
      'building_wash': 'Building Wash',
      'in_suite_dryer_vent_cleaning': 'In-Suite Dryer Vent Cleaning',
      'parkade_pressure_cleaning': 'Parkade Pressure Cleaning',
      'ground_window_cleaning': 'Ground Window Cleaning',
      'general_pressure_washing': 'General Pressure Washing',
      'other': 'Other'
    };
    return labels[jobType] || jobType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/company-documents/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/company-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/document-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company-safety-rating"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  // Initialize template safe work procedures
  const initTemplatesMutation = useMutation({
    mutationFn: async (templates: { templateId: string; title: string; description: string; jobType: string }[]) => {
      const response = await apiRequest("POST", "/api/company-documents/init-templates", { templates });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.documents?.length > 0) {
        toast({
          title: "Success",
          description: `Added ${data.documents.length} safe work procedure(s)`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/company-documents"] });
        queryClient.invalidateQueries({ queryKey: ["/api/document-reviews"] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize templates",
        variant: "destructive",
      });
    },
  });

  // Check which templates are not yet added
  const existingTemplateIds = new Set(templateSWPDocs.map((doc: any) => doc.templateId));
  const availableTemplates = SAFE_WORK_PROCEDURES.filter(
    (p) => !existingTemplateIds.has(`swp_${p.jobType}`)
  );

  // Add a single template procedure
  const handleAddTemplate = (procedure: SafeWorkProcedure) => {
    initTemplatesMutation.mutate([{
      templateId: `swp_${procedure.jobType}`,
      title: procedure.title,
      description: procedure.description,
      jobType: procedure.jobType,
    }]);
  };

  // Add all available templates
  const handleAddAllTemplates = () => {
    const templates = availableTemplates.map(p => ({
      templateId: `swp_${p.jobType}`,
      title: p.title,
      description: p.description,
      jobType: p.jobType,
    }));
    initTemplatesMutation.mutate(templates);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold truncate">{t('documents.pageTitle', 'Documents & Records')}</h1>
              <p className="text-sm text-muted-foreground hidden sm:block mt-1">{t('documents.pageSubtitle', 'All company documents and safety records')}</p>
            </div>
          </div>
        </div>

        {/* Documentation Safety Rating */}
        {(() => {
          const hasHealthSafety = healthSafetyDocs.length > 0;
          const hasPolicy = policyDocs.length > 0;
          const hasInsurance = insuranceDocs.length > 0;
          
          // For employees without permission, only count Health & Safety and Company Policy (2 docs max)
          // For company owners/ops managers, count all 3 documents
          const totalDocsRequired = canUploadDocuments ? 3 : 2;
          const docsCount = canUploadDocuments 
            ? (hasHealthSafety ? 1 : 0) + (hasPolicy ? 1 : 0) + (hasInsurance ? 1 : 0)
            : (hasHealthSafety ? 1 : 0) + (hasPolicy ? 1 : 0);
          const ratingPercent = totalDocsRequired > 0 ? Math.round((docsCount / totalDocsRequired) * 100) : 0;
          
          return (
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ring-1 ${
                    ratingPercent === 100 
                      ? 'bg-emerald-500/10 ring-emerald-500/20' 
                      : ratingPercent >= 50 
                        ? 'bg-amber-500/10 ring-amber-500/20'
                        : 'bg-red-500/10 ring-red-500/20'
                  }`}>
                    <Shield className={`h-6 w-6 ${
                      ratingPercent === 100 
                        ? 'text-primary' 
                        : ratingPercent >= 50 
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{t('documents.safetyRating.title', 'Documentation Safety Rating')}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {ratingPercent === 100 
                        ? t('documents.safetyRating.excellent', 'Excellent! All required documents are uploaded')
                        : ratingPercent >= 50 
                          ? t('documents.safetyRating.partial', 'Partial compliance - upload missing documents')
                          : t('documents.safetyRating.none', 'No documents uploaded yet')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      ratingPercent === 100 
                        ? 'text-primary' 
                        : ratingPercent >= 50 
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}>
                      {ratingPercent}%
                    </div>
                    <div className="text-sm text-muted-foreground">{docsCount}/{totalDocsRequired} {t('documents.safetyRating.documents', 'documents')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-3 mb-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                    hasHealthSafety 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {hasHealthSafety ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {t('documents.healthSafety', 'Health & Safety')}
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                    hasPolicy 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {hasPolicy ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {t('documents.companyPolicy', 'Company Policy')}
                  </div>
                  {canUploadDocuments && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                      hasInsurance 
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {hasInsurance ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {t('documents.certificateOfInsurance', 'Certificate of Insurance')}
                    </div>
                  )}
                </div>
                <Progress 
                  value={ratingPercent} 
                  className={`h-2 ${
                    ratingPercent === 100 
                      ? '[&>div]:bg-emerald-500' 
                      : ratingPercent >= 50 
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-red-500'
                  }`} 
                />
              </CardContent>
            </Card>
          );
        })()}

        {/* Admin View: Employee Document Compliance Status */}
        {canUploadDocuments && (
          (() => {
            const allReviews = allDocumentReviewsData?.reviews || [];
            const allEmployees = employeesData?.employees || [];
            
            // Include company owner in the staff list for compliance tracking
            const companyOwner = currentUser?.role === 'company' ? currentUser : null;
            const allStaff = companyOwner 
              ? [companyOwner, ...allEmployees.filter((e: any) => e.id !== companyOwner.id)]
              : allEmployees;
            
            // Required documents that employees must sign (includes all safe work procedures)
            const requiredDocTypes = ['health_safety_manual', 'company_policy', 'safe_work_procedure'];
            const requiredDocs = companyDocuments.filter((doc: any) => 
              requiredDocTypes.includes(doc.documentType)
            );
            
            // Total staff (company owner + employees)
            const totalEmployees = allStaff.length;
            
            // Total required signatures = staff * required documents
            const totalRequiredSignatures = totalEmployees * requiredDocs.length;
            
            // Group reviews by employee
            const employeeReviews = allReviews.reduce((acc: Record<string, any[]>, review: any) => {
              const key = review.employeeId;
              if (!acc[key]) acc[key] = [];
              acc[key].push(review);
              return acc;
            }, {} as Record<string, any[]>);
            
            // Calculate stats for each staff member (including company owner and those without any reviews yet)
            const employeeStats = allStaff.map((employee: any) => {
              const reviews = employeeReviews[employee.id] || [];
              const signed = reviews.filter((r: any) => r.signedAt);
              const pending = reviews.filter((r: any) => !r.signedAt);
              const viewed = reviews.filter((r: any) => r.viewedAt && !r.signedAt);
              
              // Check if all required documents are signed
              const signedDocIds = new Set(signed.map((r: any) => r.documentId));
              const allRequiredSigned = requiredDocs.every((doc: any) => signedDocIds.has(doc.id));
              
              // Build complete document list with status for ALL required docs (not just ones with reviews)
              const allDocumentStatuses = requiredDocs.map((doc: any) => {
                const review = reviews.find((r: any) => r.documentId === doc.id);
                return {
                  id: review?.id || `pending-${doc.id}`,
                  documentId: doc.id,
                  documentName: doc.fileName || doc.documentType,
                  documentType: doc.documentType,
                  viewedAt: review?.viewedAt || null,
                  signedAt: review?.signedAt || null,
                  status: review?.signedAt ? 'signed' : (review?.viewedAt ? 'viewed' : 'pending'),
                };
              });
              
              return {
                employeeId: employee.id,
                employeeName: employee.name || employee.email || 'Unknown',
                reviews: allDocumentStatuses, // Use complete list instead of just existing reviews
                signedCount: signed.length,
                pendingCount: requiredDocs.length - signed.length, // Pending = required docs not yet signed
                viewedCount: viewed.length,
                totalCount: requiredDocs.length,
                isComplete: allRequiredSigned && requiredDocs.length > 0,
              };
            }).sort((a: any, b: any) => {
              // Sort: pending first, then by name
              if (a.pendingCount > 0 && b.pendingCount === 0) return -1;
              if (a.pendingCount === 0 && b.pendingCount > 0) return 1;
              return a.employeeName.localeCompare(b.employeeName);
            });
            
            const signedReviews = allReviews.filter((r: any) => r.signedAt).length;
            const completeEmployees = employeeStats.filter((e: any) => e.isComplete).length;
            const pendingEmployees = totalEmployees - completeEmployees;
            
            // Compliance = signed reviews / total required signatures
            const compliancePercent = totalRequiredSignatures > 0 
              ? Math.round((signedReviews / totalRequiredSignatures) * 100) 
              : (requiredDocs.length === 0 ? 100 : 0);
            
            const formatDocType = (type: string, docName?: string) => {
              switch (type) {
                case 'health_safety_manual': return 'Health & Safety Manual';
                case 'company_policy': return 'Company Policy';
                case 'method_statement': return 'Method Statement';
                case 'safe_work_procedure': return docName || 'Safe Work Procedure';
                default: return type;
              }
            };
            
            const formatTimestamp = (ts: string | null) => {
              if (!ts) return null;
              return formatLocalDateMedium(ts);
            };
            
            return (
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{t('documents.employeeDocumentCompliance', 'Employee Document Compliance')}</CardTitle>
                      <CardDescription>
                        {t('documents.trackEmployeesReviewed', 'Track which employees have reviewed and signed required documents')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadComplianceReport}
                        disabled={downloadingComplianceReport}
                        data-testid="button-download-compliance-report"
                      >
                        {downloadingComplianceReport ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        {t('documents.downloadReport', 'Download Report')}
                      </Button>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant={compliancePercent === 100 ? "default" : "secondary"} 
                          className={`text-base font-semibold px-3 ${compliancePercent === 100 ? 'bg-emerald-500' : ''}`}
                        >
                          {compliancePercent}% {t('documents.signed', 'Signed')}
                        </Badge>
                        {compliancePercent < 100 && (
                          <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {Math.round((100 - compliancePercent) * 0.05)}% {t('documents.csrPenalty', 'CSR penalty')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">{totalEmployees}</div>
                      <div className="text-sm text-muted-foreground">{t('documents.totalEmployees', 'Total Employees')}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10">
                      <div className="text-2xl font-bold text-primary">{completeEmployees}</div>
                      <div className="text-sm text-muted-foreground">{t('documents.fullyCompliant', 'Fully Compliant')}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totalEmployees - completeEmployees}</div>
                      <div className="text-sm text-muted-foreground">{t('documents.pendingSignatures', 'Pending Signatures')}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10">
                      <div className="text-2xl font-bold text-primary">{signedReviews}/{totalRequiredSignatures}</div>
                      <div className="text-sm text-muted-foreground">{t('documents.documentsSigned', 'Documents Signed')}</div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={compliancePercent} 
                    className={`h-2 mb-6 ${
                      compliancePercent === 100 
                        ? '[&>div]:bg-emerald-500' 
                        : compliancePercent >= 50 
                          ? '[&>div]:bg-amber-500'
                          : '[&>div]:bg-red-500'
                    }`} 
                  />
                  
                  {/* Employee List */}
                  {employeeStats.length > 0 ? (
                    <div className="space-y-2">
                      {employeeStats.map((employee) => (
                        <Collapsible key={employee.employeeId} defaultOpen={false}>
                          <CollapsibleTrigger 
                            className="group flex items-center gap-3 w-full p-3 rounded-lg border bg-card hover-elevate"
                            data-testid={`toggle-employee-docs-${employee.employeeId}`}
                          >
                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                            <div className="flex-1 text-left min-w-0">
                              <span className="font-medium truncate">{employee.employeeName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {employee.isComplete ? (
                                <Badge variant="default" className="bg-emerald-500 text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  {t('documents.complete', 'Complete')}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {employee.pendingCount} {t('documents.pending', 'Pending')}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {employee.signedCount}/{employee.totalCount}
                              </Badge>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-7 mt-2 space-y-2">
                            {employee.reviews.map((review: any) => (
                              <div 
                                key={review.id} 
                                className={`flex items-center gap-3 p-3 rounded-lg border ${
                                  review.signedAt 
                                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                                    : review.viewedAt 
                                      ? 'bg-amber-500/5 border-amber-500/20'
                                      : 'bg-muted/50'
                                }`}
                                data-testid={`doc-review-${review.id}`}
                              >
                                <div className={`p-2 rounded-lg ${
                                  review.signedAt 
                                    ? 'bg-emerald-500/10' 
                                    : review.viewedAt 
                                      ? 'bg-amber-500/10'
                                      : 'bg-muted'
                                }`}>
                                  {review.signedAt ? (
                                    <PenLine className="h-4 w-4 text-primary" />
                                  ) : review.viewedAt ? (
                                    <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{review.documentName}</div>
                                  <div className="text-xs text-muted-foreground">{formatDocType(review.documentType)}</div>
                                </div>
                                <div className="text-right text-xs space-y-1">
                                  {review.viewedAt && (
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <Eye className="h-3 w-3" />
                                      {formatTimestamp(review.viewedAt)}
                                    </div>
                                  )}
                                  {review.signedAt && (
                                    <div className="flex items-center gap-1 text-primary">
                                      <PenLine className="h-3 w-3" />
                                      {formatTimestamp(review.signedAt)}
                                    </div>
                                  )}
                                  {!review.viewedAt && !review.signedAt && (
                                    <div className="text-muted-foreground">{t('documents.notViewed', 'Not viewed')}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                        <Users className="h-8 w-8 text-primary/50" />
                      </div>
                      <p className="text-muted-foreground font-medium">{t('documents.noDocumentReviewsAssigned', 'No document reviews assigned')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('documents.enrollEmployees', 'Enroll employees in document reviews to track their compliance')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()
        )}

        {/* Document Reviews - for employees to review and sign required documents */}
        <DocumentReviews companyDocuments={[...healthSafetyDocs, ...policyDocs]} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full max-w-sm" data-testid="select-document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health-safety" data-testid="option-health-safety">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t('documents.healthSafetyManual', 'Health & Safety Manual')}
                  </div>
                </SelectItem>
                <SelectItem value="company-policy" data-testid="option-company-policy">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t('documents.companyPolicies', 'Company Policies')}
                  </div>
                </SelectItem>
                {canUploadDocuments && (
                  <SelectItem value="insurance" data-testid="option-insurance">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      {t('documents.certificateOfInsurance', 'Certificate of Insurance')}
                    </div>
                  </SelectItem>
                )}
                <SelectItem value="swp-templates" data-testid="option-swp-templates">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t('documents.safeWorkProcedures', 'Safe Work Procedures')}
                  </div>
                </SelectItem>
                <SelectItem value="safe-work-practices" data-testid="option-safe-work-practices">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t('documents.safeWorkPractices', 'Safe Work Practices')}
                  </div>
                </SelectItem>
                <SelectItem value="inspections-safety" data-testid="option-inspections-safety">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {t('documents.equipmentInspections', 'Equipment Inspections')}
                  </div>
                </SelectItem>
                <SelectItem value="damage-reports" data-testid="option-damage-reports">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {t('documents.damageReports', 'Damage Reports')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Health & Safety Manual Tab */}
          <TabsContent value="health-safety">
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                <Shield className="h-6 w-6 text-primary dark:text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">{t('documents.healthSafetyManual', 'Health & Safety Manual')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('documents.essentialWorkplaceSafety', 'Essential workplace safety documentation')}</p>
              </div>
              <Badge variant="secondary" className="text-base font-semibold px-3">
                {healthSafetyDocs.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {canUploadDocuments && (
              <div className="mb-6 p-5 border-2 border-dashed rounded-xl bg-muted/30 hover-elevate">
                <label htmlFor="health-safety-upload" className="block mb-3 text-sm font-semibold flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {t('documents.uploadNewManual', 'Upload New Manual')}
                </label>
                <Input
                  id="health-safety-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  disabled={uploadingHealthSafety}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleDocumentUpload(file, 'health_safety_manual');
                      e.target.value = '';
                    }
                  }}
                  data-testid="input-health-safety-upload"
                />
                {uploadingHealthSafety && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <span className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    {t('documents.uploading', 'Uploading...')}
                  </p>
                )}
              </div>
            )}
            
            {healthSafetyDocs.length > 0 ? (
              <div className="space-y-2">
                {groupDocumentsByDate(healthSafetyDocs, (d: any) => d.createdAt).map((yearGroup) => (
                  <Collapsible key={yearGroup.year} defaultOpen={false}>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 [&[data-state=open]>svg]:rotate-90" />
                      <span className="font-semibold">{yearGroup.year}</span>
                      <Badge variant="secondary">{yearGroup.totalCount}</Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 mt-1">
                      {yearGroup.months.map((monthGroup) => (
                        <Collapsible key={monthGroup.month} defaultOpen={false}>
                          <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                            <span className="font-medium">{monthGroup.monthName}</span>
                            <Badge variant="outline">{monthGroup.totalCount}</Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 space-y-1 mt-1">
                            {monthGroup.days.map((dayGroup) => (
                              <Collapsible key={dayGroup.day}>
                                <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                                  <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                                  <span className="text-sm">{dayGroup.formattedDate}</span>
                                  <Badge variant="outline">{dayGroup.items.length}</Badge>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-4 space-y-2 mt-1">
                                  {dayGroup.items.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                                      <div className="p-2 bg-primary/50/10 rounded-lg">
                                        <Shield className="h-5 w-5 text-primary dark:text-primary flex-shrink-0" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold truncate">{doc.fileName}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {t('documents.uploadedBy', 'Uploaded by {{name}}', { name: doc.uploadedByName })}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => window.open(doc.fileUrl, '_blank')}
                                          data-testid={`download-health-safety-${doc.id}`}
                                        >
                                          <Download className="h-4 w-4 mr-1" />
                                          {t('documents.view', 'View')}
                                        </Button>
                                        {canUploadDocuments && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => deleteDocumentMutation.mutate(doc.id)}
                                            data-testid={`delete-health-safety-${doc.id}`}
                                          >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-primary/50/5 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary/50" />
                </div>
                <p className="text-muted-foreground font-medium">{t('documents.noHealthSafetyManual', 'No Health & Safety Manual uploaded yet')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('documents.uploadFirstDocument', 'Upload your first document to get started')}</p>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Company Policy Tab */}
          <TabsContent value="company-policy">
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">{t('documents.companyPolicies', 'Company Policies')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('documents.generalSafetyGuidelines', 'General safety guidelines')}</p>
              </div>
              <Badge variant="secondary" className="text-base font-semibold px-3">
                {policyDocs.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {canUploadDocuments && (
              <div className="mb-6 p-5 border-2 border-dashed rounded-xl bg-muted/30 hover-elevate">
                <label htmlFor="policy-upload" className="block mb-3 text-sm font-semibold flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {t('documents.uploadPolicy', 'Upload New Policy')}
                </label>
                <Input
                  id="policy-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  disabled={uploadingPolicy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleDocumentUpload(file, 'company_policy');
                      e.target.value = '';
                    }
                  }}
                  data-testid="input-policy-upload"
                />
                {uploadingPolicy && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <span className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    {t('documents.uploading', 'Uploading...')}
                  </p>
                )}
              </div>
            )}
            
            {policyDocs.length > 0 ? (
              <div className="space-y-2">
                {groupDocumentsByDate(policyDocs, (d: any) => d.createdAt).map((yearGroup) => (
                  <Collapsible key={yearGroup.year} defaultOpen={false}>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 [&[data-state=open]>svg]:rotate-90" />
                      <span className="font-semibold">{yearGroup.year}</span>
                      <Badge variant="secondary">{yearGroup.totalCount}</Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 mt-1">
                      {yearGroup.months.map((monthGroup) => (
                        <Collapsible key={monthGroup.month} defaultOpen={false}>
                          <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                            <span className="font-medium">{monthGroup.monthName}</span>
                            <Badge variant="outline">{monthGroup.totalCount}</Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 space-y-1 mt-1">
                            {monthGroup.days.map((dayGroup) => (
                              <Collapsible key={dayGroup.day}>
                                <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                                  <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                                  <span className="text-sm">{dayGroup.formattedDate}</span>
                                  <Badge variant="outline">{dayGroup.items.length}</Badge>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-4 space-y-2 mt-1">
                                  {dayGroup.items.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                                      <div className="p-2 bg-primary/10 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold truncate">{doc.fileName}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {t('documents.uploadedBy', 'Uploaded by {{name}}', { name: doc.uploadedByName })}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => window.open(doc.fileUrl, '_blank')}
                                          data-testid={`download-policy-${doc.id}`}
                                        >
                                          <Download className="h-4 w-4 mr-1" />
                                          {t('documents.view', 'View')}
                                        </Button>
                                        {canUploadDocuments && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => deleteDocumentMutation.mutate(doc.id)}
                                            data-testid={`delete-policy-${doc.id}`}
                                          >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-primary/50" />
                </div>
                <p className="text-muted-foreground font-medium">{t('documents.noCompanyPolicies', 'No Company Policies uploaded yet')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('documents.uploadFirstPolicy', 'Upload your first policy document')}</p>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Certificate of Insurance Tab - Only visible to company owners and operations managers */}
          {canUploadDocuments && (
            <TabsContent value="insurance">
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{t('documents.certificateOfInsurance', 'Certificate of Insurance')}</CardTitle>
                      <p className="text-sm text-muted-foreground">{t('documents.proofOfLiability', 'Proof of liability insurance coverage')}</p>
                    </div>
                    <Badge variant="secondary" className="text-base font-semibold px-3">
                      {insuranceDocs.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-6 p-5 border-2 border-dashed rounded-xl bg-muted/30 hover-elevate">
                    <label htmlFor="insurance-upload" className="block mb-3 text-sm font-semibold flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {t('documents.uploadCertificateInsurance', 'Upload Certificate of Insurance')}
                    </label>
                    <Input
                      id="insurance-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      disabled={uploadingInsurance}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file, 'certificate_of_insurance');
                          e.target.value = '';
                        }
                      }}
                      data-testid="input-insurance-upload"
                    />
                    {uploadingInsurance && (
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                        <span className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                        {t('documents.uploading', 'Uploading...')}
                      </p>
                    )}
                  </div>
                  
                  {insuranceDocs.length > 0 ? (
                    <div className="space-y-2">
                      {groupDocumentsByDate(insuranceDocs, (d: any) => d.createdAt).map((yearGroup) => (
                        <Collapsible key={yearGroup.year} defaultOpen={false}>
                          <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 [&[data-state=open]>svg]:rotate-90" />
                            <span className="font-semibold">{yearGroup.year}</span>
                            <Badge variant="secondary">{yearGroup.totalCount}</Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 space-y-1 mt-1">
                            {yearGroup.months.map((monthGroup) => (
                              <Collapsible key={monthGroup.month} defaultOpen={false}>
                                <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                                  <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                                  <span className="font-medium">{monthGroup.monthName}</span>
                                  <Badge variant="outline">{monthGroup.totalCount}</Badge>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-4 space-y-1 mt-1">
                                  {monthGroup.days.map((dayGroup) => (
                                    <Collapsible key={dayGroup.day}>
                                      <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate">
                                        <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                                        <span className="text-sm">{dayGroup.formattedDate}</span>
                                        <Badge variant="outline">{dayGroup.items.length}</Badge>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent className="pl-4 space-y-2 mt-1">
                                        {dayGroup.items.map((doc: any) => (
                                          <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                              <FileCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="font-semibold truncate">{doc.fileName}</div>
                                              <div className="text-sm text-muted-foreground">
                                                {t('documents.uploadedBy', 'Uploaded by {{name}}', { name: doc.uploadedByName })}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(doc.fileUrl, '_blank')}
                                                data-testid={`download-insurance-${doc.id}`}
                                              >
                                                <Download className="h-4 w-4 mr-1" />
                                                {t('documents.view', 'View')}
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => deleteDocumentMutation.mutate(doc.id)}
                                                data-testid={`delete-insurance-${doc.id}`}
                                              >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </CollapsibleContent>
                                    </Collapsible>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                        <FileCheck className="h-8 w-8 text-primary/50" />
                      </div>
                      <p className="text-muted-foreground font-medium">{t('documents.noCertificateInsurance', 'No Certificate of Insurance uploaded yet')}</p>
                      <p className="text-sm text-muted-foreground mt-1">{t('documents.uploadCertificateDesc', 'Upload your insurance certificate to demonstrate coverage')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Safe Work Procedures Templates Tab */}
          <TabsContent value="swp-templates">
            {/* Custom Safe Work Procedures Upload Section */}
            {canUploadDocuments && (
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{t('documents.customSWP', 'Custom Safe Work Procedures')}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t('documents.customSWPDesc', 'Upload your own custom Safe Work Procedures specific to your company operations.')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-base font-semibold px-3">
                      {safeWorkProcedureDocs.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 mb-6">
                    <Upload className="h-10 w-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload a PDF document with your custom Safe Work Procedure
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="swp-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file, 'safe_work_procedure');
                          e.target.value = '';
                        }
                      }}
                      disabled={uploadingSWP}
                      data-testid="input-swp-upload"
                    />
                    <Button asChild disabled={uploadingSWP}>
                      <label htmlFor="swp-upload" className="cursor-pointer" data-testid="button-upload-swp">
                        {uploadingSWP ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Custom SWP
                          </>
                        )}
                      </label>
                    </Button>
                    {uploadingSWP && (
                      <p className="text-xs text-muted-foreground mt-2">This may take a moment...</p>
                    )}
                  </div>

                  {safeWorkProcedureDocs.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm mb-3">{t('documents.uploadedDocuments', 'Uploaded Documents')}</h4>
                      {safeWorkProcedureDocs.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <FileCheck className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{doc.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/api/company-documents/${doc.id}/download`, '_blank')}
                              data-testid={`download-custom-swp-${doc.id}`}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {t('documents.download', 'Download')}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteDocumentMutation.mutate(doc.id)}
                              data-testid={`delete-custom-swp-${doc.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground">{t('documents.noCustomSWP', 'No custom Safe Work Procedures uploaded yet')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Active Template Safe Work Procedures (from database - employees must sign) */}
            {templateSWPDocs.length > 0 && (
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{t('documents.activeSWP', 'Active Safe Work Procedures')}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        These procedures require employee review and signature. All employees will be automatically enrolled.
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-base font-semibold px-3">
                      {templateSWPDocs.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {templateSWPDocs.map((doc: any) => {
                      const procedure = SAFE_WORK_PROCEDURES.find(p => `swp_${p.jobType}` === doc.templateId);
                      const jobTypeLabel = procedure?.title || doc.fileName;
                      
                      return (
                        <Card key={doc.id} className="overflow-hidden hover-elevate">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                                  <h3 className="font-semibold text-sm truncate">{jobTypeLabel}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                  {doc.description || procedure?.description}
                                </p>
                                {procedure && (
                                  <div className="flex flex-wrap gap-1.5">
                                    <Badge variant="outline" className="text-xs">
                                      {procedure.hazards.length} Hazards
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {procedure.controlMeasures.length} Controls
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {procedure.ppe.length} PPE Items
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                {procedure && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => generateSafeWorkProcedurePDF(procedure, currentUser?.companyName)}
                                    data-testid={`download-swp-${doc.id}`}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    PDF
                                  </Button>
                                )}
                                {canUploadDocuments && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => deleteDocumentMutation.mutate(doc.id)}
                                    disabled={deleteDocumentMutation.isPending}
                                    data-testid={`delete-swp-${doc.id}`}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Template Safe Work Procedures (not yet added) */}
            {canUploadDocuments && availableTemplates.length > 0 && (
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">Available Templates</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Add these industry-standard procedures. Employees will be automatically enrolled to review and sign them.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-base font-semibold px-3">
                        {availableTemplates.length}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={handleAddAllTemplates}
                        disabled={initTemplatesMutation.isPending}
                        data-testid="button-add-all-templates"
                      >
                        {initTemplatesMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-1" />
                        )}
                        Add All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {availableTemplates.map((procedure) => {
                      const jobTypeEntry = STANDARD_JOB_TYPES.find(jt => jt.value === procedure.jobType);
                      const jobTypeLabel = jobTypeEntry ? t(jobTypeEntry.labelKey, procedure.title) : procedure.title;
                      
                      return (
                        <Card key={procedure.jobType} className="overflow-hidden hover-elevate border-dashed">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                                  <h3 className="font-semibold text-sm truncate">{jobTypeLabel}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                  {procedure.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  <Badge variant="outline" className="text-xs">
                                    {procedure.hazards.length} Hazards
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {procedure.controlMeasures.length} Controls
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {procedure.ppe.length} PPE Items
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => generateSafeWorkProcedurePDF(procedure, currentUser?.companyName)}
                                  data-testid={`preview-swp-${procedure.jobType}`}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddTemplate(procedure)}
                                  disabled={initTemplatesMutation.isPending}
                                  data-testid={`add-swp-${procedure.jobType}`}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
                
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Template Notice</h4>
                  <p className="text-xs text-muted-foreground">
                    These are template Safe Work Procedures. Review and customize them to match your specific 
                    site conditions, equipment, and company policies before use. Always conduct a site-specific 
                    risk assessment for each job.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Safe Work Practices Tab */}
          <TabsContent value="safe-work-practices">
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Safe Work Practices</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      General safety guidelines that apply across all rope access operations
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-base font-semibold px-3">
                    {companyDocuments.filter((doc: any) => doc.documentType === 'safe_work_practice').length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {canUploadDocuments && (
                  <div className="mb-6 p-5 border-2 border-dashed rounded-xl bg-muted/30 hover-elevate">
                    <label htmlFor="safe-work-practice-upload" className="block mb-3 text-sm font-semibold flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Safe Work Practice Document
                    </label>
                    <Input
                      id="safe-work-practice-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file, 'safe_work_practice');
                          e.target.value = '';
                        }
                      }}
                      data-testid="input-safe-work-practice-upload"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload general safety practice documents. Employees will be automatically enrolled for review and signature.
                    </p>
                  </div>
                )}
                
                {companyDocuments.filter((doc: any) => doc.documentType === 'safe_work_practice').length > 0 ? (
                  <div className="space-y-3">
                    {companyDocuments.filter((doc: any) => doc.documentType === 'safe_work_practice').map((doc: any) => (
                      <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{doc.fileName}</div>
                          <div className="text-xs text-muted-foreground">
                            {t('documents.uploadedByOn', 'Uploaded by {{name}} on {{date}}', { name: doc.uploadedByName, date: formatLocalDate(doc.uploadedAt) })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.fileUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(doc.fileUrl, '_blank')}
                              data-testid={`view-swpractice-${doc.id}`}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {t('documents.view', 'View')}
                            </Button>
                          )}
                          {canUploadDocuments && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteDocument(doc.id)}
                              data-testid={`delete-swpractice-${doc.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                      <Shield className="h-8 w-8 text-primary/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No Safe Work Practice documents uploaded</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload general safety practice documents that apply across all operations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Template Safe Work Practices - Collapsible */}
            <Collapsible defaultOpen={false} className="group">
              <Card className="mb-6 overflow-visible">
                <CollapsibleTrigger className="w-full text-left" data-testid="toggle-safety-practice-templates">
                  <CardHeader className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent pb-4 cursor-pointer hover-elevate rounded-t-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-xl ring-1 ring-amber-500/20">
                        <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">General Safety Practice Templates</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Pre-built templates covering essential safety topics for rope access operations
                        </p>
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 mt-2" />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {SAFE_WORK_PRACTICES.map((practice) => (
                        <Card key={practice.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-amber-500/10 rounded-lg">
                                <practice.icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-medium">{practice.title}</CardTitle>
                                <CardDescription className="text-xs mt-1 line-clamp-2">
                                  {practice.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="flex flex-wrap gap-1 mb-3">
                              {getPracticeTopics(practice).slice(0, 3).map((topic, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {getPracticeTopics(practice).length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{getPracticeTopics(practice).length - 3} more
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="flex-1" data-testid={`preview-swpractice-${practice.id}`}>
                                    <Eye className="h-3 w-3 mr-1" />
                                    Preview
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <practice.icon className="h-5 w-5 text-amber-600" />
                                      {practice.title}
                                    </DialogTitle>
                                    <DialogDescription>{practice.description}</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 mt-4">
                                    <div>
                                      <h4 className="font-medium text-sm mb-2">Key Principles</h4>
                                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                        {practice.keyPrinciples.map((principle, idx) => (
                                          <li key={idx}>{principle}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm mb-2">Content</h4>
                                      <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                                        {getPracticeContent(practice)}
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter className="mt-4">
                                    <Button variant="outline" onClick={() => generateSafeWorkPracticePDF(practice)} data-testid={`download-preview-swpractice-${practice.id}`}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download PDF
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" variant="default" onClick={() => generateSafeWorkPracticePDF(practice)} data-testid={`download-swpractice-${practice.id}`}>
                                <Download className="h-3 w-3 mr-1" />
                                PDF
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Template Notice</h4>
                  <p className="text-xs text-muted-foreground">
                    These are template Safe Work Practices. Review and customize them to match your specific 
                    company policies and operational requirements. Ensure all employees are trained and 
                    acknowledge these practices before work commences.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Inspections & Safety Tab */}
          <TabsContent value="inspections-safety">
            {/* Toolbox Meeting Safety Rating */}
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ring-1 ${
                    toolboxMeetingCompliance.percentage >= 90 
                      ? 'bg-emerald-500/10 ring-emerald-500/20' 
                      : toolboxMeetingCompliance.percentage >= 50 
                        ? 'bg-amber-500/10 ring-amber-500/20'
                        : 'bg-red-500/10 ring-red-500/20'
                  }`}>
                    <Calendar className={`h-6 w-6 ${
                      toolboxMeetingCompliance.percentage >= 90 
                        ? 'text-primary' 
                        : toolboxMeetingCompliance.percentage >= 50 
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Toolbox Meeting Compliance</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {toolboxMeetingCompliance.totalDays === 0 
                        ? 'No work sessions recorded yet'
                        : toolboxMeetingCompliance.percentage >= 90 
                          ? 'Excellent! Daily toolbox meetings are being conducted consistently' 
                          : toolboxMeetingCompliance.percentage >= 50 
                            ? 'Some project days are missing toolbox meetings'
                            : 'Most project work days are missing toolbox meetings'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      toolboxMeetingCompliance.percentage >= 90 
                        ? 'text-primary' 
                        : toolboxMeetingCompliance.percentage >= 50 
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}>
                      {toolboxMeetingCompliance.percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {toolboxMeetingCompliance.daysWithMeeting}/{toolboxMeetingCompliance.totalDays} work days
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-3 text-sm text-muted-foreground">
                  Measures how often a toolbox meeting was conducted on days when work sessions were active.
                  Project-specific meetings cover that project. "Other" meetings (office, training) cover all work sessions on that date.
                </div>
                <Progress 
                  value={toolboxMeetingCompliance.percentage} 
                  className={`h-2 ${
                    toolboxMeetingCompliance.percentage >= 90 
                      ? '[&>div]:bg-emerald-500' 
                      : toolboxMeetingCompliance.percentage >= 50 
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-red-500'
                  }`} 
                />
              </CardContent>
            </Card>

            {/* Harness Inspections */}
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Equipment Inspection Records</CardTitle>
                    <p className="text-sm text-muted-foreground">Rope access gear and safety equipment</p>
                  </div>
                  <Badge variant="secondary" className="text-base font-semibold px-3">
                    {inspections.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {inspections.length > 0 && (
                  <div className="mb-4">
                    <DateRangeExport
                      documents={inspections}
                      getDateFn={(i: any) => i.inspectionDate}
                      generatePdf={generateInspectionPdfBlob}
                      documentType="Inspections"
                      colorClass="text-primary"
                    />
                  </div>
                )}
                {inspections.length > 0 ? (
                  <div className="space-y-2">
                    {groupDocumentsByDate(inspections, (i: any) => i.inspectionDate).map((yearGroup) => (
                      <Collapsible key={yearGroup.year} defaultOpen={false}>
                        <CollapsibleTrigger className="group flex items-center gap-2 w-full p-3 rounded-lg bg-primary/5 hover-elevate" data-testid={`toggle-inspections-year-${yearGroup.year}`}>
                          <ChevronRight className="h-4 w-4 text-primary transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                          <FolderOpen className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary">{yearGroup.year}</span>
                          <Badge variant="secondary" className="ml-auto">{yearGroup.totalCount}</Badge>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 mt-2 space-y-2">
                          {yearGroup.months.map((monthGroup) => (
                            <Collapsible key={monthGroup.month} defaultOpen={false}>
                              <CollapsibleTrigger className="group flex items-center gap-2 w-full p-2 rounded-md bg-primary/5 hover-elevate" data-testid={`toggle-inspections-month-${yearGroup.year}-${monthGroup.month}`}>
                                <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                                <span className="font-medium">{monthGroup.monthName}</span>
                                <Badge variant="outline" className="ml-auto text-xs">{monthGroup.totalCount}</Badge>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-4 mt-2 space-y-2">
                                {monthGroup.days.map((dayGroup) => (
                                  <div key={dayGroup.date} className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                                      <Calendar className="h-3 w-3" />
                                      <span className="font-medium">{dayGroup.formattedDate}</span>
                                      <span className="text-xs">({dayGroup.items.length})</span>
                                    </div>
                                    <div className="space-y-2 pl-5">
                                      {dayGroup.items.map((inspection: any) => (
                                        <div key={inspection.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                                          <div className="p-2 bg-primary/10 rounded-lg">
                                            <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">{inspection.inspectorName}</div>
                                            <div className="text-xs text-muted-foreground">{inspection.manufacturer || 'Equipment inspection'}</div>
                                          </div>
                                          <Badge variant={inspection.overallStatus === 'pass' ? 'default' : 'destructive'} className="text-xs">
                                            {inspection.overallStatus || 'N/A'}
                                          </Badge>
                                          <Button size="sm" variant="outline" onClick={() => downloadHarnessInspection(inspection)} data-testid={`download-inspection-tab-${inspection.id}`}>
                                            <Download className="h-3 w-3 mr-1" />
                                            PDF
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                      <Shield className="h-8 w-8 text-primary/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No equipment inspections recorded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Inspections will be logged here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Toolbox Meetings List */}
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Toolbox Meeting Records</CardTitle>
                    <p className="text-sm text-muted-foreground">Daily safety meeting documentation</p>
                  </div>
                  <Badge variant="secondary" className="text-base font-semibold px-3">
                    {meetings.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {meetings.length > 0 && (
                  <div className="mb-4">
                    <DateRangeExport
                      documents={meetings}
                      getDateFn={(m: any) => m.meetingDate}
                      generatePdf={generateMeetingPdfBlob}
                      documentType="Meetings"
                      colorClass="text-primary"
                    />
                  </div>
                )}
                {meetings.length > 0 ? (
                  <div className="space-y-2">
                    {groupDocumentsByDate(meetings, (m: any) => m.meetingDate).map((yearGroup) => (
                      <Collapsible key={yearGroup.year} defaultOpen={false}>
                        <CollapsibleTrigger className="group flex items-center gap-2 w-full p-3 rounded-lg bg-primary/5 hover-elevate" data-testid={`toggle-meetings-year-${yearGroup.year}`}>
                          <ChevronRight className="h-4 w-4 text-primary transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                          <FolderOpen className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary">{yearGroup.year}</span>
                          <Badge variant="secondary" className="ml-auto">{yearGroup.totalCount}</Badge>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 mt-2 space-y-2">
                          {yearGroup.months.map((monthGroup) => (
                            <Collapsible key={monthGroup.month} defaultOpen={false}>
                              <CollapsibleTrigger className="group flex items-center gap-2 w-full p-2 rounded-md bg-primary/5 hover-elevate" data-testid={`toggle-meetings-month-${yearGroup.year}-${monthGroup.month}`}>
                                <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                                <span className="font-medium">{monthGroup.monthName}</span>
                                <Badge variant="outline" className="ml-auto text-xs">{monthGroup.totalCount}</Badge>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-4 mt-2 space-y-2">
                                {monthGroup.days.map((dayGroup) => (
                                  <div key={dayGroup.date} className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                                      <Calendar className="h-3 w-3" />
                                      <span className="font-medium">{dayGroup.formattedDate}</span>
                                      <span className="text-xs">({dayGroup.items.length})</span>
                                    </div>
                                    <div className="space-y-2 pl-5">
                                      {dayGroup.items.map((meeting: any) => (
                                        <div key={meeting.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                                          <div className="p-2 bg-cyan-500/10 rounded-lg">
                                            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">{meeting.conductedByName}</div>
                                            <div className="text-xs text-muted-foreground">{meeting.projectName || 'Project meeting'}</div>
                                          </div>
                                          <Button size="sm" variant="outline" onClick={() => downloadToolboxMeeting(meeting)} data-testid={`download-toolbox-meeting-tab-${meeting.id}`}>
                                            <Download className="h-3 w-3 mr-1" />
                                            PDF
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                      <Calendar className="h-8 w-8 text-primary/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No toolbox meetings recorded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Safety meetings will be documented here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Damage Reports Tab */}
          <TabsContent value="damage-reports">
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Equipment Damage Reports</CardTitle>
                    <p className="text-sm text-muted-foreground">Documentation of equipment damage and retirements</p>
                  </div>
                  <Badge variant="secondary" className="text-base font-semibold px-3">
                    {damageReports.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {damageReports.length > 0 ? (
                  <div className="space-y-2">
                    {groupDocumentsByDate(damageReports, (r: any) => r.discoveredDate || r.createdAt).map((yearGroup) => (
                      <Collapsible key={yearGroup.year} defaultOpen={yearGroup.year === new Date().getFullYear()}>
                        <CollapsibleTrigger className="group flex items-center gap-2 w-full p-3 rounded-lg bg-primary/5 hover-elevate" data-testid={`toggle-damage-year-${yearGroup.year}`}>
                          <ChevronRight className="h-4 w-4 text-primary transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                          <FolderOpen className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary">{yearGroup.year}</span>
                          <Badge variant="secondary" className="ml-auto">{yearGroup.totalCount}</Badge>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 mt-2 space-y-2">
                          {yearGroup.months.map((monthGroup) => (
                            <Collapsible key={monthGroup.month} defaultOpen={false}>
                              <CollapsibleTrigger className="group flex items-center gap-2 w-full p-2 rounded-md bg-primary/5 hover-elevate" data-testid={`toggle-damage-month-${yearGroup.year}-${monthGroup.month}`}>
                                <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                                <span className="font-medium">{monthGroup.monthName}</span>
                                <Badge variant="outline" className="ml-auto text-xs">{monthGroup.totalCount}</Badge>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-4 mt-2 space-y-2">
                                {monthGroup.days.map((dayGroup) => (
                                  <div key={dayGroup.date} className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                                      <Calendar className="h-3 w-3" />
                                      <span className="font-medium">{dayGroup.formattedDate}</span>
                                      <span className="text-xs">({dayGroup.items.length})</span>
                                    </div>
                                    <div className="space-y-2 pl-5">
                                      {dayGroup.items.map((report: any) => (
                                        <div key={report.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                                          <div className="p-2 bg-primary/10 rounded-lg">
                                            <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="font-medium text-sm">{report.equipmentType || 'Equipment'}</span>
                                              <Badge variant="secondary" className="capitalize text-xs">
                                                {report.damageSeverity}
                                              </Badge>
                                              {report.equipmentRetired && (
                                                <Badge variant="destructive" className="text-xs">Retired</Badge>
                                              )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {report.equipmentBrand} {report.equipmentModel} - Reported by {report.reporterName}
                                            </div>
                                          </div>
                                          <Button size="sm" variant="outline" onClick={() => downloadDamageReportPdf(report)} data-testid={`download-damage-report-${report.id}`}>
                                            <Download className="h-3 w-3 mr-1" />
                                            PDF
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                      <AlertTriangle className="h-8 w-8 text-primary/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No damage reports recorded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Equipment damage reports will appear here once reported</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rope Access Plans - Only visible if user has safety document permission */}
        {canViewSafety && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-teal-500/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{t('documents.ropeAccessPlans', 'Rope Access Plans')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('documents.ropeAccessPlansDesc', 'Project-specific access plans and documentation')}</p>
                </div>
                <Badge variant="secondary" className="text-base font-semibold px-3">
                  {allDocuments.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {allDocuments.length > 0 ? (
                <div className="space-y-2">
                  {groupDocumentsByDate(allDocuments, (d: any) => d.date).map((yearGroup) => (
                    <Collapsible key={yearGroup.year} defaultOpen={false}>
                      <CollapsibleTrigger className="group flex items-center gap-2 w-full p-3 rounded-lg bg-primary/5 hover-elevate" data-testid={`toggle-docs-year-${yearGroup.year}`}>
                        <ChevronRight className="h-4 w-4 text-primary transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                        <FolderOpen className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">{yearGroup.year}</span>
                        <Badge variant="secondary" className="ml-auto">{yearGroup.totalCount}</Badge>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 mt-2 space-y-2">
                        {yearGroup.months.map((monthGroup) => (
                          <Collapsible key={monthGroup.month} defaultOpen={false}>
                            <CollapsibleTrigger className="group flex items-center gap-2 w-full p-2 rounded-md bg-primary/5 hover-elevate" data-testid={`toggle-docs-month-${yearGroup.year}-${monthGroup.month}`}>
                              <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                              <span className="font-medium">{monthGroup.monthName}</span>
                              <Badge variant="outline" className="ml-auto text-xs">{monthGroup.totalCount}</Badge>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4 mt-2 space-y-2">
                              {monthGroup.days.map((dayGroup) => (
                                <div key={dayGroup.date} className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                                    <Calendar className="h-3 w-3" />
                                    <span className="font-medium">{dayGroup.formattedDate}</span>
                                    <span className="text-xs">({dayGroup.items.length})</span>
                                  </div>
                                  <div className="space-y-2 pl-5">
                                    {dayGroup.items.map((doc: any, index: number) => {
                                      const filename = doc.url.split('/').pop() || 'Document';
                                      return (
                                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                                          <div className="p-2 bg-primary/10 rounded-lg">
                                            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{doc.projectName}</div>
                                            <div className="text-xs text-muted-foreground truncate">{filename}</div>
                                          </div>
                                          <Button size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank')} data-testid={`download-doc-${index}`}>
                                            <Download className="h-3 w-3 mr-1" />
                                            Download
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-primary/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">{t('documents.noRopeAccessPlans', 'No rope access plans uploaded yet')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('documents.noRopeAccessPlansDesc', 'Plans will appear here when added to projects')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Toolbox Meetings */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl ring-1 ring-cyan-500/20">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">{t('documents.toolboxMeetingRecords', 'Toolbox Meeting Records')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('documents.toolboxMeetingRecordsDesc', 'Daily safety briefings and discussions')}</p>
              </div>
              <Badge variant="secondary" className="text-base font-semibold px-3">
                {meetings.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {meetings.length > 0 ? (
              <div className="space-y-2">
                {groupDocumentsByDate(meetings, (m: any) => m.meetingDate).map((yearGroup) => (
                  <Collapsible key={yearGroup.year} defaultOpen={false}>
                    <CollapsibleTrigger className="group flex items-center gap-2 w-full p-3 rounded-lg bg-primary/5 hover-elevate" data-testid={`toggle-meetings-outer-year-${yearGroup.year}`}>
                      <ChevronRight className="h-4 w-4 text-primary transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">{yearGroup.year}</span>
                      <Badge variant="secondary" className="ml-auto">{yearGroup.totalCount}</Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 mt-2 space-y-2">
                      {yearGroup.months.map((monthGroup) => (
                        <Collapsible key={monthGroup.month} defaultOpen={false}>
                          <CollapsibleTrigger className="group flex items-center gap-2 w-full p-2 rounded-md bg-primary/5 hover-elevate" data-testid={`toggle-meetings-outer-month-${yearGroup.year}-${monthGroup.month}`}>
                            <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                            <span className="font-medium">{monthGroup.monthName}</span>
                            <Badge variant="outline" className="ml-auto text-xs">{monthGroup.totalCount}</Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 mt-2 space-y-2">
                            {monthGroup.days.map((dayGroup) => (
                              <div key={dayGroup.date} className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-medium">{dayGroup.formattedDate}</span>
                                  <span className="text-xs">({dayGroup.items.length})</span>
                                </div>
                                <div className="space-y-2 pl-5">
                                  {dayGroup.items.map((meeting: any) => (
                                    <div key={meeting.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                                      <div className="p-2 bg-cyan-500/10 rounded-lg">
                                        <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{meeting.conductedByName}</div>
                                        <div className="text-xs text-muted-foreground">{meeting.projectName || 'Team meeting'}</div>
                                      </div>
                                      <Button size="sm" variant="outline" onClick={() => downloadToolboxMeeting(meeting)} data-testid={`download-meeting-outer-${meeting.id}`}>
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-primary/50" />
                </div>
                <p className="text-muted-foreground font-medium">{t('documents.noToolboxMeetings', 'No toolbox meetings recorded yet')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('documents.noToolboxMeetingsDesc', 'Safety meetings will appear here when conducted')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FLHA Forms - Only visible to users with safety document permission */}
        {canViewSafety && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/10 rounded-xl ring-1 ring-orange-500/20">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{t('documents.flhaRecords', 'FLHA Records')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('documents.flhaRecordsDesc', 'Field-level hazard assessments')}</p>
                </div>
                <Badge variant="secondary" className="text-base font-semibold px-3">
                  {flhaForms.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {flhaForms.length > 0 && (
                <div className="mb-4">
                  <DateRangeExport
                    documents={flhaForms}
                    getDateFn={(f: any) => f.assessmentDate}
                    generatePdf={generateFlhaPdfBlob}
                    documentType="FLHA"
                    colorClass="text-orange-600 dark:text-orange-400"
                  />
                </div>
              )}
              {flhaForms.length > 0 ? (
                <div className="space-y-2">
                  {groupDocumentsByDate(flhaForms, (f: any) => f.assessmentDate).map((yearGroup) => (
                    <Collapsible key={yearGroup.year} defaultOpen={false}>
                      <CollapsibleTrigger className="group flex items-center gap-2 w-full p-3 rounded-lg bg-orange-500/5 hover-elevate" data-testid={`toggle-flha-year-${yearGroup.year}`}>
                        <ChevronRight className="h-4 w-4 text-orange-600 dark:text-orange-400 transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                        <FolderOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span className="font-semibold text-orange-600 dark:text-orange-400">{yearGroup.year}</span>
                        <Badge variant="secondary" className="ml-auto">{yearGroup.totalCount}</Badge>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 mt-2 space-y-2">
                        {yearGroup.months.map((monthGroup) => (
                          <Collapsible key={monthGroup.month} defaultOpen={false}>
                            <CollapsibleTrigger className="group flex items-center gap-2 w-full p-2 rounded-md bg-orange-500/5 hover-elevate" data-testid={`toggle-flha-month-${yearGroup.year}-${monthGroup.month}`}>
                              <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                              <span className="font-medium">{monthGroup.monthName}</span>
                              <Badge variant="outline" className="ml-auto text-xs">{monthGroup.totalCount}</Badge>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4 mt-2 space-y-2">
                              {monthGroup.days.map((dayGroup) => (
                                <div key={dayGroup.date} className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                                    <Calendar className="h-3 w-3" />
                                    <span className="font-medium">{dayGroup.formattedDate}</span>
                                    <span className="text-xs">({dayGroup.items.length})</span>
                                  </div>
                                  <div className="space-y-2 pl-5">
                                    {dayGroup.items.map((flha: any) => (
                                      <div key={flha.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                                        <div className="p-2 bg-orange-500/10 rounded-lg">
                                          <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-sm">Assessor: {flha.assessorName}</div>
                                          <div className="text-xs text-muted-foreground">{flha.projectName || 'Field assessment'}</div>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => downloadFlhaForm(flha)} data-testid={`download-flha-${flha.id}`}>
                                          <Download className="h-3 w-3 mr-1" />
                                          PDF
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-orange-500/5 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-orange-500/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">{t('documents.noFlhaForms', 'No FLHA forms recorded yet')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('documents.noFlhaFormsDesc', 'Hazard assessments will appear here when completed')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Incident Reports - Only visible to users with safety document permission */}
        {canViewSafety && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{t('documents.incidentReports', 'Incident Reports')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('documents.incidentReportsDesc', 'Safety incidents and accident reports')}</p>
                </div>
                <Badge variant="secondary" className="text-base font-semibold px-3">
                  {incidentReports.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {incidentReports.length > 0 && (
                <div className="mb-4">
                  <DateRangeExport
                    documents={incidentReports}
                    getDateFn={(r: any) => r.incidentDate}
                    generatePdf={generateIncidentPdfBlob}
                    documentType="Incidents"
                    colorClass="text-red-600 dark:text-red-400"
                  />
                </div>
              )}
              {incidentReports.length > 0 ? (
                <div className="space-y-2">
                  {groupDocumentsByDate(incidentReports, (r: any) => r.incidentDate).map((yearGroup) => (
                    <Collapsible key={yearGroup.year} defaultOpen={false}>
                      <CollapsibleTrigger className="group flex items-center gap-2 w-full p-3 rounded-lg bg-red-500/5 hover-elevate" data-testid={`toggle-incidents-year-${yearGroup.year}`}>
                        <ChevronRight className="h-4 w-4 text-red-600 dark:text-red-400 transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                        <FolderOpen className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="font-semibold text-red-600 dark:text-red-400">{yearGroup.year}</span>
                        <Badge variant="secondary" className="ml-auto">{yearGroup.totalCount}</Badge>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 mt-2 space-y-2">
                        {yearGroup.months.map((monthGroup) => (
                          <Collapsible key={monthGroup.month} defaultOpen={false}>
                            <CollapsibleTrigger className="group flex items-center gap-2 w-full p-2 rounded-md bg-red-500/5 hover-elevate" data-testid={`toggle-incidents-month-${yearGroup.year}-${monthGroup.month}`}>
                              <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                              <span className="font-medium">{monthGroup.monthName}</span>
                              <Badge variant="outline" className="ml-auto text-xs">{monthGroup.totalCount}</Badge>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4 mt-2 space-y-2">
                              {monthGroup.days.map((dayGroup) => (
                                <div key={dayGroup.date} className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                                    <Calendar className="h-3 w-3" />
                                    <span className="font-medium">{dayGroup.formattedDate}</span>
                                    <span className="text-xs">({dayGroup.items.length})</span>
                                  </div>
                                  <div className="space-y-2 pl-5">
                                    {dayGroup.items.map((report: any) => (
                                      <div key={report.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                                        <div className="p-2 bg-red-500/10 rounded-lg">
                                          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-sm">
                                            {report.incidentType || 'Incident'}
                                            {report.location && <span className="text-muted-foreground font-normal"> - {report.location}</span>}
                                          </div>
                                          {report.description && (
                                            <div className="text-xs text-muted-foreground line-clamp-1">{report.description}</div>
                                          )}
                                        </div>
                                        {report.severity && (
                                          <Badge 
                                            variant={
                                              report.severity === 'critical' ? 'destructive' :
                                              report.severity === 'major' ? 'destructive' :
                                              report.severity === 'moderate' ? 'default' :
                                              'secondary'
                                            }
                                            className="text-xs"
                                          >
                                            {report.severity}
                                          </Badge>
                                        )}
                                        <Button size="sm" variant="outline" onClick={() => downloadIncidentReport(report)} data-testid={`download-incident-${report.id}`}>
                                          <Download className="h-3 w-3 mr-1" />
                                          PDF
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-red-500/5 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-500/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">{t('documents.noIncidentReports', 'No incident reports recorded yet')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('documents.noIncidentReportsDesc', 'Safety incidents will be documented here')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Method Statements */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">{t('documents.methodStatements', 'Method Statements')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('documents.methodStatementsDesc', 'Work procedures and safety methods')}</p>
              </div>
              <Badge variant="secondary" className="text-base font-semibold px-3">
                {methodStatements.length + methodStatementDocs.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Upload Method Statement Document */}
            {canUploadDocuments && (
              <div className="mb-6 p-5 border-2 border-dashed rounded-xl bg-primary/5 hover-elevate">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-semibold flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {t('documents.uploadMethodStatement', 'Upload Your Own Method Statement')}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {t('documents.uploadMethodStatementDesc', "Upload your company's method statement document for a specific job type to satisfy compliance requirements.")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowMethodStatementUploadDialog(true)}
                    data-testid="button-upload-method-statement"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('documents.uploadDocument', 'Upload Document')}
                  </Button>
                </div>
              </div>
            )}

            {/* Uploaded Method Statement Documents by Job Type */}
            {methodStatementDocs.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  Uploaded Method Statement Documents
                </h4>
                <div className="space-y-2">
                  {methodStatementDocs.map((doc: any) => (
                    <div key={doc.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{doc.fileName}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {formatJobType(doc.jobType, doc.customJobType)}
                          </Badge>
                          <span>{t('documents.uploadedBy', 'Uploaded by {{name}}', { name: doc.uploadedByName })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => window.open(doc.fileUrl, '_blank')} data-testid={`view-method-doc-${doc.id}`}>
                          <Download className="h-3 w-3 mr-1" />
                          {t('documents.view', 'View')}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDocumentMutation.mutate(doc.id)}
                          data-testid={`delete-method-doc-${doc.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {methodStatements.length > 0 && (
              <div className="mb-4">
                <DateRangeExport
                  documents={methodStatements}
                  getDateFn={(s: any) => s.dateCreated}
                  generatePdf={generateMethodStatementPdfBlob}
                  documentType="Methods"
                  colorClass="text-primary"
                />
              </div>
            )}
            {methodStatements.length > 0 ? (
              <div className="space-y-2">
                {groupDocumentsByDate(methodStatements, (s: any) => s.dateCreated).map((yearGroup) => (
                  <Collapsible key={yearGroup.year} defaultOpen={false}>
                    <CollapsibleTrigger className="group flex items-center gap-2 w-full p-3 rounded-lg bg-primary/5 hover-elevate" data-testid={`toggle-methods-year-${yearGroup.year}`}>
                      <ChevronRight className="h-4 w-4 text-primary transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">{yearGroup.year}</span>
                      <Badge variant="secondary" className="ml-auto">{yearGroup.totalCount}</Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 mt-2 space-y-2">
                      {yearGroup.months.map((monthGroup) => (
                        <Collapsible key={monthGroup.month} defaultOpen={false}>
                          <CollapsibleTrigger className="group flex items-center gap-2 w-full p-2 rounded-md bg-primary/5 hover-elevate" data-testid={`toggle-methods-month-${yearGroup.year}-${monthGroup.month}`}>
                            <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                            <span className="font-medium">{monthGroup.monthName}</span>
                            <Badge variant="outline" className="ml-auto text-xs">{monthGroup.totalCount}</Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 mt-2 space-y-2">
                            {monthGroup.days.map((dayGroup) => (
                              <div key={dayGroup.date} className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-medium">{dayGroup.formattedDate}</span>
                                  <span className="text-xs">({dayGroup.items.length})</span>
                                </div>
                                <div className="space-y-2 pl-5">
                                  {dayGroup.items.map((statement: any) => (
                                    <div key={statement.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover-elevate active-elevate-2">
                                      <div className="p-2 bg-primary/10 rounded-lg">
                                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{statement.location || 'Method Statement'}</div>
                                        <div className="text-xs text-muted-foreground">Prepared by {statement.preparedByName}</div>
                                        {statement.workDescription && (
                                          <div className="text-xs text-muted-foreground line-clamp-1">{statement.workDescription}</div>
                                        )}
                                      </div>
                                      <Badge variant={statement.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                                        {statement.status || 'draft'}
                                      </Badge>
                                      <Button size="sm" variant="outline" onClick={() => downloadMethodStatement(statement, currentUser)} data-testid={`download-method-statement-${statement.id}`}>
                                        <Download className="h-3 w-3 mr-1" />
                                        PDF
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-primary/50" />
                </div>
                <p className="text-muted-foreground font-medium">{t('documents.noMethodStatements', 'No method statements recorded yet')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('documents.noMethodStatementsDesc', 'Work procedures will be documented here')}</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Method Statement Upload Dialog */}
      <Dialog open={showMethodStatementUploadDialog} onOpenChange={(open) => {
        setShowMethodStatementUploadDialog(open);
        if (!open) {
          setMethodStatementJobType("");
          setMethodStatementCustomJobType("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Method Statement Document</DialogTitle>
            <DialogDescription>
              Upload your company's method statement for a specific job type. This will count toward your CSR compliance for that job type.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Job Type *</Label>
              <Select value={methodStatementJobType} onValueChange={(value) => {
                setMethodStatementJobType(value);
                if (value !== 'other') {
                  setMethodStatementCustomJobType("");
                }
              }}>
                <SelectTrigger data-testid="select-method-statement-job-type">
                  <SelectValue placeholder="Select job type for this method statement" />
                </SelectTrigger>
                <SelectContent>
                  {STANDARD_JOB_TYPES.map((jobType) => (
                    <SelectItem key={jobType.value} value={jobType.value} data-testid={`select-job-type-${jobType.value}`}>
                      {t(jobType.labelKey, jobType.value.replace(/_/g, ' '))}
                    </SelectItem>
                  ))}
                  {customJobTypes.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-t mt-1 pt-2">
                        Custom Job Types
                      </div>
                      {customJobTypes.map((customType) => (
                        <SelectItem key={`custom:${customType.name}`} value={`custom:${customType.name}`}>
                          {customType.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            {methodStatementJobType === 'other' && (
              <div className="space-y-2">
                <Label>Custom Job Type Name *</Label>
                <Input
                  type="text"
                  placeholder="Enter custom job type name"
                  value={methodStatementCustomJobType}
                  onChange={(e) => setMethodStatementCustomJobType(e.target.value)}
                  data-testid="input-custom-job-type"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a descriptive name for this custom job type
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Document File *</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                disabled={uploadingMethodStatement || !methodStatementJobType || (methodStatementJobType === 'other' && !methodStatementCustomJobType.trim())}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && methodStatementJobType) {
                    handleMethodStatementUpload(file, methodStatementJobType, methodStatementCustomJobType);
                    e.target.value = '';
                  }
                }}
                data-testid="input-method-statement-upload"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
            {uploadingMethodStatement && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading document...
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowMethodStatementUploadDialog(false);
              setMethodStatementJobType("");
              setMethodStatementCustomJobType("");
            }}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
