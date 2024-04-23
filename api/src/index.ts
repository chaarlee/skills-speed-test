import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const secret = req.headers["sst-secret"] as string;
  if (secret) {
    // @TODO handle typescript error
    // req.secret = secret;
  }
  next();
});

const { DBSpeedTest } = require("./lib/db-speedTest.ts");
const DB = new DBSpeedTest(path.join(__dirname, "db/"));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/health", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

app.post("/login", (req: Request, res: Response) => {
  const { secret } = req.body;
  const competitor = DB.getCompetitorBySecret(secret);
  if (!competitor) {
    res.status(401).send("Invalid secret");
    return;
  }
  res.send("OK");
});

app.get("/competitor", (req: Request, res: Response) => {
  const secret = req.headers["sst-secret"] as string;
  // const secret = req.secret;
  const competitor = DB.getCompetitorBySecret(secret);
  // console.log("competitor", competitor);
  if (!competitor) {
    res.status(401).send("Invalid secret");
    return;
  }
  res.json(competitor);
});

app.get("/stats", (req: Request, res: Response) => {
  res.json(DB.getStats());
});

app.get("/tasksWithSubmissions", (req: Request, res: Response) => {
  const secret = req.headers["sst-secret"] as string;
  res.json(DB.getTasksWithSubmissions(secret));
});

app.post("/submitSubmission", (req: Request, res: Response) => {
  const secret = req.headers["sst-secret"] as string;
  const competitor = DB.getCompetitorBySecret(secret);
  if (!competitor) {
    res.status(401).send("Invalid secret");
    return;
  }
  const taskId = req.body.taskId;
  const submittedSolution = req.body.submittedSolution;
  const submission = DB.submitSubmission(
    competitor.id,
    taskId,
    submittedSolution
  );
  res.json(submission);
});

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
