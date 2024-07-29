import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.listen(4444, () => {
  console.log("Server started at http://localhost:4444");
  console.log("Press Ctrl + C to quit.");
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/v1/auth", authRoutes);
