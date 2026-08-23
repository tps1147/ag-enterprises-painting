# AG Enterprises full-page world

## Creative rule

The homepage is one continuous handcrafted painting world. The miniature environment remains fixed behind the page from the hero through the footer; the real headings, service copy, FAQs, links, CTAs, and project photography scroll through it as semantic HTML chapters. It is not a conventional page with one animated process section.

The recurring visual language is warm cream cardstock, deep navy trim, mint finished walls, coral paint paths and rollers, butter accents, matte plaster and paper texture, slight handmade imperfections, miniature eye-level framing, and warm editorial light. The coral line is the route through the story.

The foreground UI follows the same physical logic. It is a restrained overlay system of warm paper labels, narrow painted accents, service slips, proof snapshots, and soft cast shadows. The film remains the dominant visual; interface panels preserve the copy-safe space authored into each scene instead of covering the miniature set with full-width opaque sections.

## Still storyboard

| Chapter | Page content | Endpoint asset | Copy-safe direction |
| --- | --- | --- | --- |
| 01 Arrival | Hero | `/world/v1/01-arrival.webp` | Left |
| 02 Services | Four services | `/world/v1/02-services.webp` | Right |
| 03 Inspection | Why prep matters | `/world/v1/03-inspection.webp` | Left |
| 04 Repair | Protect, patch, smooth | `/world/v1/04-repair.webp` | Left |
| 05 Paint | Finished-wall reveal | `/world/v1/05-paint.webp` | Left |
| 06 Gallery | Real project photography | `/world/v1/06-gallery.webp` | Left/wide |
| 07 Andrew | Owner story | `/world/v1/07-andrew.webp` | Right |
| 08 Neighborhood | Cinnaminson and South Jersey | `/world/v1/08-neighborhood.webp` | Upper left |
| 08A Questions | FAQ while the neighborhood holds | `/world/v1/08-neighborhood.webp` | Right/wide |
| 09 Closing | Estimate CTA and footer | `/world/v1/09-closing.webp` | Left |

All nine v1 endpoints are 1280×720 WebP images. Together they weigh approximately 554 KB.

## Image-generation prompt system

Generation mode: built-in image generation, new 16:9 raster assets, no external web or image search.

Shared brief used for every new endpoint:

> Create a polished 16:9 editorial still from the same continuous handcrafted miniature world for a cheerful South Jersey painting company. Use matte cardstock, corrugated cardboard, plaster and paper textures with subtle handmade imperfections; warm cream architecture, deep navy trim, pine, coral, butter and mint accents; a recurring coral paint line or upright coral roller; miniature eye-level camera; warm soft daylight; realistic shadows; clean, premium composition. Preserve the same house and room geography, lens feel, materials and recurring props. Leave the requested side calm and copy-safe. No readable text, logos, people, faces, floating tools, warped geometry, glossy plastic, photoreal humans or unrelated colors.

Scene deltas:

1. Arrival: a modest South Jersey-style miniature home, open navy front door, coral line flowing from the foreground into the home, calm left side.
2. Services: connected rooms and corridor showing tired paint, a patch, skim-coated surface and wallpaper peel, with tray and tools following the coral line, calm right side.
3. Gallery: the finished mint room becomes a gallery wall with six blank cream mounts reserved for real project photography, calm left side.
4. Andrew: the same mint room opens to a neat working painter’s bench with brushes, tape, boots, mug, empty navy frame and upright coral roller, calm right side.
5. Neighborhood: the same front step expands into a small paper South Jersey block; the coral route becomes the road connecting nearby homes, calm upper-left area.
6. Closing: return to the same house at warm golden hour; the open door reveals the mint gallery and the coral line makes a playful loop at the step, calm left side.

The inspection, repair and paint endpoints came from the already-approved transformation sequence and were retained as the middle act anchors.

## Runway motion production

The endpoints were uploaded to Runway and joined with six exact start/end-frame generations. The shared motion direction was: one unbroken miniature camera journey; preserve the supplied endpoints, camera height, house geography, materials and palette; move through a physical doorway or foreground occluder; no cut, dissolve, morph, readable text, new person, floating object or audio.

| Seam | Runway task |
| --- | --- |
| Arrival → services | `94e7d085-5244-43a4-8cf3-1e7096cd4a87` |
| Services → inspection | `05307311-5e6a-42e3-bc6b-d58496103e1f` |
| Paint → gallery | `75e72bc1-8f47-44e5-9b38-541f42e6a684` |
| Gallery → Andrew | `a98f2610-36b0-43dc-acfd-aecd632cced2` |
| Andrew → neighborhood | `9d41bef2-4054-4084-9c40-ad70937306d4` |
| Neighborhood → closing | `f58d2d58-f410-45aa-a5b0-864712b534d8` |

Each generated seam is 5.041 seconds at 1920×1080 and 24 fps. The middle inspection → repair → paint act is the previously approved 15-second transformation footage. The source clips stay out of the runtime request graph; the browser downloads one stitched delivery file.

## Runtime now

- Desktop master: `/scroll-world/ag-paint-world-v1.mp4` — 45.25 seconds, 1280×720, 24 fps, H.264/yuv420p, fast-start, 13.76 MB.
- Portrait master: `/scroll-world/ag-paint-world-mobile-v1.mp4` — the same 45.25-second continuous film in a hand-tuned 450×800 pan-and-scan, 6.14 MB. Portrait screens at 900px and below receive this source instead of blindly cropping and downloading the desktop file.
- Seek structure: one keyframe every 0.25 seconds (181 total) so reverse and forward scroll seeking do not depend on distant frames.
- A single fixed, paused `<video>` is scrubbed across the whole page by native scroll; the page never swaps scene images.
- Ten semantic cue sentinels map to nine distinct endpoint times in the film. Each one is a one-pixel, assistive-technology-hidden `.world-cue` placed at a stable viewport-relative offset inside its chapter, so expanding copy or a FAQ answer does not drag the playhead to a new section midpoint. Marker positions are measured from live layout geometry and remeasured after responsive layout changes.
- Scroll events are passive and collapse into `requestAnimationFrame`; the playhead eases toward the target without changing React state on every scroll.
- `/world/v1/01-arrival.webp` is the lightweight eager desktop poster. Portrait screens use `/world/v1/01-arrival-mobile.webp`, so reduced-motion and data-saving users keep the authored mobile composition when video is skipped.
- Reduced motion, reduced data, data saver, 3G, 2G and slow-2G users keep the static poster and do not receive a master video request. Preference and connection changes are observed during the session.
- Real project proof remains normal accessible imagery and semantic content in the foreground. The film is decorative and hidden from assistive technology.
- No Three.js, GSAP, Lenis, canvas, scroll hijacking or new runtime dependency is used.

The cue fractions intentionally match the edited film: arrival `0/9`, services `1/9`, inspection `2/9`, repair `4/9`, paint `5/9`, gallery `6/9`, Andrew `7/9`, neighborhood `8/9`, questions `8/9`, and closing `9/9`. Every cue appears exactly once in the document. Standard cues sit at `48svh`; neighborhood and questions deliberately share `8/9`, with the questions cue at `68svh` to hold the neighborhood composition through the FAQ handoff before the final move home.

## Foreground overlay system

`app/world-ui.css` is the presentation layer for content that sits above the continuous film. It is imported after `app/globals.css`, leaving the stable global/accessibility foundation intact while giving the world experience a deliberate cascade boundary.

- `.world-panel` supplies the shared warm-paper surface, one-pixel edge, inset painted stripe and soft physical shadow.
- `.panel-coral`, `.panel-mint`, `.panel-butter`, `.panel-paper` and `.panel-dark` provide semantic material accents without turning every card into a competing solid color.
- `.chapter-number`, `.service-slip`, `.proof-snapshot` and `.proof-card` carry the workshop-label and real-job-proof vocabulary through the page.
- Desktop layout uses the copy-safe directions in the storyboard. The 1050px, 900px and 580px adaptations collapse panels and grids while leaving the portrait film visible above the content.
- The opening hero is bound to the visible viewport after navigation. Its spacing and typography respond to viewport height as well as width; short screens remove decorative proof labels and the handwritten note before they can push the primary message or action below the fold.
- Static-video fallback increases panel opacity for legibility. Reduced-motion and forced-colors rules preserve content and interaction without depending on animation, blur, color, or shadow.
- The overlay adds no JavaScript animation library or runtime package. Motion remains limited to the native video scrub, small compositor-friendly reveal transitions, and direct interaction feedback.

## Re-export contract

Any replacement master must increment the version in both the filename and component because the assets use an immutable cache policy. Preserve 24 fps, H.264/yuv420p, fast-start, no audio, and a GOP of six frames (0.25 seconds). Keep the desktop master below 18 MB, the portrait derivative below 8 MB, keep their timelines frame-aligned, and verify HTTP byte-range responses for both before deployment.
