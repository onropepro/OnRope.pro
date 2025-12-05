import { chromium, Browser, Page } from 'playwright';

export interface IrataVerificationResult {
  success: boolean;
  verified: boolean;
  technicianName?: string;
  level?: string;
  expiryDate?: string;
  status?: string;
  error?: string;
  requiresManualVerification?: boolean;
}

let browser: Browser | null = null;
let browserLaunchTime: number = 0;
const BROWSER_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes max browser lifetime

async function getBrowser(): Promise<Browser> {
  const now = Date.now();
  
  // Close stale browser to prevent memory leaks
  if (browser && (now - browserLaunchTime > BROWSER_MAX_AGE_MS)) {
    console.log('[IRATA] Closing stale browser instance');
    try {
      await browser.close();
    } catch (e) {
      console.error('[IRATA] Error closing stale browser:', e);
    }
    browser = null;
  }
  
  if (!browser || !browser.isConnected()) {
    console.log('[IRATA] Launching new browser instance');
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });
    browserLaunchTime = now;
  }
  
  return browser;
}

export async function verifyIrataLicense(
  lastName: string,
  irataNumber: string
): Promise<IrataVerificationResult> {
  let page: Page | null = null;
  const TIMEOUT = 20000; // 20 second timeout
  
  try {
    console.log(`[IRATA] Starting verification for: ${lastName}, ${irataNumber}`);
    
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();
    
    // Set timeouts
    page.setDefaultTimeout(TIMEOUT);
    page.setDefaultNavigationTimeout(TIMEOUT);
    
    // Navigate to the IRATA verification page
    console.log('[IRATA] Navigating to verification page...');
    await page.goto('https://techconnect.irata.org/verify/tech', {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });
    
    // Check for reCAPTCHA before doing anything
    const hasRecaptcha = await page.$('.g-recaptcha, [data-sitekey], iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"]');
    if (hasRecaptcha) {
      console.log('[IRATA] reCAPTCHA detected on page load');
      return {
        success: true,
        verified: false,
        requiresManualVerification: true,
        error: 'IRATA verification requires CAPTCHA completion. Please verify your license manually at https://techconnect.irata.org/verify/tech'
      };
    }
    
    // Wait for form elements
    await page.waitForLoadState('networkidle', { timeout: TIMEOUT });
    
    // Try to find and fill the last name field using multiple strategies
    console.log('[IRATA] Filling form fields...');
    
    // Strategy 1: Try common input selectors
    let lastNameFilled = false;
    const lastNameSelectors = [
      'input[name="lastName"]',
      'input[name="surname"]',
      'input[placeholder*="Last"]',
      'input[placeholder*="Surname"]',
      '#lastName',
      '#surname',
      'input[type="text"]:first-of-type'
    ];
    
    for (const selector of lastNameSelectors) {
      const input = await page.$(selector);
      if (input) {
        await input.fill(lastName);
        lastNameFilled = true;
        console.log(`[IRATA] Last name filled using: ${selector}`);
        break;
      }
    }
    
    if (!lastNameFilled) {
      // Try by label
      try {
        await page.getByLabel(/last name|surname/i).fill(lastName);
        lastNameFilled = true;
        console.log('[IRATA] Last name filled using label');
      } catch (e) {
        console.log('[IRATA] Could not fill last name field');
      }
    }
    
    // Try to find and fill the IRATA number field
    let irataFilled = false;
    const irataSelectors = [
      'input[name="irataNo"]',
      'input[name="irataNumber"]',
      'input[name="certNo"]',
      'input[placeholder*="IRATA"]',
      'input[placeholder*="number"]',
      '#irataNo',
      '#certNo',
      'input[type="text"]:nth-of-type(2)'
    ];
    
    for (const selector of irataSelectors) {
      const input = await page.$(selector);
      if (input) {
        await input.fill(irataNumber);
        irataFilled = true;
        console.log(`[IRATA] IRATA number filled using: ${selector}`);
        break;
      }
    }
    
    if (!irataFilled) {
      try {
        await page.getByLabel(/irata|certificate|cert/i).fill(irataNumber);
        irataFilled = true;
        console.log('[IRATA] IRATA number filled using label');
      } catch (e) {
        console.log('[IRATA] Could not fill IRATA number field');
      }
    }
    
    if (!lastNameFilled || !irataFilled) {
      return {
        success: false,
        verified: false,
        error: 'Could not locate form fields on IRATA verification page. The page structure may have changed.'
      };
    }
    
    // Click the submit button
    console.log('[IRATA] Submitting form...');
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Search")',
      'button:has-text("Verify")',
      'button:has-text("Check")',
      '.btn-primary',
      '.submit-btn'
    ];
    
    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const btn = await page.$(selector);
        if (btn) {
          await btn.click();
          submitted = true;
          console.log(`[IRATA] Form submitted using: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!submitted) {
      try {
        await page.getByRole('button', { name: /search|verify|check|submit/i }).click();
        submitted = true;
        console.log('[IRATA] Form submitted using role');
      } catch (e) {
        return {
          success: false,
          verified: false,
          error: 'Could not find submit button on IRATA verification page.'
        };
      }
    }
    
    // Wait for response
    await page.waitForLoadState('networkidle', { timeout: TIMEOUT });
    await page.waitForTimeout(2000); // Extra wait for dynamic content
    
    // Check for reCAPTCHA after submission
    const hasRecaptchaAfter = await page.$('.g-recaptcha, [data-sitekey], iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"]');
    if (hasRecaptchaAfter) {
      console.log('[IRATA] reCAPTCHA detected after submission');
      return {
        success: true,
        verified: false,
        requiresManualVerification: true,
        error: 'IRATA verification requires CAPTCHA completion. Please verify your license manually at https://techconnect.irata.org/verify/tech'
      };
    }
    
    // Get page content for parsing
    const pageContent = await page.content();
    const pageText = await page.innerText('body');
    
    console.log('[IRATA] Parsing results...');
    
    // Check for "no results" indicators
    const noResultsPatterns = [
      /no\s+(?:results?|records?|match(?:es)?)\s+found/i,
      /technician\s+not\s+found/i,
      /invalid\s+(?:credentials?|details?)/i,
      /could\s+not\s+(?:find|verify)/i
    ];
    
    for (const pattern of noResultsPatterns) {
      if (pattern.test(pageText)) {
        return {
          success: true,
          verified: false,
          error: 'No technician found with the provided details. Please check your last name and IRATA number.'
        };
      }
    }
    
    // Try to extract technician details
    const levelMatch = pageText.match(/(?:Level|Lvl)\s*[:\s]*(\d)/i) ||
                       pageContent.match(/(?:Level|Lvl)\s*[:\s]*(\d)/i);
    
    const expiryMatch = pageText.match(/(?:Expir[ey]|Valid\s+until|Expires?)\s*[:\s]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i) ||
                        pageText.match(/([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})\s*(?:expir|valid)/i);
    
    const statusMatch = pageText.match(/(?:Status)\s*[:\s]*(Current|Expired|On\s+Hold|Active|Valid|Suspended)/i);
    
    const nameMatch = pageText.match(/(?:Name|Technician)\s*[:\s]*([A-Za-z\s\-']+)/i);
    
    // Check if we found verification details
    if (levelMatch || expiryMatch || statusMatch) {
      console.log('[IRATA] Verification successful');
      return {
        success: true,
        verified: true,
        technicianName: nameMatch ? nameMatch[1].trim() : undefined,
        level: levelMatch ? `Level ${levelMatch[1]}` : undefined,
        expiryDate: expiryMatch ? expiryMatch[1] : undefined,
        status: statusMatch ? statusMatch[1].replace(/\s+/g, ' ') : 'Unknown'
      };
    }
    
    // If we got here, we couldn't parse the results
    console.log('[IRATA] Could not parse verification results');
    return {
      success: true,
      verified: false,
      requiresManualVerification: true,
      error: 'Could not parse verification results. Please verify manually at https://techconnect.irata.org/verify/tech'
    };
    
  } catch (error) {
    console.error('[IRATA] Verification error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Timeout') || error.message.includes('timeout')) {
        return {
          success: false,
          verified: false,
          error: 'IRATA verification timed out. The verification service may be temporarily slow. Please try again or verify manually.'
        };
      }
      if (error.message.includes('net::') || error.message.includes('Network')) {
        return {
          success: false,
          verified: false,
          error: 'Could not connect to IRATA verification service. Please check your connection and try again.'
        };
      }
    }
    
    return {
      success: false,
      verified: false,
      error: 'Verification service temporarily unavailable. Please try again later or verify manually at https://techconnect.irata.org/verify/tech'
    };
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error('[IRATA] Error closing page:', e);
      }
    }
  }
}

// Cleanup function to close browser on shutdown
export async function closeBrowser(): Promise<void> {
  if (browser) {
    try {
      await browser.close();
    } catch (e) {
      console.error('[IRATA] Error closing browser on shutdown:', e);
    }
    browser = null;
  }
}

// Handle process termination
process.on('SIGINT', closeBrowser);
process.on('SIGTERM', closeBrowser);
