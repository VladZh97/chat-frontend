const VISIBILITY_OPTIONS = [
  {
    label: 'Public',
    value: 'public',
  },
  {
    label: 'Private',
    value: 'private',
  },
];

const MESSAGES_OPTIONS = [
  {
    label: '10 messages',
    value: 10,
  },
  {
    label: '20 messages',
    value: 20,
  },
  {
    label: '50 messages',
    value: 50,
  },
  {
    label: '100 messages',
    value: 100,
  },
  {
    label: 'Unlimited',
    value: -1,
  },
];

const TIME_OPTIONS = [
  {
    label: 'Every 1 minute',
    value: 60,
  },
  {
    label: 'Every 2 minutes',
    value: 120,
  },
  {
    label: 'Every 5 minutes',
    value: 300,
  },
  {
    label: 'Every 10 minutes',
    value: 600,
  },
  {
    label: 'Every 30 minutes',
    value: 1800,
  },
  {
    label: 'Unlimited',
    value: -1,
  },
];

export { VISIBILITY_OPTIONS, MESSAGES_OPTIONS, TIME_OPTIONS };
