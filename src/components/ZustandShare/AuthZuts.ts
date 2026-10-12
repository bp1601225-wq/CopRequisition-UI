import { create } from "zustand";
import API, { handleAxiosError } from "../configuration/API";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthType = {
    currentUser: User | null;
    
  token: string | null;

  Login: (email: string, password: string) => Promise<boolean>;
  Logout: () => Promise<void>;
};

export const useAuthStore = create<AuthType>((set) => ({
//   currentUser: null,
currentUser: JSON.parse(localStorage.getItem("user") || "null"),

  token: localStorage.getItem("token"),

  Login: async (email, password) => {
    try {
      const response = await API.post("/authenticate", {
        email,
        password,
      });


      console.log(response)

      
      const { data, success } = response.data

      const {token, user} = data

//   console.log(user, token)

     if (success === true) {
  console.log("USER FROM BACKEND:", user);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  set({
    token,
    currentUser: user,
  });

  console.log("SAVED USER:", user);

//   toast.success("You are welcome back bro");

  return true;
}

      return false;

    } catch (error) {
      handleAxiosError(error);

      return false;
    }
  },

  Logout: async () => {
    localStorage.removeItem("token");

    set({
      token: null,
      currentUser: null,
    });
  },
}));