import  { Request, Response } from "express";
import crypto from "crypto";
import { google } from "googleapis";
import { oauth2Client, scopes } from "../config/googleConfig";
import { User } from "../Models/user.model";

export const logout=(req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid"); // default cookie name
      res.status(200).json({ message: "Logged out" });
    });
  }

export const checkAuth = async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    const user = await User.findById(req.session.userId).select(
      "displayName email"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Authenticated",
      user: {
        name: user.displayName,
        email: user.email,
      },
    });
  }  


export const login=(req: Request, res: Response) => {
    const state = crypto.randomBytes(32).toString("hex");
    req.session.state = state;

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
      state: state,
    });

    res.redirect(authorizationUrl);
  }

export const googleRedirect= async (req: Request, res: Response) => {
      const code = req.query.code as string;
      const state = req.query.state as string;

      if (state !== req.session.state) {
        return res.status(400).send("Invalid state parameter");
      }

      try {
        const data = await oauth2Client.getToken(code);
        const tokens = data.tokens;
        oauth2Client.setCredentials(tokens);
        req.session.tokens = tokens;

        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data: profile } = await oauth2.userinfo.get();

        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          user.accessToken = tokens.access_token ?? "";
          if (tokens.refresh_token) {
            user.refreshToken = tokens.refresh_token ?? "";
          }
          await user.save();
          console.log("Existing user updated:", user.email);
        } else {
          user = new User({
            googleId: profile.id,
            displayName: profile.name,
            email: profile.email,
            accessToken: tokens.access_token ?? "",
            refreshToken: tokens.refresh_token ?? "",
          });
          await user.save();
          console.log("New user created:", user.email);
        }

        req.session.userId = user._id as string;

        // res.redirect(process.env.frontend_url || "http://localhost:5173" );
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            return res.status(500).send("Failed to save session");
          }

          // Now that the session is saved, we can safely redirect
          res.redirect(process.env.frontend_url || "http://localhost:5173");
        });
      } catch (err) {
        console.error("Error getting tokens:", err);
        res.status(500).send("Authentication failed");
      }
    }