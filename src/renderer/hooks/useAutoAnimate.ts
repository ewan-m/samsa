import { RefObject, useEffect, useRef } from "react";

interface Coordinates {
  top: number;
  left: number;
  width: number;
  height: number;
}
const parents = new Set<Element>();
const coords = new WeakMap<Element, Coordinates>();
const siblings = new WeakMap<Element, [prev: Node | null, next: Node | null]>();
const animations = new WeakMap<Element, Animation>();
const intersections = new WeakMap<Element, IntersectionObserver>();
const intervals = new WeakMap<Element, number>();
const options = new WeakMap<Element, AutoAnimateOptions>();
const debounces = new WeakMap<Element, number>();
let root: HTMLElement;
const TGT = "__aa_tgt";
const DEL = "__aa_del";

const handleMutations: MutationCallback = (mutations) => {
  const elements = getElements(mutations);
  // If elements is "false" that means this mutation that should be ignored.
  if (elements) {
    elements.forEach((el) => animate(el));
  }
};

const handleResizes: ResizeObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.target === root) updateAllPos();
    if (coords.has(entry.target)) updatePos(entry.target);
  });
};

function observePosition(el: Element) {
  const oldObserver = intersections.get(el);
  oldObserver?.disconnect();
  let rect = coords.get(el);
  let invocations = 0;
  const buffer = 5;
  if (!rect) {
    rect = getCoords(el);
    coords.set(el, rect);
  }
  const { offsetWidth, offsetHeight } = root;
  const rootMargins = [
    rect.top - buffer,
    offsetWidth - (rect.left + buffer + rect.width),
    offsetHeight - (rect.top + buffer + rect.height),
    rect.left - buffer,
  ];
  const rootMargin = rootMargins
    .map((px) => `${-1 * Math.floor(px)}px`)
    .join(" ");
  const observer = new IntersectionObserver(
    () => {
      ++invocations > 1 && updatePos(el);
    },
    {
      root,
      threshold: 1,
      rootMargin,
    }
  );
  observer.observe(el);
  intersections.set(el, observer);
}

function updatePos(el: Element) {
  clearTimeout(debounces.get(el)!);
  const options = getOptions(el);
  const delay = options.duration;
  debounces.set(
    el,
    window.setTimeout(() => {
      const currentAnimation = animations.get(el);
      if (!currentAnimation || currentAnimation.finished) {
        coords.set(el, getCoords(el));
        observePosition(el);
      }
    }, delay)
  );
}

function updateAllPos() {
  clearTimeout(debounces.get(root)!);
  debounces.set(
    root,
    window.setTimeout(() => {
      parents.forEach((parent) =>
        forEach(parent, (el) => lowPriority(() => updatePos(el)))
      );
    }, 100)
  );
}

function poll(el: Element) {
  setTimeout(() => {
    intervals.set(
      el,
      window.setInterval(() => lowPriority(updatePos.bind(null, el)), 2000)
    );
  }, Math.round(2000 * Math.random()));
}

function lowPriority(callback: CallableFunction) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(() => callback());
  } else {
    requestAnimationFrame(() => callback());
  }
}

let mutations: MutationObserver | undefined;

let resize: ResizeObserver | undefined;

if (typeof window !== "undefined") {
  root = document.documentElement;
  mutations = new MutationObserver(handleMutations);
  resize = new ResizeObserver(handleResizes);
  resize.observe(root);
}

function getElements(mutations: MutationRecord[]): Set<Element> | false {
  return mutations.reduce((elements: Set<Element> | false, mutation) => {
    // Short circuit if we find a purposefully deleted node.
    if (elements === false) return false;

    if (mutation.target instanceof Element) {
      target(mutation.target);
      if (!elements.has(mutation.target)) {
        elements.add(mutation.target);
        for (let i = 0; i < mutation.target.children.length; i++) {
          const child = mutation.target.children.item(i);
          if (!child) continue;
          if (DEL in child) return false;
          target(mutation.target, child);
          elements.add(child);
        }
      }
      if (mutation.removedNodes.length) {
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const child = mutation.removedNodes[i];
          if (DEL in child) return false;
          if (child instanceof Element) {
            elements.add(child);
            target(mutation.target, child);
            siblings.set(child, [
              mutation.previousSibling,
              mutation.nextSibling,
            ]);
          }
        }
      }
    }
    return elements;
  }, new Set<Element>());
}

function target(el: Element, child?: Element) {
  if (!child && !(TGT in el)) Object.defineProperty(el, TGT, { value: el });
  else if (child && !(TGT in child))
    Object.defineProperty(child, TGT, { value: el });
}

function animate(el: Element) {
  const isMounted = root.contains(el);
  const preExisting = coords.has(el);
  if (isMounted && siblings.has(el)) siblings.delete(el);
  if (animations.has(el)) {
    animations.get(el)?.cancel();
  }
  if (preExisting && isMounted) {
    remain(el);
  } else if (preExisting && !isMounted) {
    remove(el);
  } else {
    add(el);
  }
}

function raw(str: string): number {
  return Number(str.replace(/[^0-9.\-]/g, ""));
}

function getCoords(el: Element): Coordinates {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}

function getTransitionSizes(
  el: Element,
  oldCoords: Coordinates,
  newCoords: Coordinates
) {
  let widthFrom = oldCoords.width;
  let heightFrom = oldCoords.height;
  let widthTo = newCoords.width;
  let heightTo = newCoords.height;
  const styles = getComputedStyle(el);
  const sizing = styles.getPropertyValue("box-sizing");

  if (sizing === "content-box") {
    const paddingY =
      raw(styles.paddingTop) +
      raw(styles.paddingBottom) +
      raw(styles.borderTopWidth) +
      raw(styles.borderBottomWidth);
    const paddingX =
      raw(styles.paddingLeft) +
      raw(styles.paddingRight) +
      raw(styles.borderRightWidth) +
      raw(styles.borderLeftWidth);
    widthFrom -= paddingX;
    widthTo -= paddingX;
    heightFrom -= paddingY;
    heightTo -= paddingY;
  }

  return [widthFrom, widthTo, heightFrom, heightTo].map(Math.round);
}

function getOptions(el: Element): AutoAnimateOptions {
  return TGT in el && options.has((el as Element & { __aa_tgt: Element })[TGT])
    ? options.get((el as Element & { __aa_tgt: Element })[TGT])!
    : { duration: 250, easing: "ease-in-out" };
}

function forEach(
  parent: Element,
  ...callbacks: Array<(el: Element, isRoot?: boolean) => void>
) {
  callbacks.forEach((callback) => callback(parent, options.has(parent)));
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children.item(i);
    if (child) {
      callbacks.forEach((callback) => callback(child, options.has(child)));
    }
  }
}

function remain(el: Element) {
  const oldCoords = coords.get(el);
  const newCoords = getCoords(el);
  let animation: Animation;
  if (!oldCoords) return;
  const pluginOrOptions = getOptions(el);
  const deltaX = oldCoords.left - newCoords.left;
  const deltaY = oldCoords.top - newCoords.top;
  const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(
    el,
    oldCoords,
    newCoords
  );
  const start: Record<string, any> = {
    transform: `translate(${deltaX}px, ${deltaY}px)`,
  };
  const end: Record<string, any> = {
    transform: `translate(0, 0)`,
  };
  if (widthFrom !== widthTo) {
    start.width = `${widthFrom}px`;
    end.width = `${widthTo}px`;
  }
  if (heightFrom !== heightTo) {
    start.height = `${heightFrom}px`;
    end.height = `${heightTo}px`;
  }
  animation = el.animate([start, end], pluginOrOptions);
  animations.set(el, animation);
  coords.set(el, newCoords);
  animation.addEventListener("finish", updatePos.bind(null, el));
}

function add(el: Element) {
  const newCoords = getCoords(el);
  coords.set(el, newCoords);
  const pluginOrOptions = getOptions(el);
  let animation: Animation;
  animation = el.animate(
    [
      { transform: "scale(0.9)", opacity: 0 },
      { transform: "scale(0.95)", opacity: 0, offset: 0.5 },
      { transform: "scale(1)", opacity: 1 },
    ],
    {
      duration: pluginOrOptions.duration * 1.5,
      easing: "ease-in",
    }
  );

  animations.set(el, animation);
  animation.addEventListener("finish", updatePos.bind(null, el));
}

function remove(el: Element) {
  if (!siblings.has(el) || !coords.has(el)) return;

  const [prev, next] = siblings.get(el)!;
  Object.defineProperty(el, DEL, { value: true });
  if (next && next.parentNode && next.parentNode instanceof Element) {
    next.parentNode.insertBefore(el, next);
  } else if (prev && prev.parentNode) {
    prev.parentNode.appendChild(el);
  }
  const [top, left, width, height] = deletePosition(el);
  const options = getOptions(el);
  let animation: Animation;
  Object.assign((el as HTMLElement).style, {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    margin: 0,
    pointerEvents: "none",
    transformOrigin: "center",
    zIndex: 100,
  });
  animation = el.animate(
    [
      {
        transform: "scale(1)",
        opacity: 1,
      },
      {
        transform: "scale(0.9)",
        opacity: 0,
      },
    ],
    { duration: options.duration, easing: "ease-out" }
  );

  animations.set(el, animation);
  animation.addEventListener("finish", () => {
    el.remove();
    coords.delete(el);
    siblings.delete(el);
    animations.delete(el);
    intersections.get(el)?.disconnect();
  });
}

function deletePosition(
  el: Element
): [top: number, left: number, width: number, height: number] {
  const oldCoords = coords.get(el)!;
  const [width, , height] = getTransitionSizes(el, oldCoords, getCoords(el));

  let offsetParent: Element | null = el.parentElement;
  while (
    offsetParent &&
    (getComputedStyle(offsetParent).position === "static" ||
      offsetParent instanceof HTMLBodyElement)
  ) {
    offsetParent = offsetParent.parentElement;
  }
  if (!offsetParent) offsetParent = document.body;
  const parentStyles = getComputedStyle(offsetParent);
  const parentCoords = coords.get(offsetParent) || getCoords(offsetParent);
  const top =
    Math.round(oldCoords.top - parentCoords.top) -
    raw(parentStyles.borderTopWidth);
  const left =
    Math.round(oldCoords.left - parentCoords.left) -
    raw(parentStyles.borderLeftWidth);
  return [top, left, width, height];
}

interface AutoAnimateOptions {
  duration: number;
  easing: "linear" | "ease-in" | "ease-out" | "ease-in-out" | string;
}

function autoAnimate(
  el: HTMLElement,
  config: Partial<AutoAnimateOptions> = {}
) {
  if (mutations && resize) {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    if (getComputedStyle(el).position === "static") {
      Object.assign(el.style, { position: "relative" });
    }
    forEach(el, updatePos, poll, (element) => resize?.observe(element));
    options.set(el, { duration: 250, easing: "ease-in-out", ...config });
    mutations.observe(el, { childList: true });
    parents.add(el);
  }
}

export const useAutoAnimate = <T extends Element>(): RefObject<T> => {
  const element = useRef<T>(null);
  useEffect(() => {
    if (element.current instanceof HTMLElement)
      autoAnimate(element.current, { duration: 150 });
  }, [element]);
  return element;
};
