import type { Attachment } from 'svelte/attachments';

const DEFAULT_DELAY = 200;
const DEFAULT_DISTANCE = 0;

const defaultOptions = {
  delay: DEFAULT_DELAY,
  distance: DEFAULT_DISTANCE,
  disabled: false,
  immediate: true,
  cb: () => {},
};

export function infiniteScroll(options: InfiniteScrollOptions = defaultOptions): Attachment {
  return (element) => {
    const scrollEventTarget = getScrollEventTarget(element);
    const scrollEventListener = throttle(
      check.bind(null, { ...options, scrollEventTarget, element }),
      options.delay ?? DEFAULT_DELAY,
    );
    scrollEventTarget.addEventListener('scroll', scrollEventListener);
    if (options.immediate) {
      check({ ...options, scrollEventTarget, element });
    }

    return () => scrollEventTarget.removeEventListener('scroll', scrollEventListener);
  };
}

function throttle(fn: VoidFunction, delay: number) {
  let now: number;
  let lastExec: number;
  let timer: ReturnType<typeof setTimeout> | null;

  const execute = () => {
    fn();
    lastExec = now;
  };

  return function () {
    now = Date.now();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (lastExec) {
      const diff = delay - (now - lastExec);
      if (diff < 0) {
        execute();
      } else {
        timer = setTimeout(() => {
          execute();
        }, diff);
      }
    } else {
      execute();
    }
  };
}

function getScrollTop<T extends Element>(element: T | Window) {
  if (isWindow(element)) {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
  }

  return element.scrollTop;
}

function getScrollEventTarget(element: Element | null) {
  let currentNode = element;
  while (
    currentNode &&
    currentNode.tagName !== 'HTML' &&
    currentNode.tagName !== 'BODY' &&
    currentNode.nodeType === 1
  ) {
    const overflowY = getComputedStyle(currentNode).overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode;
    }
    currentNode = currentNode.parentElement;
  }
  return window;
}

function getVisibleHeight(element: Element | Window) {
  if (isWindow(element)) {
    return document.documentElement.clientHeight;
  } else {
    return element.clientHeight;
  }
}

function isWindow<T extends Element>(element: T | Window): element is Window {
  return element === window;
}

function getElementTop(element: Element | Window) {
  if (isWindow(element)) {
    return getScrollTop(window);
  } else {
    return element.getBoundingClientRect().top + getScrollTop(window);
  }
}

function check(
  {
    disabled,
    scrollEventTarget,
    element,
    distance,
    cb,
  }: InfiniteScrollOptions & {
    element: Element;
    scrollEventTarget: Element | Window;
  },
  force?: boolean,
) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('Must be HTMLElement');
  }
  if (force !== true && disabled) return;
  const viewportScrollTop = getScrollTop(scrollEventTarget);
  const viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget);

  let shouldTrigger = false;
  if (scrollEventTarget === element) {
    shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;
  } else {
    const elementBottom =
      getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop;

    shouldTrigger = viewportBottom + distance >= elementBottom;
  }
  if (shouldTrigger && cb) {
    cb();
  }
}

type VoidFunction = () => void;

type InfiniteScrollOptions = {
  delay?: number;
  distance: number;
  disabled: boolean;
  immediate: boolean;
  cb: VoidFunction;
};
