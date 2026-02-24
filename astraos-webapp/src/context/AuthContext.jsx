import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("astraos_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [usersDb, setUsersDb] = useState(() => {
    const savedDb = localStorage.getItem("astraos_users_db");
    return savedDb ? JSON.parse(savedDb) : [];
  });

  useEffect(() => {
    localStorage.setItem("astraos_users_db", JSON.stringify(usersDb));
  }, [usersDb]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("astraos_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("astraos_user");
    }
  }, [user]);

  const login = (email, password) => {
    const existingUser = usersDb.find(
      (u) => u.email === email && u.password === password,
    );
    if (existingUser) {
      setUser(existingUser);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  };

  const signup = (name, email, password) => {
    if (usersDb.some((u) => u.email === email)) {
      return { success: false, error: "User already exists with this email" };
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    setUsersDb((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const changeUsername = (newName) => {
    if (user) {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      setUsersDb((prev) =>
        prev.map((u) => (u.id === user.id ? updatedUser : u)),
      );
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    changeUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
