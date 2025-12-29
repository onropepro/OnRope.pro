import { db } from "../server/db";
import { jobPostings } from "../shared/schema";
import { sql, and } from "drizzle-orm";

const COUNTRY_ALIASES: Record<string, string> = {
  "canada": "Canada",
  "ca": "Canada",
  "usa": "United States",
  "us": "United States",
  "united states": "United States",
  "uk": "United Kingdom",
  "united kingdom": "United Kingdom",
  "britain": "United Kingdom",
  "australia": "Australia",
  "aus": "Australia",
  "uae": "United Arab Emirates",
  "norway": "Norway",
};

const PROVINCE_ALIASES: Record<string, { province: string; country: string }> = {
  "bc": { province: "British Columbia", country: "Canada" },
  "british columbia": { province: "British Columbia", country: "Canada" },
  "ab": { province: "Alberta", country: "Canada" },
  "alberta": { province: "Alberta", country: "Canada" },
  "on": { province: "Ontario", country: "Canada" },
  "ontario": { province: "Ontario", country: "Canada" },
  "qc": { province: "Quebec", country: "Canada" },
  "quebec": { province: "Quebec", country: "Canada" },
  "ns": { province: "Nova Scotia", country: "Canada" },
  "nb": { province: "New Brunswick", country: "Canada" },
  "mb": { province: "Manitoba", country: "Canada" },
  "sk": { province: "Saskatchewan", country: "Canada" },
  "nl": { province: "Newfoundland and Labrador", country: "Canada" },
  "pe": { province: "Prince Edward Island", country: "Canada" },
  "nt": { province: "Northwest Territories", country: "Canada" },
  "yt": { province: "Yukon", country: "Canada" },
  "nu": { province: "Nunavut", country: "Canada" },
  "ca": { province: "California", country: "United States" },
  "california": { province: "California", country: "United States" },
  "tx": { province: "Texas", country: "United States" },
  "texas": { province: "Texas", country: "United States" },
  "ny": { province: "New York", country: "United States" },
  "new york": { province: "New York", country: "United States" },
  "wa": { province: "Washington", country: "United States" },
  "washington": { province: "Washington", country: "United States" },
  "fl": { province: "Florida", country: "United States" },
  "florida": { province: "Florida", country: "United States" },
  "co": { province: "Colorado", country: "United States" },
  "colorado": { province: "Colorado", country: "United States" },
  "or": { province: "Oregon", country: "United States" },
  "oregon": { province: "Oregon", country: "United States" },
  "la": { province: "Louisiana", country: "United States" },
  "louisiana": { province: "Louisiana", country: "United States" },
  "al": { province: "Alabama", country: "United States" },
  "alabama": { province: "Alabama", country: "United States" },
};

const KNOWN_CITIES: Record<string, { city: string; province: string; country: string }> = {
  "vancouver": { city: "Vancouver", province: "British Columbia", country: "Canada" },
  "calgary": { city: "Calgary", province: "Alberta", country: "Canada" },
  "edmonton": { city: "Edmonton", province: "Alberta", country: "Canada" },
  "toronto": { city: "Toronto", province: "Ontario", country: "Canada" },
  "montreal": { city: "Montreal", province: "Quebec", country: "Canada" },
  "ottawa": { city: "Ottawa", province: "Ontario", country: "Canada" },
  "winnipeg": { city: "Winnipeg", province: "Manitoba", country: "Canada" },
  "victoria": { city: "Victoria", province: "British Columbia", country: "Canada" },
  "halifax": { city: "Halifax", province: "Nova Scotia", country: "Canada" },
  "seattle": { city: "Seattle", province: "Washington", country: "United States" },
  "houston": { city: "Houston", province: "Texas", country: "United States" },
  "los angeles": { city: "Los Angeles", province: "California", country: "United States" },
  "san francisco": { city: "San Francisco", province: "California", country: "United States" },
  "denver": { city: "Denver", province: "Colorado", country: "United States" },
  "new york": { city: "New York City", province: "New York", country: "United States" },
  "london": { city: "London", province: "England", country: "United Kingdom" },
  "aberdeen": { city: "Aberdeen", province: "Scotland", country: "United Kingdom" },
  "sydney": { city: "Sydney", province: "New South Wales", country: "Australia" },
  "perth": { city: "Perth", province: "Western Australia", country: "Australia" },
  "dubai": { city: "Dubai", province: "Dubai", country: "United Arab Emirates" },
  "abu dhabi": { city: "Abu Dhabi", province: "Abu Dhabi", country: "United Arab Emirates" },
  "oslo": { city: "Oslo", province: "Oslo", country: "Norway" },
  "stavanger": { city: "Stavanger", province: "Rogaland", country: "Norway" },
};

interface ParsedLocation {
  jobCity: string | null;
  jobProvinceState: string | null;
  jobCountry: string | null;
}

function parseLocation(location: string): ParsedLocation {
  const result: ParsedLocation = {
    jobCity: null,
    jobProvinceState: null,
    jobCountry: null,
  };

  if (!location) return result;

  const parts = location.split(",").map(p => p.trim());
  const lowercaseLocation = location.toLowerCase().trim();

  const knownCity = KNOWN_CITIES[lowercaseLocation];
  if (knownCity) {
    return {
      jobCity: knownCity.city,
      jobProvinceState: knownCity.province,
      jobCountry: knownCity.country,
    };
  }

  if (parts.length === 1) {
    const part = parts[0].toLowerCase();
    
    if (KNOWN_CITIES[part]) {
      const city = KNOWN_CITIES[part];
      return { jobCity: city.city, jobProvinceState: city.province, jobCountry: city.country };
    }
    
    if (PROVINCE_ALIASES[part]) {
      const prov = PROVINCE_ALIASES[part];
      return { jobCity: null, jobProvinceState: prov.province, jobCountry: prov.country };
    }
    
    if (COUNTRY_ALIASES[part]) {
      return { jobCity: null, jobProvinceState: null, jobCountry: COUNTRY_ALIASES[part] };
    }
    
    result.jobCity = parts[0];
    result.jobCountry = "Canada";
  } else if (parts.length === 2) {
    const [first, second] = parts.map(p => p.toLowerCase());
    
    const secondProvince = PROVINCE_ALIASES[second];
    if (secondProvince) {
      result.jobCity = parts[0];
      result.jobProvinceState = secondProvince.province;
      result.jobCountry = secondProvince.country;
    } else if (COUNTRY_ALIASES[second]) {
      const firstProvince = PROVINCE_ALIASES[first];
      if (firstProvince) {
        result.jobProvinceState = firstProvince.province;
        result.jobCountry = COUNTRY_ALIASES[second];
      } else {
        result.jobCity = parts[0];
        result.jobCountry = COUNTRY_ALIASES[second];
      }
    } else {
      result.jobCity = parts[0];
      result.jobProvinceState = parts[1];
      result.jobCountry = "Canada";
    }
  } else if (parts.length >= 3) {
    result.jobCity = parts[0];
    
    const secondLower = parts[1].toLowerCase();
    const thirdLower = parts[2].toLowerCase();
    
    const secondProvince = PROVINCE_ALIASES[secondLower];
    if (secondProvince) {
      result.jobProvinceState = secondProvince.province;
      result.jobCountry = secondProvince.country;
    } else {
      result.jobProvinceState = parts[1];
    }
    
    if (COUNTRY_ALIASES[thirdLower]) {
      result.jobCountry = COUNTRY_ALIASES[thirdLower];
    } else {
      result.jobCountry = parts[2];
    }
  }

  return result;
}

async function backfillJobLocations() {
  console.log("Starting job location backfill...");
  
  const jobsToUpdate = await db.select({
    id: jobPostings.id,
    location: jobPostings.location,
    jobCity: jobPostings.jobCity,
    jobProvinceState: jobPostings.jobProvinceState,
    jobCountry: jobPostings.jobCountry,
  })
  .from(jobPostings)
  .where(
    and(
      sql`${jobPostings.location} IS NOT NULL`,
      sql`(${jobPostings.jobCity} IS NULL AND ${jobPostings.jobProvinceState} IS NULL AND ${jobPostings.jobCountry} IS NULL)`
    )
  );

  console.log(`Found ${jobsToUpdate.length} job postings to backfill`);

  let updated = 0;
  let skipped = 0;

  for (const job of jobsToUpdate) {
    if (!job.location) {
      skipped++;
      continue;
    }

    const parsed = parseLocation(job.location);
    
    if (!parsed.jobCity && !parsed.jobProvinceState && !parsed.jobCountry) {
      console.log(`Could not parse location for job ${job.id}: "${job.location}"`);
      skipped++;
      continue;
    }

    console.log(`Updating job ${job.id}: "${job.location}" → city: ${parsed.jobCity}, province: ${parsed.jobProvinceState}, country: ${parsed.jobCountry}`);

    await db.update(jobPostings)
      .set({
        jobCity: parsed.jobCity,
        jobProvinceState: parsed.jobProvinceState,
        jobCountry: parsed.jobCountry,
      })
      .where(sql`${jobPostings.id} = ${job.id}`);

    updated++;
  }

  console.log(`\nBackfill complete: ${updated} updated, ${skipped} skipped`);
}

backfillJobLocations()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during backfill:", error);
    process.exit(1);
  });
