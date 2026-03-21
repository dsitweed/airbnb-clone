export const SEED_IDS = {
  users: {
    alice: '11111111-1111-1111-1111-111111111111',
    bob: '22222222-2222-2222-2222-222222222222',
  },
  listings: {
    cozyStudio: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    beachHouse: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  },
  reservations: {
    aliceStaysAtBeach: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  },
} as const;

export const SEED_META = {
  provider: 'seed',
} as const;
