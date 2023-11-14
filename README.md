# [kulturfinder.sh](https://kulturfinder.sh) - Frontend

<a href="https://kulturfinder.sh" target="_blank"><img src="docs/logo.png" title="Kulturfinder.sh Logo" width="500px"/></a>

Made by [kultursphäre.sh](https://www.kultursphaere.sh/)

## Beschreibung - description

Der kulturfinder.sh ist eine Web-App, die es den Nutzer:innen ermöglicht, mobil auf ihrem Smartphone
Kulturinstitutionen in ganz Schleswig-Holstein zu finden. Geobasiert werden Kultureinrichtungen im Umkreis des
Standortes des Nutzers auf einer Landkarte angezeigt. Zu jeder Institution gibt es zudem ein Foto sowie eine
Beschreibung, die Adresse und weitere Angebote.

The kulturfinder.sh is a web-app that enables users to find cultural institutions in Schleswig-Holstein on their mobile
devices. It uses to geodata to show users a map of nearby insitutions. A photo and description are included for each
institution as well as the address and information about other services.

<img alt="A smartphone is held in one hand. The smartphone shows the homepage of Kulturfinder.sh." src="docs/kulturQuadrat.jpg" title="Smartphone with Kulturfinder app" width="500px"/>

[📺 Image Video 📺](https://vimeo.com/274652974)

### [kultursphäre.sh](https://www.kultursphaere.sh/)

Die kultursphäre.sh ist ein Projekt des Fachbereiches Medien der Fachhochschule Kiel. Das Projekt wird gefördert vom
Ministerium für Bildung, Wissenschaft und Kultur des Landes Schleswig-Holstein.

kultursphäre.sh is a project by the media department of Kiel University of Applied Sciences. The project is funded by
the Ministry of Education, Science, and Culture of the state of Schleswig-Holstein.

## Contributing

[Contributor License Agreement](./docs/CONTRIBUTOR-AGREEMENT.md)

### Project setup

[How to contribute](./docs/CONTRIBUTING.md)

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Test service worker with local http-server

```
npm install http-server -g
npm run build
http-server dist
```

To test changes, rebuild with npm. The http-server does not have to be restarted for this.
