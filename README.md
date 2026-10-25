# The Lagos Correspondent

Israel Olanrewaju Amoo’s newspaper portfolio. Static HTML, CSS, and browser JavaScript; no build step or server required. The masthead, typefaces, ink palette, and newspaper identity carry through a quieter, more visual edition.

## Fresh off the press

Two printed sheets open at their centre crease to reveal the portfolio. The first visit opens automatically; internal page navigation uses the same paper language. Reader settings include a replay with an explicit Unfold action. Escape and Skip cancel the opening, motion preferences are respected, and timed fallbacks release the page if an enhancement fails.

The front page introduces Israel in one short paragraph, with the fuller biography behind **Behind the byline**. Two selected builds appear as paper clippings; the Printing Room and Lagos archive sit inside the optional **Sunday Supplement**. Project cards use short captions with the fuller description available in Project notes. Writing and contact copy are also shorter.

`press-transition.js` owns the opening and navigation; `frontpage.css` supplies the concise layout and paper treatment. Both extend the original buildless site. Four locally hosted WebP screenshots show Blackbell, Vistacraft, Figure234, and Doodlemon. The screenshots total approximately 159 kB. The remaining projects keep illustrated posters; the Degen Lifestyles host returned a 522 error during this review.

## The reading room

- Newspaper opening, section stamps, reading progress, and ink feedback. Motion can be switched off and respects reduced-motion preferences.
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

JavaScript syntax and Git whitespace checks passed, along with local-asset, unique-ID, landmark, and ARIA-reference checks. Browser checks cover the opening, replay, Unfold action, Escape cancellation, motion controls, page navigation, folded biography, project filters and full notes, index-to-supplement deep links, writing filters and reading-list storage, live headline editing, archive selection, and enquiry generation. The headline PNG download was verified in the earlier interaction pass. A 390-pixel iframe (375-pixel content area) was used for narrow-layout inspection, including the curtain; this is not a physical-device test.

## Archive sources

- [Library of Congress: The Nigerian Daily Times](https://www.loc.gov/item/sn94021149/)
- [British Pathé: Princess Alexandra Declares Nigeria Independent (1960)](https://www.britishpathe.com/asset/197943/)
