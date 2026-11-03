# Nikola Znaor Architects – Website: Notizen

Stand: 7. Oktober 2026. Hier steht, was fertig ist, was offen ist und wie es weitergeht.

---

## 1. Website starten (Vorschau)

Im Terminal, im Ordner `NikolaZnaorWebsite` (~/Documents/GitHub/NikolaZnaorWebsite):

```
export PATH=$HOME/.local/node/bin:$PATH
npx @11ty/eleventy --serve --port 8080
```

Dann im Browser **http://localhost:8080/** öffnen.
Die Vorschau läuft nur, solange das Terminal offen ist.
Node.js liegt in `~/.local/node` (ohne Admin installiert).

In einer neuen Claude-Sitzung reicht auch: „Starte die Website-Vorschau.“

---

## 2. Was fertig ist

**Aufbau:** Eleventy-Website in drei Sprachen: EN unter `/`, NL unter `/nl/`, HR unter `/hr/`.
Seiten: Home, Approach, Work (mit Filter), eine Seite pro Projekt, Studio (mit Presse), Contact.

**Design**
- Weißer Rand um das Blatt, feine blaue Rahmenlinie.
- Blaue Navigation: links der Name und EN / NL / HR, rechts Approach · Work · Studio · Contact.
- Beim Darüberfahren werden Felder invertiert, nichts wird unterstrichen.
- Startseite:
  - Raster mit Achsen A–G und 1–4.
  - „Nikola Znaor / Architects“ steht zwischen den Linien 2–3 und 3–4, mit Hilfslinien an N, Z und A.
  - Der Name erscheint Buchstabe für Buchstabe, danach wächst der Baum.
- Unterseiten: blauer Streifen, eine Rasterreihe hoch, der Titel steht auf Linie 1.
- Spalten sind am Achtel-Raster ausgerichtet (Achsen A, D, E, G).
- Approach:
  - links das Statement und der Absatz über den Ort;
  - rechts drei Aspekte mit animierten Mini-Zeichnungen (Mauer, Lastfluss, Sonne und Lamellen).
- Work:
  - Filter: All · Buildings · Pavilions · Houses · Renovations · Competitions · Research.
  - Jedes Projekt hat links eine Mini-Zeichnung.
  - Aufgeklappt: „Open project“, die Beschreibung und die blaue Zeichnung invertiert (blau auf weiß); beim Darüberfahren kippt sie zu weiß auf blau.
  - Dieselben Filter stehen auch auf der Startseite.
- Projektseiten:
  - Fetter Titel im blauen Streifen.
  - Oben ein Bildpaar: Wireframe in Klein-Blau neben dem Schlüsselbild, in halber Bildschirmhöhe.
  - Darunter Plankopf, Beschreibung und die übrigen Bilder in Dreierreihen.
  - Videos sind möglich (Airshade).
- Fußzeile: einzeilig, wie der Plankopf eines Plans.
- Schrift: Barlow (selbst gehostet). DIN kommt, sobald es eine Web-Lizenz gibt; die Vorlage steht in `src/assets/css/fonts.css`.

**Studio**
- Nikola Znaor, award-winning architect and inventor.
- Büros: Amsterdam und Zagreb. E-Mail: info@nikolaznaor.com.
- Sprachen: Croatian, Dutch (native) · English, German (fluent) · Italian (intermediate).
- Presse: Sombra mit Archello Award 2025 sowie ArchDaily, DETAIL und Dezeen (verlinkt).

---

## 3. Projekte – Stand

| # | Projekt | Kategorie | Ort | Status / Jahr | Bilder | Offen |
|---|---|---|---|---|---|---|
| 1 | Markus Wines | Buildings | Split | Installed · 2026 | 10 + Wireframe | Rolle des Büros am Gebäude selbst? „Installed“ oder „Upcoming“? |
| 2 | Sombra | Pavilions | Venice | Built · 2025 | 8 + Wireframe | fertig. Okay der Fotografen (Heemskerk, Vespignani) für das KI-Wireframe? |
| 3 | House in Dalmatia | Houses | Croatia | Main design · 2025 | 8 + Wireframe | Laut Plan liegt es in **Momjan (Istrien)**, nicht in Dalmatien. Text und Lead-Satz fehlen. |
| 4 | Vision Pavilion | Pavilions | [fehlt] | [fehlt] | 9 + Wireframe | Ort, Status, Jahr, Text, Lead-Satz |
| 5 | Villa in Dubrovnik | Houses | Dubrovnik | [fehlt] | 8 + Wireframe | Die Bilder zeigen Platz und Modelle, ist es wirklich eine Villa? Text, Status, Jahr |
| 6 | Bol Villa | Houses | Bol | [fehlt] | 1 Skizze | Text, Status, Jahr, mehr Bilder |
| 7 | House in Zagreb | Renovations | Zagreb | Concept design · 2023 | 11 + Wireframe | fertig (Text aus dem PDF) |
| 8 | Apartment on Brač | Renovations | Brač | [fehlt] | keine | alles, nicht auf der Startseite |
| 9 | Amsterdam Rooftop | Renovations | Amsterdam | Completed · 2024 | keine | Text, Bilder, nicht auf der Startseite |
| 10 | Mountain View | Renovations | Gorski Kotar | In progress · [Jahr] | keine | Jahr, Text, Bilder, nicht auf der Startseite |
| 11 | Airshade | Research | Netherlands | Patent | Wireframe, 3 Zeichnungen, 3 Videos | fertig, mit Link zu airshade.eu |

- Competitions: Die Rubrik ist da, aber es gibt noch kein Projekt.
- Wireframes fehlen noch für Bol Villa (nur Skizze), Apartment on Brač, Amsterdam Rooftop und Mountain View.
- Prompt und Stilvorlage für neue Wireframes liegen im Ordner `WIREFRAME/`.

---

## 4. Offene Platzhalter (alles in [eckigen Klammern])

- **Projekte:** siehe Tabelle oben. Der Satz „[One sentence that captures the project]“ fehlt bei Vision Pavilion, Villa in Dubrovnik, Bol Villa, House in Dalmatia, Brač, Rooftop und Mountain View.
- **Studio, „Talks and workshops“:** drei Platzhalter (Datum, Ort).
- **Webadresse:** `site.url` in `src/_data/site.js` steht noch auf `https://example.com`. Kommt die Seite auf nikolaznaor.com?
- **NL- und HR-Texte:** Ich habe sie selbst übersetzt. Vor dem Start sollte ein Muttersprachler sie lesen.

Nach jedem Build listet das Terminal alle Platzhalter pro Seite auf.

---

## 5. Noch zu tun (technisch)

1. **README** schreiben: Projekt hinzufügen, Bilder austauschen, Veröffentlichen.
2. **Veröffentlichen:** Netlify oder GitHub Pages einrichten.
3. **Social-Media-Vorschaubild:** `og-default.png` wird verlinkt, existiert aber noch nicht.
4. `sitemap.xml` und `robots.txt` anlegen.
5. Schlussprüfung: Barrierefreiheit, Handy-Ansicht und Ladezeit.
6. **Startseite:** Apartment on Brač, Amsterdam Rooftop und Mountain View dort freischalten (`featured: true`), sobald sie Bilder haben.

---

## 6. Wo was liegt

| Was | Wo |
|---|---|
| Projekte (ein Text pro Sprache) | `src/en/work/`, `src/nl/work/`, `src/hr/work/` (gleicher Dateiname) |
| Projektbilder | `src/images/<projekt>/` |
| Videos | `src/assets/video/` |
| Texte für Approach, Studio, Presse, Menü | `src/en/en.11tydata.yaml` (bzw. `nl/…`, `hr/…`) |
| E-Mail, Webadresse, Sprachen, Filter-Reihenfolge | `src/_data/site.js` |
| Farben, Abstände, Layout | `src/assets/css/main.css` |
| Startseiten-Animation (Raster, Name, Baum) | `src/assets/js/blueprint.js` (Tempo: `SPEED`, `LETTER_DELAY`, `TITLE_TIME`) |
| Mini-Zeichnungen der Projektliste | `src/_includes/partials/project-mini.njk` |
| Original-Wireframes und KI-Prompt | `WIREFRAME/` |
| Ausgangsmaterial der Projekte | `PROJECTS/` |
| Ursprünglicher Entwurf | `nikola-znaor-architects-v3.html` |

**Nützliche Einstellungen pro Bild** (im Projekttext unter `images:`)

| Einstellung | Wirkung |
|---|---|
| `wide: true` | volle Breite |
| `half: true` | halbe Breite |
| `wide: false` | beim ersten Bild: kein Bildpaar oben |
| `position: center 80%` | welcher Teil beim Zuschnitt sichtbar bleibt (0% = oben, 100% = unten) |
| `fit: contain` | ganze blaue Zeichnung, mit Blau aufgefüllt |
| `pad: 1.25rem` | blaue Zeichnung kleiner, mit Rand |
| `drawing: true` | in der Projektliste invertiert zeigen |
| `credit: Name` | Fotografen-Nachweis „© Name“ |
| `video: airshade/name.mp4` | Video statt Bild |
