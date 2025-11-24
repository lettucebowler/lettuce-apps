import { toast } from 'svoast';
const baseToastStyles =
  'border-radius: 0.5rem; color: var(--color-snow-300); background: var(--color-charade-800); padding: 1rem 1.5rem; font-size: 18px;';

export function toastError(message: string, opts?: { id: string | undefined }) {
  toast.error(message, {
    duration: 4000,
  });
}

export function toastSuccess(message: string, opts?: { id: string | undefined }) {
  toast.success(message);
}

export function toastLoading(message: string, opts?: { id: string | undefined } | undefined) {
  // return toast.loading(message, {
  //   style: baseToastStyles,
  //   id: opts ? opts.id : undefined,
  //   iconTheme: {
  //     primary: 'var(--snow-300)',
  //     secondary: 'var(--color-charade-300)',
  //   },
  // });
  return 'h';
}

export function toastPromise({
  promise,
  loadingText,
  successText,
  errorText,
}: {
  promise: Promise<any>;
  loadingText: string;
  successText: string;
  errorText: string;
}) {
  return toast.promise(promise, {
    loading: loadingText,
    success: successText,
    error: errorText,
  });
}
