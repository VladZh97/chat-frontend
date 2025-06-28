import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

type Step = 'idle' | 'website' | 'content';

interface IState {
  step: Step;
  website: string;
}

interface IActions {
  setStep: (value: Step) => void;
  setWebsite: (value: string) => void;
  reset: () => void;
}

const initState: IState = {
  step: 'idle',
  website: '',
};

export const useDashboardStore = create<IState & IActions>((set, get) => ({
  ...initState,
  setStep: step => set({ step }),
  setWebsite: website => set({ website }),
  reset: () => set(initState),
}));

export const useDashboardStoreShallow = <U>(selector: (store: IState & IActions) => U) => {
  return useDashboardStore(useShallow(selector));
};
