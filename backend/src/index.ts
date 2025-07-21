import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import eventRouter from "./routes/event.route";
import authRoute from "./routes/auth.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust the first proxy (for netlify)
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin:process.env.frontend_url, // your frontend origin
    credentials: true, // allow cookies
  })
);

// Use session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: true, // true if using HTTPS
      httpOnly: true,
      sameSite: "none", // 'none' for cross-site requests, 'lax' for same-site
    },
  })
);

app.use(express.json());

// Extended session type to include our fields (tokens, state)
declare module "express-session" {
  interface SessionData {
    state?: string;
    tokens?: any;
    userId?: string;
  }
}

app.use((req:Request,res:Response,next:NextFunction)=>{
  console.log("state-"+req.session?.state+"\n");
  console.log("tokens-"+req.session?.tokens+"\n");
  console.log("userId-"+req.session?.userId+"\n");

  next();
})

app.get("/",(req: Request, res: Response) => {
  res.send("Welcome to the Custom Event Calendar API");
});


app.use("/api/v1/events", eventRouter);

authRoute(app);


mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
