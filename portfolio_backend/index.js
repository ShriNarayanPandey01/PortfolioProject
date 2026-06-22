import crypto from "node:crypto";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { portfolioData } from "./data/portfolioData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..", "portfolio");
const distPath = path.join(frontendRoot, "dist");
const publicPath = path.join(frontendRoot, "public");
const messagesPath = path.join(__dirname, "data", "messages.json");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(publicPath));
app.use(express.static(distPath));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "portfolio-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/portfolio", (_req, res) => {
  res.json(portfolioData);
});

app.get("/api/projects/backend", (_req, res) => {
  res.json(portfolioData.backendProjects);
});

app.get("/api/profiles", (_req, res) => {
  res.json(portfolioData.codingProfiles);
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      ok: false,
      error: "name, email, and message are required",
    });
  }

  const submission = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = await fs.readFile(messagesPath, "utf8");
    const messages = JSON.parse(raw);
    messages.push(submission);
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));

    return res.status(201).json({
      ok: true,
      message: "Message received successfully.",
      submission,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Could not store the contact message.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Portfolio API listening on http://localhost:${port}`);
});
