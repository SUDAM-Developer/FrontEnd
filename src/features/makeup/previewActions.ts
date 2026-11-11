import type { MakeupActions } from './types';
export function createPreviewActions(scenario?: string): MakeupActions {
  let attempt = 0;
  async function work(signal: AbortSignal) {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => {
          signal.removeEventListener('abort', abort);
          resolve();
        },
        scenario === 'loading' ? 3000 : 650,
      );
      function abort() {
        clearTimeout(timer);
        reject(new Error('Aborted'));
      }
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort();
    });
    if (scenario === 'error' && ++attempt === 1) throw new Error('Preview failure');
  }
  return {
    registerCancellation: async (_, signal) => work(signal),
    shareCandidates: async (_, __, signal) => {
      await work(signal);
      return scenario === 'share-cancelled' ? 'cancelled' : 'unavailable';
    },
    rescheduleTime: async (_, __, signal) => work(signal),
  };
}
