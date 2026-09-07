"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  type CaseShot,
  type CaseStudy as Study,
} from "@/content/design/case-studies";

import { ArrowLeft, DownloadSimple } from "./icon";
import { Overlay } from "./motion/overlay";

/**
 * The case-study overlay.
 *
 * The layout is a port of the reference detail page's composition: an
 * eight-column grid holding a sticky two-column rail beside a six-column
 * content well, with the chapter list in the rail scroll-spying the content.
 *
 * Two things about the rail are worth stating, because both are easy to undo:
 *
 *   - The spy reads positions against the SCROLLING ELEMENT, not the viewport.
 *     The page behind is locked while this is open, so anything rooted on the
 *     viewport would never fire again after the first frame.
 *   - The rail carries the only close button, and it stays in the DOM at every
 *     width. The reference simply hides its rail below desktop, which it can
 *     afford because its "GO BACK" is a link on a real page; here that would
 *     leave a modal with no visible way out. Below the breakpoint the rail
 *     becomes a compact top bar and only the chapter list is dropped.
 *
 * The shell (portal, focus trap, Esc, scroll lock, transition) is `Overlay`.
 */
export function CaseStudy({
  study,
  onClose,
}: {
  study: Study | null;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Hold the last study through the exit tween. `Overlay` keeps the panel
     mounted for ~300ms after `open` goes false, so rendering from `study`
     directly would blank the panel the instant Close is pressed. Same trick as
     `play-detail.tsx`. */
  const [shown, setShown] = useState<Study | null>(study);
  const [active, setActive] = useState<string | null>(null);
  if (study && study !== shown) {
    setShown(study);
    /* Seeded from the study being OPENED, never a module-level constant: with a
       constant, the second case study would open with the first one's chapter
       highlighted until the reader scrolled. */
    setActive(study.blocks[0].id);
  }

  const open = study !== null;
  const activeId = active ?? shown?.blocks[0].id;

  /* Which figure is showing full size, or null. */
  const [zoomed, setZoomed] = useState<CaseShot | null>(null);
  /* Cleared when the case study closes, so reopening never lands straight back
     inside a viewer from last time. */
  if (!open && zoomed) setZoomed(null);

  /* Stable identity, and it matters. Passed inline, this is a new function on
     every render, and the viewer's key listener lists it as a dependency: the
     listener was then torn down and re-added on every re-render, and the chapter
     scroll spy re-renders this component constantly. Escape worked or did not
     depending on where in that churn the key landed. */
  const closeZoom = useCallback(() => setZoomed(null), []);

  /**
   * The spy is position-based rather than an IntersectionObserver band, for one
   * reason that a band cannot solve: the LAST chapter can never reach the middle
   * of the viewport, so with a band it stays un-highlighted no matter how far
   * you scroll. Hitting the bottom is therefore its own case, and the rest is a
   * reading line — the lowest chapter whose top has passed it wins.
   *
   * rAF-throttled on the container's own scroll, the same shape as
   * `use-works-scroll.ts`.
   */
  useEffect(() => {
    const root = scrollRef.current;
    if (!open || !root) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[data-chapter]"),
      );
      if (sections.length === 0) return;

      const atBottom =
        root.scrollTop + root.clientHeight >= root.scrollHeight - 4;
      if (atBottom) {
        const id = sections[sections.length - 1].dataset.chapter;
        if (id) setActive(id);
        return;
      }

      const line = root.getBoundingClientRect().top + 140;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section;
      }
      const id = current.dataset.chapter;
      if (id) setActive(id);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    /* Deferred rather than called here, so the first reading happens after the
       overlay has laid out — and out of the effect body. */
    frame = requestAnimationFrame(update);
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [open, shown]);

  /**
   * Jump to a chapter.
   *
   * A NOTE FOR THE NEXT PERSON WHO TESTS THIS IN A HEADLESS OR HIDDEN BROWSER
   * AND CONCLUDES IT IS BROKEN. It is not. `behavior: "smooth"` is driven by
   * animation frames, and a hidden document (`document.visibilityState ===
   * "hidden"`) fires none, so the scroll never advances and `scrollTop` stays
   * where it was. In the same pane, `behavior: "auto"` and a direct assignment
   * both work, because neither needs a frame, which makes the failure look
   * specific to smooth scrolling rather than to the environment.
   *
   * This was diagnosed as a real bug once and "fixed" by hand-rolling an rAF
   * tween, which of course did not work either, for the same reason: no frames.
   * Check `requestAnimationFrame` is actually firing before touching this.
   *
   * What CAN be verified without frames is the arithmetic: the computed target
   * for the last chapter of work (04) is 2191px, and assigning it directly
   * lands at 2184px, the scroller's clamped maximum.
   */
  const goTo = (id: string) => {
    const root = scrollRef.current;
    const target = root?.querySelector<HTMLElement>(`[data-chapter="${id}"]`);
    if (!root || !target) return;
    const top =
      target.getBoundingClientRect().top -
      root.getBoundingClientRect().top +
      root.scrollTop -
      24;
    root.scrollTo({
      top,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <Overlay
      open={open}
      onClose={onClose}
      labelledBy="jn-case-title"
      className="jn-case"
    >
      {shown ? (
        <>
          {/* `inert` while the viewer is open. The scroller is the right target
            even though the viewer now lives outside the panel: every focusable
            the panel has is inside this scroller, the rail and its Close button
            included, and the panel itself is only tabIndex -1. Inerting here
            therefore takes the whole case study out of the tab order and away
            from a screen reader, with no need to reach for the panel node. */}
          <div
            ref={scrollRef}
            className="jn-case__scroll"
            inert={zoomed !== null}
          >
            <header className="jn-case__hero">
              <p className="jn-case__chip">
                <span className="jn-case__chipClient">{shown.chip.client}</span>
                <span className="jn-case__chipRole">{shown.chip.role}</span>
              </p>

              <h2 id="jn-case-title" className="jn-case__statement">
                <Emphasised text={shown.statement} emphasis={shown.emphasis} />
              </h2>

              <Figure shot={shown.hero} priority onOpen={setZoomed} />
            </header>

            <div className="jn-case__grid">
              <aside className="jn-case__rail">
                <button
                  type="button"
                  className="jn-case__back"
                  onClick={onClose}
                  data-cursor="link"
                >
                  <ArrowLeft /> Close
                </button>

                <nav
                  className="jn-case__chapters"
                  aria-label="Case study sections"
                >
                  {shown.blocks.map((block) => (
                    <button
                      key={block.id}
                      type="button"
                      className="jn-case__chapter"
                      data-active={block.id === activeId ? "" : undefined}
                      aria-current={block.id === activeId ? "true" : undefined}
                      onClick={() => goTo(block.id)}
                      data-cursor="link"
                    >
                      {block.nav}
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="jn-case__content">
                <dl className="jn-case__facts">
                  {shown.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                {shown.blocks.map((block) => (
                  <section
                    key={block.id}
                    data-chapter={block.id}
                    className="jn-case__block"
                  >
                    <h3 className="jn-case__blockHeading">{block.heading}</h3>
                    <p className="jn-case__blockBody">{block.body}</p>
                    {block.figures?.map((shot) => (
                      <Figure key={shot.src} shot={shot} onOpen={setZoomed} />
                    ))}

                    {/* `download` rather than a plain link, so a Markdown file is
                      saved instead of being rendered as text in the tab. Same
                      origin, so the attribute is honoured. */}
                    {block.download ? (
                      <a
                        className="jn-case__download"
                        href={block.download.href}
                        download
                        data-cursor="link"
                      >
                        <DownloadSimple />
                        <span>{block.download.label}</span>
                        {block.download.meta ? (
                          <span className="jn-case__downloadMeta">
                            {block.download.meta}
                          </span>
                        ) : null}
                      </a>
                    ) : null}
                  </section>
                ))}
              </div>
            </div>
          </div>

          <FigureViewer shot={zoomed} onClose={closeZoom} />
        </>
      ) : null}
    </Overlay>
  );
}

/**
 * The full-size figure viewer.
 *
 * NOT an `Overlay`, but it does portal to `<body>` the same way one does, and it
 * has to: it fills the window, and it CANNOT do that from inside the case-study
 * panel. GSAP leaves a transform on that panel, and a transformed ancestor makes
 * `position: fixed` resolve against the ancestor rather than the viewport, so a
 * viewer nested in the panel is silently panel-bound however it is positioned.
 * An earlier version was, and measured 1.45x the inline figure instead of filling
 * the screen.
 *
 * Three hazards come with living outside the panel. All three are already handled
 * here, so none of them needs solving again:
 *
 *   - Esc and Tab are captured and stopped before the parent's bubble-phase
 *     listener sees them, which is what stops one Esc closing both layers.
 *   - The parent inerts `document.body.children` as a snapshot taken when it
 *     mounts, so this portal, appended later, is never caught by it. In exchange
 *     this component inerts the parent's panel itself while open.
 *   - `lockScroll()` is reference-counted and the parent already holds a lock, so
 *     there is nothing to add.
 *
 * ACCEPTED LIMITATION: the parent's wheel guard calls `preventDefault()` on any
 * wheel whose target its panel does not contain, which now includes this viewer.
 * Harmless while the image is `object-fit: contain` with nothing to scroll. If a
 * viewer ever needs panning or zooming, that guard is what will block it.
 */
function FigureViewer({
  shot,
  onClose,
}: {
  shot: CaseShot | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const open = shot !== null;

  /* Read through a ref inside the listener, so the listener depends on nothing
     but `open`. Even with a stable `onClose` this is the right shape: an event
     listener should not be re-registered because a callback identity moved. */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /* Remember what opened us, so focus goes back to that exact figure rather than
     to the top of the panel. Captured on open, before focus moves. */
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => openerRef.current?.focus?.({ preventScroll: true });
  }, [open]);

  /**
   * Esc and Tab, handled in the CAPTURE phase and stopped there.
   *
   * This is the whole reason the viewer is hand-rolled. `Overlay` listens for
   * keydown on `document` in the bubble phase, and `preventDefault` does not stop
   * a co-registered listener on the same node: without this, one Esc would close
   * the viewer AND the case study behind it. Capturing first and calling
   * `stopPropagation` means the parent never sees the key at all.
   */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      /* One control in here, so the trap is simply "stay on it". Cheaper and
         harder to get wrong than cycling a list of one. */
      if (event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current?.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="jn-case__viewer" role="dialog" aria-modal="true">
      <button
        type="button"
        className="jn-case__viewerScrim"
        onClick={onClose}
        aria-label="Close the larger view"
        tabIndex={-1}
      />
      <div className="jn-case__viewerInner">
        {/* A plain `img`, not `next/image`. Every source is already AVIF, and the
            optimizer would re-encode it to WebP, which for these is usually the
            larger file. There is nothing to gain and a format to lose.

            The lint rule warns about LCP and bandwidth. Neither applies: this
            only mounts after a click on a figure inside a modal, so it can never
            be the LCP element, and it is the same file the inline figure already
            fetched. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="jn-case__viewerImg"
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
        />
        {shot.caption ? (
          <p className="jn-case__viewerCaption">{shot.caption}</p>
        ) : null}
      </div>

      <button
        ref={closeRef}
        type="button"
        className="jn-case__viewerClose"
        onClick={onClose}
        data-cursor="link"
      >
        Close
      </button>
    </div>,
    document.body,
  );
}

/**
 * Tracks the OS reduced-motion setting as state rather than reading it once, so a
 * viewer who changes the setting mid-session gets the right treatment without a
 * reload. Same shape as the guard in `cursor.tsx`.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/**
 * One case-study figure.
 *
 * Comparison sources carry their own BEFORE and AFTER labels, so the component
 * does not need a two-up mode to build the comparison itself.
 *
 * Everything but the hero lazy-loads: these live inside a modal that most visitors
 * never open, so they should cost nothing until it does.
 *
 * Stills are clickable and open in `FigureViewer`; videos are not. The rule is
 * deliberately "has no `video`" rather than "is currently showing a still",
 * because the three video figures fall back to stills under reduced motion and
 * keying off the motion preference would make them clickable only for some
 * visitors, which is an inconsistency for no gain.
 */
function Figure({
  shot,
  priority = false,
  onOpen,
}: {
  shot: CaseShot;
  priority?: boolean;
  onOpen?: (shot: CaseShot) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  /* `shot.src` is not a fallback of last resort here: under reduced motion it is
     the figure. The two are required to show the same thing for exactly that
     reason, so opting out of motion never costs the viewer content. */
  const showVideo = Boolean(shot.video) && !reducedMotion;
  const canOpen = Boolean(onOpen) && !shot.video;

  /* A button, not a div with a click handler: it lands in the tab order, answers
     Enter and Space for free, and the overlay's existing focus trap already
     collects `button:not([disabled])`. */
  const FrameTag = canOpen ? "button" : "div";

  return (
    <figure className="jn-case__figure">
      <FrameTag
        className="jn-case__figureFrame"
        {...(canOpen
          ? {
              type: "button" as const,
              onClick: () => onOpen?.(shot),
              "data-cursor": "view",
              "aria-label": `View larger: ${shot.alt}`,
            }
          : {})}
      >
        {showVideo ? (
          <video
            className="jn-case__figureVideo"
            src={shot.video}
            aria-label={shot.alt}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            /* The comparisons are authored at 1280 and land in an ~820px column,
               so ask for the full width: on a 2x screen that is the difference
               between legible phone UI inside them and mush. */
            sizes="(max-width: 900px) 92vw, 1280px"
          />
        )}

        {canOpen ? (
          <span className="jn-case__figureCue" aria-hidden="true">
            View larger
          </span>
        ) : null}
      </FrameTag>

      {shot.caption || shot.note ? (
        <figcaption className="jn-case__figureCaption">
          {shot.caption ? <span>{shot.caption}</span> : null}
          {shot.note ? (
            <span className="jn-case__figureNote">{shot.note}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * The reference hangs its hero on a single figure lifted to full weight inside
 * the sentence — same face, same size, weight alone. Falls back to the plain
 * string if the emphasis text is not found, so a copy edit cannot break it.
 */
function Emphasised({ text, emphasis }: { text: string; emphasis: string }) {
  const at = text.indexOf(emphasis);
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <strong>{emphasis}</strong>
      {text.slice(at + emphasis.length)}
    </>
  );
}
