# Property Manager Building Map - Implementation Plan

## Overview
Create an interactive Leaflet map for property managers showing all active projects across their linked buildings (strata numbers), regardless of which vendor is working on them. Clicking a building marker opens the same project detail view as clicking a project inside a vendor card.

---

## Phase 1: Backend API

### 1.1 New API Endpoint: Get All PM Buildings with Active Projects
```
GET /api/property-managers/me/buildings-map
```

**Response Structure:**
```typescript
{
  buildings: [{
    projectId: string;
    strataPlanNumber: string;
    buildingName: string | null;
    buildingAddress: string;
    latitude: string | null;
    longitude: string | null;
    status: string;
    jobType: string;
    customJobType: string | null;
    startDate: string | null;
    endDate: string | null;
    // Vendor info
    vendorLinkId: string;  // For opening project detail
    vendorName: string;
    vendorLogo: string | null;
  }]
}
```

**Logic:**
1. Get all PM's company links (with strata numbers)
2. For each link, fetch projects matching that strata number from the linked company
3. Filter to only include projects with `latitude` and `longitude` set
4. Return combined list with vendor info attached

---

## Phase 2: Frontend Component

### 2.1 Create New Component: `PropertyManagerBuildingsMap.tsx`

**Key Features:**
- Reuse map patterns from `SuperUserBuildings.tsx`:
  - `MapContainer` with `TileLayer` (OpenStreetMap or similar)
  - Custom building markers using `L.divIcon`
  - `MapEventHandler` for bounds tracking
  - `FlyToBuilding` component for smooth navigation
- Default center: Vancouver area (49.2827, -123.1207)
- Show markers with color coding by status (active = green, scheduled = blue, etc.)
- Popup on hover showing building name + active job type

### 2.2 Building List Sidebar
- Scrollable list of buildings alongside map (like SuperUser buildings)
- Search/filter by building name or address
- Highlight corresponding marker on hover
- Show project count, vendor name, job type

### 2.3 Click Behavior
- Clicking marker or list item opens project detail view
- Uses existing `selectedVendor` and `selectedProject` state pattern
- Navigates to same UI as clicking project inside vendor card

---

## Phase 3: Integration into PropertyManager.tsx

### 3.1 Add Map Tab/Section
- New navigation option: "Buildings Map" 
- Toggle between current vendor cards view and map view
- Persist preference in localStorage

### 3.2 State Management
```typescript
const [showMapView, setShowMapView] = useState(false);
const [selectedMapProject, setSelectedMapProject] = useState<MapBuildingData | null>(null);
```

### 3.3 When Project Selected from Map
1. Find the corresponding `vendorLinkId` from the project data
2. Set `selectedVendor` using link data (may need to fetch or cache)
3. Set `selectedProject` to trigger existing project detail view
4. User sees same project detail UI they'd see from vendor card

---

## Phase 4: Empty/Edge States

### 4.1 No Linked Vendors
- Show message: "Link to a vendor first to see your buildings on the map"

### 4.2 No Strata Numbers Set
- Show message: "Set strata numbers for your vendor links to see building locations"

### 4.3 No Active Projects
- Show empty map with message: "No active projects at your buildings"

### 4.4 Missing Coordinates
- Projects without lat/lng won't appear on map
- Show badge: "X buildings missing location data"

---

## Phase 5: Multilingual Support

Add translations for:
- `propertyManager.buildingsMap` - "Buildings Map"
- `propertyManager.viewOnMap` - "View on Map"
- `propertyManager.activeProjects` - "Active Projects"
- `propertyManager.noLocationData` - "Missing location data"
- All other new UI strings in EN/FR/ES

---

## Technical Specifications

| Aspect | Detail |
|--------|--------|
| **Map Library** | Leaflet via `react-leaflet` (already installed) |
| **Default Zoom** | 11 (metro area view) |
| **Marker Style** | Circular with building icon, colored by status |
| **Mobile** | Full-width map, collapsible list below |
| **Desktop** | Split view: map left (60%), list right (40%) |

---

## Files to Modify/Create

| File | Action |
|------|--------|
| `server/routes.ts` | Add `/api/property-managers/me/buildings-map` endpoint |
| `server/storage.ts` | Add `getPropertyManagerBuildingsForMap()` function |
| `client/src/pages/PropertyManager.tsx` | Add map view toggle, integrate map component |
| `client/src/components/PropertyManagerBuildingsMap.tsx` | **NEW** - Main map component |
| `client/src/i18n/locales/en.json` | Add translations |
| `client/src/i18n/locales/fr.json` | Add translations |
| `client/src/i18n/locales/es.json` | Add translations |

---

## Estimated Effort
- **Backend API**: ~1 hour
- **Map Component**: ~2-3 hours (reusing SuperUser patterns)
- **Integration**: ~1 hour
- **Edge cases + Polish**: ~1 hour
- **Translations**: ~30 min

**Total: ~6-7 hours**
