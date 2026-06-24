import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // must be true — sends the cookie cross-origin
  }),
);

app.use(express.json());

app.use(
  session({
    // connect-mongo reads the same MONGO_URI and creates a sessions collection
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24, // auto-expire docs after 24 h (in seconds)
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // don't save empty sessions
    cookie: {
      httpOnly: true, // inaccessible to JS — blocks XSS cookie theft
      secure: false, // flip to true when on HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24 h in ms
    },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(5000, () => console.log("Server on http://localhost:5000"));
