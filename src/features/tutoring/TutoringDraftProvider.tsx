import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { OperationPreferences } from './operation';
type Draft = {
  operation: OperationPreferences | null;
  setOperation: Dispatch<SetStateAction<OperationPreferences | null>>;
};
const Context = createContext<Draft | null>(null);
export function TutoringDraftProvider({ children }: { children: ReactNode }) {
  const [operation, setOperation] = useState<OperationPreferences | null>(null);
  return <Context.Provider value={{ operation, setOperation }}>{children}</Context.Provider>;
}
export function useTutoringDraft() {
  const value = useContext(Context);
  if (!value) throw new Error('TutoringDraftProvider is required');
  return value;
}
