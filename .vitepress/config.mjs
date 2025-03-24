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
        {text: 'ICP Forests', link: 'dauerbeobachtung/icp-forests/meteo'},
        {text: 'Level II', link: 'dauerbeobachtung/level-ii/beerenbusch-kiefer_1202'}
      ]},
      { text: 'Untersuchung', items:[
        {text: 'Trockenstress', link: 'untersuchung/trockenstress/trockenstress'},
        {text: 'Vegetationszeit', link: 'untersuchung/vegetationszeit/vegetationszeit'}
      ]},
      { text: 'API', link: '/api/getting_started'}
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
          items: [
            { text: 'Meteo', link: '/dauerbeobachtung/icp-forests/meteo'}
          ]
        },
        {
          text: 'Level II',
          items: [
            { text: 'Beerenbusch Kiefer - 1202', link: '/dauerbeobachtung/level-ii/beerenbusch-kiefer_1202' }
          ]
        }
      ],
      '/untersuchung/': [
        {
          text: 'Untersuchungen',
          items: [
            { text: 'Trockenstress', link: '/untersuchung/trockenstress/trockenstress' },
            { text: 'Vegetationszeit', link: '/untersuchung/vegetationszeit/vegetationszeit' }
          ]api/dictionary
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
          text: 'Für angemeldete Nutzer',
          items: [
            { text: 'Daten manipulieren', link: '/api/authentication' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Landeskompetenzzentrum-Forst-Eberswalde/FUK-ICP-Forest-Server' },
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
