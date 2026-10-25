# The Lagos Correspondent

Israel Olanrewaju Amoo’s newspaper portfolio. Static HTML, CSS, and browser JavaScript; no build step or server required. The original masthead, typefaces, colours, page structure, portrait, and project grid are retained.

## The reading room

- Paper transitions, printed masthead entrance, section stamps, reading progress, and ink feedback. Motion can be switched off and respects reduced-motion preferences.
- A searchable edition index, available from the toolbar, `/`, or Ctrl/⌘ K.
- Project filters, project sheets, and live previews loaded on request. External hosting can restrict previews; existing Visit Site links remain available.
- Writing filters and a reading list saved in the visitor’s browser. Storage failures fall back to the current visit.
- A printing room that previews a custom headline and exports a 1080 × 1350 PNG.
- Two credited Lagos archive notes: the Nigerian Daily Times record (1926) and a British Pathé independence newsreel (1960). Footage opens at the archive, rather than being copied into the site.
- An enquiry composer that creates a reviewable email draft. It sends nothing automatically.
- An optional synthesized press click. Sound always starts off.

`theme.js` applies display preferences before paint; `edition.js` supplies shared interactions; `interactions.css` extends the original `style.css`. Without JavaScript the portfolio, articles, contact links, and CV remain readable.

## Reference review

The reference sites were reviewed for interaction ideas, with the existing newspaper design retained:

| Reference | Useful direction |
| --- | --- |
| [Oyin](https://www.oyin.design/) | A consistent editorial narrative and inline disclosures. Its animated view rendered blank in the review browser after the initial content loaded. |
| [Frvky](https://frvky.online/) | A personal world with explorable windows and media. |
| [Etornam Ahiator](https://www.etornamahiator.com/) | Cinematic framing and a consistent motion language. The hero media only partially played in the review browser. |
| [Rashedat Jinadu](https://www.rashedatjinadu.com/) | Tactile paper details alongside clear project and contact paths. |
| [Oyende Favour](https://oyendefavour.com/) | Interactions that belong to the portfolio’s theme and link back to actual work. |
| [Ena Labs](https://ena-labs.netlify.app/) | Personal, themed controls with visible instructions. |
| [Jidekel](https://www.jidekel.com/) | A deliberately paced entrance and an editorial identity. |
| [Sanyi](https://www.sanyi.space/) | Small personal interactions, including a flippable portrait. |
| [Ajanwachuku](https://www.ajanwachuku.work/) | A playground plus a browsable project archive. |
| [Madurey](https://madurey.com/) | Discoverable play layered around real work. |

## Checks

JavaScript syntax and Git whitespace checks passed. Browser checks covered search, page navigation, project filters and sheets, requested preview loading, writing filters, reading-list persistence after reload, live headline editing, a PNG download event, archive selection, enquiry generation, and display controls. The 390-pixel iframe preview was used to inspect the narrow layout; it is not a physical-device test.

## Archive sources

- [Library of Congress: The Nigerian Daily Times](https://www.loc.gov/item/sn94021149/)
- [British Pathé: Princess Alexandra Declares Nigeria Independent (1960)](https://www.britishpathe.com/asset/197943/)
