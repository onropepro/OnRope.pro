import { db } from "./db";
import { equipmentCatalog } from "@shared/schema";

const PRE_POPULATED_EQUIPMENT = [
  // Applicators
  { equipmentType: "Applicators", brand: "Ettore", model: "Pro+ Series" },
  { equipmentType: "Applicators", brand: "IPC Eagle", model: "Pulex" },
  { equipmentType: "Applicators", brand: "Moerman", model: "Liquidator" },
  { equipmentType: "Applicators", brand: "Pulex", model: "Microfiber" },
  { equipmentType: "Applicators", brand: "Sorbo", model: "T-Bar" },
  { equipmentType: "Applicators", brand: "Unger", model: "StripWasher" },
  
  // Ascenders
  { equipmentType: "Ascender", brand: "CMC", model: "Rescucender" },
  { equipmentType: "Ascender", brand: "Climbing Technology", model: "Quick Roll" },
  { equipmentType: "Ascender", brand: "ISC", model: "Rocker" },
  { equipmentType: "Ascender", brand: "Kong", model: "Futura Foot" },
  { equipmentType: "Ascender", brand: "Kong", model: "Lift" },
  { equipmentType: "Ascender", brand: "Petzl", model: "ASCENSION" },
  { equipmentType: "Ascender", brand: "Petzl", model: "BASIC" },
  { equipmentType: "Ascender", brand: "Petzl", model: "CROLL" },
  { equipmentType: "Ascender", brand: "Petzl", model: "PANTIN" },
  { equipmentType: "Ascender", brand: "Singing Rock", model: "Lift" },
  
  // Back up devices
  { equipmentType: "Back up device", brand: "Camp", model: "Goblin" },
  { equipmentType: "Back up device", brand: "Climbing Technology", model: "Roll-N-Lock" },
  { equipmentType: "Back up device", brand: "ISC", model: "D4 Work Rescue" },
  { equipmentType: "Back up device", brand: "Kong", model: "Back-Up" },
  { equipmentType: "Back up device", brand: "Petzl", model: "ASAP" },
  { equipmentType: "Back up device", brand: "Petzl", model: "ASAP Lock" },
  { equipmentType: "Back up device", brand: "Singing Rock", model: "Locker" },
  { equipmentType: "Back up device", brand: "Skylotec", model: "SKN LT" },
  
  // Carabiner - Aluminum
  { equipmentType: "Carabiner - Aluminum", brand: "Black Diamond", model: "Positron Screwgate" },
  { equipmentType: "Carabiner - Aluminum", brand: "Black Diamond", model: "RockLock Screwgate" },
  { equipmentType: "Carabiner - Aluminum", brand: "Camp", model: "D Pro Lock" },
  { equipmentType: "Carabiner - Aluminum", brand: "Camp", model: "Photon Lock" },
  { equipmentType: "Carabiner - Aluminum", brand: "DMM", model: "Rhino Locksafe" },
  { equipmentType: "Carabiner - Aluminum", brand: "Edelrid", model: "HMS Strike Slider" },
  { equipmentType: "Carabiner - Aluminum", brand: "Grivel", model: "K3N Plume Twin Gate" },
  { equipmentType: "Carabiner - Aluminum", brand: "Petzl", model: "Am'D Triact-Lock" },
  { equipmentType: "Carabiner - Aluminum", brand: "Petzl", model: "SPIRIT Screw-Lock" },
  { equipmentType: "Carabiner - Aluminum", brand: "Petzl", model: "WILLIAM Triact-Lock" },
  { equipmentType: "Carabiner - Aluminum", brand: "Singing Rock", model: "HMS Triple Lock" },
  { equipmentType: "Carabiner - Aluminum", brand: "Wild Country", model: "Ascent Lite Screwgate" },
  
  // Carabiner - Steel
  { equipmentType: "Carabiner - Steel", brand: "Black Diamond", model: "Oval Keylock Steel" },
  { equipmentType: "Carabiner - Steel", brand: "Camp", model: "Oval XL 3Lock Steel" },
  { equipmentType: "Carabiner - Steel", brand: "DMM", model: "Ultra O Locksafe" },
  { equipmentType: "Carabiner - Steel", brand: "ISC", model: "Big Dan Triple Lock" },
  { equipmentType: "Carabiner - Steel", brand: "ISC", model: "HMS Triple Lock" },
  { equipmentType: "Carabiner - Steel", brand: "Kong", model: "Ovalone Trilock" },
  { equipmentType: "Carabiner - Steel", brand: "Petzl", model: "OK Triact-Lock" },
  { equipmentType: "Carabiner - Steel", brand: "Petzl", model: "OXAN Triact-Lock" },
  { equipmentType: "Carabiner - Steel", brand: "Petzl", model: "VULCAN Triact-Lock" },
  { equipmentType: "Carabiner - Steel", brand: "Singing Rock", model: "Oval Steel Triple Lock" },
  
  // Descenders
  { equipmentType: "Descender", brand: "CMC", model: "Clutch" },
  { equipmentType: "Descender", brand: "CMC", model: "MPD" },
  { equipmentType: "Descender", brand: "Camp", model: "Giant" },
  { equipmentType: "Descender", brand: "Climbing Technology", model: "Sparrow 200R" },
  { equipmentType: "Descender", brand: "ISC", model: "D4" },
  { equipmentType: "Descender", brand: "ISC", model: "D5" },
  { equipmentType: "Descender", brand: "Kong", model: "Oka" },
  { equipmentType: "Descender", brand: "Kong", model: "Pirata" },
  { equipmentType: "Descender", brand: "Petzl", model: "I'D L" },
  { equipmentType: "Descender", brand: "Petzl", model: "I'D S" },
  { equipmentType: "Descender", brand: "Petzl", model: "Maestro L" },
  { equipmentType: "Descender", brand: "Petzl", model: "Maestro S" },
  { equipmentType: "Descender", brand: "Petzl", model: "PIRANA" },
  { equipmentType: "Descender", brand: "Petzl", model: "RIG" },
  { equipmentType: "Descender", brand: "Petzl", model: "Rescucender" },
  { equipmentType: "Descender", brand: "Petzl", model: "Rig 2019" },
  { equipmentType: "Descender", brand: "Petzl", model: "Simple" },
  { equipmentType: "Descender", brand: "Petzl", model: "Stop" },
  { equipmentType: "Descender", brand: "Rock Exotica", model: "Akimbo" },
  { equipmentType: "Descender", brand: "Rock Exotica", model: "MachineWorks Totem" },
  { equipmentType: "Descender", brand: "Singing Rock", model: "Shuttle" },
  { equipmentType: "Descender", brand: "Skylotec", model: "Deus" },
  { equipmentType: "Descender", brand: "Skylotec", model: "Sirius" },
  
  // Gloves
  { equipmentType: "Gloves", brand: "Black Diamond", model: "Crag" },
  { equipmentType: "Gloves", brand: "Edelrid", model: "Work Glove Closed" },
  { equipmentType: "Gloves", brand: "Ironclad", model: "General Utility" },
  { equipmentType: "Gloves", brand: "Kong", model: "Claw" },
  { equipmentType: "Gloves", brand: "Mechanix", model: "M-Pact" },
  { equipmentType: "Gloves", brand: "Mechanix", model: "Original" },
  { equipmentType: "Gloves", brand: "Petzl", model: "CORDEX" },
  { equipmentType: "Gloves", brand: "Petzl", model: "CORDEX PLUS" },
  { equipmentType: "Gloves", brand: "Singing Rock", model: "Trapper" },
  { equipmentType: "Gloves", brand: "Skylotec", model: "Flex" },
  
  // Harnesses
  { equipmentType: "Harness", brand: "Black Diamond", model: "Technician" },
  { equipmentType: "Harness", brand: "CMC", model: "Proseries Harness" },
  { equipmentType: "Harness", brand: "Camp", model: "Titan" },
  { equipmentType: "Harness", brand: "Edelrid", model: "TreeRex Triple Lock" },
  { equipmentType: "Harness", brand: "ISC", model: "Gravity" },
  { equipmentType: "Harness", brand: "Petzl", model: "AVAO BOD" },
  { equipmentType: "Harness", brand: "Petzl", model: "AVAO SIT" },
  { equipmentType: "Harness", brand: "Petzl", model: "FALCON" },
  { equipmentType: "Harness", brand: "Petzl", model: "FALCON ASCENT" },
  { equipmentType: "Harness", brand: "Petzl", model: "NEWTON" },
  { equipmentType: "Harness", brand: "Petzl", model: "VOLT" },
  { equipmentType: "Harness", brand: "Singing Rock", model: "Expert 3D" },
  { equipmentType: "Harness", brand: "Singing Rock", model: "Profi Worker 3D" },
  { equipmentType: "Harness", brand: "Skylotec", model: "ARG 80" },
  { equipmentType: "Harness", brand: "Skylotec", model: "IGNITE PROTON" },
  
  // Helmets
  { equipmentType: "Helmet", brand: "Black Diamond", model: "Vision" },
  { equipmentType: "Helmet", brand: "Camp", model: "ARES" },
  { equipmentType: "Helmet", brand: "ISC", model: "AeroLite" },
  { equipmentType: "Helmet", brand: "Kask", model: "Superplasma PL" },
  { equipmentType: "Helmet", brand: "Kask", model: "Zenith" },
  { equipmentType: "Helmet", brand: "Petzl", model: "ALVEO" },
  { equipmentType: "Helmet", brand: "Petzl", model: "STRATO" },
  { equipmentType: "Helmet", brand: "Petzl", model: "VERTEX" },
  { equipmentType: "Helmet", brand: "Singing Rock", model: "Flash Industry" },
  { equipmentType: "Helmet", brand: "Skylotec", model: "Inceptor GRX" },
  
  // Lanyards
  { equipmentType: "Lanyard", brand: "Camp", model: "Shock Absorber" },
  { equipmentType: "Lanyard", brand: "ISC", model: "Shock Absorber Lanyard" },
  { equipmentType: "Lanyard", brand: "Kong", model: "Y Lanyard" },
  { equipmentType: "Lanyard", brand: "Petzl", model: "ABSORBICA-Y" },
  { equipmentType: "Lanyard", brand: "Petzl", model: "CONNEXION FIXE" },
  { equipmentType: "Lanyard", brand: "Petzl", model: "GRILLON" },
  { equipmentType: "Lanyard", brand: "Petzl", model: "JANE" },
  { equipmentType: "Lanyard", brand: "Petzl", model: "PROGRESS" },
  { equipmentType: "Lanyard", brand: "Singing Rock", model: "Reactor" },
  { equipmentType: "Lanyard", brand: "Skylotec", model: "Skysafe Pro" },
  
  // Ropes
  { equipmentType: "Rope", brand: "Beal", model: "Industrie 10.5mm" },
  { equipmentType: "Rope", brand: "Beal", model: "Pro Classic 10.5mm" },
  { equipmentType: "Rope", brand: "BlueWater", model: "II+ Static 11mm" },
  { equipmentType: "Rope", brand: "BlueWater", model: "SafeLine 11mm" },
  { equipmentType: "Rope", brand: "Edelrid", model: "Performance Static 10.5mm" },
  { equipmentType: "Rope", brand: "Petzl", model: "AXIS 11mm" },
  { equipmentType: "Rope", brand: "Petzl", model: "PARALLEL 10.5mm" },
  { equipmentType: "Rope", brand: "Petzl", model: "VECTOR 12.5mm" },
  { equipmentType: "Rope", brand: "Sterling", model: "HTP Static 11mm" },
  { equipmentType: "Rope", brand: "Sterling", model: "SafetyPro 11mm" },
  { equipmentType: "Rope", brand: "Sterling", model: "SuperStatic2 11mm" },
  { equipmentType: "Rope", brand: "Teufelberger", model: "PATRON Plus 11mm" },
  { equipmentType: "Rope", brand: "Yale Cordage", model: "XTC Fire 11mm" },
  
  // Shock absorbers
  { equipmentType: "Shock absorber", brand: "3M", model: "DBI-SALA" },
  { equipmentType: "Shock absorber", brand: "Camp", model: "Shock Absorber" },
  { equipmentType: "Shock absorber", brand: "ISC", model: "Fall Arrest" },
  { equipmentType: "Shock absorber", brand: "Kong", model: "Indy" },
  { equipmentType: "Shock absorber", brand: "Kong", model: "Shark" },
  { equipmentType: "Shock absorber", brand: "Miller", model: "Titan Pack-Type" },
  { equipmentType: "Shock absorber", brand: "Petzl", model: "ABSORBICA" },
  { equipmentType: "Shock absorber", brand: "Petzl", model: "ABSORBICA-I" },
  { equipmentType: "Shock absorber", brand: "Petzl", model: "ABSORBICA-Y" },
  { equipmentType: "Shock absorber", brand: "Singing Rock", model: "Absorber-Y" },
  { equipmentType: "Shock absorber", brand: "Skylotec", model: "BFD SK12" },
  { equipmentType: "Shock absorber", brand: "Skylotec", model: "Skysafe Pro Flex" },
  
  // Squeegee rubbers
  { equipmentType: "Squeegee rubbers", brand: "Ettore", model: "Master Brass" },
  { equipmentType: "Squeegee rubbers", brand: "Ettore", model: "Super System" },
  { equipmentType: "Squeegee rubbers", brand: "Moerman", model: "Excelerator" },
  { equipmentType: "Squeegee rubbers", brand: "Pulex", model: "TechnoLite" },
  { equipmentType: "Squeegee rubbers", brand: "Sorbo", model: "Cobra" },
  { equipmentType: "Squeegee rubbers", brand: "Unger", model: "ErgoTec Ninja" },
  { equipmentType: "Squeegee rubbers", brand: "Unger", model: "S-Channel" },
  { equipmentType: "Squeegee rubbers", brand: "Wagtail", model: "High Flyer" },
  
  // Suction cups
  { equipmentType: "Suction cup", brand: "All-Vac", model: "N5000" },
  { equipmentType: "Suction cup", brand: "Bohle", model: "Veribor" },
  { equipmentType: "Suction cup", brand: "GGR Glass", model: "Triple Pad" },
  { equipmentType: "Suction cup", brand: "Grabo", model: "Pro" },
  { equipmentType: "Suction cup", brand: "Wood's Powr-Grip", model: "N4000" },
  { equipmentType: "Suction cup", brand: "Wood's Powr-Grip", model: "N5450" },
  
  // Work positioning devices
  { equipmentType: "Work positioning device", brand: "Camp", model: "Goblin Fall Arrester" },
  { equipmentType: "Work positioning device", brand: "ISC", model: "Rope Grab Adjuster" },
  { equipmentType: "Work positioning device", brand: "Kong", model: "Trimmer" },
  { equipmentType: "Work positioning device", brand: "Petzl", model: "GRILLON" },
  { equipmentType: "Work positioning device", brand: "Petzl", model: "JANE" },
  { equipmentType: "Work positioning device", brand: "Petzl", model: "PROGRESS ADJUST" },
  { equipmentType: "Work positioning device", brand: "Singing Rock", model: "Reactor" },
  { equipmentType: "Work positioning device", brand: "Skylotec", model: "SKN LT" },
  
  // High pressure hoses
  { equipmentType: "High pressure hose", brand: "Generic", model: "Standard" },
  
  // Air hoses
  { equipmentType: "Air hose", brand: "Generic", model: "Standard" },
  
  // Caution signs
  { equipmentType: "Caution signs", brand: "Generic", model: "Standard" },
  
  // Cones
  { equipmentType: "Cones", brand: "Generic", model: "Standard" },
  
  // Street signs
  { equipmentType: "Street signs", brand: "Generic", model: "Standard" },
  
  // Delineators
  { equipmentType: "Delineator", brand: "Generic", model: "Standard" },
  
  // Pressure hose gaskets
  { equipmentType: "Pressure hose gasket", brand: "Generic", model: "Standard" },
  
  // Pressure washer wands
  { equipmentType: "Pressure washer wand", brand: "Generic", model: "Standard" },
  
  // Pulleys
  { equipmentType: "Pulley", brand: "CMC", model: "Rescue Pulley" },
  { equipmentType: "Pulley", brand: "Petzl", model: "RESCUE" },
  { equipmentType: "Pulley", brand: "Petzl", model: "PRO" },
  { equipmentType: "Pulley", brand: "Petzl", model: "MICRO TRAXION" },
  { equipmentType: "Pulley", brand: "Rock Exotica", model: "Omni-Block" },
  { equipmentType: "Pulley", brand: "ISC", model: "Double Pulley" },
  
  // Slings
  { equipmentType: "Slings", brand: "Petzl", model: "ANNEAU" },
  { equipmentType: "Slings", brand: "Petzl", model: "ST'ANNEAU" },
  { equipmentType: "Slings", brand: "Black Diamond", model: "Nylon Runner" },
  { equipmentType: "Slings", brand: "Black Diamond", model: "Dynex Runner" },
  { equipmentType: "Slings", brand: "Sterling", model: "Tubular Webbing" },
  { equipmentType: "Slings", brand: "BlueWater", model: "Anchor Sling" },
];

export async function seedEquipmentCatalog(): Promise<void> {
  try {
    // Check if the catalog already has items
    const existingItems = await db.select().from(equipmentCatalog).limit(1);
    
    if (existingItems.length > 0) {
      console.log("Equipment catalog already seeded, skipping...");
      return;
    }
    
    console.log("Seeding equipment catalog with pre-populated items...");
    
    // Insert all pre-populated items
    for (const item of PRE_POPULATED_EQUIPMENT) {
      await db.insert(equipmentCatalog).values({
        equipmentType: item.equipmentType,
        brand: item.brand,
        model: item.model,
        usageCount: 0,
      });
    }
    
    console.log(`✓ Seeded ${PRE_POPULATED_EQUIPMENT.length} equipment catalog items`);
  } catch (error) {
    console.error("Error seeding equipment catalog:", error);
  }
}
