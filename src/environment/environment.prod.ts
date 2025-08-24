import { PLAN_NAMES } from '@/config';

const environment = {
  assetsBaseUrl: 'https://assets.heyway.chat',
  api: 'https://api.heyway.chat',
  // subscriptions: [
  //   {
  //     title: PLAN_NAMES.FREE,
  //     period: 'monthly',
  //     price: 0,
  //   },
  //   {
  //     title: PLAN_NAMES.FREE,
  //     period: 'yearly',
  //     price: 0,
  //   },
  //   {
  //     title: PLAN_NAMES.PRO,
  //     period: 'monthly',
  //     price: 39,
  //     id: 'price_1Rzb4KHXneWYTmOmjrZRsuUI',
  //   },
  //   {
  //     title: PLAN_NAMES.PRO,
  //     period: 'yearly',
  //     price: 396,
  //     id: 'price_1Rzb4KHXneWYTmOmD6lhiSrg',
  //   },
  //   {
  //     title: PLAN_NAMES.TEAM,
  //     period: 'monthly',
  //     price: 79,
  //     id: 'price_1Rzb5NHXneWYTmOm5WQVXkE3',
  //   },
  //   {
  //     title: PLAN_NAMES.TEAM,
  //     period: 'yearly',
  //     price: 792,
  //     id: 'price_1Rzb5xHXneWYTmOmEMlKixEo',
  //   },
  // ],
  subscriptions: [
    {
      title: PLAN_NAMES.FREE,
      period: 'monthly',
      price: 0,
    },
    {
      title: PLAN_NAMES.FREE,
      period: 'yearly',
      price: 0,
    },
    {
      title: PLAN_NAMES.PRO,
      period: 'monthly',
      price: 39,
      id: 'price_1RzOnuH5z64scL5B5DzxHOeI',
    },
    {
      title: PLAN_NAMES.PRO,
      period: 'yearly',
      price: 396,
      id: 'price_1RzOnuH5z64scL5BAGVAbwZ6',
    },
    {
      title: PLAN_NAMES.TEAM,
      period: 'monthly',
      price: 79,
      id: 'price_1RzOoKH5z64scL5Bsn7WuQQI',
    },
    {
      title: PLAN_NAMES.TEAM,
      period: 'yearly',
      price: 792,
      id: 'price_1RzOoqH5z64scL5B2DMRIQez',
    },
  ],
};

export { environment };
