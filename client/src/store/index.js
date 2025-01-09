import { create } from "zustand";
import { createAuthSlice } from "./slice/auth-slice";
import {createChatSlice} from "./slice/chat-slice";

 export const useAppStore = create((set, get) => ({
    ...createAuthSlice(set, get),
    ...createChatSlice(set, get),
  }));