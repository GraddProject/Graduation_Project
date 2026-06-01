import { createContext, useState } from "react";

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
const [token, setToken] = useState(() => localStorage.getItem("token"));

const [user, setUser] = useState(() => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
});

  function saveUser(data) {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser: saveUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}