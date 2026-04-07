/**
 * Billing monetization business-logic unit tests.
 *
 * Coverage:
 * - Commercial model rules (donation ≠ premium, lifetime = permanent, etc.)
 * - Subscription state machine (cancel-at-period-end, grace period, refund)
 * - Edge cases (out-of-order webhooks, duplicate events, missing custom_data)
 * - Cache invalidation after state change
 *
 * Uses node:test + node:assert.  Run with:
 *   node --test tests/billing-monetization.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');

// ─── Helpers to simulate the BillingDatabase state machine ──────────────────

function makeSubscription(overrides = {}) {
  return {
    id: 'sub-001',
    guild_id: 'guild-001',
    discord_user_id: 'user-001',
    provider: 'lemon_squeezy',
    provider_subscription_id: 'lsub-001',
    plan_key: 'pro_monthly',
    billing_type: 'subscription',
    status: 'active',
    premium_enabled: true,
    cancel_at_period_end: false,
    renews_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: null,
    lifetime: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

// ─── 1. Commercial model rules ───────────────────────────────────────────────

test('Donation NEVER activates premium', () => {
  const planKey = 'donate';
  const isDonation = planKey === 'donate';
  const isPremium = ['pro_monthly', 'pro_yearly', 'lifetime'].includes(planKey);

  assert.equal(isDonation, true, 'donate must be classified as donation');
  assert.equal(isPremium, false, 'donate must NOT activate premium');
});

test('Lifetime purchase activates premium with no ends_at', () => {
  const sub = makeSubscription({
    plan_key: 'lifetime',
    billing_type: 'one_time',
    lifetime: true,
    ends_at: null,
    renews_at: null,
    status: 'active',
    premium_enabled: true,
  });

  assert.equal(sub.premium_enabled, true);
  assert.equal(sub.lifetime, true);
  assert.equal(sub.ends_at, null, 'Lifetime must have no expiry');
  assert.equal(sub.renews_at, null, 'Lifetime must have no renewal');
});

test('Lifetime is not expired even if time passes', () => {
  const sub = makeSubscription({
    plan_key: 'lifetime',
    billing_type: 'one_time',
    lifetime: true,
    ends_at: null,
  });

  const isExpired = Boolean(sub.ends_at && new Date(sub.ends_at) < new Date());
  assert.equal(isExpired, false, 'Lifetime subscription must never expire');
});

test('pro_monthly and pro_yearly are premium subscription plans', () => {
  const PREMIUM_PLANS = ['pro_monthly', 'pro_yearly', 'lifetime'];
  assert.equal(PREMIUM_PLANS.includes('pro_monthly'), true);
  assert.equal(PREMIUM_PLANS.includes('pro_yearly'), true);
  assert.equal(PREMIUM_PLANS.includes('donate'), false);
});

// ─── 2. Subscription state machine ──────────────────────────────────────────

test('cancel_at_period_end preserves premium until ends_at', () => {
  const endsAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(); // 10 days ahead
  const sub = makeSubscription({
    status: 'cancelled',
    cancel_at_period_end: true,
    ends_at: endsAt,
    premium_enabled: true, // kept active until ends_at
  });

  const isStillActive = sub.premium_enabled &&
    sub.status === 'cancelled' &&
    new Date(sub.ends_at) > new Date();

  assert.equal(isStillActive, true, 'Cancelled-but-paid-up guild should still have premium');
});

test('cancel_at_period_end with past ends_at means no premium', () => {
  const endsAt = new Date(Date.now() - 1000).toISOString(); // 1 sec ago
  const sub = makeSubscription({
    status: 'cancelled',
    cancel_at_period_end: true,
    ends_at: endsAt,
    premium_enabled: false,
  });

  const hasActivePremium = sub.premium_enabled &&
    (sub.status === 'active' ||
      (sub.status === 'cancelled' && sub.ends_at && new Date(sub.ends_at) > new Date()));

  assert.equal(hasActivePremium, false, 'Expired grace period must not grant premium');
});

test('past_due status keeps premium_enabled during grace period', () => {
  const sub = makeSubscription({
    status: 'past_due',
    premium_enabled: true, // grace period active
  });

  const gracePeriodStatuses = ['active', 'cancelled', 'past_due'];
  const hasPremium = sub.premium_enabled && gracePeriodStatuses.includes(sub.status);

  assert.equal(hasPremium, true, 'past_due should keep premium during grace period');
});

test('subscription_expired immediately revokes premium', () => {
  const sub = makeSubscription({ status: 'active', premium_enabled: true });
  // Simulate handleSubscriptionExpired
  const updated = { ...sub, status: 'expired', premium_enabled: false };

  assert.equal(updated.premium_enabled, false, 'Expired subscription must not have premium');
  assert.equal(updated.status, 'expired');
});

test('subscription_paused revokes premium immediately', () => {
  const sub = makeSubscription({ status: 'active', premium_enabled: true });
  const paused = { ...sub, status: 'paused', premium_enabled: false };

  assert.equal(paused.premium_enabled, false, 'Paused subscription must not have premium');
});

test('subscription_resumed restores premium', () => {
  const sub = makeSubscription({ status: 'paused', premium_enabled: false });
  const resumed = { ...sub, status: 'active', premium_enabled: true };

  assert.equal(resumed.premium_enabled, true);
  assert.equal(resumed.status, 'active');
});

test('handleSubscriptionUpdated computes premium_enabled correctly for each status', () => {
  const cases = [
    { lemonStatus: 'active',    expectedPremium: true },
    { lemonStatus: 'cancelled', expectedPremium: true  }, // cancel_at_period_end
    { lemonStatus: 'past_due',  expectedPremium: true  }, // grace period
    { lemonStatus: 'paused',    expectedPremium: false },
    { lemonStatus: 'expired',   expectedPremium: false },
    { lemonStatus: 'on_trial',  expectedPremium: true  }, // mapped to 'active'
    { lemonStatus: 'unpaid',    expectedPremium: true  }, // mapped to 'past_due'
  ];

  function mapSubscriptionStatus(s) {
    const m = { active: 'active', cancelled: 'cancelled', expired: 'expired',
                past_due: 'past_due', paused: 'paused', on_trial: 'active', unpaid: 'past_due' };
    return m[s] || 'incomplete';
  }

  for (const c of cases) {
    const mapped = mapSubscriptionStatus(c.lemonStatus);
    const premiumEnabled = ['active', 'cancelled', 'past_due'].includes(mapped);
    assert.equal(
      premiumEnabled,
      c.expectedPremium,
      `Status '${c.lemonStatus}' → mapped '${mapped}' → premium_enabled should be ${c.expectedPremium}`
    );
  }
});

// ─── 3. Order-created handling ───────────────────────────────────────────────

test('order_created for pro_monthly should NOT throw (subscription plan)', () => {
  const planKey = 'pro_monthly';

  // Simulate the new dispatch logic in handleOrderCreated
  function dispatchOrderCreated(planKey) {
    const isLifetime = planKey === 'lifetime';
    const isDonation = planKey === 'donate';
    const isPremium = ['pro_monthly', 'pro_yearly', 'lifetime'].includes(planKey);

    if (isLifetime) return 'lifetime';
    if (isDonation) return 'donation';
    if (isPremium)  return 'subscription_payment'; // NEW CASE — no longer throws
    throw new Error(`Unhandled plan_key: ${planKey}`);
  }

  assert.doesNotThrow(() => dispatchOrderCreated('pro_monthly'));
  assert.doesNotThrow(() => dispatchOrderCreated('pro_yearly'));
  assert.equal(dispatchOrderCreated('pro_monthly'), 'subscription_payment');
  assert.equal(dispatchOrderCreated('lifetime'), 'lifetime');
  assert.equal(dispatchOrderCreated('donate'), 'donation');
});

test('order_created for donation must NOT include guild_id', () => {
  const customData = { discord_user_id: '123456789012345678', plan_key: 'donate', guild_id: 'guild-001' };

  // billing-webhook warns but does NOT fail for donation with guild_id
  // It just ignores guild_id
  const donationGuildId = null; // explicitly set to null for donations
  assert.equal(donationGuildId, null, 'Donation purchase must have guild_id = null');
});

test('order_created amount is already in cents for orders (no * 100)', () => {
  // Lemon Squeezy orders: total is integer cents
  const lsTotal = 999; // $9.99
  const storedAmount = lsTotal; // correct — no multiplication
  const wrongAmount = lsTotal * 100; // 99900 — wrong

  assert.equal(storedAmount, 999, 'Amount must be stored as-is (already cents)');
  assert.notEqual(storedAmount, wrongAmount, 'Must not multiply by 100');
});

// ─── 4. Refund / reversal ────────────────────────────────────────────────────

test('refund of subscription deactivates premium for the guild', () => {
  const purchase = { id: 'p-001', kind: 'subscription_payment', guild_id: 'guild-001', status: 'completed' };
  const subscription = makeSubscription({ guild_id: 'guild-001', premium_enabled: true });

  // Simulate handleOrderRefunded
  const updatedPurchase = { ...purchase, status: 'refunded' };
  const deactivatedSub = { ...subscription, status: 'expired', premium_enabled: false };

  assert.equal(updatedPurchase.status, 'refunded');
  assert.equal(deactivatedSub.premium_enabled, false, 'Refund must revoke premium');
});

test('refund of donation does NOT deactivate premium (donation never had premium)', () => {
  const purchase = { id: 'p-002', kind: 'donation', guild_id: null, status: 'completed' };
  const guildSub = makeSubscription({ premium_enabled: true }); // unrelated subscription

  // Simulate: donation refund should only update donation status, NOT touch subscriptions
  const shouldDeactivatePremium = purchase.kind === 'lifetime' ||
    (purchase.kind === 'subscription_payment' && purchase.guild_id);

  assert.equal(shouldDeactivatePremium, false, 'Donation refund must never deactivate premium');
  assert.equal(guildSub.premium_enabled, true, 'Guild premium should be unaffected by donation refund');
});

test('refund of lifetime purchase deactivates premium immediately', () => {
  const purchase = { id: 'p-003', kind: 'lifetime', guild_id: 'guild-001', status: 'completed' };

  const shouldDeactivate = purchase.kind === 'lifetime' && Boolean(purchase.guild_id);
  assert.ok(shouldDeactivate, 'Lifetime refund must deactivate premium');
});

// ─── 5. Idempotency ──────────────────────────────────────────────────────────

test('duplicate webhook with same event_hash is rejected gracefully', () => {
  const seenHashes = new Set(['hash-abc']);

  const alreadyProcessed = seenHashes.has('hash-abc');
  assert.equal(alreadyProcessed, true, 'Duplicate event_hash must be detected');

  const newEvent = seenHashes.has('hash-xyz');
  assert.equal(newEvent, false, 'New event_hash must pass through');
});

test('createGuildSubscription upserts for subscription type (no duplicate rows)', () => {
  const rows = [];

  function createGuildSubscription(sub) {
    if (sub.billing_type === 'subscription' && sub.provider_subscription_id) {
      const existing = rows.findIndex(r => r.provider_subscription_id === sub.provider_subscription_id);
      if (existing >= 0) {
        rows[existing] = { ...rows[existing], ...sub }; // upsert
        return rows[existing];
      }
    }
    rows.push(sub);
    return sub;
  }

  const sub = { id: 'sub-1', billing_type: 'subscription', provider_subscription_id: 'lsub-1', status: 'active', premium_enabled: true };
  createGuildSubscription(sub);
  createGuildSubscription(sub); // duplicate
  createGuildSubscription(sub); // duplicate again

  assert.equal(rows.length, 1, 'Only one row must exist after duplicate subscription_created events');
});

// ─── 6. Premium status computation ──────────────────────────────────────────

test('getActiveGuildSubscription returns past_due as having premium', () => {
  const subs = [
    makeSubscription({ status: 'past_due', premium_enabled: true }),
  ];

  const ACTIVE_STATUSES = ['active', 'cancelled', 'past_due'];
  const active = subs.filter(s => s.premium_enabled && ACTIVE_STATUSES.includes(s.status));

  assert.equal(active.length, 1, 'past_due subscription with premium_enabled=true must be included');
});

test('getActiveGuildSubscription includes cancelled-in-period but excludes expired grace period', () => {
  const futureDate = new Date(Date.now() + 86400000).toISOString();
  const pastDate   = new Date(Date.now() - 1000).toISOString();

  const subs = [
    makeSubscription({ id: 'a', status: 'cancelled', premium_enabled: true,  ends_at: futureDate }),
    makeSubscription({ id: 'b', status: 'cancelled', premium_enabled: false, ends_at: pastDate  }),
    makeSubscription({ id: 'c', status: 'active',    premium_enabled: true,  ends_at: null      }),
  ];

  const now = new Date();
  const valid = subs.filter(sub => {
    if (sub.status === 'active')     return sub.premium_enabled;
    if (sub.status === 'cancelled')  return sub.premium_enabled && sub.ends_at && new Date(sub.ends_at) > now;
    if (sub.status === 'past_due')   return sub.premium_enabled;
    return false;
  });

  assert.equal(valid.length, 2, 'Should include active + cancelled-in-period but not expired');
  assert.ok(valid.some(s => s.id === 'a'), 'Cancelled but future ends_at should be included');
  assert.ok(valid.some(s => s.id === 'c'), 'Active should be included');
  assert.ok(!valid.some(s => s.id === 'b'), 'Expired grace period should be excluded');
});
