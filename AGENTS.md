# Bergfelds – projektöverlämning för AI-agenter

## Projektets syfte

Det här är Bergfeld Försäljning AB:s svenska, statiska webbplats. Den presenterar företaget i Ludvika, dess utbud inom industri, VVS och verkstad, kundlöfte, butik och kontaktvägar. Målgruppen är främst företag och yrkesverksamma. Webbplatsens ton ska kännas personlig, kunnig, rak och lokal – inte som en anonym e-handelsplats.

## Teknik och struktur

- Webbplatsen är byggd med vanlig HTML, CSS och JavaScript. Den har ingen pakethanterare, frontendramverk, server, databas eller byggsteg.
- HTML-sidorna ligger i projektroten och delar navigering, sidfot, bildresurser och JavaScript.
- `main.js` innehåller den gemensamma interaktionen och data för leverantörskatalogen.
- `assets/` innehåller logotyp, favicon, fotografier, illustrationsbilder samt leverantörs- och företagslogotyper (`assets/suppliers/` och `assets/logos/`).
- `.github/workflows/pages.yml` publicerar projektroten till GitHub Pages vid push till `main` eller manuell körning.
- `README.md` beskriver hur webbplatsen öppnas lokalt och hur Pages publiceras.

### Sidor

- `index.html` – startsida med huvudbudskap, produktområden, arbetssätt och kontaktvägar.
- `butiken.html` – butik/besök, tillfällig plats, öppettider och hur beställningar hanteras.
- `sortiment.html` – huvudområdena industri, VVS och verkstad, produktkategorier och leverantörs-/företagskatalog.
- `du-som-kund.html` – kundlöfte, service, produktkunskap och samarbete.
- `om-bergfelds.html` – företagets grundare, historia, affärsidé, vision och värderingar.
- `kontakta-oss.html` – allmänna kontaktuppgifter, personkontakter, besöks- och postadress.
- `integritetspolicy.html` – information om personuppgifter, externa tjänster, lagring och rättigheter.

## Visuell stil och innehåll

- Skriv webbplatsens innehåll på svenska. Behåll företagets personliga, professionella och sakliga ton.
- Den aktuella designriktningen i `style.css` är ren och industriell: marinblå ytor, blå accentfärg, ljusgrå/blå bakgrund, tydliga rubriker och mjuka hörn. Designtokens omfattar bland annat `--navy: #0c253d`, `--blue: #0875d1`, `--paper: #f4f7fa` och `--radius: 14px`.
- Stilmallen använder Inter för brödtext och Manrope för rubriker, har responsiva brytpunkter vid 1024, 768 och 390 px samt stöd för `prefers-reduced-motion`. Bevara dessa egenskaper när stilen ändras.
- `sortiment.html` laddar Schibsted Grotesk i sin HTML medan den gemensamma stilmallen importerar Inter/Manrope. Om typografin ändras, gör den konsekvent över sidorna.
- Använd befintliga bilder och logotyper från `assets/` med relativa sökvägar. Behåll beskrivande alternativtexter och lazy loading för bilder som inte är första innehåll.
- Håll layouten responsiv och bevara tydlig tangentbordsfokus, semantiska HTML-element, beskrivande länkar och tillgängliga etiketter. Ändra inte företagsfakta, adress, öppettider, priser eller produkt-/leverantörspåståenden utan att först verifiera dem.

## Funktioner och begränsningar

- `main.js` öppnar/stänger mobilmenyn, uppdaterar knappens `aria-expanded` och text, stänger menyn vid navigering och markerar aktuell navigationslänk utifrån sidnamnet.
- `main.js` sätter årtalet i element med `data-year`.
- På `sortiment.html` bygger `main.js` leverantörs-/företagskorten i `.supplier-directory` från en array med namn, bildsökväg och valfri extern URL. Vissa kort är länkar, andra är endast informationskort. Uppdatera data och tillhörande bildresurser tillsammans.
- Kontakt sker via `tel:`- och `mailto:`-länkar. Det finns ingen server, databas, beställningskassa eller aktivt formulärflöde i koden som granskats. Integritetspolicyn nämner ett formulär som skapar ett mejlutkast; stäm av och korrigera den texten om formulärfunktionen inte finns när sidan ändras eller publiceras.
- Google Fonts, Google Maps och leverantörs-/sociala länkar är externa beroenden. Alla lokala länkar och bilder ska fortsätta fungera på GitHub Pages projektadress genom relativa sökvägar.

## Ändringar och verifiering

- Läs `git status` och diffar innan du ändrar filer. Bevara orelaterade och redan påbörjade användarändringar; återställ eller radera inte användarens arbete.
- Kontrollera alltid aktuellt Git-tillstånd och diffar innan arbete. Arbetskatalogen kan ändras medan du arbetar; skriv inte över eller återställ ändringar som tillhör användaren.
- När en förändring påverkar gemensam navigering, sidfot, typografi eller kontaktuppgifter, kontrollera alla HTML-sidor där den delen förekommer.
- Det finns inga definierade test- eller byggkommandon. Öppna `index.html` lokalt för enkel kontroll och verifiera berörda sidor i en webbläsare. Vid större UI-ändringar: kontrollera mobil- och desktoplayout, länkar, bilder och konsolfel.
- Uppdatera relevanta dokument när beteenden eller projektets arbetssätt ändras. Håll ändringar små och undvik att införa verktyg eller beroenden utan ett faktiskt behov.
