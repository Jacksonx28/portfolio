# The Lagos Correspondent

Israel Olanrewaju Amoo’s newspaper portfolio. Static HTML, CSS, and browser JavaScript; no build step or server required. The masthead, typefaces, ink palette, and newspaper identity carry through a quieter, more visual edition.

## Fresh off the press

Two printed sheets open at their centre crease to reveal the portfolio. The opening is an optional replay under Reader settings, with an explicit Unfold action. Normal visits and page navigation show the work immediately. Escape and Skip cancel the opening, motion preferences are respected, and timed fallbacks release the page if an enhancement fails.

The front page introduces Israel in two short lines, with the biography under **About Israel** below four project previews; the Printing Room and Lagos archive sit inside the optional **Sunday Supplement**. Project cards use short captions with the fuller description available in Project notes. Writing and contact copy are also shorter.

`press-transition.js` owns the optional opening and folded-section deep links; `frontpage.css` supplies the concise layout and paper treatment. Both extend the original buildless site. Four locally hosted WebP screenshots show Blackbell, Vistacraft, Figure234, and Doodlemon. The screenshots total approximately 159 kB. The remaining projects keep illustrated posters; the Degen Lifestyles host returned a 522 error during this review.

## The reading room

- Optional newspaper replay and subtle project hover feedback. Motion can be switched off and respects reduced-motion preferences.
- A searchable edition index, available from the footer, `/`, or Ctrl/⌘ K.
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

JavaScript syntax and Git whitespace checks passed, along with local-asset, unique-ID, landmark, and ARIA-reference checks. Browser checks cover the opening, replay, Unfold action, Escape cancellation, motion controls, page navigation, folded biography, project filters and full notes, index-to-supplement deep links, writing filters and reading-list storage, live headline editing, archive selection, and enquiry generation. The headline PNG download was verified in the earlier interaction pass. A 390-pixel iframe (375-pixel content area) was used for narrow-layout inspection, including the curtain; this is not a physical-device test.

## Archive sources

- [Library of Congress: The Nigerian Daily Times](https://www.loc.gov/item/sn94021149/)
- [British Pathé: Princess Alexandra Declares Nigeria Independent (1960)](https://www.britishpathe.com/asset/197943/)

## Work-first refinement

The landing page now starts with a plain frontend-engineering and technical-writing introduction, followed immediately by four colour project previews. Three previews link straight to the live work; Vistacraft links to its existing preview-only project entry. The biography and Sunday Supplement remain optional disclosures below the work.

All pages use Home / Work / Writing / Contact navigation. Decorative datelines, page banners, subtitle, scrolling availability ticker, and click ripples were removed. Search and reader preferences sit at the bottom. Normal visits and navigation no longer run the newspaper curtain or delay links; the original opening is available only through Reader settings → Replay opening. Subtle project hover feedback and reduced-motion support remain.

## Introduction restored

The front-page introduction again uses the original Builder / Writer / Lagos-made headline, portrait, experience figures, and CV link. A single sentence identifies Israel as a frontend engineer and technical writer in Lagos, with a short optional biography. Two selected projects follow the introduction. The quieter navigation and optional newspaper replay remain.

## Visible Printing Room and larger desktop type

A sticky newspaper Extra below the masthead invites visitors to make their own front page, from every page. It links directly to the Printing Room, which is visible without opening a disclosure. The historical Lagos archive keeps a separate optional disclosure. Desktop typography is larger across the introduction, navigation, project captions, articles and forms; narrow-screen type sizes remain unchanged.

## Featured project update

Community Pulse and Vistacraft lead the home page with live embedded previews and full-site links. Both also load live previews automatically in Work. Community Pulse is the first Work entry, Villa Corallina has been removed, and the global project index reflects the six current projects.

The Printing Room callout now appears only on Home. On narrow screens it stays in normal document flow rather than floating over content.
