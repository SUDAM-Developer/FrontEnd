import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
type Profile = { name: string; subjects: string[] };
type State = {
  agreed: boolean[];
  setAgreed: Dispatch<SetStateAction<boolean[]>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
};
const Context = createContext<State | null>(null);
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [agreed, setAgreed] = useState([false, false, false]);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile>({ name: '', subjects: [] });
  const [editing, setEditing] = useState(false);
  return (
    <Context.Provider
      value={{
        agreed,
        setAgreed,
        name,
        setName,
        selected,
        setSelected,
        profile,
        setProfile,
        editing,
        setEditing,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useOnboarding() {
  const value = useContext(Context);
  if (!value) throw new Error('OnboardingProvider is required');
  return value;
}
