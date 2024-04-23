import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { CopyBlock, dracula, googlecode, monoBlue } from "react-code-blocks";
import { Textarea } from "@/components/ui/textarea";
import { submitSolution } from "@/clients/sst-client";
import { CircleCheckBig, CircleX } from "lucide-react";

function isJsonStringWithArray(str) {
  try {
    const json = JSON.parse(str);
    return Array.isArray(json) && json.length > 0;
  } catch (e) {
    return false;
  }
  return true;
}

export default function TaskWithSubmission({ task, reloadTasks }) {
  const [submissions, setSubmissions] = useState([]);
  const [competitorSolution, setCompetitorSolution] = useState("");

  useEffect(() => {
    // getTasksWithResult().then((data) => {
    //   console.log("data", data);
    //   setTasks(data);
    // });
  }, []);

  // if (!tasks.length) return "loading...";

  return (
    <Card className="mr-4">
      <CardHeader>
        <div className="flex justify-between">
          <div className="font-bold text-xl flex items-center">
            <span className="text-muted-foreground mr-2">#{task.id}</span>
            <span>{task.name}</span>
            {task.submissions.length === 0 ? (
              <span className="text-gray-400 ml-2">(No submission)</span>
            ) : task.isSolved ? (
              <span className="text-green-500 ml-2">(Solved)</span>
            ) : (
              <span className="text-red-500 ml-2">(Not Solved)</span>
            )}
          </div>
          <div className="font-bold">{task.point} pt</div>
        </div>
      </CardHeader>
      <CardContent>
        <div>{parse(task.description)}</div>
        <div className="font-bold text-lg my-2">Input</div>
        <div className="max-h-96 overflow-auto my-4">
          <CopyBlock
            text={JSON.stringify(JSON.parse(task.input), null, 2)}
            language="json"
            showLineNumbers={true}
            theme={dracula}
            wrapLongLines={true}
          />
        </div>
        {!task.isSolved && (
          <>
            <div className="font-bold text-lg my-2">Your Solution</div>
            <div>
              <Textarea
                placeholder="Copy & paste your solution here in the right JSON format"
                className="h-64"
                value={competitorSolution}
                onChange={(e) => setCompetitorSolution(e.target.value)}
              />
              <Button
                className={`mt-2 w-full`}
                disabled={
                  !competitorSolution ||
                  !isJsonStringWithArray(competitorSolution)
                }
                onClick={async () => {
                  console.log("submit solution", competitorSolution);
                  if (!isJsonStringWithArray(competitorSolution)) {
                    alert("Invalid JSON format");
                    return;
                  }
                  const submission = await submitSolution(
                    task.id,
                    JSON.parse(competitorSolution)
                  );
                  // console.log("submission", submission);
                  reloadTasks();
                }}
              >
                <span>Submit Solution</span>
                {competitorSolution &&
                  !isJsonStringWithArray(competitorSolution) && (
                    <span className="text-red-500 ml-2">(Invalid JSON)</span>
                  )}
              </Button>
            </div>
          </>
        )}
        <div className="font-bold text-lg my-2">
          {task.submissions.length} submission(s)
        </div>
        <div>
          {task.submissions.map((submission) => (
            <div key={submission.id} className="mt-2 mb-4">
              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground text-xs">
                  {submission.isSuccessful ? (
                    <CircleCheckBig className="text-green-500" />
                  ) : (
                    <CircleX className="text-red-500" />
                  )}
                </span>
                <span className="text-muted-foreground text-sm">
                  {submission.createdAt}
                </span>
              </div>
              <div className="my-2">
                <CopyBlock
                  text={JSON.stringify(submission.submittedSolution, null, 2)}
                  language="json"
                  showLineNumbers={true}
                  theme={monoBlue}
                  wrapLongLines={true}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
