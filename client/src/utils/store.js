import { create } from "zustand";

export const userStore = create((set) => ({
    token: null,
    userType: null,
    setToken: (id) => set((_) => ({ token: id })),
    setType: (type) => set((_) => ({ userType: type })),
    removeUser: () => set((_) => ({ token: null, userType: null })),
  }));