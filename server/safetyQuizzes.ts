// Pre-built Safety Practice Quizzes
// SWP Quizzes for each job type, FLHA Quiz, and Harness Inspection Quiz
// Each quiz has 20 questions with 4 multiple choice options

import { QuizQuestion } from './certificationQuizzes';

export interface SafetyQuiz {
  quizType: string;
  title: string;
  category: "swp" | "flha" | "harness" | "general_safety";
  jobType?: string; // For SWP quizzes
  questions: QuizQuestion[];
}

// Window Cleaning SWP Quiz
const swpWindowCleaningQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the minimum strength requirement for rope access anchor points in window cleaning?", options: { A: "5 kN", B: "10 kN", C: "15 kN", D: "20 kN" }, correctAnswer: "C" },
  { questionNumber: 2, question: "What wind speed threshold should trigger cessation of rope access window cleaning work?", options: { A: "20 km/h", B: "30 km/h", C: "40 km/h", D: "50 km/h" }, correctAnswer: "C" },
  { questionNumber: 3, question: "What is the primary purpose of establishing ground-level exclusion zones during window cleaning?", options: { A: "To prevent public access for privacy", B: "To protect pedestrians from falling objects", C: "To reserve parking spaces", D: "To mark the work schedule" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What type of harness is required for rope access window cleaning?", options: { A: "Waist belt only", B: "Chest harness only", C: "Full body harness with front and rear attachment points", D: "Sit harness only" }, correctAnswer: "C" },
  { questionNumber: 5, question: "What is the minimum helmet standard required for rope access window cleaning?", options: { A: "EN 812", B: "EN 397", C: "EN 166", D: "EN 352" }, correctAnswer: "B" },
  { questionNumber: 6, question: "How should tools be secured when working at height during window cleaning?", options: { A: "In pockets only", B: "Held in hands", C: "Secured with tool lanyards or in a tool bag", D: "Placed on window ledges" }, correctAnswer: "C" },
  { questionNumber: 7, question: "What is the minimum rope diameter recommended for rope access window cleaning?", options: { A: "8 mm", B: "9 mm", C: "10.5 mm", D: "12 mm" }, correctAnswer: "C" },
  { questionNumber: 8, question: "What action should be taken immediately if suspension trauma is suspected?", options: { A: "Wait for the ambulance", B: "Initiate rescue within 10 minutes", C: "Let the person rest for 30 minutes", D: "Continue monitoring" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What is the minimum team size for rope access window cleaning operations?", options: { A: "1 person", B: "2 people", C: "3 people", D: "4 people" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What type of cleaning solution is preferred for exterior window cleaning?", options: { A: "Any household cleaner", B: "Industrial solvents", C: "Approved, biodegradable solutions", D: "Acid-based cleaners" }, correctAnswer: "C" },
  { questionNumber: 11, question: "What is the purpose of rope protectors in window cleaning operations?", options: { A: "To add weight to the rope", B: "To mark the rope", C: "To prevent rope damage from sharp edges", D: "To make the rope waterproof" }, correctAnswer: "C" },
  { questionNumber: 12, question: "Before going over the edge, what safety check must be performed?", options: { A: "Check the weather forecast", B: "Buddy-check of all PPE and attachments", C: "Count all tools", D: "Take a photo" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What is the minimum IRATA certification level required for window cleaning?", options: { A: "No certification needed", B: "Level 1 minimum", C: "Level 2 minimum", D: "Level 3 only" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What communication device should all rope access personnel carry?", options: { A: "Mobile phone only", B: "Whistle only", C: "Two-way radio", D: "Megaphone" }, correctAnswer: "C" },
  { questionNumber: 15, question: "What should be done if severe weather develops during operations?", options: { A: "Speed up the work", B: "Continue as normal", C: "Immediate controlled ascent to safety", D: "Wait on the rope for conditions to improve" }, correctAnswer: "C" },
  { questionNumber: 16, question: "What documentation should be available on site for cleaning chemicals?", options: { A: "Purchase receipts", B: "Safety Data Sheets (SDS)", C: "Brand brochures", D: "Mixing instructions only" }, correctAnswer: "B" },
  { questionNumber: 17, question: "How often should anchor points be inspected and confirmed for load ratings?", options: { A: "Annually", B: "Monthly", C: "Before each work session", D: "When damage is visible" }, correctAnswer: "C" },
  { questionNumber: 18, question: "What should be inspected on the harness before each use?", options: { A: "Color only", B: "Webbing, stitching, and hardware", C: "Brand name", D: "Weight" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What is the correct technique when descending for window cleaning?", options: { A: "Free fall descent", B: "Controlled manner maintaining three points of contact", C: "Rapid descent to save time", D: "Bounce against the building" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What must be in place before any rope access window cleaning begins?", options: { A: "Coffee break schedule", B: "Rescue plan with trained rescue team available", C: "Marketing materials", D: "Customer payment" }, correctAnswer: "B" }
];

// Dryer Vent Cleaning SWP Quiz
const swpDryerVentCleaningQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the primary fire-related hazard when cleaning dryer vents?", options: { A: "Electrical sparks", B: "Highly flammable lint accumulation", C: "Gas leaks", D: "Chemical reactions" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What type of respiratory protection is recommended when disturbing lint accumulation?", options: { A: "No protection needed", B: "Cloth mask", C: "P2 minimum respirator", D: "Surgical mask" }, correctAnswer: "C" },
  { questionNumber: 3, question: "What type of tools should be used to minimize fire ignition risk?", options: { A: "Any metal tools", B: "Anti-static tools", C: "Wooden tools only", D: "Plastic tools only" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What type of vacuum system is required for dryer vent cleaning?", options: { A: "Standard household vacuum", B: "Shop vacuum", C: "Vacuum with HEPA filtration", D: "Wet/dry vacuum" }, correctAnswer: "C" },
  { questionNumber: 5, question: "Before accessing vents, what assessment should be performed?", options: { A: "Color assessment", B: "Pest assessment", C: "Size assessment", D: "Brand assessment" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What should be verified is available on site during dryer vent cleaning?", options: { A: "Extra lint bags", B: "Fire extinguisher", C: "Extra brushes", D: "Cleaning solution" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What should be done before using rotary brushes in the duct?", options: { A: "Apply lubricant", B: "Vacuum loose lint first", C: "Wet the duct", D: "Heat the duct" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What equipment should be used to verify duct cleanliness after cleaning?", options: { A: "Flashlight", B: "Inspection camera/borescope", C: "Mirror", D: "Measuring tape" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What biological hazards might be encountered in dryer vents?", options: { A: "Toxic gases", B: "Mold, bird nests, pest infestations", C: "Radioactive materials", D: "Chemical waste" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What immediate action should be taken if fire is detected during vent cleaning?", options: { A: "Continue cleaning to remove fuel source", B: "Suspend work immediately", C: "Call supervisor first", D: "Document the fire" }, correctAnswer: "B" },
  { questionNumber: 11, question: "How should removed lint and debris be handled?", options: { A: "Left at the building", B: "Thrown in regular trash", C: "Secured containment and proper disposal", D: "Compressed into blocks" }, correctAnswer: "C" },
  { questionNumber: 12, question: "What type of eye protection is recommended for dryer vent cleaning?", options: { A: "No protection needed", B: "Safety glasses with dust protection", C: "Sunglasses", D: "Reading glasses" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What should be done if a confined space hazard is identified when accessing ductwork?", options: { A: "Proceed with caution", B: "Proper ventilation assessment before entry", C: "Work faster", D: "Use a fan" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What should be documented during dryer vent inspection?", options: { A: "Weather conditions only", B: "Vent condition with photos", C: "Worker names only", D: "Time of day only" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What type of gloves are recommended for dryer vent cleaning?", options: { A: "Latex gloves", B: "Cut resistant gloves", C: "Cotton gloves", D: "No gloves needed" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What should be done with vent covers after cleaning?", options: { A: "Discard them", B: "Replace or reinstall securely", C: "Leave them off for airflow", D: "Paint them" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What training is required for dryer vent cleaning technicians?", options: { A: "No specific training", B: "Training in dryer vent cleaning techniques and fire hazards", C: "Only first aid", D: "Only customer service" }, correctAnswer: "B" },
  { questionNumber: 18, question: "Why should a ground exclusion zone be established for rope access dryer vent cleaning?", options: { A: "To reserve parking", B: "To protect from falling debris", C: "To impress clients", D: "To mark territory" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What is the purpose of using a rotary brush system?", options: { A: "To polish the duct", B: "To clean duct interior effectively", C: "To measure duct diameter", D: "To seal the duct" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What emergency procedure applies if a rope access emergency occurs during vent cleaning?", options: { A: "Wait for building manager", B: "Initiate rescue plan", C: "Call police first", D: "Document the situation" }, correctAnswer: "B" }
];

// Building Wash SWP Quiz
const swpBuildingWashQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "What is a major injury risk specific to pressure washing operations?", options: { A: "Sunburn", B: "High pressure water injection injuries", C: "Dehydration", D: "Muscle strain" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What action should be taken if an injection injury occurs?", options: { A: "Apply ice", B: "Stop immediately and seek medical attention", C: "Continue working", D: "Bandage the wound" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What electrical safety measure may be required near external electrical installations?", options: { A: "Faster work pace", B: "Electrical isolation of fittings", C: "Using metal nozzles", D: "Working in wet conditions" }, correctAnswer: "B" },
  { questionNumber: 4, question: "Why should pressure limits be set for each surface type?", options: { A: "To save water", B: "To prevent building material damage", C: "To reduce noise", D: "To save time" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What PPE is specifically needed when using chemical treatments during building wash?", options: { A: "Sun hat", B: "Respirator", C: "Knee pads", D: "Back brace" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What type of ground exclusion zone is needed for pressure washing?", options: { A: "Smaller than normal", B: "Extended zones due to water spray", C: "No zone needed", D: "Only at entry points" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What hearing protection requirement applies during pressure washing?", options: { A: "Optional", B: "Mandatory hearing protection", C: "Only for supervisors", D: "Only in enclosed spaces" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What should be done before applying pressure to any surface?", options: { A: "Apply maximum pressure", B: "Surface assessment", C: "Skip inspection", D: "Use smallest nozzle" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What is the correct washing direction for building exteriors?", options: { A: "Bottom to top", B: "Top to bottom", C: "Side to side", D: "Random pattern" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What is the typical recommended distance from the surface when pressure washing?", options: { A: "5-10 cm", B: "30-60 cm", C: "100-150 cm", D: "200+ cm" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What should be done with chemical spills during building washing?", options: { A: "Ignore them", B: "Contain and neutralize per SDS", C: "Wash away with water only", D: "Report at end of day" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What items should be protected before pressure washing begins?", options: { A: "Only the main entrance", B: "Windows, vents, and electrical items", C: "Only the roof", D: "Only landscaping" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What waterproof PPE is required for building wash operations?", options: { A: "No special clothing", B: "Waterproof coveralls or rain suit", C: "Cotton overalls", D: "Regular work clothes" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What should be verified before starting the pressure washer?", options: { A: "Paint color", B: "Water supply adequacy and hose condition", C: "Brand name", D: "Age of equipment" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the purpose of allowing dwell time after applying detergent?", options: { A: "To take a break", B: "To allow the detergent to work effectively", C: "To dry the surface", D: "To save water" }, correctAnswer: "B" },
  { questionNumber: 16, question: "How should hose runs be managed during rope access pressure washing?", options: { A: "Run them through the ropes", B: "Prevent tangles with climbing ropes", C: "Let them hang freely", D: "Tape them to the building" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What footwear is required for building wash operations?", options: { A: "Sandals", B: "Waterproof, non-slip safety boots", C: "Regular sneakers", D: "Flip-flops" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What slip hazard exists during building wash operations?", options: { A: "Ice", B: "Wet surfaces from pressure washing", C: "Oil spills", D: "Sand" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What IRATA level is recommended for complex facade washing?", options: { A: "No certification", B: "Level 2 or higher", C: "Level 1 only", D: "Any level" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What environmental controls should be in place before washing?", options: { A: "None needed", B: "Spill containment and proper drainage", C: "Only weather monitoring", D: "Only noise control" }, correctAnswer: "B" }
];

// In-Suite Dryer Vent SWP Quiz
const swpInSuiteDryerVentQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "What must be done to the dryer before beginning in-suite vent cleaning?", options: { A: "Turn it on", B: "Disconnect from power (unplug or isolate)", C: "Move it closer to the wall", D: "Add more clothes" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What is the recommended team size for moving appliances?", options: { A: "One person", B: "Two-person team", C: "Three people", D: "No specific requirement" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What should be placed on the floor in the work area?", options: { A: "Newspapers", B: "Protective floor coverings", C: "Cardboard boxes", D: "Towels" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What should be documented before starting work in a resident's unit?", options: { A: "Weather conditions", B: "Pre-existing conditions with photographs", C: "Resident's schedule", D: "Building address" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What identification should technicians have when entering residential units?", options: { A: "Personal ID only", B: "Company uniform and ID badge", C: "Verbal introduction only", D: "Business card" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What should be done first when arriving at a resident's unit?", options: { A: "Start work immediately", B: "Introduce yourself and show identification", C: "Inspect the dryer", D: "Move furniture" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What should be explained to the resident before starting work?", options: { A: "Company history", B: "Work to be performed and estimated duration", C: "Other clients in the building", D: "Equipment costs" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What type of footwear is appropriate for in-suite work?", options: { A: "Outdoor boots", B: "Safety footwear with non-marking soles", C: "Sandals", D: "Slippers" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What should be done after reconnecting the duct to the dryer?", options: { A: "Leave immediately", B: "Ensure secure, sealed connection", C: "Add extra tape", D: "Test with maximum heat" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What action should be taken if a pest infestation is discovered?", options: { A: "Continue cleaning", B: "Stop work, notify resident and supervisor", C: "Remove pests yourself", D: "Ignore it" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What training is needed for customer service in residential settings?", options: { A: "No training needed", B: "Professional conduct and customer service skills", C: "Sales training only", D: "Technical training only" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What should be done at the end of the in-suite cleaning job?", options: { A: "Leave quickly", B: "Have resident confirm satisfactory completion", C: "Leave a bill", D: "Schedule next appointment" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What emergency action is required if fire is detected in a residential unit?", options: { A: "Use the dryer to extinguish", B: "Evacuate unit immediately, call 911", C: "Close the door and wait", D: "Continue working" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What should be done for electrical shock incidents?", options: { A: "Touch the victim", B: "Do not touch victim, isolate power, call for help", C: "Pour water on victim", D: "Wait for recovery" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What type of knee protection is recommended for floor work?", options: { A: "None needed", B: "Knee pads", C: "Cardboard", D: "Towels" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What should be verified before entering a residential building?", options: { A: "Number of units", B: "Building policies for contractor access", C: "Building age", D: "Paint color" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What should be confirmed regarding resident appointments?", options: { A: "Building layout", B: "Access and appointment time", C: "Parking rates", D: "Weather conditions" }, correctAnswer: "B" },
  { questionNumber: 18, question: "After moving the dryer, what inspection should be performed?", options: { A: "Dryer age", B: "Duct condition and any damage", C: "Dryer color", D: "Dryer brand" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What test should be performed after reconnecting power to the dryer?", options: { A: "No testing needed", B: "Brief operation test", C: "Full cycle test", D: "Heat test only" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What should be done with all debris after cleaning?", options: { A: "Leave in the unit", B: "Clean up and remove all debris", C: "Put in resident's garbage", D: "Vacuum into HVAC" }, correctAnswer: "B" }
];

// Parkade Pressure Cleaning SWP Quiz
const swpParkadePressureQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "What is a primary hazard in parkade cleaning operations?", options: { A: "Sunburn", B: "Vehicle traffic in active parking areas", C: "Wildlife", D: "Noise from outside" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What type of hazard exists in underground parking structures related to air quality?", options: { A: "Pollen", B: "Carbon monoxide from vehicle exhaust", C: "High humidity", D: "Dust from outside" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What equipment should be used in enclosed parkades for air quality monitoring?", options: { A: "Thermometer", B: "CO monitor", C: "Humidity gauge", D: "Wind meter" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What electrical protection is required for equipment in standing water conditions?", options: { A: "No protection needed", B: "GFCI protection", C: "Extra long cords", D: "Metal casings" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What traffic management measure is required during parkade cleaning?", options: { A: "No measures needed", B: "Barriers and signage with section closure", C: "Verbal warnings only", D: "Parking attendant" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What should be done before starting pressure washing in a parkade?", options: { A: "Start immediately", B: "Coordinate with building management for section closures", C: "Wait for all cars to leave", D: "Turn off all lights" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What is the correct direction to work when pressure washing parkade floors?", options: { A: "From drains outward", B: "From highest point toward drains", C: "In circles", D: "Random pattern" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What attachment is recommended for large floor areas?", options: { A: "Single nozzle", B: "Surface cleaner attachment", C: "Turbo nozzle", D: "Extension wand" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What should be monitored to prevent flooding during parkade cleaning?", options: { A: "Weather outside", B: "Drainage function", C: "Number of cars", D: "Time of day" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What PPE visibility requirement applies in parkade environments?", options: { A: "No visibility gear needed", B: "High visibility vest", C: "White clothing", D: "Reflective tape on equipment" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What additional lighting may be required in underground parkades?", options: { A: "No extra lighting", B: "Supplementary lighting equipment", C: "Natural light only", D: "Emergency lights only" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What should warning signs include for parkade cleaning?", options: { A: "English only", B: "Multiple languages", C: "Pictures only", D: "Company logo" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What type of degreaser application requires dwell time?", options: { A: "General washing", B: "Oil-stained areas", C: "Water rinsing", D: "Wall cleaning" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What should be verified about drainage before starting work?", options: { A: "Drain color", B: "Drainage is clear and functional", C: "Drain depth", D: "Number of drains" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What environmental consideration may be required in parkade cleaning?", options: { A: "None", B: "Water reclamation/vacuum system", C: "Air fresheners", D: "Temperature control" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What type of footwear is essential for parkade cleaning work?", options: { A: "Open-toe shoes", B: "Non-slip safety boots with steel toe", C: "Regular sneakers", D: "Waterproof sandals" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What chemical handling equipment should be on site?", options: { A: "None needed", B: "Spill kit", C: "Extra containers", D: "Mixing bowls" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What should be done with oil-stained areas before general washing?", options: { A: "Pressure wash immediately", B: "Apply degreaser and allow dwell time", C: "Skip them", D: "Cover them up" }, correctAnswer: "B" },
  { questionNumber: 19, question: "How should debris be managed during floor washing?", options: { A: "Leave in corners", B: "Flush toward drains continuously", C: "Collect manually first", D: "Ignore debris" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What respiratory protection may be needed when using chemicals in enclosed parkades?", options: { A: "No protection needed", B: "Respirator", C: "Dust mask only", D: "Scented mask" }, correctAnswer: "B" }
];

// Ground Window Cleaning SWP Quiz
const swpGroundWindowQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "What is a primary slip hazard during ground window cleaning?", options: { A: "Ice", B: "Wet surfaces from cleaning solution runoff", C: "Oil spills", D: "Loose gravel" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What equipment is commonly used for ground-level window cleaning?", options: { A: "Rope access gear", B: "Water-fed pole system", C: "Scaffolding", D: "Ladder only" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What pedestrian safety measure is needed for ground window cleaning?", options: { A: "No measures needed", B: "Barriers and warning signs around work area", C: "Verbal warnings only", D: "Work at night" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What should be done with excess cleaning solution?", options: { A: "Let it run into drains", B: "Collect and manage runoff properly", C: "Leave it to evaporate", D: "Spray it on plants" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What type of footwear is required for ground window cleaning?", options: { A: "Sandals", B: "Non-slip safety footwear", C: "Dress shoes", D: "Bare feet" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What chemical safety information should be available on site?", options: { A: "Product advertisements", B: "Safety Data Sheets (SDS)", C: "Price lists", D: "Manufacturing dates" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What is the proper technique for avoiding streaks on ground-level windows?", options: { A: "Random wiping", B: "Systematic squeegee technique from top to bottom", C: "Circular motions", D: "Spray and leave" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What should be protected from cleaning solution splashes?", options: { A: "Only the windows", B: "Landscaping, vehicles, and pedestrian areas", C: "Only the building", D: "Only parking areas" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What weather condition affects ground window cleaning quality?", options: { A: "Cloudy skies", B: "Direct sunlight causing rapid drying", C: "Night time", D: "Indoor temperature" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What should be done if windows have significant dirt buildup?", options: { A: "Use more pressure", B: "Pre-wash to loosen dirt before squeegee", C: "Skip those windows", D: "Use abrasive materials" }, correctAnswer: "B" },
  { questionNumber: 11, question: "How should cleaning equipment be stored between uses?", options: { A: "Left outside", B: "Clean, dry, and properly stored", C: "In cleaning solution", D: "In direct sunlight" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What is the purpose of using a scrubber before the squeegee?", options: { A: "To apply wax", B: "To apply and agitate cleaning solution", C: "To dry the window", D: "To polish the frame" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What should be done with dirty squeegee blades?", options: { A: "Continue using them", B: "Wipe clean regularly or replace", C: "Soak in cleaner", D: "Ignore the condition" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What manual handling consideration applies to water-fed pole systems?", options: { A: "No consideration needed", B: "Proper ergonomics and regular breaks", C: "Maximum speed operation", D: "Continuous use without breaks" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What should be checked on windows before cleaning?", options: { A: "Window age", B: "Damage, cracks, or loose seals", C: "Original manufacturer", D: "Glass type" }, correctAnswer: "B" },
  { questionNumber: 16, question: "How should vehicle traffic near ground cleaning areas be managed?", options: { A: "No management needed", B: "Barriers or cones to protect work area", C: "Work around traffic", D: "Stop all traffic" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What eye protection may be needed for ground window cleaning?", options: { A: "None", B: "Safety glasses to protect from splashes", C: "Sunglasses", D: "Reading glasses" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What should be done with window frames during cleaning?", options: { A: "Ignore them", B: "Clean and wipe down as part of the service", C: "Paint them", D: "Leave them wet" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What communication is needed with building occupants during cleaning?", options: { A: "No communication needed", B: "Notification of cleaning schedule and any access needs", C: "Personal conversations", D: "Marketing materials" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What should be done if damage to a window is discovered during cleaning?", options: { A: "Ignore it", B: "Document and report to supervisor/client", C: "Attempt repair", D: "Cover it up" }, correctAnswer: "B" }
];

// General Pressure Washing SWP Quiz
const swpGeneralPressureQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the main injury hazard from pressure washer operation?", options: { A: "Sunburn", B: "High pressure injection injuries", C: "Heat exhaustion", D: "Back strain" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What is the minimum recommended distance to maintain when pressure washing?", options: { A: "5 cm", B: "30-60 cm depending on surface", C: "2 meters", D: "No specific distance" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What nozzle angles are commonly used for different pressure washing applications?", options: { A: "0 degrees only", B: "15, 25, and 40 degree tips", C: "90 degrees only", D: "Random selection" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What should be inspected before using pressure washing hoses?", options: { A: "Color", B: "Damage or wear", C: "Length only", D: "Brand" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What chemical ratio should be verified before pressure washing?", options: { A: "Any ratio works", B: "Correct dilution ratios per manufacturer", C: "Maximum concentration", D: "No chemicals needed" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What hearing protection is required during pressure washer operation?", options: { A: "None", B: "Hearing protection is mandatory", C: "Only indoors", D: "Only for long sessions" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What should be done if equipment malfunctions during operation?", options: { A: "Continue carefully", B: "Shut down equipment immediately", C: "Increase pressure", D: "Call for help while running" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What training is required for pressure washer operation?", options: { A: "No training needed", B: "Pressure washer operation training", C: "Only reading the manual", D: "Watching videos" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What should be done to protect nearby vehicles during pressure washing?", options: { A: "Nothing", B: "Move or cover vehicles", C: "Wash them too", D: "Work around them" }, correctAnswer: "B" },
  { questionNumber: 10, question: "How should pressure washing work progress on vertical surfaces?", options: { A: "Bottom to top", B: "Top to bottom", C: "Side to side only", D: "Random pattern" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What environmental consideration applies to pressure washing runoff?", options: { A: "None", B: "Prevent contaminated water entering storm drains", C: "Use maximum water", D: "Runoff is not regulated" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What is the purpose of testing pressure washer operation before work?", options: { A: "To warm up the motor", B: "To verify settings and safe operation", C: "To waste water", D: "To make noise" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What PPE is required for hands during pressure washing?", options: { A: "No gloves needed", B: "Chemical resistant gloves", C: "Cotton gloves", D: "Leather gloves" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What surface protection may be needed before pressure washing?", options: { A: "None", B: "Covering delicate plants and materials", C: "Only paint protection", D: "Only window protection" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the correct procedure when finishing pressure washing?", options: { A: "Leave equipment running", B: "Shut down equipment properly following procedures", C: "Drain all water immediately", D: "Leave hoses connected" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What should be checked about the water supply before pressure washing?", options: { A: "Temperature only", B: "Adequacy and proper connection", C: "Color", D: "Source only" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What action is required if structural concerns arise during pressure washing?", options: { A: "Continue carefully", B: "Stop work and evaluate", C: "Increase pressure", D: "Complete the section first" }, correctAnswer: "B" },
  { questionNumber: 18, question: "How should the work area be secured during pressure washing?", options: { A: "No security needed", B: "Barriers and warning signs", C: "Verbal warnings only", D: "Work at night" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What quality check should be performed during pressure washing?", options: { A: "None during work", B: "Check work quality before moving to next section", C: "Only at the end", D: "Only if client asks" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What is required if chemical spill occurs during pressure washing?", options: { A: "Ignore it", B: "Contain and neutralize per SDS", C: "Wash it away", D: "Report at end of job" }, correctAnswer: "B" }
];

// FLHA (Field Level Hazard Assessment) Quiz
const flhaQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "When should a Field Level Hazard Assessment (FLHA) be completed?", options: { A: "Once per month", B: "Before starting each work task or when conditions change", C: "Only for new projects", D: "At the end of each day" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What is the primary purpose of an FLHA?", options: { A: "To satisfy paperwork requirements", B: "To identify and control workplace hazards before work begins", C: "To document completed work", D: "To assign blame for accidents" }, correctAnswer: "B" },
  { questionNumber: 3, question: "Who is responsible for completing an FLHA?", options: { A: "Only supervisors", B: "Workers performing the task, often with supervisor review", C: "Safety officers only", D: "Building owners" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What should be assessed regarding weather conditions in an FLHA?", options: { A: "Only temperature", B: "Wind, precipitation, lightning risk, and temperature extremes", C: "Only if it's raining", D: "Weather is not relevant" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What is a 'control measure' in an FLHA?", options: { A: "A remote control device", B: "An action taken to eliminate or reduce a hazard", C: "A measurement tool", D: "A quality standard" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What should be done if a new hazard is identified during work?", options: { A: "Ignore it and continue", B: "Stop, reassess, update the FLHA, and implement controls", C: "Report it at the end of the day", D: "Only report if someone is injured" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What personal factors should be considered in an FLHA?", options: { A: "Only physical fitness", B: "Fatigue, stress, medications, and fitness for work", C: "Job title only", D: "Years of experience only" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What should be assessed about the work area in an FLHA?", options: { A: "Color of surroundings", B: "Access/egress, ground conditions, overhead hazards, nearby activities", C: "Only lighting", D: "Only parking availability" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What is the hierarchy of controls in hazard management?", options: { A: "PPE first, then other measures", B: "Elimination, substitution, engineering, administrative, PPE", C: "Only use PPE", D: "Random selection of controls" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What equipment-related items should be assessed in an FLHA?", options: { A: "Brand names only", B: "Condition, suitability, required PPE, and inspection status", C: "Purchase date only", D: "Color matching" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What communication elements should be included in an FLHA?", options: { A: "Personal phone numbers", B: "Emergency contacts, signals, and team communication methods", C: "Company marketing slogans", D: "Social media accounts" }, correctAnswer: "B" },
  { questionNumber: 12, question: "How should hazards be prioritized in an FLHA?", options: { A: "Alphabetically", B: "By severity and likelihood of occurrence", C: "By cost to fix", D: "By ease of documentation" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What should happen if workers cannot control an identified hazard?", options: { A: "Work anyway", B: "Stop work and escalate to supervision", C: "Ignore and continue", D: "Document for next time" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What role does signing the FLHA serve?", options: { A: "Just paperwork", B: "Confirmation that hazards were discussed and understood", C: "Legal requirement only", D: "To identify handwriting" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What should be done with completed FLHA documents?", options: { A: "Throw them away", B: "Retain as records per company policy", C: "Give to the client", D: "Post on social media" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What environmental hazards should be considered in an FLHA?", options: { A: "None", B: "Traffic, utilities, public access, wildlife, terrain", C: "Only weather", D: "Only noise" }, correctAnswer: "B" },
  { questionNumber: 17, question: "When should the FLHA be reviewed during a work shift?", options: { A: "Never after initial completion", B: "When conditions change or at regular intervals", C: "Only if an accident occurs", D: "At the end of the shift" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What is residual risk in an FLHA context?", options: { A: "Risk that doesn't exist", B: "Risk remaining after control measures are implemented", C: "Risk from yesterday", D: "Future predicted risk" }, correctAnswer: "B" },
  { questionNumber: 19, question: "How should team members participate in the FLHA process?", options: { A: "Only listen", B: "Actively contribute observations and concerns", C: "Sign without reading", D: "Delegate to one person" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What training is required to complete an FLHA effectively?", options: { A: "No training needed", B: "Hazard recognition and control training", C: "Only first aid", D: "Computer skills only" }, correctAnswer: "B" }
];

// Harness Inspection Quiz
const harnessInspectionQuiz: QuizQuestion[] = [
  { questionNumber: 1, question: "How often should a harness be inspected by the user?", options: { A: "Weekly", B: "Before each use", C: "Monthly", D: "Annually" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What should be checked on harness webbing during inspection?", options: { A: "Color fading only", B: "Cuts, abrasions, fraying, chemical damage, and UV degradation", C: "Brand label only", D: "Weight rating" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What condition of stitching indicates the harness should be removed from service?", options: { A: "Any visible stitching", B: "Broken, cut, or pulled stitching", C: "Different colored thread", D: "Double stitching" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What should be checked on metal hardware during harness inspection?", options: { A: "Polish level", B: "Cracks, distortion, corrosion, and proper function", C: "Manufacturer stamp only", D: "Weight" }, correctAnswer: "B" },
  { questionNumber: 5, question: "How should a harness be stored when not in use?", options: { A: "In direct sunlight", B: "In a clean, dry location away from heat, chemicals, and UV", C: "Hanging by one strap", D: "In a wet bag" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What is the typical maximum service life of a harness?", options: { A: "1 year", B: "5-10 years depending on manufacturer and use", C: "Unlimited if looks good", D: "3 months" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What should be done with a harness that has been subjected to a fall?", options: { A: "Continue using if it looks OK", B: "Remove from service and have it inspected by a competent person", C: "Wash it and reuse", D: "Tighten all straps and continue" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What documentation should accompany a harness?", options: { A: "None required", B: "Manufacturer instructions, inspection records, and service history", C: "Only purchase receipt", D: "Only the size label" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What attachment points on a harness should be inspected?", options: { A: "Only the front point", B: "All attachment points including front, rear, and side D-rings", C: "Only metal points", D: "Only the waist belt" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What buckle types require specific inspection procedures?", options: { A: "All buckles are the same", B: "Quick-connect, pass-through, and tongue buckles each have specific checks", C: "Only metal buckles", D: "Only plastic buckles" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What indicates chemical contamination on a harness?", options: { A: "Clean appearance", B: "Stiffness, discoloration, or unusual odor", C: "Normal flexibility", D: "Bright colors" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What should be done if any defect is found during harness inspection?", options: { A: "Mark it for later repair", B: "Tag out and remove from service immediately", C: "Continue using carefully", D: "Report at end of week" }, correctAnswer: "B" },
  { questionNumber: 13, question: "Who is considered a 'competent person' for formal harness inspection?", options: { A: "Any worker", B: "Someone trained and knowledgeable in harness inspection", C: "The newest employee", D: "Anyone with tools" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How often should a formal inspection by a competent person be conducted?", options: { A: "Only when damaged", B: "At intervals specified by manufacturer, typically every 6-12 months", C: "Once in harness lifetime", D: "Every 5 years" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What label information should be present and legible on a harness?", options: { A: "Only the brand name", B: "Manufacturer, model, size, standards compliance, and manufacture date", C: "Only the price", D: "Only the color code" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What is the significance of the manufacture date on a harness?", options: { A: "No significance", B: "Determines service life calculation and inspection schedule", C: "Only for warranty", D: "Only for ordering replacements" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What should be checked on leg loops during inspection?", options: { A: "Only the padding", B: "Webbing condition, stitching, buckles, and proper adjustment", C: "Only the size", D: "Only the color" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What contamination sources can damage harness materials?", options: { A: "Only water", B: "Chemicals, oils, solvents, battery acid, and some cleaning agents", C: "Only paint", D: "Only dirt" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What should be verified about harness fit during inspection?", options: { A: "Only that it goes on", B: "Proper sizing, adjustment range, and secure positioning when worn", C: "Only the color match", D: "Only the weight" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What is the correct response if a harness shows signs of heat damage?", options: { A: "Continue if not melted", B: "Remove from service as structural integrity may be compromised", C: "Cool it down and reuse", D: "Cover damaged areas with tape" }, correctAnswer: "B" }
];

// Export all safety quizzes
export const safetyQuizzes: SafetyQuiz[] = [
  {
    quizType: "swp_window_cleaning",
    title: "Window Cleaning Safe Work Procedure",
    category: "swp",
    jobType: "window_cleaning",
    questions: swpWindowCleaningQuiz
  },
  {
    quizType: "swp_dryer_vent_cleaning",
    title: "Dryer Vent Cleaning Safe Work Procedure",
    category: "swp",
    jobType: "dryer_vent_cleaning",
    questions: swpDryerVentCleaningQuiz
  },
  {
    quizType: "swp_building_wash",
    title: "Building Wash Safe Work Procedure",
    category: "swp",
    jobType: "building_wash",
    questions: swpBuildingWashQuiz
  },
  {
    quizType: "swp_in_suite_dryer_vent",
    title: "In-Suite Dryer Vent Cleaning Safe Work Procedure",
    category: "swp",
    jobType: "in_suite_dryer_vent_cleaning",
    questions: swpInSuiteDryerVentQuiz
  },
  {
    quizType: "swp_parkade_pressure",
    title: "Parkade Pressure Cleaning Safe Work Procedure",
    category: "swp",
    jobType: "parkade_pressure_cleaning",
    questions: swpParkadePressureQuiz
  },
  {
    quizType: "swp_ground_window",
    title: "Ground Window Cleaning Safe Work Procedure",
    category: "swp",
    jobType: "ground_window_cleaning",
    questions: swpGroundWindowQuiz
  },
  {
    quizType: "swp_general_pressure",
    title: "General Pressure Washing Safe Work Procedure",
    category: "swp",
    jobType: "general_pressure_washing",
    questions: swpGeneralPressureQuiz
  },
  {
    quizType: "flha_assessment",
    title: "Field Level Hazard Assessment (FLHA)",
    category: "flha",
    questions: flhaQuiz
  },
  {
    quizType: "harness_inspection",
    title: "Harness Inspection Procedures",
    category: "harness",
    questions: harnessInspectionQuiz
  }
];

// Function to get a safety quiz by type
export function getSafetyQuiz(quizType: string): SafetyQuiz | undefined {
  return safetyQuizzes.find(quiz => quiz.quizType === quizType);
}

// Function to get all safety quizzes by category
export function getSafetyQuizzesByCategory(category: SafetyQuiz["category"]): SafetyQuiz[] {
  return safetyQuizzes.filter(quiz => quiz.category === category);
}

// Function to get available safety quiz types
export function getAvailableSafetyQuizzes(): { quizType: string; title: string; category: string; jobType?: string }[] {
  return safetyQuizzes.map(quiz => ({
    quizType: quiz.quizType,
    title: quiz.title,
    category: quiz.category,
    jobType: quiz.jobType
  }));
}
