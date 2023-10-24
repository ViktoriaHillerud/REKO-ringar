import { create } from "zustand";

interface StoreUser {
  storeUser: string;
  setStoreUser: (storeUser: string) => void;
  authToken: string | null;
  setAuthToken: (authToken: string | null) => void;
}

const useStoreUser = create<StoreUser>((set) => ({
  storeUser: "",
  setStoreUser: (storeUser: string) => set({ storeUser }),
  authToken: null,
  setAuthToken: (authToken: string | null) => set({ authToken }),
}));

export default useStoreUser;
