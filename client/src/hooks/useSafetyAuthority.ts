import { useState, useEffect } from 'react';
import { getAuthorityByLocation, getAuthorityName } from '@/lib/safety-authorities';

interface GeoData {
  country: string;
  region_code: string;
}

const CACHE_KEY = 'safetyAuthorityName';

export function useSafetyAuthority() {
  const [authorityName, setAuthorityName] = useState("Your auditor");

  useEffect(() => {
    async function fetchLocation() {
      try {
        // Check for test location parameter in URL
        const params = new URLSearchParams(window.location.search);
        const testLocation = params.get('testLocation');
        
        if (testLocation) {
          // Format: testLocation=US,CA or testLocation=CA,BC
          const [country, region] = testLocation.split(',');
          const authority = getAuthorityByLocation(country.toUpperCase(), region.toUpperCase());
          const name = getAuthorityName(authority);
          setAuthorityName(name);
          return;
        }

        // Check cache first
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          setAuthorityName(cached);
          return;
        }

        // Fetch geolocation from ipapi.co
        const response = await fetch('https://ipapi.co/json/', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Geolocation API error');
        
        const data: GeoData = await response.json();
        const authority = getAuthorityByLocation(data.country, data.region_code);
        const name = getAuthorityName(authority);
        
        setAuthorityName(name);
        sessionStorage.setItem(CACHE_KEY, name);
      } catch (error) {
        // Silently fail to default
        console.error('Geolocation fetch failed:', error);
      }
    }

    fetchLocation();
  }, []);

  return authorityName;
}
