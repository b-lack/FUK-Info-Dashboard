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
      { text: 'Inventuren', link: '/inventur_level_1/bodenzustandserhebung'},
      { text: 'Daten-Historie', link: '/historie/aktuelle-witterungsdaten'},
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
      '/inventur_level_1/': [
        {
          text: 'Inventuren Level I',
          items: [
            { text: 'Bodenzustandserhebung', link: '/inventur_level_1/bodenzustandserhebung' },
            { text: 'Waldzustandserhebung', link: '/inventur_level_1/waldzustandserhebung' },
            { text: 'Waldinventur', link: '/inventur_level_1/waldinventur' }
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
