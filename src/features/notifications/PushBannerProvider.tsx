import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PushBanner } from '@/components/PushBanner';
export type BannerNotification = {
  id?: string;
  title: string;
  message: string;
  timeLabel?: string;
  /** 기본 5초. 0이면 자동으로 닫지 않습니다. */ durationMs?: number;
  onPress?: () => void;
};
type Entry = BannerNotification & { id: string; revision: number };
type ContextValue = {
  show: (notification: BannerNotification) => string;
  dismiss: (id?: string) => void;
};
const Context = createContext<ContextValue | null>(null);
const MAX_QUEUE = 5;
export function PushBannerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Entry[]>([]);
  const [appState, setAppState] = useState(AppState.currentState);
  const sequence = useRef(0);
  const active = queue[0];
  const insets = useSafeAreaInsets();
  const show = useCallback((notification: BannerNotification) => {
    const revision = ++sequence.current;
    const id = notification.id?.trim() || `banner-${revision}`;
    const entry = { ...notification, id, revision };
    if (!notification.title.trim()) return id;
    setQueue((current) => {
      const exists = current.some((item) => item.id === id);
      return exists
        ? current.map((item) => (item.id === id ? entry : item))
        : [...current, entry].slice(0, MAX_QUEUE);
    });
    return id;
  }, []);
  const dismiss = useCallback(
    (id?: string) =>
      setQueue((current) => (id ? current.filter((item) => item.id !== id) : current.slice(1))),
    [],
  );
  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);
  useEffect(() => {
    if (!active || appState !== 'active') return;
    const duration = active.durationMs ?? 5000;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const timer = setTimeout(() => dismiss(active.id), duration);
    return () => clearTimeout(timer);
  }, [active, appState, dismiss]);
  return (
    <Context.Provider value={{ show, dismiss }}>
      {children}
      {active && appState === 'active' && (
        <View pointerEvents="box-none" style={[s.layer, { top: insets.top + 12 }]}>
          <View pointerEvents="box-none" style={s.width}>
            <PushBanner
              title={active.title}
              message={active.message}
              timeLabel={active.timeLabel}
              onDismiss={() => dismiss(active.id)}
              onPress={() => {
                dismiss(active.id);
                active.onPress?.();
              }}
            />
          </View>
        </View>
      )}
    </Context.Provider>
  );
}
export function usePushBanner() {
  const context = useContext(Context);
  if (!context) throw new Error('PushBannerProvider is required');
  return context;
}
const s = StyleSheet.create({
  layer: { position: 'absolute', left: 0, right: 0, zIndex: 1000, alignItems: 'center' },
  width: { width: '100%', maxWidth: 390, paddingHorizontal: 10 },
});
