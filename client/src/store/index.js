import { create } from "zustand";
import { createAuthSlice } from "./slice/auth-slice";

 export const useAppStore = create((set, get) => ({
    ...createAuthSlice(set, get),
  }));