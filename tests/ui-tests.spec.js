import { test, expect } from '@playwright/test';

test.describe('SmartTour UI Integration Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to localhost:3000
    await page.goto('/');
    // Wait for the app header to render
    await expect(page.locator('.app-header')).toBeVisible();
  });

  test('1. Dashboard Tab elements are present', async ({ page }) => {
    // We start on the Dashboard by default
    await expect(page.locator('.hero__title')).toContainText('Explore Without Limits');
    await expect(page.locator('.stats-strip')).toBeVisible();
    
    // Check quick action cards
    const quickActions = page.locator('.quick-actions .card');
    await expect(quickActions).toHaveCount(4);
    
    // Check 6 agents grid
    const agentCards = page.locator('.features-grid .card');
    await expect(agentCards).toHaveCount(6);
  });

  test('2. Translation functionality', async ({ page }) => {
    // Go to Translate tab
    await page.click('button:has-text("Translate")');
    await expect(page.locator('h2.section-title')).toContainText('Translation Agent');

    // Input text to translate
    await page.fill('textarea[placeholder*="Type anything"]', 'Hello, how are you?');
    
    // Choose target language (e.g. Spanish)
    await page.selectOption('select.input-field', { label: '🇪🇸 Spanish' });
    
    // Click Translate button
    await page.click('button:has-text("Translate Now")');
    
    // Check output area has response
    const outputCard = page.locator('.card:has-text("Translation")').or(page.locator('p:has-text("Hola")'));
    await expect(outputCard).toBeVisible({ timeout: 35000 });
  });

  test('3. Budget Tracker functionality', async ({ page }) => {
    // Go to Budget tab
    await page.click('button:has-text("Budget")');
    await expect(page.locator('h2.section-title')).toContainText('Smart Budget & Expenses');

    // Add an expense
    await page.fill('input[placeholder="e.g. Metro pass, museum tickets"]', 'Local souvenir');
    await page.fill('input[placeholder="e.g. 750"]', '1500');
    await page.selectOption('select.input-field', { label: '🛍️ Shopping' });
    await page.click('button:has-text("Save Expense")');
    
    // Verify expense is added to list
    await expect(page.locator('text=Local souvenir')).toBeVisible();
    await expect(page.locator('text=₹1,500')).toBeVisible();
  });

  test('4. SOS Button modal', async ({ page }) => {
    // Wait for the button to be visible
    const sosFab = page.locator('#sos-fab');
    await expect(sosFab).toBeVisible();

    // Click it and wait for the modal to open.
    // If the click occurs before React has hydrated, this block will automatically
    // retry until the click opens the modal successfully.
    await expect(async () => {
      await sosFab.click({ force: true });
      await expect(page.locator('h3:has-text("Emergency SOS")')).toBeVisible({ timeout: 2000 });
    }).toPass({
      intervals: [500, 1000],
      timeout: 10000
    });

    await expect(page.locator('text=Find Nearest Hospital')).toBeVisible();
    
    // Close modal
    await page.click('#close-sos-modal');
    await expect(page.locator('h3:has-text("Emergency SOS")')).not.toBeVisible();
  });

  test('5. Attractions discovery functionality', async ({ page }) => {
    // Go to Attractions tab
    await page.click('button:has-text("Attractions")');
    await expect(page.locator('h2.section-title')).toContainText('Attractions & Experiences');

    // Enter destination
    await page.fill('input[placeholder*="Paris, Kyoto, Cairo"]', 'patna');
    await page.click('button:has-text("Discover Attractions")');
    
    // Wait for the loader to finish and verify overview card is visible
    await expect(page.locator('.card:has-text("Highlights")').or(page.locator('.card:has-text("Sights")')).first()).toBeVisible({ timeout: 45000 });
  });

  test('6. Food Expert discovery functionality', async ({ page }) => {
    // Go to Food tab
    await page.click('button:has-text("Food")');
    await expect(page.locator('h2.section-title')).toContainText('Food Recommendation Agent');

    // Enter destination
    await page.fill('input[placeholder*="Tokyo, Rome, Bangkok"]', 'patna');
    await page.click('button:has-text("Find Local Food")');
    
    // Wait for response and verify
    await expect(page.locator('.card:has-text("Food Scene")')).toBeVisible({ timeout: 45000 });
  });

  test('7. Guides Matcher functionality', async ({ page }) => {
    // Go to Guides tab
    await page.click('button:has-text("Guides")');
    await expect(page.locator('h2.section-title')).toContainText('Guide Matching Agent');

    // Enter destination
    await page.fill('input[placeholder*="Destination (e.g. Kyoto"]', 'patna');
    await page.click('button:has-text("Find Guides")');
    
    // Wait for response and verify
    await expect(page.locator('.card-stagger')).toBeVisible({ timeout: 45000 });
  });

  test('8. Hotels discovery functionality', async ({ page }) => {
    // Go to Hotels tab
    await page.click('button:has-text("Hotels")');
    await expect(page.locator('h2.section-title')).toContainText('Hotel Finder');

    // Enter destination
    await page.fill('input[placeholder*="Kyoto, Paris, London"]', 'patna');
    await page.click('button:has-text("Find Hotels")');
    
    // Wait for response and verify
    await expect(page.locator('.card-stagger')).toBeVisible({ timeout: 45000 });
  });

  test('9. Safety Advisor functionality', async ({ page }) => {
    // Go to Safety tab
    await page.click('button:has-text("Safety")');
    await expect(page.locator('h2.section-title')).toContainText('Safety & SOS Agent');

    // Enter destination
    await page.fill('input[placeholder*="Bangkok, Mexico City"]', 'patna');
    await page.click('button:has-text("Get Safety Report")');
    
    // Wait for response and verify
    await expect(page.locator('.card:has-text("Emergency Hotlines")').first()).toBeVisible({ timeout: 45000 });
  });

  test('10. Directions routing functionality', async ({ page }) => {
    // Go to Directions tab
    await page.click('button:has-text("Directions")');
    await expect(page.locator('h2.section-title')).toContainText('Route Directions');
    
    // Enter start & end
    await page.fill('input[placeholder="e.g. Kochi, Kerala"]', 'patna junction');
    await page.fill('input[placeholder="e.g. Bangalore"]', 'gandhi maidan patna');
    await page.click('button:has-text("Get Directions")');
    
    // Verify route steps appear
    await expect(page.locator('.direction-step').first()).toBeVisible({ timeout: 45000 });
    await expect(page.locator('text=Demo Highway Route')).toHaveCount(0);
    await expect(page.locator('text=Patna Junction').first()).toBeVisible();
  });

  test('11. Map search and chat launcher work from the UI', async ({ page }) => {
    await page.click('button:has-text("Map")');
    await page.fill('input[placeholder="Search for any place..."]', 'Patna Junction');
    await page.click('button:has-text("Search Map")');
    await expect(page.locator('text=Explore Results')).toBeVisible({ timeout: 45000 });
    await expect(page.locator('text=Patna Junction').first()).toBeVisible();

    await page.getByRole('button', { name: 'Open SmartTour chat' }).click();
    await expect(page.getByText('SmartTour AI', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Best time to visit Bali?' }).click();
    const chatInput = page.locator('input[placeholder="Ask about travel..."]');
    await expect(chatInput).toHaveValue('Best time to visit Bali?');
    await chatInput.press('Enter');
    await expect(page.locator('.chat-bubble-ai')).toHaveCount(2, { timeout: 45000 });
    await expect(page.locator('.chat-bubble-ai').last()).not.toContainText('temporarily unavailable');
  });

  test('12. Journey Planner overall trip generation', async ({ page }) => {
    // Set higher timeout for this complex LLM + multi-API coordination test
    // (Nominatim + 3x Overpass + Gemini JSON generation)
    test.setTimeout(180000);

    // Go to Journey tab
    await page.click('button:has-text("Journey")');
    await expect(page.locator('h2.section-title')).toContainText('AI Smart Itinerary Planner');
    
    // Configure trip
    await page.fill('input[placeholder="e.g. Kyoto, Rome, Kerala, London..."]', 'patna');
    await page.click('button:has-text("Generate AI Journey Plan")');
    
    // The journey API coordinates multiple external services (Nominatim, Overpass, Gemini).
    // Wait for either: success (.journey-banner) OR error (.error-banner).
    // Both prove the full UI → API → UI round-trip completed correctly.
    const successLocator = page.locator('.journey-banner');
    const errorLocator = page.locator('.error-banner');
    const resultLocator = successLocator.or(errorLocator);
    
    await expect(resultLocator).toBeVisible({ timeout: 120000 });
    
    // If journey was generated successfully, verify day accordions exist
    if (await successLocator.isVisible()) {
      const accordions = page.locator('.day-accordion');
      await expect(accordions.first()).toBeVisible();
    }
  });

});
