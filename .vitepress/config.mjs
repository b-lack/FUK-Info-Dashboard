import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Forstliche Umweltkontrolle",
  description: "Landeskompetenzzentrum Forst Eberswalde",
  //base: '/FUK-Info-Dashboard/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Allgemeines', link: '/allgemeines/aufgaben'},
      { text: 'Inventuren', link: '/inventur/bodenzustandserhebung'},
      { text: 'Inventuren', items:[
        {text: 'BZE', link: 'inventur/bodenzustandserhebung/bodenzustandserhebung'},
        {text: 'LWI', link: 'inventur/landeswaldinventur/landeswaldinventur'},
        {text: 'WZE', link: 'inventur/waldzustandserhebung/waldzustandserhebung'}
      ]},
      { text: 'Dauerbeobachtung', items:[
        {text: 'ICP Forests', link: 'dauerbeobachtung/icp-forests/meteo'},
        {text: 'Level II', link: 'dauerbeobachtung/level-ii/beerenbusch-kiefer_1202'}
      ]},
      { text: 'API', link: '/api/getting_started'}
    ],

    sidebar: {
      '/allgemeines/': [
        {
          text: 'Allgemeines',
          items: [
            { text: 'Aufgaben', link: '/allgemeines/aufgaben' },
            { text: 'Struktur', link: '/allgemeines/struktur' },
            { text: 'Level I', link: '/allgemeines/level_1' },
            { text: 'Level II', link: '/allgemeines/level_2' }
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
  }
})
