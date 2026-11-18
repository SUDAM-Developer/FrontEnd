import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ApiError } from '@/apis/client';
export type Resource<T> =
  { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error'; message: string };
export function apiMessage(error: unknown) {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403))
    return '로그인이 필요하거나 접근 권한이 없어요. 다시 로그인해 주세요.';
  return error instanceof Error ? error.message : '연결이 불안정해요. 다시 시도해 주세요.';
}
/** 화면 재진입 시 다시 조회하며 이전 요청·늦게 도착한 응답을 폐기합니다. */
export function useApiResource<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<Resource<T>>({ status: 'loading' });
  const [version, setVersion] = useState(0);
  const generation = useRef(0);
  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      const current = (generation.current = Math.max(generation.current + 1, version));
      setState({ status: 'loading' });
      load(controller.signal)
        .then((data) => {
          if (!controller.signal.aborted && current === generation.current)
            setState({ status: 'ready', data });
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted && current === generation.current)
            setState({ status: 'error', message: apiMessage(error) });
        });
      return () => controller.abort();
    }, [load, version]),
  );
  const retry = useCallback(() => setVersion((value) => value + 1), []);
  return { state, retry };
}
