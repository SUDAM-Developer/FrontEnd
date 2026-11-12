import { useCallback, useEffect, useRef, useState } from 'react';
/** 중복 요청, 화면 종료 후 상태 반영을 막는 저장 경계입니다. */
export function useSubmission() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const active = useRef(true);
  const locked = useRef(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      controller.current?.abort();
    };
  }, []);
  const run = useCallback(
    async <T>(save: (signal: AbortSignal) => Promise<T>, success: (value: T) => void) => {
      if (locked.current) return;
      locked.current = true;
      setPending(true);
      setError(false);
      const request = new AbortController();
      controller.current = request;
      try {
        const value = await save(request.signal);
        if (active.current && !request.signal.aborted) success(value);
      } catch {
        if (active.current && !request.signal.aborted) setError(true);
      } finally {
        locked.current = false;
        if (active.current) setPending(false);
      }
    },
    [],
  );
  return { pending, error, clearError: () => setError(false), run };
}
