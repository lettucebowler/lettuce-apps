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

    $effect(() => {
      activeKeyListeners.add(element);
      document.addEventListener('keydown', handleKeydown);

      return () => {
        activeKeyListeners.delete(element);
        document.removeEventListener('keydown', handleKeydown);
      };
    });
  };
}
