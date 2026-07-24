"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const instagramUrl = "https://www.instagram.com/ag_enterprises_painting/";

const services = [
  {
    number: "01",
    symbol: "✦",
    title: "Interior Painting",
    text: "Rooms, walls, ceilings, trim, kitchens, and bathrooms—finished with clean lines and careful attention to the surfaces underneath.",
    tone: "paper",
  },
  {
    number: "02",
    symbol: "+",
    title: "Drywall & Sheetrock Repair",
    text: "Holes, patches, cracks, and damaged areas repaired and prepared before the first finish coat goes on.",
    tone: "mint",
  },
  {
    number: "03",
    symbol: "≈",
    title: "Skim Coating",
    text: "Uneven, damaged, or wallpaper-scarred walls smoothed into a better foundation for paint.",
    tone: "butter",
  },
  {
    number: "04",
    symbol: "↗",
    title: "Wallpaper Removal",
    text: "The old layer comes down, what is underneath gets assessed, and the wall is prepared for its next finish.",
    tone: "coral",
  },
];

const projects = [
  {
    image: "/work/exterior-column.jpg",
    width: 640,
    height: 853,
    alt: "Freshly painted white exterior porch column beside brickwork",
    title: "Exterior column refresh",
    tag: "Small exterior project",
    note: "Surface repair, bonding, careful prep, and a crisp white finish for a compact exterior detail.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DKfNzFmxBMg/",
  },
  {
    image: "/work/kitchen-reset.jpg",
    width: 512,
    height: 640,
    alt: "Freshly repainted galley kitchen with gray cabinets and clean white walls",
    title: "Kitchen reset",
    tag: "Ceilings, walls + baseboard",
    note: "A straightforward repaint with two coats on the ceilings and walls, plus fresh baseboard paint.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DEuoYZFRUpj/",
  },
  {
    image: "/work/careful-prep.jpg",
    width: 640,
    height: 800,
    alt: "Floor carefully covered and taped before wall and ceiling painting",
    title: "The prep is the project",
    tag: "Patch, sand, prime + paint",
    note: "Floors protected before ceiling patches, wall touch-ups, sanding, priming, and painting begin.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DH07G6WxyD4/",
  },
  {
    image: "/work/room-finish.jpg",
    width: 640,
    height: 800,
    alt: "Fresh two-tone room paint with light lower walls and a gray upper section",
    title: "Small-room finish",
    tag: "Interior repaint",
    note: "A compact room repaint that shows how a clean edge and fresh surface can change the whole feel.",
    source: "https://www.instagram.com/ag_enterprises_painting/p/DEcwB_Xpvu5/",
  },
];

const processSteps = [
  ["Show the wall", "Send project photos, your town, and a quick note about what is bothering you."],
  ["Get the plan", "Andrew looks at the surface and talks through the repair, prep, and finish."],
  ["Repair + paint", "The room gets protected, the wall gets ready, and the finish goes on cleanly."],
  ["Enjoy the reveal", "Review the fresh finish and cross one more house thing off the list."],
];

const faqs = [
  [
    "Do you take small painting and repair jobs?",
    "Yes. Small drywall patches, ceilings, kitchens, bathrooms, trim, and other focused projects are exactly the kind of work AG Enterprises Painting welcomes.",
  ],
  [
    "Can drywall repair and painting be handled together?",
    "Yes. Repair, surface preparation, priming, and painting can be planned as one project so the finished area reads as a complete wall—not a patch with paint on it.",
  ],
  [
    "What is skim coating?",
    "Skim coating adds a thin layer of joint compound to smooth uneven or damaged walls. It can create a better paint-ready surface after old texture, repairs, or wallpaper removal.",
  ],
  [
    "Can you remove wallpaper and prepare the wall afterward?",
    "Yes. Wallpaper removal is followed by an assessment of the wall underneath. Glue residue, damage, and uneven areas can then be addressed before paint.",
  ],
  [
    "What should I include with an estimate request?",
    "Send a full-room photo, a close-up of the trouble spot, your town, and a sentence about the result you want. That gives Andrew a useful first look at the scope.",
  ],
  [
    "Do you work outside Cinnaminson?",
    "AG Enterprises Painting is based in Cinnaminson and works in nearby South Jersey communities. Share your town when you reach out so Andrew can confirm the current service area.",
  ],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const rollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const stepItems = Array.from(document.querySelectorAll<HTMLElement>("[data-process-step]"));

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("motion-ready");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );

    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nextStep = Number((entry.target as HTMLElement).dataset.processStep || 0);
            setActiveStep(nextStep);
          }
        });
      },
      { rootMargin: "-35% 0px -45%", threshold: 0 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    stepItems.forEach((item) => stepObserver.observe(item));

    return () => {
      revealObserver.disconnect();
      stepObserver.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
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
        Skip to the good walls
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
              Get an estimate <span aria-hidden="true">↗</span>
            </button>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero shell" id="top" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">Cinnaminson interior painting + wall repair</p>
            <h1 id="hero-heading">
              Small repairs.
              <br />
              Serious prep.
              <br />
              <span className="paint-line">Big fresh-room energy.</span>
            </h1>
            <p className="hero-subhead">
              Interior painting, drywall and Sheetrock repair, skim coating, and wallpaper removal for homes in Cinnaminson and nearby South Jersey—handled with care, clean lines, and a little good humor.
            </p>

            <div className="hero-actions" role="group" aria-label="Estimate options">
              <button className="button button-primary" type="button" onClick={openWallNote} onPointerEnter={replayRoller}>
                Show us the wall <span aria-hidden="true">↗</span>
              </button>
              <a className="button button-secondary" href={instagramUrl} target="_blank" rel="noreferrer">
                Send project photos <span aria-hidden="true">→</span>
              </a>
            </div>

            <ul className="proof-row" aria-label="Why call AG Enterprises Painting">
              <li>Small projects welcome</li>
              <li>Prep + paint together</li>
              <li>Talk directly with Andrew</li>
            </ul>

            <p className="hero-note" aria-hidden="true">
              <strong>↳</strong> Prep first. Paint second. Victory lap third.
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
                src="/work/kitchen-reset.jpg"
                alt="Freshly repainted galley kitchen with gray cabinets"
                width="640"
                height="800"
              />
            </figure>

            <p className="photo-caption">real work<br />right nearby</p>

            <div className="quality-seal" role="img" aria-label="Prep first, paint second">
              <div className="quality-seal-ring" aria-hidden="true">
                <span>Prep first · paint second</span>
                <span>Good work · good mood</span>
              </div>
              <span className="quality-seal-core">OH,<br />NICE.</span>
            </div>

            <div className="roller-hello" ref={rollerRef} aria-hidden="true">
              <span className="roller-bubble">Good walls. Good mood.</span>
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
            <span>Small jobs welcome</span>
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
                <p className="section-kicker">Repair + prep + paint</p>
                <h2 id="services-heading">One call for the repair and the finish.</h2>
              </div>
              <p>
                From “tiny mystery dent” to “why did anyone choose that wallpaper?”—the wall gets a sensible plan before the paint can opens.
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
              <p><strong>Not sure what the wall needs?</strong> A couple of photos can make the first conversation much easier.</p>
              <button className="text-button" type="button" onClick={openWallNote}>Send a photo <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </section>

        <section className="projects-section shell" id="work" aria-labelledby="work-heading">
          <div className="section-head" data-reveal>
            <div>
              <p className="section-kicker">Recent local work</p>
              <h2 id="work-heading">Proof, not paint poetry.</h2>
            </div>
            <p>Real work from the AG Enterprises Painting feed. Tap a project to see what was handled.</p>
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
                        <small>What we handled</small>
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
              <span className="prep-sticker">The finish starts here.</span>
            </div>

            <div className="prep-copy" data-reveal>
              <p className="section-kicker">The prep difference</p>
              <h2 id="prep-heading">The finish starts before the paint can opens.</h2>
              <p className="large-copy">
                A fresh color cannot hide a surface that was never made ready. AG Enterprises Painting looks at the wall first, handles the repair, and paints when the foundation is right.
              </p>
              <ol className="prep-list">
                <li><span>01</span><div><strong>Look closely</strong><p>Find the cracks, bumps, nail pops, old glue, and trouble spots.</p></div></li>
                <li><span>02</span><div><strong>Patch + smooth</strong><p>Repair what needs attention and build a paint-ready surface.</p></div></li>
                <li><span>03</span><div><strong>Finish cleanly</strong><p>Prime where needed, paint carefully, and keep the edges crisp.</p></div></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="owner-section shell" id="andrew" aria-labelledby="owner-heading">
          <div className="owner-card" data-reveal>
            <div className="owner-badge" aria-hidden="true">
              <span>AG</span>
              <small>Neighbor-run</small>
            </div>
            <div className="owner-copy">
              <p className="section-kicker">One project. One point of contact.</p>
              <h2 id="owner-heading">Talk directly with Andrew.</h2>
              <p>
                AG Enterprises Painting is a neighbor-run business based in Cinnaminson. Andrew brings an upbeat, straightforward approach: look at the wall, explain the plan, and take the prep seriously.
              </p>
              <p>
                The small drywall patch, kitchen, bathroom, ceiling, or trim job that feels too focused for a big crew? Those are welcome here.
              </p>
              <div className="owner-actions">
                <button className="button button-primary" type="button" onClick={openWallNote}>Show Andrew the project ↗</button>
                <a className="instagram-link" href={instagramUrl} target="_blank" rel="noreferrer">@ag_enterprises_painting</a>
              </div>
            </div>
            <p className="owner-side-note" aria-hidden="true">Small jobs welcome.<br />Weird walls encouraged.</p>
          </div>
        </section>

        <section className="process-section" id="process" aria-labelledby="process-heading">
          <div className="shell process-layout">
            <div className="process-intro" data-reveal>
              <p className="section-kicker">How it goes</p>
              <h2 id="process-heading">From “uh-oh” to “oh, nice.”</h2>
              <p>No maze of departments. Just a clear sequence from the first photos to the fresh finish.</p>
              <button className="text-button" type="button" onClick={openWallNote}>Start with a photo ↗</button>
            </div>

            <div className="process-track" style={{ "--active-step": activeStep } as CSSProperties}>
              <div className="process-rail" aria-hidden="true">
                <div className="process-roller">
                  <span className="tiny-roller-head" />
                  <span className="tiny-roller-handle" />
                </div>
              </div>
              <div className="process-list">
                {processSteps.map(([title, text], index) => (
                  <article className={"process-step " + (activeStep === index ? "is-active" : "")} key={title} data-process-step={index} data-reveal>
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
              <p className="section-kicker">Based right here</p>
              <h2 id="area-heading">Painting and wall repair in Cinnaminson and nearby South Jersey.</h2>
            </div>
            <div>
              <p>
                AG Enterprises Painting is based in Cinnaminson, New Jersey, and works with homeowners in nearby South Jersey communities. Tell Andrew where the project is when you reach out, and he can confirm whether it is within the current service area.
              </p>
              <button className="text-button" type="button" onClick={openWallNote}>Tell us your town ↗</button>
            </div>
          </div>
        </section>

        <section className="faq-section shell" id="faq" aria-labelledby="faq-heading">
          <div className="faq-intro" data-reveal>
            <p className="section-kicker">Before the drop cloths come out</p>
            <h2 id="faq-heading">A few good wall questions.</h2>
            <p>If yours is not here, send Andrew a photo and the short version.</p>
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
              <p className="section-kicker">The wall confessional</p>
              <h2 id="contact-heading">Tell us what the wall did.</h2>
              <p>A few details and photos help Andrew understand whether the job needs a patch, a skim, paint, or a respectful combination of all three.</p>
            </div>
            <div className="closing-actions">
              <button className="button button-sun" type="button" onClick={openWallNote}>Show us the wall ↗</button>
              <a className="button button-dark-outline" href={instagramUrl} target="_blank" rel="noreferrer">See more local work →</a>
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

      <nav className="mobile-action-bar" aria-label="Quick estimate actions">
        <button type="button" onClick={openWallNote}>Show us the wall</button>
        <a href={instagramUrl} target="_blank" rel="noreferrer">Send photos</a>
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
          <button className="dialog-close" type="button" aria-label="Close estimate guide" onClick={() => dialogRef.current?.close()}>×</button>
          <p className="section-kicker">The wall confessional</p>
          <h2 id="wall-dialog-title">Give Andrew the useful version.</h2>
          <p className="dialog-lede">Instagram is the verified contact channel currently connected to this site. A useful first message includes:</p>
          <ol className="photo-checklist">
            <li><span>1</span><div><strong>One full-room photo</strong><p>Enough context to understand where the trouble spot lives.</p></div></li>
            <li><span>2</span><div><strong>One or two close-ups</strong><p>Show the crack, patch, texture, wallpaper, or edge clearly.</p></div></li>
            <li><span>3</span><div><strong>Your town + the goal</strong><p>Say where the project is and what you want the room to feel like afterward.</p></div></li>
          </ol>
          <a className="button button-primary dialog-action" href={instagramUrl} target="_blank" rel="noreferrer">Open Instagram and send photos ↗</a>
          <small>No form submission is simulated here—your message goes through the company’s real Instagram profile.</small>
        </div>
      </dialog>
    </div>
  );
}
