import { defineConfig } from 'vitepress'
import vuetify from 'vite-plugin-vuetify'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Forstliche Umweltkontrolle",
  lang: 'de-DE',
  description: "Landeskompetenzzentrum Forst Eberswalde",
  //base: '/FUK-Info-Dashboard/',
  base: '/',
  search: {
    provider: 'local'
  },
  themeConfig: {
    logo: '/lfe-logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Allgemeines', link: '/allgemeines/info'},
      { text: 'Inventuren', items:[
        {text: 'Bodenzustandserhebung', link: 'inventur/bodenzustandserhebung/bodenzustandserhebung'},
        {text: 'Landeswaldinventur', link: 'inventur/landeswaldinventur/landeswaldinventur'},
        {text: 'Waldzustandserhebung', link: 'inventur/waldzustandserhebung/waldzustandserhebung'}
      ]},
      { text: 'Dauerbeobachtung', items:[
        {text: 'ICP Forests', link: 'dauerbeobachtung/icp-forests'},
        {text: 'Level II', link: 'dauerbeobachtung/level-ii'}
      ]},
      { text: 'Untersuchung', items:[
        {text: 'Trockenstress', link: 'untersuchung/trockenstress/trockenstress'},
        {text: 'Vegetationszeit', link: 'untersuchung/vegetationszeit/vegetationszeit'}
      ]},
      { text: 'API', link: '/api/getting_started'},
      { component: 'DashboardButton'},
    ],

    sidebar: {
      '/allgemeines/': [
        {
          text: 'Allgemeines',
          items: [
            { text: 'Aufgaben', link: '/allgemeines/aufgaben' },
            { text: 'Struktur', link: '/allgemeines/struktur' }
          ]
        }
      ],
      '/inventur/': [
        {
          text: 'BZE',
          items: [
            { text: 'Bodenzustandserhebung', link: '/inventur/bodenzustandserhebung/bodenzustandserhebung' }
          ]
        },
        {
          text: 'LWI',
          items: [
            { text: 'Landeswaldinventur', link: '/inventur/landeswaldinventur/landeswaldinventur' }
          ]
        },
        {
          text: 'WZE',
          items: [
            { text: 'Waldzustandserhebung', link: '/inventur/waldzustandserhebung/waldzustandserhebung' }
          ]
        }
      ],
      '/dauerbeobachtung/': [
        {
          text: 'ICP Forests',
          link: '/dauerbeobachtung/icp-forests/index',
          items: [
            { text: 'mm', link: '/dauerbeobachtung/icp-forests/meteo'},
            { text: 'cc', link: '/dauerbeobachtung/icp-forests/crown_condition' },
          ]
        },
        {
          text: 'Level II',
          link: '/dauerbeobachtung/level-ii',
          items: [
            { text: 'Grünewald - 1101', link: '/dauerbeobachtung/level-ii/grunewald_1101' },
            { text: 'Natteheide - 1201', link: '/dauerbeobachtung/level-ii/natteheide_1201' },
            { text: 'Beerenbusch Kiefer - 1202', link: '/dauerbeobachtung/level-ii/beerenbusch-kiefer_1202' },
            { text: 'Kienhorst - 1203', link: '/dauerbeobachtung/level-ii/kienhorst_1203' },
            { text: 'Weitzgrund - 1204', link: '/dauerbeobachtung/level-ii/weitzgrund_1204' },
            { text: 'Neusorgefeld - 1205', link: '/dauerbeobachtung/level-ii/neusorgefeld_1205' },
            { text: 'Schwenow - 1206', link: '/dauerbeobachtung/level-ii/schwenow_1206' },
            { text: 'Beerenbusch Buchen - 1207', link: '/dauerbeobachtung/level-ii/beerenbusch_buchen_1207' },
            { text: 'Fünfeichen - 1208', link: '/dauerbeobachtung/level-ii/fuenfeichen_1208' },
            { text: 'Kienhorst Eichen - 1209', link: '/dauerbeobachtung/level-ii/kienhorst_eichen_1209' }
          ]
        }
      ],
      '/untersuchung/': [
        {
          text: 'Untersuchungen',
          items: [
            { text: 'Trockenstress', link: '/untersuchung/trockenstress/trockenstress' },
            { text: 'Vegetationszeit', link: '/untersuchung/vegetationszeit/vegetationszeit' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API',
          items: [
            { text: 'Getting Started', link: '/api/getting_started' },
            { text: 'Dictionary', link: '/api/dictionary' },
            { text: 'Data', link: '/api/data' }
          ]
        },
        {
          text: 'Use Cases',
          items: [
            { text: 'Range by Date', link: '/api/range' },
          ]
        },
        {
          text: 'Authenticated Users',
          items: [
            { text: 'Data processing', link: '/api/authentication' },
          ]
        }
      ],
      '/dashboard/': [
        {
          text: 'User',
          items: [
            { text: 'Account', link: '/dashboard/profile' }
          ]
        },
        {
          text: 'R',
          items: [
            { text: 'Monitor', link: '/dashboard/r-monitor' },
            { text: 'Functions', link: '/dashboard/r-api' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'gitlab', link: 'https://gitlab.opencode.de/lfe/fuk/icp-forests/FUK-ICP-Forest-Server'}
    ],
    footer: {
      message: 'Service des <b>Landesbetrieb Forst Brandenburg</b>',
      copyright: '<a href="https://forst.brandenburg.de/lfb/de/impressum/" target="blank">Impressum</a> <a href="https://forst.brandenburg.de/lfb/de/datenschutz/" target="blank">Datenschutz</a>'
    }
  },
  vite: {
    plugins: [
      vuetify(),
    ],
    // Prevent Vuetify from optimizing imports by default
    ssr: {
      noExternal: ['vuetify']
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    optimizeDeps: {
      //exclude: ['@deck.gl/core', '@deck.gl/layers', '@deck.gl/geo-layers']
    },
    assetsInclude: ['**/*.wgsl'],
  }
})
