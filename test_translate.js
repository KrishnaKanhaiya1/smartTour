async function testTranslation() {
    const start = Date.now();
    try {
        const r = await fetch('http://localhost:3000/api/agent/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: "Hello, my name is John and I would like to book a tour.", targetLanguage: "ja" })
        });
        const status = r.status;
        const json = await r.json();
        console.log(`Status: ${status} in ${Date.now() - start}ms`);
        console.log('Response:', JSON.stringify(json, null, 2));
    } catch (e) {
        console.error('Fetch error:', e);
    }
}
testTranslation();
