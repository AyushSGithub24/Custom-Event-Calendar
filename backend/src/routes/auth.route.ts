import { checkAuth, login, googleRedirect, logout } from "../controllers/auth.contoller";

export default function authRoute(app: any) {
  app.post("/logout",logout);

  app.get("/api/auth/check", checkAuth);

  app.get("/login", login);

  app.get( "/google/redirect", googleRedirect);
}
