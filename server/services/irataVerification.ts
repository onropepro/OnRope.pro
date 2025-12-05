import { chromium } from 'playwright-extra';
import type { Browser, Page, BrowserContext } from 'playwright';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

const TWOCAPTCHA_API_KEY = process.env.TWOCAPTCHA_API_KEY || '';
const RECAPTCHA_SITE_KEY = '6LclgYooAAAAAMSMpBh5Ct2ku8wg_R3S4P5y2kaH';
const IRATA_VERIFY_URL = 'https://techconnect.irata.org/verify/tech';

interface TwoCaptchaResponse {
  status: number;
  request: string;
}

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
const BROWSER_MAX_AGE_MS = 30 * 60 * 1000;

async function solve2Captcha(siteKey: string, pageUrl: string): Promise<string | null> {
  if (!TWOCAPTCHA_API_KEY) {
    console.log('[2Captcha] No API key configured');
    return null;
  }

  try {
    console.log('[2Captcha] Submitting reCAPTCHA v3 solve request...');
    
    const submitUrl = `http://2captcha.com/in.php?key=${TWOCAPTCHA_API_KEY}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${encodeURIComponent(pageUrl)}&version=v3&action=verify&min_score=0.7&json=1`;
    
    const submitResponse = await fetch(submitUrl);
    const submitResult: TwoCaptchaResponse = await submitResponse.json();
    
    if (submitResult.status !== 1) {
      console.log('[2Captcha] Submit failed:', submitResult.request);
      return null;
    }
    
    const requestId = submitResult.request;
    console.log('[2Captcha] Request ID:', requestId);
    
    const maxAttempts = 40;
    const pollInterval = 5000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      console.log(`[2Captcha] Polling for result (attempt ${attempt + 1}/${maxAttempts})...`);
      
      const resultUrl = `http://2captcha.com/res.php?key=${TWOCAPTCHA_API_KEY}&action=get&id=${requestId}&json=1`;
      const resultResponse = await fetch(resultUrl);
      const resultData: TwoCaptchaResponse = await resultResponse.json();
      
      if (resultData.status === 1) {
        console.log('[2Captcha] CAPTCHA solved successfully!');
        return resultData.request;
      }
      
      if (resultData.request !== 'CAPCHA_NOT_READY') {
        console.log('[2Captcha] Error:', resultData.request);
        return null;
      }
    }
    
    console.log('[2Captcha] Timeout waiting for solution');
    return null;
    
  } catch (error) {
    console.error('[2Captcha] Error:', error);
    return null;
  }
}

async function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
}

async function humanLikeMouseMove(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  if (!viewport) return;
  
  const moves = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < moves; i++) {
    const x = Math.floor(Math.random() * viewport.width);
    const y = Math.floor(Math.random() * viewport.height);
    await page.mouse.move(x, y, { steps: Math.floor(Math.random() * 10) + 5 });
    await randomDelay(100, 300);
  }
}

async function getBrowser(): Promise<Browser> {
  const now = Date.now();
  
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
    console.log('[IRATA] Launching new stealth browser instance');
    
    const systemChromiumPath = '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium';
    
    browser = await chromium.launch({
      headless: true,
      executablePath: systemChromiumPath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--window-size=1920,1080',
        '--start-maximized'
      ]
    });
    browserLaunchTime = now;
  }
  
  return browser;
}

async function createStealthContext(browser: Browser): Promise<BrowserContext> {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ];
  
  const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
  
  const context = await browser.newContext({
    userAgent: randomUA,
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    permissions: ['geolocation'],
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    }
  });
  
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters: any) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission } as PermissionStatus) :
        originalQuery(parameters)
    );
    
    (window as any).chrome = { runtime: {} };
    
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter: number) {
      if (parameter === 37445) return 'Intel Inc.';
      if (parameter === 37446) return 'Intel Iris OpenGL Engine';
      return getParameter.call(this, parameter);
    };
  });
  
  return context;
}

export async function verifyIrataLicense(
  lastName: string,
  irataNumber: string
): Promise<IrataVerificationResult> {
  let context: BrowserContext | null = null;
  let page: Page | null = null;
  const TIMEOUT = 60000;
  
  try {
    console.log(`[IRATA] Starting verification for: ${lastName}, ${irataNumber}`);
    
    if (!TWOCAPTCHA_API_KEY) {
      console.log('[IRATA] No 2Captcha API key - cannot proceed with automated verification');
      return {
        success: false,
        verified: false,
        requiresManualVerification: true,
        error: 'Automated verification requires 2Captcha API key. Please verify manually.'
      };
    }
    
    console.log('[IRATA] Starting 2Captcha solve proactively...');
    const captchaTokenPromise = solve2Captcha(RECAPTCHA_SITE_KEY, IRATA_VERIFY_URL);
    
    const browserInstance = await getBrowser();
    context = await createStealthContext(browserInstance);
    page = await context.newPage();
    
    page.setDefaultTimeout(TIMEOUT);
    page.setDefaultNavigationTimeout(TIMEOUT);
    
    await randomDelay(500, 1500);
    
    console.log('[IRATA] Navigating to verification page...');
    await page.goto(IRATA_VERIFY_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });
    
    await randomDelay(2000, 3000);
    
    console.log('[IRATA] Waiting for page to fully render...');
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      console.log('[IRATA] Networkidle timeout, continuing...');
    });
    
    await randomDelay(2000, 3000);
    await humanLikeMouseMove(page);
    
    let pageContent = await page.content();
    let pageText = await page.innerText('body').catch(() => '');
    
    console.log('[IRATA] Page content length:', pageContent.length);
    console.log('[IRATA] Page text preview:', pageText.substring(0, 300));
    
    const captchaToken = await captchaTokenPromise;
    
    if (!captchaToken) {
      console.log('[IRATA] Failed to solve CAPTCHA');
      return {
        success: false,
        verified: false,
        requiresManualVerification: true,
        error: 'Could not solve security challenge. Please verify manually at techconnect.irata.org'
      };
    }
    
    console.log('[IRATA] Got CAPTCHA token, injecting...');
    
    await page.evaluate((token) => {
      let responseField = document.querySelector('#g-recaptcha-response') as HTMLTextAreaElement;
      if (!responseField) {
        responseField = document.createElement('textarea');
        responseField.id = 'g-recaptcha-response';
        responseField.name = 'g-recaptcha-response';
        responseField.style.display = 'none';
        document.body.appendChild(responseField);
      }
      responseField.value = token;
      
      const hiddenInputs = document.querySelectorAll('input[name="g-recaptcha-response"]');
      hiddenInputs.forEach((input: Element) => {
        (input as HTMLInputElement).value = token;
      });
      
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        let input = form.querySelector('input[name="g-recaptcha-response"]') as HTMLInputElement;
        if (!input) {
          input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'g-recaptcha-response';
          input.value = token;
          form.appendChild(input);
        } else {
          input.value = token;
        }
      });
      
      if (typeof (window as any).grecaptcha !== 'undefined') {
        try {
          (window as any).grecaptcha.getResponse = () => token;
          (window as any).grecaptcha.execute = () => Promise.resolve(token);
        } catch (e) {}
      }
      
      if (typeof (window as any).grecaptcha !== 'undefined' && (window as any).grecaptcha.enterprise) {
        try {
          (window as any).grecaptcha.enterprise.execute = () => Promise.resolve(token);
        } catch (e) {}
      }
    }, captchaToken);
    
    await randomDelay(1000, 2000);
    
    console.log('[IRATA] Reloading page with CAPTCHA token...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    await randomDelay(2000, 3000);
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    
    await humanLikeMouseMove(page);
    await randomDelay(1000, 2000);
    
    pageContent = await page.content();
    pageText = await page.innerText('body').catch(() => '');
    
    console.log('[IRATA] Looking for form fields after CAPTCHA...');
    
    const allInputs = await page.$$('input');
    console.log(`[IRATA] Found ${allInputs.length} total input fields`);
    
    for (const input of allInputs) {
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const id = await input.getAttribute('id');
      const placeholder = await input.getAttribute('placeholder');
      console.log(`[IRATA] Input: type=${type}, name=${name}, id=${id}, placeholder=${placeholder}`);
    }
    
    if (allInputs.length === 0) {
      console.log('[IRATA] Still no form fields found. Page may require different approach.');
      console.log('[IRATA] Full page HTML preview:', pageContent.substring(0, 2000));
      
      return {
        success: false,
        verified: false,
        requiresManualVerification: true,
        error: 'Could not access IRATA verification form. Please verify manually at techconnect.irata.org'
      };
    }
    
    let lastNameFilled = false;
    const lastNameSelectors = [
      'input[name*="surname" i]',
      'input[name*="lastName" i]',
      'input[name*="last" i]',
      'input[placeholder*="surname" i]',
      'input[placeholder*="last" i]',
      'input[id*="surname" i]',
      'input[id*="lastName" i]',
      'input[type="text"]:first-of-type'
    ];
    
    for (const selector of lastNameSelectors) {
      try {
        const input = await page.$(selector);
        if (input && await input.isVisible()) {
          await humanLikeMouseMove(page);
          await randomDelay(200, 500);
          await input.click();
          await randomDelay(100, 300);
          await input.fill('');
          for (const char of lastName) {
            await input.type(char, { delay: Math.floor(Math.random() * 80) + 40 });
          }
          lastNameFilled = true;
          console.log(`[IRATA] Last name filled using: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!lastNameFilled) {
      const textInputs = await page.$$('input[type="text"], input:not([type])');
      if (textInputs.length > 0) {
        const firstInput = textInputs[0];
        if (await firstInput.isVisible()) {
          await firstInput.click();
          await randomDelay(100, 300);
          for (const char of lastName) {
            await firstInput.type(char, { delay: Math.floor(Math.random() * 80) + 40 });
          }
          lastNameFilled = true;
          console.log('[IRATA] Last name filled using first visible text input');
        }
      }
    }
    
    await randomDelay(500, 1000);
    await humanLikeMouseMove(page);
    
    let irataFilled = false;
    const irataSelectors = [
      'input[name*="irata" i]',
      'input[name*="cert" i]',
      'input[name*="number" i]',
      'input[placeholder*="irata" i]',
      'input[placeholder*="cert" i]',
      'input[placeholder*="number" i]',
      'input[id*="irata" i]',
      'input[id*="cert" i]',
      'input[type="text"]:nth-of-type(2)'
    ];
    
    for (const selector of irataSelectors) {
      try {
        const input = await page.$(selector);
        if (input && await input.isVisible()) {
          await humanLikeMouseMove(page);
          await randomDelay(200, 500);
          await input.click();
          await randomDelay(100, 300);
          await input.fill('');
          for (const char of irataNumber) {
            await input.type(char, { delay: Math.floor(Math.random() * 80) + 40 });
          }
          irataFilled = true;
          console.log(`[IRATA] IRATA number filled using: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!irataFilled) {
      const textInputs = await page.$$('input[type="text"], input:not([type])');
      if (textInputs.length > 1) {
        const secondInput = textInputs[1];
        if (await secondInput.isVisible()) {
          await secondInput.click();
          await randomDelay(100, 300);
          for (const char of irataNumber) {
            await secondInput.type(char, { delay: Math.floor(Math.random() * 80) + 40 });
          }
          irataFilled = true;
          console.log('[IRATA] IRATA number filled using second visible text input');
        }
      }
    }
    
    if (!lastNameFilled || !irataFilled) {
      console.log('[IRATA] Could not locate all form fields');
      return {
        success: false,
        verified: false,
        requiresManualVerification: true,
        error: 'Could not fill verification form. Please verify manually at techconnect.irata.org'
      };
    }
    
    await randomDelay(800, 1500);
    await humanLikeMouseMove(page);
    
    console.log('[IRATA] Looking for submit button...');
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Search")',
      'button:has-text("Verify")',
      'button:has-text("Check")',
      'button:has-text("Submit")',
      '.btn-primary',
      'button.btn'
    ];
    
    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const btn = await page.$(selector);
        if (btn && await btn.isVisible()) {
          await humanLikeMouseMove(page);
          await randomDelay(300, 700);
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
      return {
        success: false,
        verified: false,
        error: 'Could not find submit button on IRATA verification page.'
      };
    }
    
    console.log('[IRATA] Waiting for response...');
    await randomDelay(3000, 5000);
    
    try {
      await page.waitForLoadState('networkidle', { timeout: 20000 });
    } catch (e) {
      console.log('[IRATA] Networkidle timeout after submit, continuing...');
    }
    
    await randomDelay(1000, 2000);
    
    pageText = await page.innerText('body').catch(() => '');
    pageContent = await page.content();
    
    console.log('[IRATA] Result page text length:', pageText.length);
    console.log('[IRATA] Result preview:', pageText.substring(0, 500));
    
    const noResultsPatterns = [
      /no\s+(?:results?|records?|match(?:es)?)\s+found/i,
      /technician\s+not\s+found/i,
      /invalid\s+(?:credentials?|details?)/i,
      /could\s+not\s+(?:find|verify)/i,
      /no\s+technician/i,
      /not\s+registered/i
    ];
    
    for (const pattern of noResultsPatterns) {
      if (pattern.test(pageText)) {
        console.log('[IRATA] No technician found');
        return {
          success: true,
          verified: false,
          error: 'No technician found with the provided details. Please check your last name and IRATA number.'
        };
      }
    }
    
    const levelMatch = pageText.match(/(?:Level|Lvl)\s*[:\s]*(\d)/i) ||
                       pageContent.match(/(?:Level|Lvl)\s*[:\s]*(\d)/i) ||
                       pageText.match(/L(\d)\s+Tech/i);
    
    const expiryMatch = pageText.match(/(?:Expir[ey]|Valid\s+until|Expires?)\s*[:\s]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i) ||
                        pageText.match(/([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})\s*(?:expir|valid)/i) ||
                        pageText.match(/(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i);
    
    const statusMatch = pageText.match(/(?:Status)\s*[:\s]*(Current|Expired|On\s+Hold|Active|Valid|Suspended|Registered)/i);
    
    const nameMatch = pageText.match(/(?:Name|Technician)\s*[:\s]*([A-Za-z\s\-']+?)(?:\s*Level|\s*Status|\s*Expir|\s*$)/i);
    
    const hasTableWithData = await page.$('table tr td, .result, .technician-info, .verification-result');
    
    if (levelMatch || expiryMatch || statusMatch || hasTableWithData) {
      console.log('[IRATA] Verification successful!');
      console.log('[IRATA] Level:', levelMatch ? levelMatch[1] : 'not found');
      console.log('[IRATA] Expiry:', expiryMatch ? expiryMatch[1] : 'not found');
      console.log('[IRATA] Status:', statusMatch ? statusMatch[1] : 'not found');
      
      return {
        success: true,
        verified: true,
        technicianName: nameMatch ? nameMatch[1].trim() : undefined,
        level: levelMatch ? `Level ${levelMatch[1]}` : undefined,
        expiryDate: expiryMatch ? expiryMatch[1] : undefined,
        status: statusMatch ? statusMatch[1].replace(/\s+/g, ' ') : 'Verified'
      };
    }
    
    console.log('[IRATA] Could not parse verification results');
    console.log('[IRATA] Full page content:', pageContent.substring(0, 3000));
    
    return {
      success: true,
      verified: false,
      requiresManualVerification: true,
      error: 'Could not parse verification results. Please verify manually at techconnect.irata.org'
    };
    
  } catch (error) {
    console.error('[IRATA] Verification error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Timeout') || error.message.includes('timeout')) {
        return {
          success: false,
          verified: false,
          error: 'IRATA verification timed out. Please try again.'
        };
      }
      if (error.message.includes('net::') || error.message.includes('Network')) {
        return {
          success: false,
          verified: false,
          error: 'Could not connect to IRATA verification service. Please check your connection.'
        };
      }
    }
    
    return {
      success: false,
      verified: false,
      error: 'Verification service temporarily unavailable. Please try again later.'
    };
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error('[IRATA] Error closing page:', e);
      }
    }
    if (context) {
      try {
        await context.close();
      } catch (e) {
        console.error('[IRATA] Error closing context:', e);
      }
    }
  }
}

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

process.on('SIGINT', closeBrowser);
process.on('SIGTERM', closeBrowser);
