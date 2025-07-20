import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useUserStore } from "../stores/eventStore";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null); // null = loading, false = unauth, true = auth
  const updateName = useUserStore((state) => state.updateName);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          console.log("User is authenticated", data);
          updateName(data.user.name); // <-- Fix here: access nested `user.name`
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.error("Error during auth check", error);
        setAuth(false);
      }
    };

    checkAuth();
  }, [updateName]);

  if (auth === null) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;
  return children;
}
