import fs from "fs";

export type Task = {
  id: number;
  name: string;
  description: string;
  input: any;
  solution: any;
  point: number;
};

export type Competitor = {
  id: string;
  name: string;
  nationality: string;
  workstation?: string;
  secret: string;
};

export type Submission = {
  id: number;
  competitor: Competitor;
  taskId: number;
  competitorId: string;
  submittedSolution: any;
  isSuccessful: boolean;
  time: Date;
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
    this.tasks = tasks;

    this.submissions = [];
  }

  getCompetitorBySecret(secret: string): Competitor | undefined {
    return this.competitors.find((c) => c.secret === secret);
  }
}

module.exports = { DBSpeedTest };
