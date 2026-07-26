import test from 'node:test';
import assert from 'node:assert/strict';
import { UserContextAgent } from '../lib/services/agents/userContextAgent.js';

test('analyzePreferences handles object-style interests payloads', async () => {
  const agent = new UserContextAgent();

  const profile = await agent.analyzePreferences({
    destination: 'Munnar',
    interests: { nature: true, food: true },
    budget: 'moderate',
    travelStyle: 'balanced',
  });

  assert.equal(profile.userId, 'anonymous');
  assert.equal(profile.destination, undefined);
  assert.deepEqual(profile.interests, { nature: 1, food: 1 });
  assert.equal(profile.budget.tier, 'moderate');
});
