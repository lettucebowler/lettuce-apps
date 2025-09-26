import type { Attachment } from 'svelte/attachments';

const activeKeyListeners: Set<Element> = new Set();

export function escapeKey(callback: (event: KeyboardEvent) => void): Attachment {
  return (element) => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        const elements = Array.from(activeKeyListeners);
        const topmostElement = elements[elements.length - 1];
        if (element === topmostElement) {
          callback(event);
        }
      }
    }

    activeKeyListeners.add(element);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      activeKeyListeners.delete(element);
      document.removeEventListener('keydown', handleKeydown);
    };
  };
}

const focusableSelectors = ['a[href]', 'button', 'input', 'textarea', 'select', '[tabindex]:not([tabindex="-1"])'];
function getFocusableElements(element: Element) {
  return Array.from(element.querySelectorAll<HTMLElement>(focusableSelectors.join(','))).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
  );
}

export function focusTrap(): Attachment {
  return (element) => {
    function handleKeyDown(event: Event) {
      if (!(event instanceof KeyboardEvent)) {
        throw new Error('Event must be a KeyboardEvent');
      }
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(element);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    const focusableElements = getFocusableElements(element);
    focusableElements[0]?.focus();

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  };
}

export function outsideClick(callback: (event: MouseEvent) => void): Attachment {
  return (element) => {
    function handleClick(event: MouseEvent) {
      if (!element.contains(event.target as Node)) {
        callback(event);
      }
    }

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  };
}

type HotKeyOptions = {
  key: string;
  onKeydown: (event: KeyboardEvent) => void;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
};

export function hotKey(options: HotKeyOptions): Attachment {
  return (element) => {
    const { key, onKeydown, ctrlKey = false, metaKey = false, shiftKey = false, altKey = false } = options;

    function handleKeydown(event: Event) {
      if (!(event instanceof KeyboardEvent)) {
        throw new Error('Event must be a KeyboardEvent');
      }
      if (
        (event.key === key || (shiftKey && event.key === key.toUpperCase())) &&
        event.ctrlKey == ctrlKey &&
        event.metaKey == metaKey &&
        event.shiftKey == shiftKey &&
        event.altKey == altKey
      ) {
        event.preventDefault();
        onKeydown(event);
      }
    }

    element.addEventListener('keydown', handleKeydown, true);
    return () => element.removeEventListener('keydown', handleKeydown, true);
  };
}
