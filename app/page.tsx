"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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

const processSteps = [
  ["Send the evidence", "Share one room photo, a close-up, your town, and the short version of what is going on."],
  ["Talk it through", "I’ll look at the surface and explain what likely needs repair, prep, and paint."],
  ["Protect, repair, paint", "The room gets covered, the wall gets made right, and the finish goes on carefully."],
  ["Walk in and smile", "Look over the finished room and enjoy not staring at that one spot anymore."],
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
  const [activeStep, setActiveStep] = useState(0);
  const [rollerOffset, setRollerOffset] = useState(3);
  const [mobileActionsVisible, setMobileActionsVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const rollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const stepItems = Array.from(document.querySelectorAll<HTMLElement>("[data-process-step]"));

    let revealObserver: IntersectionObserver | null = null;
    let processResizeObserver: ResizeObserver | null = null;

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

    let processFrame = 0;

    const updateProcess = () => {
      processFrame = 0;
      if (!stepItems.length) return;

      const readingLine = Math.min(window.innerHeight * 0.48, 520);
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      stepItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const marker = rect.top + Math.min(rect.height * 0.34, 64);
        const distance = Math.abs(marker - readingLine);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      const nextOffset = Math.round(stepItems[closestIndex].offsetTop + 3);
      setActiveStep((current) => current === closestIndex ? current : closestIndex);
      setRollerOffset((current) => current === nextOffset ? current : nextOffset);
    };

    const queueProcessUpdate = () => {
      if (!processFrame) processFrame = window.requestAnimationFrame(updateProcess);
    };

    if (typeof window.ResizeObserver === "function") {
      try {
        processResizeObserver = new ResizeObserver(queueProcessUpdate);
        stepItems.forEach((item) => processResizeObserver?.observe(item));
      } catch {
        processResizeObserver?.disconnect();
        processResizeObserver = null;
      }
    }
    window.addEventListener("scroll", queueProcessUpdate, { passive: true });
    window.addEventListener("resize", queueProcessUpdate);
    queueProcessUpdate();

    return () => {
      revealObserver?.disconnect();
      processResizeObserver?.disconnect();
      window.removeEventListener("scroll", queueProcessUpdate);
      window.removeEventListener("resize", queueProcessUpdate);
      if (processFrame) window.cancelAnimationFrame(processFrame);
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

    if (typeof window.IntersectionObserver !== "function") {
      setMobileActionsVisible(true);
      return;
    }

    let heroObserver: IntersectionObserver | null = null;
    try {
      heroObserver = new IntersectionObserver(
        ([entry]) => setMobileActionsVisible(!entry.isIntersecting),
        { threshold: 0.08 },
      );
      heroObserver.observe(hero);
    } catch {
      setMobileActionsVisible(true);
    }

    return () => heroObserver?.disconnect();
  }, []);

  const replayRoller = () => {
    const roller = rollerRef.current;
    if (!roller || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    roller.classList.remove("is-rolling");
    void roller.offsetWidth;
    roller.classList.add("is-rolling");
  };

  const openWallNote = () => {
    setMenuOpen(false);
    replayRoller();
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

            <button className="nav-cta" type="button" onClick={openWallNote} onPointerEnter={replayRoller}>
              Send me a photo <span aria-hidden="true">↗</span>
            </button>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero shell" id="top" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">Interior painting + wall repair · Cinnaminson, NJ</p>
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
              <button className="button button-primary" type="button" onClick={openWallNote} onPointerEnter={replayRoller}>
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

          <div className="hero-art" role="group" aria-label="Recent AG Enterprises Painting work">
            <div className="photo-swatch" aria-hidden="true" />
            <span className="tape tape-one" aria-hidden="true" />
            <span className="tape tape-two" aria-hidden="true" />

            <figure className="hero-photo hero-photo-main">
              <img
                src="/work/exterior-column.jpg"
                alt="Freshly painted white exterior porch column beside brickwork"
                width="640"
                height="853"
                fetchPriority="high"
              />
            </figure>

            <figure className="hero-photo hero-photo-small">
              <img
                src="/work/kitchen-reset-v3.webp"
                alt="Freshly repainted galley kitchen with gray cabinets"
                width="1536"
                height="1920"
              />
            </figure>

            <p className="photo-caption">real jobs<br />real local walls</p>

            <div className="quality-seal" role="img" aria-label="Fix it right, paint it nice">
              <div className="quality-seal-ring" aria-hidden="true">
                <span>Fix it right · paint it nice</span>
                <span>Good work · good mood</span>
              </div>
              <span className="quality-seal-core">MUCH<br />BETTER.</span>
            </div>

            <div className="roller-hello" ref={rollerRef} aria-hidden="true">
              <span className="roller-bubble">Let&apos;s get it sorted.</span>
              <div className="roller-tool">
                <span className="roller-head" />
                <span className="roller-arm" />
                <span className="roller-handle" />
              </div>
            </div>
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
          <div className="shell">
            <div className="section-head light-head" data-reveal>
              <div>
                <p className="section-kicker">What I handle</p>
                <h2 id="services-heading">Fix the wall. Then make the room feel good again.</h2>
              </div>
              <p>
                Sometimes the job is a new color. Sometimes the wall needs a little therapy first. I handle the patching, smoothing, prep, and paint so you are not coordinating two different people.
              </p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <article className={"service-card tone-" + service.tone} key={service.title} data-reveal>
                  <span className="service-number" aria-hidden="true">{service.number}</span>
                  <span className="service-icon" aria-hidden="true">{service.symbol}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>

            <div className="inline-cta" data-reveal>
              <p><strong>Patch, skim coat, or paint?</strong> You do not need to figure that out before you reach out.</p>
              <button className="text-button" type="button" onClick={openWallNote}>Ask Andrew <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </section>

        <section className="projects-section shell" id="work" aria-labelledby="work-heading">
          <div className="section-head" data-reveal>
            <div>
              <p className="section-kicker">The honest camera roll</p>
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
                    className={"project-card " + (isOpen ? "is-open" : "")}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`project-note-${index}`}
                    onClick={() => setOpenProject(isOpen ? null : index)}
                  >
                    <span className="project-tape" aria-hidden="true" />
                    <span className="project-image">
                      <img src={project.image} alt={project.alt} width={project.width} height={project.height} loading="lazy" />
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

        <section className="prep-section" aria-labelledby="prep-heading">
          <div className="shell prep-layout">
            <div className="prep-photo" data-reveal>
              <img
                src="/work/careful-prep.jpg"
                alt="Floor and room carefully protected before wall repair and painting"
                width="640"
                height="800"
                loading="lazy"
              />
              <span className="prep-sticker">This is where the good finish begins.</span>
            </div>

            <div className="prep-copy" data-reveal>
              <p className="section-kicker">Where good work starts</p>
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

        <section className="owner-section shell" id="andrew" aria-labelledby="owner-heading">
          <div className="owner-card" data-reveal>
            <div className="owner-badge" aria-hidden="true">
              <span>AG</span>
              <small>Andrew at AG</small>
            </div>
            <div className="owner-copy">
              <p className="section-kicker">The person behind the paint</p>
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

        <section className="process-section" id="process" aria-labelledby="process-heading">
          <div className="shell process-layout">
            <div className="process-intro">
              <p className="section-kicker">No mystery process</p>
              <h2 id="process-heading">From “uh-oh” to “oh, nice.”</h2>
              <p>You send the wall. I take a look. Then we make a sensible plan for getting it from “uh-oh” to “oh, nice.”</p>
              <button className="text-button" type="button" onClick={openWallNote}>Send me the wall ↗</button>
            </div>

            <div className="process-track" style={{ "--roller-offset": `${rollerOffset}px` } as CSSProperties}>
              <div className="process-rail" aria-hidden="true">
                <div className="process-roller">
                  <span className="tiny-roller-head" />
                  <span className="tiny-roller-handle" />
                </div>
              </div>
              <div className="process-list">
                {processSteps.map(([title, text], index) => (
                  <article className={"process-step " + (activeStep === index ? "is-active" : "")} key={title} data-process-step={index}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><h3>{title}</h3><p>{text}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="area-section shell" aria-labelledby="area-heading">
          <div className="area-card" data-reveal>
            <div>
              <p className="section-kicker">Cinnaminson home base</p>
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
          <div className="faq-intro" data-reveal>
            <p className="section-kicker">Questions people actually ask</p>
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
        </section>

        <section className="closing-section shell" id="contact" aria-labelledby="contact-heading">
          <div className="closing-card" data-reveal>
            <div className="closing-copy">
              <p className="section-kicker">Start with a few photos</p>
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
          <p className="section-kicker">A useful first message</p>
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
