// Using native Node.js fetch (Node 18+)

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoint(name, url, method = 'GET', body = null) {
    console.log(`\n--- Testing ${name} ---`);
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(body && { body: JSON.stringify(body) })
        };
        const start = Date.now();
        const res = await fetch(BASE_URL + url, options);
        const data = await res.json();
        console.log(`Time: ${Date.now() - start}ms`);
        console.log(`Status: ${res.status}`);
        console.log(`Success: ${data.success}`);
        if (!data.success) {
            console.error(`Error:`, data.error || data);
        } else {
            console.log(`Preview:`, JSON.stringify(data.data || data).slice(0, 500) + '...');
        }
        return data;
    } catch (e) {
        console.error(`Fetch failed for ${name}:`, e.message);
    }
}

async function runTests() {
    console.log('Starting SmartTour API Integration Tests...');

    await testEndpoint('Chat API', '/agent/chat', 'POST', { message: 'What is the capital of France and what should I see there?' });
    await testEndpoint('Attractions API', '/agent/attractions', 'POST', { destination: 'Tokyo', budget: 'moderate' });
    await testEndpoint('Food API', '/agent/food', 'POST', { destination: 'Rome', dietaryRestrictions: ['vegetarian'] });
    await testEndpoint('Translate API', '/agent/translate', 'POST', { text: 'Hello, how much is this?', targetLang: 'es' });
    await testEndpoint('Safety API', '/agent/safety', 'POST', { destination: 'Rio de Janeiro' });
    await testEndpoint('Journey Planner', '/agent/journey', 'POST', { destination: 'London', tripDuration: 2, interests: ['History'] });

    console.log('\n--- Tests Complete ---');
}

runTests();
