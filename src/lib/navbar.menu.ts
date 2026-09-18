// src/lib/navbar.menu.ts
import { url } from '@/lib/data.js';

export const navbar = {
  search: {
    dev: true,
  },

  notifications: {
    dev: true,
  },

  apps: {
    dev: true,
  },

  github: {
    dev: true,
  },

  profile: {
    title: 'Profile',
    title_tr_key: 'navbar.profile.title',

    submenus: [
      {
        key: 'profile',
        link: url('profile'),
        title: 'Profile',
        title_tr_key: 'navbar.profile.profile',
        dev: true,
      },
      {
        key: 'settings',
        link: url('settings'),
        title: 'Settings',
        title_tr_key: 'navbar.profile.settings',
        dev: true,
      },
      {
        key: 'billing',
        link: url('billing'),
        title: 'Billing',
        title_tr_key: 'navbar.profile.billing',
        dev: true,
      },
      {
        key: 'logout',
        link: '',
        title: 'Logout',
        title_tr_key: 'sidebar.title.logout',
        action: 'logout',
      },
    ],
  },
};
