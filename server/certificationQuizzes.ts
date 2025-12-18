// Pre-built IRATA and SPRAT Certification Quizzes
// 12 quizzes total: 6 IRATA (2 per level) + 6 SPRAT (2 per level)
// Each quiz has 20 questions with 4 multiple choice options

export interface QuizQuestion {
  questionNumber: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
}

export interface CertificationQuiz {
  quizType: string; // irata_level_1_a, irata_level_1_b, etc.
  title: string;
  level: number;
  certification: "irata" | "sprat";
  questions: QuizQuestion[];
}

// IRATA Level 1 - Quiz A
const irataLevel1QuizA: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the minimum number of attachment points required when working on rope?", options: { A: "One", B: "Two", C: "Three", D: "Four" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What does PPE stand for?", options: { A: "Personal Protective Equipment", B: "Professional Protection Essentials", C: "Primary Protection Equipment", D: "Personal Protection Essentials" }, correctAnswer: "A" },
  { questionNumber: 3, question: "Before using a rope, what is the first thing you should do?", options: { A: "Attach your descender", B: "Inspect it for damage", C: "Measure its length", D: "Coil it properly" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What is the primary purpose of a backup device in rope access?", options: { A: "To speed up descent", B: "To provide a second point of attachment in case of main line failure", C: "To carry tools", D: "To assist with ascending" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What knot is commonly used to tie into a harness?", options: { A: "Clove hitch", B: "Bowline", C: "Figure of eight on a bight", D: "Reef knot" }, correctAnswer: "C" },
  { questionNumber: 6, question: "What is the minimum safe working load for a rope access anchor?", options: { A: "5 kN", B: "10 kN", C: "15 kN", D: "20 kN" }, correctAnswer: "C" },
  { questionNumber: 7, question: "How often should harnesses be inspected by a competent person?", options: { A: "Weekly", B: "Monthly", C: "Every 6 months", D: "Before each use and at regular intervals" }, correctAnswer: "D" },
  { questionNumber: 8, question: "What is edge protection used for?", options: { A: "To prevent rope damage from sharp edges", B: "To mark work areas", C: "To anchor ropes", D: "To provide weather protection" }, correctAnswer: "A" },
  { questionNumber: 9, question: "What should you do if you discover damage to your equipment during an inspection?", options: { A: "Continue using it carefully", B: "Report it and remove it from service", C: "Tape over the damage", D: "Use it only for light work" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What is the purpose of a stop knot at the end of a rope?", options: { A: "To mark the rope end", B: "To prevent the rope end passing through a descender", C: "To add weight", D: "To make coiling easier" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What is the correct way to store ropes?", options: { A: "In direct sunlight to dry them", B: "Near chemicals for cleaning", C: "In a cool, dry place away from UV light and chemicals", D: "Hanging with tight kinks" }, correctAnswer: "C" },
  { questionNumber: 12, question: "What type of harness is required for rope access work?", options: { A: "Simple waist belt", B: "Chest harness only", C: "Full body harness with front and rear attachment points", D: "Sit harness only" }, correctAnswer: "C" },
  { questionNumber: 13, question: "What is the primary function of a descender?", options: { A: "To ascend the rope", B: "To control descent on a rope", C: "To act as a backup device", D: "To connect ropes together" }, correctAnswer: "B" },
  { questionNumber: 14, question: "When should you NOT use rope access techniques?", options: { A: "In windy conditions over 50 mph", B: "When safer alternatives are available and practical", C: "On buildings over 10 stories", D: "During daylight hours only" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What does a pre-use check of a karabiner include?", options: { A: "Checking the gate opens and closes properly and the locking mechanism works", B: "Weighing the karabiner", C: "Checking the color", D: "Testing it on the ground" }, correctAnswer: "A" },
  { questionNumber: 16, question: "What is the minimum distance between the lowest point of descent and the ground or obstruction?", options: { A: "1 meter", B: "2 meters", C: "The length needed for a controlled stop", D: "5 meters" }, correctAnswer: "C" },
  { questionNumber: 17, question: "What is the purpose of a toolbox talk?", options: { A: "To discuss tool maintenance", B: "To communicate site-specific hazards and safety procedures", C: "To assign tools to workers", D: "To count tools" }, correctAnswer: "B" },
  { questionNumber: 18, question: "How should you carry tools when working at height?", options: { A: "In your pockets", B: "Secured with tool lanyards or in a tool bag", C: "In your hands", D: "Thrown up by a colleague" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What action should be taken if weather conditions deteriorate?", options: { A: "Speed up the work", B: "Continue as normal", C: "Assess the risk and consider stopping work", D: "Remove all PPE to move faster" }, correctAnswer: "C" },
  { questionNumber: 20, question: "What is the purpose of a work positioning lanyard?", options: { A: "For fall arrest only", B: "To allow hands-free work while supported", C: "For rescue operations", D: "For abseiling" }, correctAnswer: "B" }
];

// IRATA Level 1 - Quiz B
const irataLevel1QuizB: QuizQuestion[] = [
  { questionNumber: 1, question: "What does IRATA stand for?", options: { A: "International Rope Access Training Association", B: "Industrial Rope Access Trade Association", C: "International Rope Access Technicians Association", D: "Industrial Rope Access Technicians Association" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What is the maximum load that should be applied to a connector designed for human suspension?", options: { A: "5 kN", B: "15 kN", C: "25 kN", D: "35 kN" }, correctAnswer: "C" },
  { questionNumber: 3, question: "What type of rope is typically used for rope access work?", options: { A: "Dynamic climbing rope", B: "Low stretch kernmantle rope", C: "Polypropylene rope", D: "Natural fiber rope" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What is the function of an ascender?", options: { A: "To control descent", B: "To grip the rope and allow upward movement", C: "To connect ropes", D: "To provide backup protection" }, correctAnswer: "B" },
  { questionNumber: 5, question: "How long is an IRATA Level 1 certification valid?", options: { A: "1 year", B: "2 years", C: "3 years", D: "5 years" }, correctAnswer: "C" },
  { questionNumber: 6, question: "What should be checked during a pre-use harness inspection?", options: { A: "Color and brand", B: "Stitching, webbing, buckles, and attachment points", C: "Weight only", D: "Date of purchase" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What is the purpose of a deviation?", options: { A: "To add more rope", B: "To redirect the rope away from hazards or obstructions", C: "To increase speed", D: "To mark the work area" }, correctAnswer: "B" },
  { questionNumber: 8, question: "When using two ropes, what should be the relationship between them?", options: { A: "One should be longer", B: "They should be different colors", C: "They should be independently anchored", D: "They must be the same diameter" }, correctAnswer: "C" },
  { questionNumber: 9, question: "What is suspension trauma?", options: { A: "Fear of heights", B: "A medical condition caused by prolonged suspension in a harness", C: "Rope burn", D: "Equipment failure" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What is the recommended action time for rescuing a suspended person?", options: { A: "Within 1 hour", B: "As quickly as possible, ideally within minutes", C: "Within 30 minutes", D: "At the end of the work shift" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What marking should be on certified PPE?", options: { A: "Company logo only", B: "CE marking with relevant EN standards", C: "Color coding", D: "Employee name" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What is the minimum team size for rope access work?", options: { A: "One person can work alone", B: "Two people minimum", C: "Three people minimum", D: "Four people minimum" }, correctAnswer: "C" },
  { questionNumber: 13, question: "What is a cow's tail used for?", options: { A: "Animal handling", B: "Short lanyard for connection to anchors", C: "Carrying tools", D: "Weather protection" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How should ropes be transported?", options: { A: "Dragged along the ground", B: "In a bag or container, protected from damage", C: "Wrapped around equipment", D: "Loose in a vehicle" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the purpose of a risk assessment?", options: { A: "To speed up work", B: "To identify hazards and implement control measures", C: "To reduce equipment costs", D: "To assign blame" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What should you do if you feel unwell while suspended on rope?", options: { A: "Continue working", B: "Immediately communicate and descend or be rescued", C: "Rest for 30 minutes", D: "Increase speed to finish faster" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What is the Alpine butterfly knot used for?", options: { A: "Tying into harness", B: "Creating a loop in the middle of a rope", C: "Joining two ropes", D: "Terminating rope ends" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What color rope is typically used as a backup/safety line?", options: { A: "Any color is acceptable", B: "Red only", C: "Different color from working line for easy identification", D: "Black only" }, correctAnswer: "C" },
  { questionNumber: 19, question: "What is cross-loading of a karabiner?", options: { A: "Loading across the minor axis instead of the major axis", B: "Using multiple karabiners", C: "Connecting two karabiners together", D: "Normal use" }, correctAnswer: "A" },
  { questionNumber: 20, question: "When should you inform your supervisor of equipment issues?", options: { A: "At the end of the week", B: "Immediately upon discovery", C: "During breaks only", D: "Only if it causes an accident" }, correctAnswer: "B" }
];

// IRATA Level 2 - Quiz A
const irataLevel2QuizA: QuizQuestion[] = [
  { questionNumber: 1, question: "What additional responsibilities does a Level 2 technician have over Level 1?", options: { A: "Managing the entire project", B: "Rigging for self and assisting others, rescue capability", C: "Signing off equipment", D: "Training new technicians" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What is a rebelay?", options: { A: "A type of knot", B: "A point where the rope is re-anchored during descent/ascent", C: "A rescue technique", D: "A type of harness" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What is the minimum strength requirement for a rebelay anchor?", options: { A: "5 kN", B: "10 kN", C: "15 kN", D: "20 kN" }, correctAnswer: "C" },
  { questionNumber: 4, question: "How should you approach a casualty for rescue?", options: { A: "From above only", B: "From below only", C: "Assess the situation and use the safest approach", D: "Call for external rescue only" }, correctAnswer: "C" },
  { questionNumber: 5, question: "What is the purpose of a rescue kit?", options: { A: "For personal use only", B: "To facilitate the rescue of an incapacitated colleague", C: "For first aid only", D: "For tool storage" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What knot is commonly used for creating a load-sharing anchor?", options: { A: "Figure of eight", B: "Bowline", C: "Equalizing anchor knot or load-sharing system", D: "Clove hitch" }, correctAnswer: "C" },
  { questionNumber: 7, question: "When performing a rescue, what is the first priority?", options: { A: "Speed", B: "Safety of the rescuer", C: "Equipment preservation", D: "Documentation" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What is the purpose of a progress capture device?", options: { A: "To measure distance", B: "To prevent the load from lowering while hauling", C: "To record work completed", D: "To capture photographs" }, correctAnswer: "B" },
  { questionNumber: 9, question: "How should you rig a deviation?", options: { A: "Using a single karabiner directly on the rope", B: "Using a sling or cord with appropriate connectors", C: "Tying a knot in the rope", D: "Using tape" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What should be considered when rigging over an edge?", options: { A: "Only rope length", B: "Edge protection, rope angles, and anchor placement", C: "Color of the rope", D: "Time of day" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What is the purpose of a Y-hang?", options: { A: "To create a single anchor point", B: "To distribute load between two anchors", C: "To mark the work area", D: "To store equipment" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What factors affect the strength of a knot?", options: { A: "Rope color only", B: "Knot type, rope type, and how it is dressed", C: "Time of day", D: "Weather conditions only" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What is a hauling system used for?", options: { A: "Lowering only", B: "Raising loads or personnel", C: "Cutting rope", D: "Marking areas" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What is the mechanical advantage of a 3:1 hauling system?", options: { A: "1 kg input = 1 kg output", B: "1 kg input = 3 kg output", C: "3 kg input = 1 kg output", D: "1 kg input = 6 kg output" }, correctAnswer: "B" },
  { questionNumber: 15, question: "How should you pass a knot during descent?", options: { A: "Cut the knot out", B: "Safely transfer between attachment points past the knot", C: "Jump past it", D: "Have someone remove it" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What is the purpose of dynamic anchors?", options: { A: "To create static attachment", B: "To absorb energy in a fall situation", C: "To mark work areas", D: "For tool attachment" }, correctAnswer: "B" },
  { questionNumber: 17, question: "When should a rescue plan be prepared?", options: { A: "After an incident", B: "Before work begins", C: "During work only", D: "At the end of the project" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What is rope-to-rope transfer?", options: { A: "Changing rope types", B: "Moving from one rope system to another while remaining attached", C: "Cutting ropes", D: "Joining ropes" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What documentation should a Level 2 be familiar with?", options: { A: "Company brochures only", B: "Risk assessments, method statements, and rescue plans", C: "Marketing materials", D: "Employee contracts" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What is the role of communication in rope access work?", options: { A: "Optional", B: "Critical for safety and coordination", C: "Only needed for emergencies", D: "Management responsibility only" }, correctAnswer: "B" }
];

// IRATA Level 2 - Quiz B
const irataLevel2QuizB: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the minimum experience requirement for IRATA Level 2?", options: { A: "No experience required", B: "6 months and 500 hours as Level 1", C: "12 months and 1000 hours as Level 1", D: "2 years as Level 1" }, correctAnswer: "C" },
  { questionNumber: 2, question: "What is a tyrolean traverse?", options: { A: "A type of descent", B: "Horizontal movement along a tensioned rope", C: "A rescue technique", D: "An anchor type" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What should be checked before establishing a rope access system?", options: { A: "Weather only", B: "Anchors, ropes, equipment, access/egress, and rescue plan", C: "Break times", D: "Equipment color" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What is the purpose of a back-up device in a hauling system?", options: { A: "To increase speed", B: "To hold the load if the main system fails", C: "To reduce friction", D: "To mark position" }, correctAnswer: "B" },
  { questionNumber: 5, question: "How do you calculate the angle factor for Y-hangs?", options: { A: "Ignore angles", B: "Wider angles increase load on each leg", C: "Angles don't matter", D: "Only vertical matters" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What is the maximum recommended angle for a Y-hang?", options: { A: "180 degrees", B: "120 degrees", C: "90 degrees", D: "45 degrees" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What technique is used for ascending past a knot?", options: { A: "Cut the knot", B: "Systematically transfer ascenders past the knot", C: "Jump over it", D: "Remove the knot" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What is edge protection efficiency affected by?", options: { A: "Color only", B: "Material, design, and proper placement", C: "Brand name", D: "Cost" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What is the purpose of a chest ascender?", options: { A: "For descending", B: "To assist with ascending and maintain upright position", C: "For rescue only", D: "For tool attachment" }, correctAnswer: "B" },
  { questionNumber: 10, question: "How should a fallen climber rescue be approached?", options: { A: "Wait for emergency services", B: "Quickly assess, reach, stabilize, and evacuate", C: "Leave them until end of shift", D: "Only call supervisor" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What is a load-release hitch?", options: { A: "A permanent connection", B: "A hitch that can be released under load for lowering", C: "A decorative knot", D: "An anchor type" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What factors determine anchor selection?", options: { A: "Convenience only", B: "Load requirements, direction of pull, and anchor integrity", C: "Color matching", D: "Distance from edge" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What is the purpose of pre-tensioning a rope system?", options: { A: "To waste time", B: "To remove slack and check system before loading", C: "To damage ropes", D: "For appearance" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How should you communicate during a rescue operation?", options: { A: "Shouting only", B: "Clear, concise commands with confirmation", C: "Hand signals only", D: "No communication needed" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the advantage of a releasable anchor?", options: { A: "Looks better", B: "Can be untied/adjusted from a remote position", C: "Costs less", D: "Weighs less" }, correctAnswer: "B" },
  { questionNumber: 16, question: "When rigging for a pick-off rescue, what must be considered?", options: { A: "Rope color", B: "Combined weight, anchor strength, and descent route", C: "Time of day", D: "Weather only" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What is the difference between static and dynamic rope?", options: { A: "Color only", B: "Static has low stretch, dynamic has high stretch for falls", C: "No difference", D: "Length only" }, correctAnswer: "B" },
  { questionNumber: 18, question: "How should multiple users be managed on a single rope system?", options: { A: "No rules apply", B: "Careful load calculations and appropriate system design", C: "Unlimited users allowed", D: "One person decides" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What is the purpose of a mid-rope knot?", options: { A: "Decoration", B: "To create attachment points or isolate damaged sections", C: "To shorten rope only", D: "To mark ownership" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What should be included in a post-work inspection?", options: { A: "Nothing", B: "Equipment check, documentation, and debriefing", C: "Leaving immediately", D: "Only counting tools" }, correctAnswer: "B" }
];

// IRATA Level 3 - Quiz A
const irataLevel3QuizA: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the primary role of an IRATA Level 3 technician?", options: { A: "Only performing physical work", B: "Supervising and managing rope access operations", C: "Equipment purchasing", D: "Office work only" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What documentation must a Level 3 prepare before a job?", options: { A: "None required", B: "Risk assessments, method statements, and rescue plans", C: "Timesheets only", D: "Equipment lists only" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What is the Level 3's responsibility regarding equipment?", options: { A: "No responsibility", B: "Ensuring all equipment is inspected, suitable, and compliant", C: "Purchasing only", D: "Cleaning only" }, correctAnswer: "B" },
  { questionNumber: 4, question: "How should a Level 3 manage inexperienced team members?", options: { A: "Leave them alone", B: "Direct supervision, training, and appropriate task assignment", C: "Give them the hardest tasks", D: "Ignore them" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What is the Level 3's role in emergency situations?", options: { A: "Run away", B: "Coordinate rescue, communicate with services, manage the scene", C: "Wait for others", D: "Continue working" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What legal requirements must a Level 3 understand?", options: { A: "None", B: "Health and safety legislation, working at height regulations", C: "Marketing laws", D: "Tax regulations only" }, correctAnswer: "B" },
  { questionNumber: 7, question: "How should conflicting instructions be managed on site?", options: { A: "Ignore them", B: "Stop work, clarify with relevant parties, document decisions", C: "Follow any instruction", D: "Ask the newest team member" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What is the purpose of site-specific induction?", options: { A: "Waste time", B: "Familiarize workers with hazards, procedures, and emergency plans", C: "Reduce wages", D: "Delay work" }, correctAnswer: "B" },
  { questionNumber: 9, question: "How should environmental hazards be assessed?", options: { A: "Ignore them", B: "Identify, evaluate, and implement control measures", C: "Work regardless", D: "Only consider weather" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What is the Level 3's responsibility for record keeping?", options: { A: "No records needed", B: "Maintain accurate logs of inspections, training, and incidents", C: "Destroy all records", D: "Only keep financial records" }, correctAnswer: "B" },
  { questionNumber: 11, question: "How should interface with other trades be managed?", options: { A: "No communication", B: "Coordinate schedules, communicate hazards, and ensure safety", C: "Avoid other trades", D: "Work in isolation" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What should a Level 3 do if unsafe conditions are identified?", options: { A: "Ignore them", B: "Stop work, implement controls, or refuse to proceed", C: "Continue regardless", D: "Blame others" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What is the purpose of a permit to work system?", options: { A: "Create paperwork", B: "Control high-risk activities and ensure safety measures are in place", C: "Delay work", D: "Reduce wages" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How should near-miss incidents be handled?", options: { A: "Ignore them", B: "Report, investigate, and implement preventive measures", C: "Deny they happened", D: "Punish workers" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the Level 3's role in equipment selection?", options: { A: "No role", B: "Ensure appropriate equipment for the task and conditions", C: "Choose cheapest options", D: "Random selection" }, correctAnswer: "B" },
  { questionNumber: 16, question: "How should complex rigging situations be managed?", options: { A: "Trial and error", B: "Careful planning, calculations, and peer review", C: "Guess work", D: "Ignore complexity" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What training responsibilities does a Level 3 have?", options: { A: "None", B: "Mentoring team members and ensuring competence", C: "Only personal training", D: "Avoiding training" }, correctAnswer: "B" },
  { questionNumber: 18, question: "How should changes to work plans be managed?", options: { A: "No process needed", B: "Assess impact, update documentation, communicate changes", C: "Ignore changes", D: "Proceed without review" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What is the purpose of a safety audit?", options: { A: "Waste time", B: "Verify compliance and identify improvement opportunities", C: "Punish workers", D: "Create paperwork" }, correctAnswer: "B" },
  { questionNumber: 20, question: "How should the work area be managed at the end of each day?", options: { A: "Leave immediately", B: "Secure ropes, equipment, and ensure site safety", C: "No action needed", D: "Remove all equipment" }, correctAnswer: "B" }
];

// IRATA Level 3 - Quiz B
const irataLevel3QuizB: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the minimum experience requirement for IRATA Level 3?", options: { A: "1 year as Level 2", B: "12 months and 1000 hours as Level 2", C: "6 months as Level 2", D: "No experience needed" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What is the ratio of Level 3 to other technicians required on site?", options: { A: "No ratio required", B: "At least one Level 3 for every rope access team", C: "One Level 3 per company", D: "Level 3 is optional" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What should be included in a method statement?", options: { A: "Company history", B: "Scope, hazards, controls, sequence of operations, and emergency procedures", C: "Marketing information", D: "Financial projections" }, correctAnswer: "B" },
  { questionNumber: 4, question: "How should anchor points be verified on unfamiliar structures?", options: { A: "Assume they are safe", B: "Inspect, test, or obtain confirmation of integrity", C: "Use without checking", D: "Ask a random person" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What is the Level 3's responsibility for PPE compliance?", options: { A: "No responsibility", B: "Ensure all team members have and use appropriate PPE", C: "Personal PPE only", D: "Purchasing only" }, correctAnswer: "B" },
  { questionNumber: 6, question: "How should work in confined spaces be managed?", options: { A: "No special measures", B: "Specific risk assessment, permits, atmosphere monitoring, rescue plan", C: "Work as normal", D: "Avoid documentation" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What weather conditions require work to stop?", options: { A: "Work in all conditions", B: "Conditions that compromise safety (high winds, lightning, etc.)", C: "Only heavy rain", D: "Never stop for weather" }, correctAnswer: "B" },
  { questionNumber: 8, question: "How should hot work at height be managed?", options: { A: "No special measures", B: "Fire risk assessment, fire watch, appropriate permits", C: "Work as normal", D: "Ignore fire risks" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What is the Level 3's role in accident investigation?", options: { A: "Hide evidence", B: "Preserve scene, gather information, support investigation", C: "Blame individuals", D: "Avoid involvement" }, correctAnswer: "B" },
  { questionNumber: 10, question: "How should subcontractor management be approached?", options: { A: "No oversight needed", B: "Verify competence, ensure compliance with site rules", C: "Allow self-management", D: "Avoid communication" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What is the purpose of equipment retirement criteria?", options: { A: "Reduce costs", B: "Ensure equipment is withdrawn before it becomes unsafe", C: "Create paperwork", D: "Delay work" }, correctAnswer: "B" },
  { questionNumber: 12, question: "How should rope access be integrated with other access methods?", options: { A: "Avoid integration", B: "Coordinate methods, ensure safety interfaces are managed", C: "Work in isolation", D: "Ignore other methods" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What is the Level 3's role in continuous improvement?", options: { A: "Maintain status quo", B: "Identify improvements, share lessons learned, update procedures", C: "Avoid change", D: "Ignore feedback" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How should working over water be managed?", options: { A: "No special measures", B: "Specific risk assessment, rescue boat, buoyancy aids if needed", C: "Work as normal", D: "Ignore water hazards" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the purpose of a safety management system?", options: { A: "Create bureaucracy", B: "Systematically manage safety risks across operations", C: "Slow down work", D: "Impress clients" }, correctAnswer: "B" },
  { questionNumber: 16, question: "How should lone working at height be managed?", options: { A: "Never allowed in rope access", B: "Specific controls, communication, and monitoring", C: "Same as team work", D: "No special measures" }, correctAnswer: "A" },
  { questionNumber: 17, question: "What is the Level 3's responsibility for emergency preparedness?", options: { A: "No responsibility", B: "Ensure plans are in place, tested, and understood by all", C: "Delegate entirely", D: "Avoid emergency planning" }, correctAnswer: "B" },
  { questionNumber: 18, question: "How should night work be managed?", options: { A: "Same as day work", B: "Additional lighting, communication, and supervision requirements", C: "Avoid night work", D: "Reduce safety measures" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What documentation should be retained after project completion?", options: { A: "None", B: "Records as required by legislation and company policy", C: "Destroy all records", D: "Only financial records" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What is the Level 3's role in client communication?", options: { A: "Avoid clients", B: "Professional representation, progress updates, safety discussions", C: "Mislead clients", D: "Ignore client requirements" }, correctAnswer: "B" }
];

// SPRAT Level 1 - Quiz A
const spratLevel1QuizA: QuizQuestion[] = [
  { questionNumber: 1, question: "What does SPRAT stand for?", options: { A: "Society of Professional Rope Access Technicians", B: "Safety Professional Rope Access Team", C: "Society for Professional Rope Access Training", D: "Standard Professional Rope Access Techniques" }, correctAnswer: "A" },
  { questionNumber: 2, question: "What is the minimum number of independent anchors required in SPRAT guidelines?", options: { A: "One", B: "Two", C: "Three", D: "Four" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What is the minimum breaking strength for life safety rope under SPRAT?", options: { A: "3,000 lbf", B: "5,000 lbf", C: "7,500 lbf", D: "10,000 lbf" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What type of harness must be used for rope access work?", options: { A: "Simple belt", B: "Class III full body harness", C: "Chest harness only", D: "Any available harness" }, correctAnswer: "B" },
  { questionNumber: 5, question: "How often must rope access equipment be inspected by a competent person?", options: { A: "Annually only", B: "Before each use and at regular intervals", C: "Monthly only", D: "When damage is visible" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What is the purpose of a backup device in SPRAT operations?", options: { A: "To speed descent", B: "To provide fall protection on the secondary line", C: "To carry tools", D: "For ascending only" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What is the maximum free fall distance allowed in SPRAT guidelines?", options: { A: "12 feet", B: "6 feet", C: "2 feet", D: "No limit" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What knot efficiency factor should be considered for anchor calculations?", options: { A: "100%", B: "50% reduction typically", C: "10% reduction", D: "No reduction" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What is the minimum age requirement for SPRAT certification?", options: { A: "16 years", B: "18 years", C: "21 years", D: "No age limit" }, correctAnswer: "B" },
  { questionNumber: 10, question: "How long is a SPRAT certification valid?", options: { A: "1 year", B: "2 years", C: "3 years", D: "5 years" }, correctAnswer: "C" },
  { questionNumber: 11, question: "What documentation is required for rope access equipment?", options: { A: "None required", B: "Inspection records and manufacturer information", C: "Purchase receipts only", D: "Photos only" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What is the purpose of a controlled descent device?", options: { A: "Ascending only", B: "Controlling rate of descent on rope", C: "Emergency use only", D: "Tool attachment" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What should be done if rope damage is discovered?", options: { A: "Continue using carefully", B: "Remove from service and document", C: "Repair it", D: "Use for training only" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What is the minimum working load for rope access connectors?", options: { A: "1,000 lbf", B: "3,600 lbf (16 kN)", C: "10,000 lbf", D: "5,000 lbf" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What personal factors can affect rope access work safety?", options: { A: "Hair color", B: "Fatigue, medication, and health conditions", C: "Age only", D: "Nothing affects safety" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What is edge protection used for in rope access?", options: { A: "Marking boundaries", B: "Protecting rope from damage at sharp edges", C: "Weather protection", D: "Tool storage" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What communication method should be established before work?", options: { A: "None needed", B: "Clear signals or radio communication", C: "Shouting only", D: "Text messages" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What is the purpose of pre-job planning?", options: { A: "Delay work", B: "Identify hazards and plan safe work methods", C: "Increase costs", D: "Meet regulations only" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What should be checked during a connector inspection?", options: { A: "Color only", B: "Gate function, locking mechanism, wear, and corrosion", C: "Weight", D: "Brand name" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What is the role of a safety watch in rope access?", options: { A: "Timing breaks", B: "Monitoring workers and prepared to assist in emergency", C: "Counting tools", D: "Entertainment" }, correctAnswer: "B" }
];

// SPRAT Level 1 - Quiz B
const spratLevel1QuizB: QuizQuestion[] = [
  { questionNumber: 1, question: "What type of rope is standard for SPRAT rope access?", options: { A: "Dynamic climbing rope", B: "Static or low-stretch kernmantle", C: "Polypropylene", D: "Natural fiber" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What is the purpose of the two-rope system?", options: { A: "Carry more weight", B: "Provide redundancy if one rope fails", C: "Work faster", D: "Save money" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What factor affects rope lifespan?", options: { A: "Color only", B: "UV exposure, chemical exposure, and abrasion", C: "Manufacturer's reputation", D: "Purchase date only" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What is the maximum working load for a rope access rope?", options: { A: "Full breaking strength", B: "Fraction of breaking strength (typically 1/10)", C: "50% of breaking strength", D: "No limit" }, correctAnswer: "B" },
  { questionNumber: 5, question: "How should equipment be stored?", options: { A: "In direct sunlight", B: "Clean, dry, away from chemicals and UV", C: "Near heat sources", D: "In vehicle trunks" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What is the purpose of anchor inspection?", options: { A: "Decorative", B: "Verify capacity and integrity before loading", C: "Count anchors", D: "Photography" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What should a technician do before leaving the ground?", options: { A: "Nothing special", B: "Complete equipment check and confirm rescue plan", C: "Say goodbye", D: "Make phone calls" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What is suspension intolerance?", options: { A: "Fear of heights", B: "Medical emergency from prolonged harness suspension", C: "Equipment failure", D: "Rope damage" }, correctAnswer: "B" },
  { questionNumber: 9, question: "How quickly should a rescue be performed?", options: { A: "Within hours", B: "As quickly as safely possible", C: "End of work day", D: "No rush" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What is the purpose of a daily safety briefing?", options: { A: "Waste time", B: "Communicate hazards and procedures for the day", C: "Reduce pay", D: "Delay work" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What should be done if weather conditions change?", options: { A: "Ignore changes", B: "Reassess risks and adjust or stop work if necessary", C: "Work faster", D: "Continue regardless" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What marking indicates equipment certification?", options: { A: "Company logo", B: "ANSI or CE certification marks", C: "Color coding", D: "Stickers" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What is the purpose of a work positioning device?", options: { A: "Fall arrest", B: "Allow hands-free work while supported", C: "Rescue only", D: "Tool carrying" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How should multiple loads on an anchor be calculated?", options: { A: "Ignore extra loads", B: "Sum all loads and ensure anchor capacity is adequate", C: "Divide by two", D: "Estimate roughly" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What personal protective equipment is required beyond harness and helmet?", options: { A: "None", B: "Task-specific PPE such as gloves, eye protection", C: "Fashion accessories", D: "No additional PPE" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What action should be taken for an equipment failure?", options: { A: "Continue working", B: "Stop work, investigate, and replace equipment", C: "Ignore it", D: "Fix it yourself" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What documentation should technicians maintain?", options: { A: "None", B: "Training records and equipment inspection logs", C: "Personal diary", D: "Social media posts" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What is the minimum crew size for SPRAT operations?", options: { A: "One person", B: "Minimum of two, typically three for rescue capability", C: "Five people", D: "No minimum" }, correctAnswer: "B" },
  { questionNumber: 19, question: "How should rope ends be managed?", options: { A: "Left loose", B: "Secured with knots to prevent running through devices", C: "Burned", D: "Tied together" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What is the Level 1's primary role on site?", options: { A: "Supervising others", B: "Performing work under supervision of higher levels", C: "Managing the project", D: "Equipment purchasing" }, correctAnswer: "B" }
];

// SPRAT Level 2 - Quiz A
const spratLevel2QuizA: QuizQuestion[] = [
  { questionNumber: 1, question: "What additional skills does a SPRAT Level 2 have compared to Level 1?", options: { A: "Management skills only", B: "Rigging, rescue, and supervising Level 1 technicians", C: "No additional skills", D: "Financial management" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What is the minimum experience requirement for SPRAT Level 2?", options: { A: "No experience", B: "500-1000 hours documented rope access work", C: "100 hours", D: "2 weeks" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What is a rope grab device used for?", options: { A: "Cutting rope", B: "Providing fall protection on vertical lines", C: "Carrying equipment", D: "Rescue only" }, correctAnswer: "B" },
  { questionNumber: 4, question: "How should a mid-line anchor be inspected?", options: { A: "Visual inspection only", B: "Verify anchor integrity, connection method, and load path", C: "Count the anchors", D: "No inspection needed" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What is the purpose of a rescue rehearsal?", options: { A: "Entertainment", B: "Ensure team is capable of performing rescue quickly", C: "Pass the time", D: "Impress clients" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What mechanical advantage is provided by a 2:1 pulley system?", options: { A: "No advantage", B: "Pull force is halved", C: "Pull force is doubled", D: "Pull force is tripled" }, correctAnswer: "B" },
  { questionNumber: 7, question: "How should rope protection be positioned at edges?", options: { A: "Anywhere convenient", B: "Under the rope at point of contact with edge", C: "Away from the rope", D: "On top of rope" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What is a directional pulley used for?", options: { A: "Cutting rope", B: "Changing the direction of pull", C: "Rescue only", D: "Storage" }, correctAnswer: "B" },
  { questionNumber: 9, question: "How should tensioned traverses be rigged?", options: { A: "Loosely", B: "With proper tension, backup, and adequate anchor strength", C: "Without backup", D: "Any way is acceptable" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What is the primary consideration for picking off an injured worker?", options: { A: "Speed only", B: "Safety of rescuer while efficiently reaching casualty", C: "Cost", D: "Documentation" }, correctAnswer: "B" },
  { questionNumber: 11, question: "How is fall factor calculated?", options: { A: "Weight times height", B: "Fall distance divided by rope length", C: "Random number", D: "Age of rope" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What should be verified before using fixed anchors?", options: { A: "Color matching", B: "Integrity, load rating, and proper installation", C: "Brand name", D: "Installation date only" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What is the purpose of a progress capture device in hauling?", options: { A: "Measuring distance", B: "Preventing load from lowering when not pulling", C: "Communication", D: "Decoration" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How should sharp edges on structures be managed?", options: { A: "Ignore them", B: "Protect with edge protection devices or padding", C: "Work around them", D: "Mark with tape only" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the Level 2's role in emergency response?", options: { A: "Leave the area", B: "Capable of performing rescue and managing emergencies", C: "Call others", D: "Watch only" }, correctAnswer: "B" },
  { questionNumber: 16, question: "How should deviation slings be positioned?", options: { A: "Tightly against the rope", B: "Allow rope movement while preventing unwanted contact", C: "Loosely tied", D: "Any position" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What factors affect pulley system efficiency?", options: { A: "Color only", B: "Friction, sheave size, and rope compatibility", C: "Brand", D: "Age" }, correctAnswer: "B" },
  { questionNumber: 18, question: "How should ascending systems be configured for efficiency?", options: { A: "Any arrangement", B: "Proper spacing and compatibility between ascenders", C: "Randomly", D: "Maximum distance apart" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What is the purpose of a contingency plan?", options: { A: "Waste time", B: "Prepare for emergencies and unexpected situations", C: "Increase costs", D: "Documentation only" }, correctAnswer: "B" },
  { questionNumber: 20, question: "How should documentation be maintained during work?", options: { A: "No documentation needed", B: "Contemporaneous records of inspections and activities", C: "At the end of project", D: "Never" }, correctAnswer: "B" }
];

// SPRAT Level 2 - Quiz B
const spratLevel2QuizB: QuizQuestion[] = [
  { questionNumber: 1, question: "What knot is preferred for creating a mid-line attachment point?", options: { A: "Simple overhand", B: "Butterfly or directional figure 8", C: "Granny knot", D: "Slip knot" }, correctAnswer: "B" },
  { questionNumber: 2, question: "How should a hauling system be back-tied?", options: { A: "No backup needed", B: "Independent backup preventing uncontrolled lowering", C: "Same anchor", D: "Verbal agreement" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What considerations apply to hot work at height?", options: { A: "No special measures", B: "Fire prevention, spark protection, and fire watch", C: "Work faster", D: "Ignore sparks" }, correctAnswer: "B" },
  { questionNumber: 4, question: "How should rope access interface with scaffolding?", options: { A: "No interface", B: "Coordinate, ensure compatibility, and clear communication", C: "Avoid scaffolding", D: "Remove scaffolding" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What is the purpose of a knot-passing technique?", options: { A: "Removing knots", B: "Safely moving past knots while maintaining attachment", C: "Cutting rope", D: "Adding knots" }, correctAnswer: "B" },
  { questionNumber: 6, question: "How should multiple anchor points be equalized?", options: { A: "Randomly connect", B: "Use load-sharing techniques to distribute force", C: "Use one anchor", D: "Ignore equalization" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What is the Level 2's responsibility for site setup?", options: { A: "No responsibility", B: "Assist in rigging, verify safety measures, supervise work", C: "Paperwork only", D: "Leave it to Level 3" }, correctAnswer: "B" },
  { questionNumber: 8, question: "How should descent devices be locked off?", options: { A: "Let go", B: "Using manufacturer-specified locking technique", C: "Tie a knot anywhere", D: "Trust it will stay" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What is the purpose of rope management during work?", options: { A: "Appearance", B: "Prevent tangles, damage, and maintain organization", C: "Color coding", D: "Entertainment" }, correctAnswer: "B" },
  { questionNumber: 10, question: "How should chemical hazards be managed in rope access?", options: { A: "Ignore them", B: "Identify, assess exposure, and implement controls", C: "Work quickly", D: "No special measures" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What is a high-directional anchor used for?", options: { A: "Decoration", B: "Creating vertical access in horizontal structures", C: "Lowering only", D: "Storage" }, correctAnswer: "B" },
  { questionNumber: 12, question: "How should rescue plans be communicated?", options: { A: "Keep them secret", B: "Share with all team members before work begins", C: "Write them after work", D: "Verbal only" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What factors affect the selection of rigging components?", options: { A: "Color only", B: "Load requirements, environment, and compatibility", C: "Cost only", D: "Brand preference" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How should work in public areas be managed?", options: { A: "No special measures", B: "Barriers, warnings, and exclusion zones", C: "Work at night", D: "Ignore public" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the Level 2's role in equipment management?", options: { A: "No role", B: "Track, inspect, and maintain equipment", C: "Purchasing only", D: "Ignore equipment" }, correctAnswer: "B" },
  { questionNumber: 16, question: "How should anchor failure be prepared for?", options: { A: "Hope it doesn't happen", B: "Redundant systems and backup anchors", C: "Ignore the possibility", D: "Work faster" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What training should a Level 2 provide to Level 1 technicians?", options: { A: "None", B: "On-the-job guidance and skill development", C: "Theory only", D: "Criticism only" }, correctAnswer: "B" },
  { questionNumber: 18, question: "How should environmental factors affect work planning?", options: { A: "Ignore environment", B: "Assess and plan for temperature, weather, and visibility", C: "Work regardless", D: "Only consider rain" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What is the purpose of a safety standdown?", options: { A: "Punishment", B: "Address safety concerns and reinforce procedures", C: "Waste time", D: "Reduce wages" }, correctAnswer: "B" },
  { questionNumber: 20, question: "How should work restrictions due to medical conditions be managed?", options: { A: "Ignore them", B: "Communicate limitations and assign appropriate tasks", C: "Terminate employment", D: "Hide conditions" }, correctAnswer: "B" }
];

// SPRAT Level 3 - Quiz A
const spratLevel3QuizA: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the primary responsibility of a SPRAT Level 3?", options: { A: "Physical work only", B: "Planning, supervising, and ensuring safety compliance", C: "Equipment purchasing", D: "Marketing" }, correctAnswer: "B" },
  { questionNumber: 2, question: "What documentation must a Level 3 prepare?", options: { A: "None required", B: "Job safety analysis, rescue plans, and method statements", C: "Invoices only", D: "Personal records" }, correctAnswer: "B" },
  { questionNumber: 3, question: "How should a Level 3 verify subcontractor competence?", options: { A: "Take their word", B: "Review certifications, experience, and safety records", C: "No verification needed", D: "Price comparison only" }, correctAnswer: "B" },
  { questionNumber: 4, question: "What is the Level 3's role in regulatory compliance?", options: { A: "Ignore regulations", B: "Ensure all work meets applicable standards and regulations", C: "Delegate entirely", D: "Paperwork only" }, correctAnswer: "B" },
  { questionNumber: 5, question: "How should complex rigging be planned?", options: { A: "Trial and error", B: "Engineering review, calculations, and verification", C: "Guesswork", D: "Copy previous jobs" }, correctAnswer: "B" },
  { questionNumber: 6, question: "What is the Level 3's responsibility for crew welfare?", options: { A: "No responsibility", B: "Ensure rest, fatigue management, and safe working conditions", C: "Work only", D: "Punishment" }, correctAnswer: "B" },
  { questionNumber: 7, question: "How should work handovers be managed?", options: { A: "No handover needed", B: "Document status, hazards, and incomplete work", C: "Verbal only", D: "Leave notes randomly" }, correctAnswer: "B" },
  { questionNumber: 8, question: "What training records must a Level 3 maintain?", options: { A: "None", B: "Team member certifications, training, and competency records", C: "Personal only", D: "Financial records" }, correctAnswer: "B" },
  { questionNumber: 9, question: "How should equipment failures be documented?", options: { A: "No documentation", B: "Investigate, document, and report appropriately", C: "Hide failures", D: "Blame users" }, correctAnswer: "B" },
  { questionNumber: 10, question: "What is the Level 3's role in client relations?", options: { A: "Avoid clients", B: "Professional communication and representing the team", C: "Argue with clients", D: "No interaction" }, correctAnswer: "B" },
  { questionNumber: 11, question: "How should lessons learned be managed?", options: { A: "Ignore them", B: "Document, share, and implement improvements", C: "Keep secret", D: "Forget them" }, correctAnswer: "B" },
  { questionNumber: 12, question: "What is the Level 3's responsibility for site security?", options: { A: "No responsibility", B: "Ensure equipment and work areas are secured", C: "Lock personal items", D: "Leave everything open" }, correctAnswer: "B" },
  { questionNumber: 13, question: "How should work permits be managed?", options: { A: "Ignore permits", B: "Obtain, review conditions, and ensure compliance", C: "Work without permits", D: "Forge permits" }, correctAnswer: "B" },
  { questionNumber: 14, question: "What is the Level 3's role in quality assurance?", options: { A: "No role", B: "Ensure work meets specifications and standards", C: "Ignore quality", D: "Speed only" }, correctAnswer: "B" },
  { questionNumber: 15, question: "How should emergency drill results be used?", options: { A: "File and forget", B: "Analyze, identify improvements, and update procedures", C: "Ignore results", D: "Punish participants" }, correctAnswer: "B" },
  { questionNumber: 16, question: "What factors should influence crew selection?", options: { A: "Random selection", B: "Skills, experience, physical capability, and certification", C: "Friendship only", D: "Lowest cost" }, correctAnswer: "B" },
  { questionNumber: 17, question: "How should interfaces with other trades be documented?", options: { A: "No documentation", B: "Record agreements, responsibilities, and safety measures", C: "Verbal only", D: "Ignore interfaces" }, correctAnswer: "B" },
  { questionNumber: 18, question: "What is the Level 3's responsibility for environmental protection?", options: { A: "None", B: "Prevent contamination and manage waste properly", C: "Dump waste", D: "Ignore environment" }, correctAnswer: "B" },
  { questionNumber: 19, question: "How should deviation from planned work be managed?", options: { A: "Proceed regardless", B: "Stop, assess, and re-plan if necessary", C: "Ignore deviations", D: "Continue faster" }, correctAnswer: "B" },
  { questionNumber: 20, question: "What is the purpose of final inspection and sign-off?", options: { A: "Bureaucracy", B: "Verify work is complete, safe, and meets requirements", C: "Delay payment", D: "Find problems" }, correctAnswer: "B" }
];

// SPRAT Level 3 - Quiz B
const spratLevel3QuizB: QuizQuestion[] = [
  { questionNumber: 1, question: "What is the minimum experience requirement for SPRAT Level 3?", options: { A: "No requirement", B: "Significant documented experience as Level 2", C: "100 hours", D: "1 week" }, correctAnswer: "B" },
  { questionNumber: 2, question: "How should a Level 3 manage crew fatigue?", options: { A: "Ignore fatigue", B: "Monitor work hours, ensure rest, and adjust schedules", C: "Increase work", D: "Punish tired workers" }, correctAnswer: "B" },
  { questionNumber: 3, question: "What is the Level 3's role in accident prevention?", options: { A: "Wait for accidents", B: "Proactive hazard identification and risk management", C: "React only", D: "Blame others" }, correctAnswer: "B" },
  { questionNumber: 4, question: "How should regulatory changes be managed?", options: { A: "Ignore changes", B: "Monitor, assess impact, and implement updates", C: "Continue old methods", D: "Wait to be told" }, correctAnswer: "B" },
  { questionNumber: 5, question: "What is the Level 3's responsibility for crew competency?", options: { A: "No responsibility", B: "Verify, develop, and maintain team skills", C: "Assume competency", D: "Ignore skills" }, correctAnswer: "B" },
  { questionNumber: 6, question: "How should budget constraints affect safety decisions?", options: { A: "Safety can be reduced", B: "Safety is non-negotiable regardless of budget", C: "Budget comes first", D: "Ignore safety for savings" }, correctAnswer: "B" },
  { questionNumber: 7, question: "What is the Level 3's role in contractor selection?", options: { A: "No role", B: "Evaluate competence, safety record, and capability", C: "Lowest price wins", D: "Random selection" }, correctAnswer: "B" },
  { questionNumber: 8, question: "How should near-miss reporting be encouraged?", options: { A: "Punish reporters", B: "Create open culture, no-blame reporting, and feedback", C: "Discourage reporting", D: "Ignore near-misses" }, correctAnswer: "B" },
  { questionNumber: 9, question: "What is the Level 3's responsibility for toolbox talks?", options: { A: "Not required", B: "Ensure they are relevant, conducted, and documented", C: "Delegate entirely", D: "Skip them" }, correctAnswer: "B" },
  { questionNumber: 10, question: "How should innovation in safety be approached?", options: { A: "Avoid change", B: "Encourage improvement while maintaining standards", C: "Never change", D: "Copy competitors only" }, correctAnswer: "B" },
  { questionNumber: 11, question: "What is the Level 3's role in insurance matters?", options: { A: "No role", B: "Ensure adequate coverage and compliance with requirements", C: "Avoid insurance", D: "Fraudulent claims" }, correctAnswer: "B" },
  { questionNumber: 12, question: "How should work in extreme temperatures be managed?", options: { A: "Work normally", B: "Adjust work schedules, provide hydration, monitor workers", C: "Ignore temperature", D: "Work faster" }, correctAnswer: "B" },
  { questionNumber: 13, question: "What is the purpose of management reviews?", options: { A: "Bureaucracy", B: "Evaluate performance and identify improvements", C: "Assign blame", D: "Waste time" }, correctAnswer: "B" },
  { questionNumber: 14, question: "How should equipment obsolescence be managed?", options: { A: "Use forever", B: "Monitor condition, plan replacement, follow manufacturer guidance", C: "Ignore age", D: "Repair indefinitely" }, correctAnswer: "B" },
  { questionNumber: 15, question: "What is the Level 3's responsibility for crew motivation?", options: { A: "No responsibility", B: "Create positive work environment and recognize achievements", C: "Punishment only", D: "Ignore morale" }, correctAnswer: "B" },
  { questionNumber: 16, question: "How should safety performance be measured?", options: { A: "Ignore performance", B: "Track incidents, leading indicators, and improvements", C: "Count accidents only", D: "No measurement" }, correctAnswer: "B" },
  { questionNumber: 17, question: "What is the Level 3's role in emergency services liaison?", options: { A: "No contact", B: "Establish communication and provide site information", C: "Avoid services", D: "Obstruct services" }, correctAnswer: "B" },
  { questionNumber: 18, question: "How should technology changes affect operations?", options: { A: "Ignore technology", B: "Evaluate benefits, train staff, and implement safely", C: "Avoid all technology", D: "Use untested equipment" }, correctAnswer: "B" },
  { questionNumber: 19, question: "What is the Level 3's responsibility for succession planning?", options: { A: "No planning", B: "Develop team members for advancement", C: "Keep knowledge secret", D: "Prevent advancement" }, correctAnswer: "B" },
  { questionNumber: 20, question: "How should work quality be verified?", options: { A: "Trust it's correct", B: "Inspection, testing, and documentation", C: "Ignore quality", D: "Client responsibility" }, correctAnswer: "B" }
];

// Export all quizzes
export const certificationQuizzes: CertificationQuiz[] = [
  { quizType: "irata_level_1_a", title: "Rope Access Knowledge Quiz - Level 1 (Set A)", level: 1, certification: "irata", questions: irataLevel1QuizA },
  { quizType: "irata_level_1_b", title: "Rope Access Knowledge Quiz - Level 1 (Set B)", level: 1, certification: "irata", questions: irataLevel1QuizB },
  { quizType: "irata_level_2_a", title: "Rope Access Knowledge Quiz - Level 2 (Set A)", level: 2, certification: "irata", questions: irataLevel2QuizA },
  { quizType: "irata_level_2_b", title: "Rope Access Knowledge Quiz - Level 2 (Set B)", level: 2, certification: "irata", questions: irataLevel2QuizB },
  { quizType: "irata_level_3_a", title: "Rope Access Knowledge Quiz - Level 3 (Set A)", level: 3, certification: "irata", questions: irataLevel3QuizA },
  { quizType: "irata_level_3_b", title: "Rope Access Knowledge Quiz - Level 3 (Set B)", level: 3, certification: "irata", questions: irataLevel3QuizB },
  { quizType: "sprat_level_1_a", title: "Rope Access Knowledge Quiz - Level 1 (Set A)", level: 1, certification: "sprat", questions: spratLevel1QuizA },
  { quizType: "sprat_level_1_b", title: "Rope Access Knowledge Quiz - Level 1 (Set B)", level: 1, certification: "sprat", questions: spratLevel1QuizB },
  { quizType: "sprat_level_2_a", title: "Rope Access Knowledge Quiz - Level 2 (Set A)", level: 2, certification: "sprat", questions: spratLevel2QuizA },
  { quizType: "sprat_level_2_b", title: "Rope Access Knowledge Quiz - Level 2 (Set B)", level: 2, certification: "sprat", questions: spratLevel2QuizB },
  { quizType: "sprat_level_3_a", title: "Rope Access Knowledge Quiz - Level 3 (Set A)", level: 3, certification: "sprat", questions: spratLevel3QuizA },
  { quizType: "sprat_level_3_b", title: "Rope Access Knowledge Quiz - Level 3 (Set B)", level: 3, certification: "sprat", questions: spratLevel3QuizB },
];

// Helper function to get quizzes based on certification level
export function getQuizzesForUser(irataLevel: string | null, spratLevel: string | null): CertificationQuiz[] {
  const result: CertificationQuiz[] = [];
  
  // Parse IRATA level (e.g., "Level 1", "Level 2", "Level 3")
  if (irataLevel) {
    const levelMatch = irataLevel.match(/(\d)/);
    if (levelMatch) {
      const userLevel = parseInt(levelMatch[1]);
      // User sees quizzes for their level and below
      certificationQuizzes
        .filter(q => q.certification === "irata" && q.level <= userLevel)
        .forEach(q => result.push(q));
    }
  }
  
  // Parse SPRAT level
  if (spratLevel) {
    const levelMatch = spratLevel.match(/(\d)/);
    if (levelMatch) {
      const userLevel = parseInt(levelMatch[1]);
      certificationQuizzes
        .filter(q => q.certification === "sprat" && q.level <= userLevel)
        .forEach(q => result.push(q));
    }
  }
  
  return result;
}
