import { useEffect, useState } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null); // null = loading, false = unauth, true = auth

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/check", {
      method: "GET",
      credentials: "include", // include cookies
    })
      .then((res) => {
        if (res.ok) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch(() => {
        setAuth(false);
      });
  }, []);

  if (auth === null) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;
  return children;
}
