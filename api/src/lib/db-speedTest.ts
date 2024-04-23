import fs from "fs";
import _ from "lodash";

export type Task = {
  id: number;
  name: string;
  description: string;
  input: string;
  solution: string;
  point: number;
};

export type TaskWithoutSolution = Omit<Task, "solution">;

export type Competitor = {
  id: string;
  name: string;
  nationality: string;
  workstation?: string;
  secret: string;
};

export type Submission = {
  id: number;
  taskId: number;
  competitorId: string;
  submittedSolution: string;
  isSuccessful: boolean;
  createdAt: string;
};

class DBSpeedTest {
  dir: string;
  tasks: Task[];
  competitors: Competitor[];
  submissions: Submission[];

  constructor(dir: string) {
    this.dir = dir;
    const competitors = JSON.parse(
      fs.readFileSync(`${dir}/competitors.json`, "utf-8")
    );
    console.log("competitors", competitors.length);
    this.competitors = competitors;

    const tasks = JSON.parse(fs.readFileSync(`${dir}/tasks.json`, "utf-8"));
    console.log("tasks", tasks.length);
    this.tasks = tasks.sort((a: Task, b: Task) => a.id - b.id);

    this.submissions = [];
  }

  removeSolutionFromTask(task: Task): TaskWithoutSolution {
    return {
      id: task.id,
      name: task.name,
      description: task.description,
      input: task.input,
      point: task.point,
    };
  }

  getCompetitorBySecret(secret: string): Competitor | undefined {
    return this.competitors.find((c) => c.secret === secret);
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  getTasks(): TaskWithoutSolution[] {
    return this.tasks.map(this.removeSolutionFromTask);
  }

  getTasksWithSubmissions(secret: string): TaskWithoutSolution[] {
    const competitor = this.getCompetitorBySecret(secret);
    if (!competitor) {
      throw new Error("Invalid secret");
    }
    return this.tasks.map(this.removeSolutionFromTask).map((task) => {
      const submissions = this.submissions
        .filter((s) => s.taskId === task.id && s.competitorId === competitor.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return {
        ...task,
        submissions: submissions,
        isSolved: submissions.some((s) => s.isSuccessful),
      };
    });
  }

  checkSolution(solution: string, submittedSolution: string): boolean {
    return _.isEqual(JSON.parse(submittedSolution), JSON.parse(solution));
  }

  submitSubmission(
    competitorId: string,
    taskId: number,
    submittedSolution: string
  ): Submission {
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    const id = this.submissions.length + 1;
    const submission: Submission = {
      id,
      competitorId,
      taskId,
      submittedSolution: submittedSolution,
      isSuccessful: this.checkSolution(task.solution, submittedSolution),
      createdAt: new Date().toISOString(),
    };
    this.submissions.push(submission);
    return submission;
  }
}

module.exports = { DBSpeedTest };
