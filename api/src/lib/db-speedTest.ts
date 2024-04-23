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
  photoUrl?: string;
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

    if (!fs.existsSync(`${dir}/submissions.json`)) {
      fs.writeFileSync(`${dir}/submissions.json`, "[]");
    }
    const submissions = JSON.parse(
      fs.readFileSync(`${dir}/submissions.json`, "utf-8")
    );
    console.log("submissions", submissions.length);
    this.submissions = submissions;
  }

  saveSubmissions() {
    fs.writeFileSync(
      `${this.dir}/submissions.json`,
      JSON.stringify(this.submissions, null, 2)
    );
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
    this.saveSubmissions();
    return submission;
  }

  getStats() {
    const competitors = this.competitors.sort((a, b) =>
      a.id.localeCompare(b.id)
    );
    return {
      competitors: competitors.map((c) => ({
        ...c,
        totalSubmissions: this.submissions.filter(
          (s) => s.competitorId === c.id
        ).length,
        totalSuccessfulSubmissions: this.submissions.filter(
          (s) => s.competitorId === c.id && s.isSuccessful
        ).length,
        point: this.tasks.reduce((acc, task) => {
          const submission = this.submissions.find(
            (s) =>
              s.competitorId === c.id && s.taskId === task.id && s.isSuccessful
          );
          return acc + (submission ? task.point : 0);
        }, 0),
      })),
      tasks: this.tasks.map(this.removeSolutionFromTask).map((task) => {
        const submissions = this.submissions.filter(
          (s) => s.taskId === task.id
        );
        return {
          ...task,
          totalSubmissions: submissions.length,
          competitorsSubmission: competitors.reduce((acc: object, c) => {
            const competitorSubmissions = submissions.filter(
              (s) => s.competitorId === c.id
            );
            const competitorSubmissionstats = {
              totalSubmissions: competitorSubmissions.length,
              isSuccessful:
                competitorSubmissions.filter((s) => s.isSuccessful).length > 0,
            };
            return {
              ...acc,
              [c.id]: competitorSubmissionstats,
            };
          }, {}),
        };
      }),
      totalPoint: this.tasks.reduce((acc, task) => {
        return acc + task.point;
      }, 0),
    };
  }
}

module.exports = { DBSpeedTest };
