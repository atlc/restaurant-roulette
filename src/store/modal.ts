import { create } from 'zustand';
import { INITIAL_MODAL_STATE } from '../constants/restaurants';

interface ModalStore {
  title: string,
  message: string,
  isOpen: boolean,
  showButtons?: boolean,
  setTitle: (title: string) => void,
  setMessage: (message: string) => void,
  setIsOpen: (isOpen: boolean) => void,
  setShowButtons: (showButtons: boolean) => void,
  onConfirm: () => void,
  setOnConfirm: (onConfirm: () => void) => void,
  onCancel: () => void,
  launch: ({ title, message, showButtons, onConfirm }: { title: string, message: string, showButtons?: boolean, onConfirm?: () => void }) => void,
}

export const useModalStore = create<ModalStore>((set) => ({
  ...INITIAL_MODAL_STATE,
  setTitle: (title: string) => set({ title }),
  setMessage: (message: string) => set({ message }),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setShowButtons: (showButtons: boolean) => set({ showButtons }),
  setOnConfirm: (onConfirm: () => void) => set({ onConfirm, isOpen: false }),
  onCancel: () => {
    set({ isOpen: false })
  },
  launch: ({ title, message, showButtons, onConfirm }: { title: string, message: string, showButtons?: boolean, onConfirm?: () => void }) => {
    set({ title, message, showButtons, onConfirm, isOpen: true });
  }
}));