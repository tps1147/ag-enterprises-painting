"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ContinuousWorldStage from "./components/ContinuousWorldStage";

const instagramUrl = "https://www.instagram.com/ag_enterprises_painting/";

const services = [
  {
    number: "01",
    symbol: "✦",
    title: "Interior Painting",
    text: "Walls, ceilings, trim, kitchens, and bathrooms—with the room protected, the surface prepared, and the cut lines kept clean.",
    tone: "paper",
  },
  {
    number: "02",
    symbol: "+",
    title: "Drywall & Sheetrock Repair",
    text: "Holes, cracks, nail pops, and tired old patches repaired so they can blend back into the wall instead of becoming the main attraction.",
    tone: "mint",
  },
  {
    number: "03",
    symbol: "≈",
    title: "Skim Coating",
    text: "Rough, uneven, or wallpaper-scarred surfaces smoothed into a clean foundation that fresh paint can actually flatter.",
    tone: "butter",
  },
  {
    number: "04",
    symbol: "↗",
    title: "Wallpaper Removal",
    text: "The old paper comes down, the glue and damage underneath get dealt with, and the wall gets a proper reset.",
    tone: "coral",
  },
];

const projects = [
  {
    image: "/work/exterior-column.jpg",
    width: 640,
    height: 853,
    alt: "Freshly painted white exterior porch column beside brickwork",
    title: "Porch column, cleaned up",
    tag: "Small exterior project",
    note: "Surface repair, bonding, careful prep, and a crisp white finish gave this hardworking porch detail a proper comeback.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DKfNzFmxBMg/",
  },
  {
    image: "/work/kitchen-reset-v3.webp",
    width: 1536,
    height: 1920,
    alt: "Freshly repainted galley kitchen with gray cabinets and clean white walls",
    title: "A calmer kitchen",
    tag: "Ceilings, walls + baseboard",
    note: "Two coats on the ceilings and walls, fresh baseboard paint, and a galley kitchen that feels lighter and pulled together again.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DEuoYZFRUpj/",
  },
  {
    image: "/work/blue-wall-finish.webp",
    width: 1536,
    height: 1920,
    alt: "Deep navy kitchen wall above crisp white wainscoting and window trim",
    title: "Blue wall, big personality",
    tag: "Skim coat + bold color",
    note: "The rough stage came first: skim coating, sanding, and prep. Then the deep navy went on and the white trim got its crisp little victory lap.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DDaUa7fSbkk/",
  },
  {
    image: "/work/room-finish.jpg",
    width: 640,
    height: 800,
    alt: "Fresh two-tone room paint with light lower walls and a gray upper section",
    title: "One small room, reset",
    tag: "Interior repaint",
    note: "A compact repaint with clean edges and a fresh surface—proof that a small room can make a big comeback.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DEcwB_Xpvu5/",
  },
  {
    image: "/work/careful-prep.jpg",
    width: 640,
    height: 800,
    alt: "Floor carefully covered and taped before wall and ceiling painting",
    title: "Prep before pretty",
    tag: "Patch, sand, prime + paint",
    note: "The floors were protected before the ceiling patches, wall touch-ups, sanding, priming, and painting got underway.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DH07G6WxyD4/",
  },
  {
    image: "/work/clubhouse-walls-v2.webp",
    width: 1440,
    height: 1800,
    alt: "Fresh light walls with dark window trim and a built-in counter",
    title: "Light walls, sharp edges",
    tag: "Walls + dark trim",
    note: "Fresh light walls, dark window trim, and a clean line around the built-in counter gave this hardworking room a simple, pulled-together reset.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DEL_0jHNVEE/",
  },
];

const faqs = [
  [
    "Is my job too small?",
    "Probably not. A drywall patch, one ceiling, a bathroom, kitchen, trim, or one stubborn wall are all worth sending over. Small, focused projects are welcome.",
  ],
  [
    "Can you repair the drywall and paint it too?",
    "Yes. I can plan the repair, surface preparation, priming, and painting together so you are not left coordinating a patch from one person and paint from another.",
  ],
  [
    "What is skim coating—and might my wall need it?",
    "Skim coating uses thin layers of joint compound to smooth an uneven or damaged surface. It is often useful after old texture, repeated repairs, or wallpaper removal.",
  ],
  [
    "Can wallpaper removal and painting be one project?",
    "Yes. Once the paper comes down, I can assess the wall underneath and deal with leftover glue, damage, or uneven areas before the new finish goes on.",
  ],
  [
    "What photos should I send?",
    "Send one full-room photo, one or two close-ups of the trouble spot, your town, and a sentence about what you want changed. No wall diagnosis required.",
  ],
  [
    "Do you travel outside Cinnaminson?",
    "Yes, for projects in nearby South Jersey communities. Include your town when you message me and I’ll let you know whether it is within my current service area.",
  ],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [mobileActionsVisible, setMobileActionsVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    let revealObserver: IntersectionObserver | null = null;

    const showAllRevealItems = () => {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      document.documentElement.classList.remove("motion-ready");
    };

    if (reducedMotion || typeof window.IntersectionObserver !== "function") {
      showAllRevealItems();
    } else {
      try {
        revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver?.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px -10%", threshold: 0.12 },
        );

        document.documentElement.classList.add("motion-ready");
        revealItems.forEach((item) => revealObserver?.observe(item));
      } catch {
        revealObserver?.disconnect();
        revealObserver = null;
        showAllRevealItems();
      }
    }

    return () => {
      revealObserver?.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeMenuAboveBreakpoint = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    const alignHashTarget = () => {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (!targetId) return;
      document.getElementById(targetId)?.scrollIntoView({ block: "start", behavior: "auto" });
    };
    const initialHashTimer = window.setTimeout(alignHashTarget, 180);

    window.addEventListener("keydown", closeMenuOnEscape);
    window.addEventListener("resize", closeMenuAboveBreakpoint);
    window.addEventListener("hashchange", alignHashTarget);
    window.addEventListener("load", alignHashTarget);

    return () => {
      window.clearTimeout(initialHashTimer);
      window.removeEventListener("keydown", closeMenuOnEscape);
      window.removeEventListener("resize", closeMenuAboveBreakpoint);
      window.removeEventListener("hashchange", alignHashTarget);
      window.removeEventListener("load", alignHashTarget);
    };
  }, []);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;

    let heroObserver: IntersectionObserver | null = null;
    let fallbackFrame: number | null = null;
    const showFallbackActions = () => setMobileActionsVisible(true);

    if (typeof window.IntersectionObserver !== "function") {
      fallbackFrame = window.requestAnimationFrame(showFallbackActions);
    } else {
      try {
        heroObserver = new IntersectionObserver(
          ([entry]) => setMobileActionsVisible(!entry.isIntersecting),
          { threshold: 0.08 },
        );
        heroObserver.observe(hero);
      } catch {
        fallbackFrame = window.requestAnimationFrame(showFallbackActions);
      }
    }

    return () => {
      heroObserver?.disconnect();
      if (fallbackFrame !== null) window.cancelAnimationFrame(fallbackFrame);
    };
  }, []);

  const openWallNote = () => {
    setMenuOpen(false);
    dialogRef.current?.showModal();
  };

  return (
    <div className="site-frame">
      <div className="paint-progress" aria-hidden="true">
        <div className="paint-progress-bar" />
      </div>

      <a className="skip-link" href="#main-content">
        Skip to the wall stuff
      </a>

      <header className="site-header">
        <div className="shell">
          <nav className="nav-shell" aria-label="Main navigation">
            <a className="brand" href="#top" aria-label="AG Enterprises Painting home">
              <span className="brand-mark" aria-hidden="true">
                AG
              </span>
              <span className="brand-copy">
                <strong>AG Enterprises</strong>
                <span>Painting · Cinnaminson, NJ</span>
              </span>
            </a>

            <button
              className="menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-links"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span className="sr-only">Menu</span>
            </button>

            <div className={"nav-links " + (menuOpen ? "is-open" : "")} id="site-links">
              <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
              <a href="#work" onClick={() => setMenuOpen(false)}>Local work</a>
              <a href="#andrew" onClick={() => setMenuOpen(false)}>Meet Andrew</a>
              <a href="#faq" onClick={() => setMenuOpen(false)}>FAQs</a>
            </div>

            <button className="nav-cta" type="button" onClick={openWallNote}>
              Show me the wall <span aria-hidden="true">↗</span>
            </button>
          </nav>
        </div>
      </header>

      <div className="world-journey">
        <ContinuousWorldStage />
        <div className="world-chapters">
      <main className="world-page" id="main-content">
        <section className="hero shell" id="top" aria-labelledby="hero-heading">
          <span className="world-cue" data-world-frame="arrival" aria-hidden="true" />
          <div className="hero-copy world-panel panel-coral">
            <p className="eyebrow"><span className="chapter-number" aria-hidden="true">01</span> Interior painting + wall repair · Cinnaminson, NJ</p>
            <h1 id="hero-heading">
              That wall has a story.
              <br />
              Let&apos;s give it
              <br />
              <span className="paint-line">a better ending.</span>
            </h1>
            <p className="hero-subhead">
              Hey, I&apos;m Andrew. I paint rooms, repair drywall, skim rough walls, and remove wallpaper around Cinnaminson and nearby South Jersey. Small job or strange wall, send me a photo and I&apos;ll tell you the sensible next step.
            </p>

            <div className="hero-actions" role="group" aria-label="Estimate options">
              <button className="button button-primary" type="button" onClick={openWallNote}>
                Show me the wall <span aria-hidden="true">↗</span>
              </button>
              <a className="button button-secondary" href={instagramUrl} target="_blank" rel="noreferrer">
                See my recent work <span aria-hidden="true">→</span>
              </a>
            </div>

            <ul className="proof-row" aria-label="Why call AG Enterprises Painting">
              <li>Small jobs are welcome</li>
              <li>Repair + paint in one plan</li>
              <li>You talk directly with me</li>
            </ul>

            <p className="hero-note" aria-hidden="true">
              <strong>↳</strong> Good work. Good mood. No mystery.
            </p>
          </div>

        </section>

        <div className="service-ticker" role="group" aria-label="AG Enterprises Painting services">
          <div className="ticker-track">
            <span>Small jobs absolutely welcome</span>
            <span>Interior painting</span>
            <span>Drywall repair</span>
            <span>Skim coating</span>
            <span>Wallpaper removal</span>
            <span>Cinnaminson, New Jersey</span>
          </div>
        </div>

        <section className="services-section" id="services" aria-labelledby="services-heading">
          <span className="world-cue" data-world-frame="services" aria-hidden="true" />
          <div className="shell services-shell">
            <div className="section-head light-head world-panel panel-coral" data-reveal>
              <div>
                <p className="section-kicker"><span className="chapter-number" aria-hidden="true">02</span> What I handle</p>
                <h2 id="services-heading">Fix the wall. Then make the room feel good again.</h2>
              </div>
              <p>
                Sometimes the job is a new color. Sometimes the wall needs a little therapy first. I handle the patching, smoothing, prep, and paint so you are not coordinating two different people.
              </p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <article className={"service-card service-slip tone-" + service.tone} key={service.title} data-reveal>
                  <span className="service-number" aria-hidden="true">{service.number}</span>
                  <span className="service-icon" aria-hidden="true">{service.symbol}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>

            <div className="inline-cta world-panel panel-mint" data-reveal>
              <p><strong>Patch, skim coat, or paint?</strong> You do not need to figure that out before you reach out.</p>
              <button className="text-button" type="button" onClick={openWallNote}>Ask Andrew <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </section>

        <section className="prep-section" id="prep" aria-labelledby="prep-heading">
          <span className="world-cue" data-world-frame="inspection" aria-hidden="true" />
          <div className="shell prep-layout">
            <div className="prep-photo proof-snapshot" data-reveal>
              <Image
                src="/work/careful-prep.jpg"
                alt="Floor and room carefully protected before wall repair and painting"
                width={640}
                height={800}
                loading="lazy"
                sizes="(max-width: 580px) 205px, (max-width: 900px) 250px, 25vw"
              />
              <span className="prep-sticker">This is where the good finish begins.</span>
            </div>

            <div className="prep-copy world-panel panel-butter" data-reveal>
              <p className="section-kicker"><span className="chapter-number" aria-hidden="true">03</span> Where good work starts</p>
              <h2 id="prep-heading">Paint is the last step, not the magic trick.</h2>
              <p className="large-copy">
                If the wall is cracked, lumpy, or still wearing yesterday’s wallpaper glue, a fresh color will not fix it. I protect the room and get the surface right first, so the finished job looks good for the right reason.
              </p>
              <ol className="prep-list">
                <li><span>01</span><div><strong>Protect first</strong><p>Cover floors, furniture, and nearby surfaces before the dusty work begins.</p></div></li>
                <li><span>02</span><div><strong>Make the wall right</strong><p>Repair cracks, holes, nail pops, rough patches, and old adhesive as needed.</p></div></li>
                <li><span>03</span><div><strong>Paint the room—not the floor</strong><p>Prime where needed, paint evenly, keep the edges crisp, and look it all over.</p></div></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="world-process-section" id="process" aria-labelledby="process-heading">
          <article className="world-process-beat world-process-repair shell">
            <span className="world-cue" data-world-frame="repair" aria-hidden="true" />
            <div className="world-copy-panel world-panel panel-coral" data-reveal>
              <p className="section-kicker"><span className="chapter-number" aria-hidden="true">04</span> Make the wall right</p>
              <h2 id="process-heading">The prep is the promise.</h2>
              <p>
                I cover the room, repair what paint cannot hide, and smooth the surface that needs it before the new color goes on. The boring-looking part is usually the part doing the most work.
              </p>
              <ul className="world-process-list">
                <li><span>01</span> Protect the room</li>
                <li><span>02</span> Repair and smooth</li>
                <li><span>03</span> Prime where needed</li>
              </ul>
            </div>
          </article>

          <article className="world-process-beat world-process-paint shell">
            <span className="world-cue" data-world-frame="paint" aria-hidden="true" />
            <div className="world-copy-panel world-panel panel-mint" data-reveal>
              <p className="section-kicker"><span className="chapter-number" aria-hidden="true">05</span> Then the fun part</p>
              <h2>From “uh-oh” to “oh, nice.”</h2>
              <p>
                Paint goes on evenly, the edges stay crisp, and I look the room over before the drop cloths come up. Then you get to stop staring at that one spot.
              </p>
              <button className="text-button" type="button" onClick={openWallNote}>Show me the wall ↗</button>
              <small>One wide shot. One close-up. Your town. That’s plenty to start.</small>
            </div>
          </article>
        </section>

        <section className="projects-section shell" id="work" aria-labelledby="work-heading">
          <span className="world-cue" data-world-frame="gallery" aria-hidden="true" />
          <div className="section-head world-panel panel-butter" data-reveal>
            <div>
              <p className="section-kicker"><span className="chapter-number" aria-hidden="true">06</span> The honest camera roll</p>
              <h2 id="work-heading">Real walls. Careful work. No stock photos.</h2>
            </div>
            <p>These are actual AG Enterprises Painting jobs around South Jersey. Open one to see what I repaired, prepared, or painted.</p>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => {
              const isOpen = openProject === index;
              return (
                <article className={"project-card-wrap project-" + (index + 1)} key={project.title} data-reveal>
                  <button
                    className={"project-card proof-card " + (isOpen ? "is-open" : "")}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`project-note-${index}`}
                    onClick={() => setOpenProject(isOpen ? null : index)}
                  >
                    <span className="project-tape" aria-hidden="true" />
                    <span className="project-image">
                      <Image
                        src={project.image}
                        alt={project.alt}
                        width={project.width}
                        height={project.height}
                        loading="lazy"
                        sizes="(max-width: 650px) 92vw, (max-width: 1050px) 46vw, 31vw"
                      />
                      <span className="project-note" id={`project-note-${index}`} aria-hidden={!isOpen}>
                        <small>What I handled</small>
                        {project.note}
                      </span>
                    </span>
                    <span className="project-meta">
                      <span>
                        <strong>{project.title}</strong>
                        <small>{project.tag}</small>
                      </span>
                      <span className="peek-label">{isOpen ? "Close details" : "View details"}</span>
                    </span>
                  </button>
                  <a className="project-source" href={project.source} target="_blank" rel="noreferrer">View original post ↗</a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="owner-section shell" id="andrew" aria-labelledby="owner-heading">
          <span className="world-cue" data-world-frame="andrew" aria-hidden="true" />
          <div className="owner-card world-panel panel-mint" data-reveal>
            <div className="owner-badge" aria-hidden="true">
              <span>AG</span>
              <small>Andrew at AG</small>
            </div>
            <div className="owner-copy">
              <p className="section-kicker"><span className="chapter-number" aria-hidden="true">07</span> The person behind the paint</p>
              <h2 id="owner-heading">Hi, I&apos;m Andrew. I take the work seriously—myself, less so.</h2>
              <p>
                At AG Enterprises Painting, I take on the focused jobs that can make a whole home feel better: the drywall patch you keep noticing, the rough wall, the tired ceiling, or the room that just needs a reset.
              </p>
              <p>
                When you reach out, you get me. I’ll look at the project, explain what I think it needs, and give the prep the same attention as the paint. I like clean work, straight answers, and keeping the day in a good mood.
              </p>
              <div className="owner-actions">
                <button className="button button-primary" type="button" onClick={openWallNote}>Show me the project ↗</button>
                <a className="instagram-link" href={instagramUrl} target="_blank" rel="noreferrer">@ag_enterprises_painting</a>
              </div>
            </div>
            <p className="owner-side-note" aria-hidden="true">Small jobs.<br />Straight answers.<br />Good energy.</p>
          </div>
        </section>

        <section className="area-section shell" id="area" aria-labelledby="area-heading">
          <span className="world-cue" data-world-frame="neighborhood" aria-hidden="true" />
          <div className="area-card world-panel panel-butter" data-reveal>
            <div>
              <p className="section-kicker"><span className="chapter-number" aria-hidden="true">08</span> Cinnaminson home base</p>
              <h2 id="area-heading">Based in Cinnaminson. Working nearby in South Jersey.</h2>
            </div>
            <div>
              <p>
                I’m based in Cinnaminson and take projects in nearby South Jersey communities. Include your town with your photos and I’ll let you know whether it is within my current service area.
              </p>
              <button className="text-button" type="button" onClick={openWallNote}>Send your town ↗</button>
            </div>
          </div>
        </section>

        <section className="faq-section shell" id="faq" aria-labelledby="faq-heading">
          <span className="world-cue" data-world-frame="questions" aria-hidden="true" />
          <div className="faq-panel world-panel panel-paper">
            <div className="faq-intro" data-reveal>
              <p className="section-kicker"><span className="chapter-number is-note" aria-hidden="true">NOTE</span> Questions people actually ask</p>
              <h2 id="faq-heading">The useful stuff, before the drop cloths.</h2>
              <p>If yours is not here, send me a photo and the short version.</p>
            </div>
            <div className="faq-list" data-reveal>
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}<span aria-hidden="true">+</span></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="closing-section shell" id="contact" aria-labelledby="contact-heading">
          <span className="world-cue" data-world-frame="closing" aria-hidden="true" />
          <div className="closing-card world-panel panel-dark" data-reveal>
            <div className="closing-copy">
              <p className="section-kicker"><span className="chapter-number" aria-hidden="true">09</span> Start with a few photos</p>
              <h2 id="contact-heading">Show me what&apos;s bugging you.</h2>
              <p>Send one wide shot, one close-up, your town, and the honest version: “This corner is driving me nuts.” That is plenty to start.</p>
            </div>
            <div className="closing-actions">
              <button className="button button-sun" type="button" onClick={openWallNote}>Start with a few photos ↗</button>
              <a className="button button-dark-outline" href={instagramUrl} target="_blank" rel="noreferrer">See more of my work →</a>
            </div>
            <div className="closing-roller" aria-hidden="true"><span /><i /></div>
          </div>
        </section>
      </main>

      <footer className="site-footer shell">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">AG</span>
          <div><strong>AG Enterprises Painting</strong><p>Cinnaminson, New Jersey</p></div>
        </div>
        <p>Interior painting · Drywall repair · Skim coating · Wallpaper removal</p>
        <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>
      </footer>
        </div>
      </div>

      <nav className={"mobile-action-bar " + (mobileActionsVisible ? "is-visible" : "")} aria-label="Quick estimate actions">
        <button type="button" onClick={openWallNote}>Show me the wall</button>
        <a href={instagramUrl} target="_blank" rel="noreferrer">See my work</a>
      </nav>

      <dialog
        className="wall-dialog"
        ref={dialogRef}
        aria-labelledby="wall-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="dialog-card">
          <button className="dialog-close" type="button" aria-label="Close photo guide" onClick={() => dialogRef.current?.close()}>×</button>
          <p className="section-kicker"><span className="chapter-number is-note" aria-hidden="true">START</span> A useful first message</p>
          <h2 id="wall-dialog-title">Give me the quick version.</h2>
          <p className="dialog-lede">You do not need to diagnose the wall. The easiest way to start is with a message on Instagram that includes:</p>
          <ol className="photo-checklist">
            <li><span>1</span><div><strong>The whole area</strong><p>Stand back far enough to show the room and where the problem lives.</p></div></li>
            <li><span>2</span><div><strong>The trouble up close</strong><p>Show the crack, hole, texture, wallpaper, patch, or damaged edge clearly.</p></div></li>
            <li><span>3</span><div><strong>Your town + the goal</strong><p>Say where you are and what you would like repaired, removed, or refreshed.</p></div></li>
          </ol>
          <a className="button button-primary dialog-action" href={instagramUrl} target="_blank" rel="noreferrer">Message me on Instagram ↗</a>
          <small>This opens the real @ag_enterprises_painting profile in a new tab.</small>
        </div>
      </dialog>
    </div>
  );
}
