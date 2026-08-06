import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'en-US',

  title: 'WSync LED',

  description:
    'Mobile-first React application that analyzes video colors and streams LED frames over WebSocket.',

  srcDir: '.',

  cleanUrls: true,

  lastUpdated: true,

  appearance: true,

  ignoreDeadLinks: true,

  themeConfig: {
    logo: {
      src: '/assets/app-icon.svg',
      alt: 'WSync LED logo'
    },

    siteTitle: 'WSync LED',

    nav: [
      {
        text: 'Project',
        link: '/project/readme.html',
      },
      {
        text: 'API',
        link: '/api/modules.html',
      },
      {
        text: 'Examples',
        link: '/examples/',
      },
      {
        text: 'Guide',
        link: '/guide/getting-started.html',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/Antonin1106/wsync-led',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            {
              text: 'Getting Started',
              link: '/guide/getting-started',
            },
            {
              text: 'Installation',
              link: '/guide/installation',
            },
            {
              text: 'Architecture',
              link: '/guide/architecture',
            },
          ],
        },
      ],

      '/project/': [
        {
          text: 'Project',
          collapsed: false,
          items: [
            {
              text: 'Overview',
              link: '/project/readme.html',
            },
            {
              text: 'Contributing',
              link: '/project/contributing.html',
            },
            {
              text: 'Code of conduct',
              link: '/project/code_of_conduct.html',
            },
            {
              text: 'Security',
              link: '/project/security.html',
            },
            {
              text: 'Accessibility',
              link: '/project/accessibility.html',
            },
          ],
        },
      ],

      '/api/': [
        {
          text: 'API Reference',
          items: [
            {
              text: 'Modules',
              link: '/api/modules.html',
            },
            {
              text: 'Main App Component',
              link: '/api/components/App/App/README.html',
            },
            {
              text: 'Control section',
              link: '/api/components/App/Controls/Controls/README.html',
            },
            {
              text: 'Preview section',
              link: '/api/components/App/Preview/Preview/README.html',
            },
          ],
        },
      ],

      '/examples/': [
        {
          text: 'Examples',
          items: [
            {
              text: 'Overview',
              link: '/examples/',
            },
            {
              text: 'WLED integration',
              link: '/examples/wled.html',
            },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Antonin1106/wsync-led',
      },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    editLink: {
      pattern:
        'https://github.com/Antonin1106/wsync-led/edit/main/docs/:path',
      text: 'Edit this page',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026',
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },

    returnToTopLabel: 'Back to top',

    sidebarMenuLabel: 'Menu',

    darkModeSwitchLabel: 'Theme',

    lightModeSwitchTitle: 'Switch to light mode',

    darkModeSwitchTitle: 'Switch to dark mode',
  },
});