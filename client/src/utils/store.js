import { create } from "zustand";

export const userStore = create((set) => ({
    userID: null,
    setID: (id) => set((_) => ({ userID: id })),
    removeID: () => set((_) => ({ userID: null })),
  }));