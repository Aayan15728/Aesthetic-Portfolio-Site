"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const INTERACTIVE = 'a[href], button, [role="button"], [role="tab"], summary, label[for], [data-cursor]';
// places where the system cursor must stay (text caret, native controls)
const NATIVE = 'input, textarea, select, [contenteditable="true"], [data-native-cursor]';

// the arrow's tip, in CSS pixels from the top-left of the element: this point sits exactly on the mouse
const TIP_X = 4;
const TIP_Y = 3;

/**
 * A smooth replacement for the system arrow: a rounded, black pointer with its tip at the top-left, a straight left
 * edge like a normal system cursor, and a light ring (readable on any
 * background, no shadows). It tracks the mouse almost instantly, leans slightly into the direction you move,
 * grows over clickable things, and presses in with a ring on click. A small label trails behind it and names
 * what you're about to do ("Open", "Drag", or any [data-cursor] text).
 *
 * Only active for a real mouse (fine pointer + hover). Touch devices, text fields and anywhere marked
 * [data-native-cursor] keep the system cursor, and without JavaScript nothing changes.
 */
export function SiteCursor() {
  const root = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const lean = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const labelText = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rootEl = root.current;
    const arrowEl = arrow.current;
    const leanEl = lean.current;
    const bodyEl = body.current;
    const labelEl = label.current;
    const textEl = labelText.current;
    const ringEl = ring.current;
    if (!rootEl || !arrowEl || !leanEl || !bodyEl || !labelEl || !textEl || !ringEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;

    // the arrow follows tightly; the label trails more loosely
    const arrowX = gsap.quickTo(arrowEl, "x", { duration: reduce ? 0 : 0.12, ease: "power3.out" });
    const arrowY = gsap.quickTo(arrowEl, "y", { duration: reduce ? 0 : 0.12, ease: "power3.out" });
    const labelX = gsap.quickTo(labelEl, "x", { duration: reduce ? 0 : 0.42, ease: "power3.out" });
    const labelY = gsap.quickTo(labelEl, "y", { duration: reduce ? 0 : 0.42, ease: "power3.out" });
    // lean rotates around the tip so the tip never drifts off the pointer
    gsap.set(leanEl, { transformOrigin: `${TIP_X}px ${TIP_Y}px` });
    const leanTo = gsap.quickTo(leanEl, "rotation", { duration: 0.35, ease: "power3.out" });

    let shown = false;
    let inField = false;
    let settle = 0;
    const state = { x: -100, y: -100 };

    const setVisible = (visible: boolean) => {
      gsap.to(rootEl, { opacity: visible ? 1 : 0, duration: reduce ? 0 : 0.2, overwrite: "auto" });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      state.x = event.clientX;
      state.y = event.clientY;
      if (!shown) {
        // first move: appear in place instead of flying in from the corner
        shown = true;
        gsap.set([arrowEl, labelEl], { x: state.x, y: state.y });
        if (!inField) setVisible(true);
      }
      arrowX(state.x);
      arrowY(state.y);
      labelX(state.x + 18);
      labelY(state.y + 28);

      if (!reduce) {
        // kept small, so the pointer never looks like it's standing upright
        leanTo(Math.max(-8, Math.min(8, event.movementX * 0.8)));
        window.clearTimeout(settle);
        settle = window.setTimeout(() => leanTo(0), 90);
      }
    };

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      inField = !!target.closest(NATIVE);
      if (shown) setVisible(!inField);

      const drag = target.closest("canvas.lanyard-canvas");
      const custom = target.closest("[data-cursor]");
      const link = target.closest("a[href]");
      const interactive = !!target.closest(INTERACTIVE) || !!drag;

      const text = custom?.getAttribute("data-cursor") ?? (drag ? "Drag" : link ? "Open" : "");
      textEl.textContent = text;
      labelEl.dataset.show = text ? "true" : "false";
      bodyEl.dataset.hover = interactive ? "true" : "false";
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      bodyEl.dataset.press = "true";
      if (reduce) return;
      gsap.fromTo(
        ringEl,
        { x: event.clientX, y: event.clientY, scale: 0.3, opacity: 0.55 },
        { scale: 1.6, opacity: 0, duration: 0.55, ease: "power2.out", overwrite: true }
      );
    };

    const onUp = () => {
      bodyEl.dataset.press = "false";
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => {
      if (shown && !inField) setVisible(true);
    };

    html.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      html.classList.remove("has-custom-cursor");
      window.clearTimeout(settle);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      gsap.killTweensOf([rootEl, arrowEl, leanEl, labelEl, ringEl]);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="site-cursor">
      <div ref={ring} className="site-cursor__ring" />
      <div ref={arrow} className="site-cursor__arrow">
        <div ref={lean}>
          <div ref={body} className="site-cursor__body" data-hover="false" data-press="false">
            <svg width="28" height="31" viewBox="0 0 40 44" fill="none">
              {/* rounded pointer with a notch: black fill, light ring */}
              <path
                d="M5.7 4.3 5.7 37 14.5 29 31 28.5Z"
                fill="#0a0a0a"
                stroke="#ececec"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div ref={label} className="site-cursor__label" data-show="false">
        <span ref={labelText} />
      </div>
    </div>
  );
}
