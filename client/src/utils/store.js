import { create } from "zustand";

export const userStore = create((set) => ({
    userID: null,
    userType: null,
    setID: (id) => set((_) => ({ userID: id })),
    setType: (type) => set((_) => ({ userType: type })),
    removeUser: () => set((_) => ({ userID: null, userType: null })),
  }));