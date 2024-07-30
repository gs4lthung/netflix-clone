import { create } from "zustand";

export const useContentStore=create((set)=>({
    contentType:"movie",
    setContentType:(type: string)=>set({contentType:type})
}))