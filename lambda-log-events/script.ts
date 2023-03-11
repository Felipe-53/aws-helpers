import assert from "node:assert";
import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  GetLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { appendFileSync, writeFileSync } from "node:fs";

const functionName = process.argv[2];
assert(
  typeof functionName === "string" && functionName !== "",
  "Provide the function name as the first argument"
);

async function main() {
  const client = new CloudWatchLogsClient({ region: "sa-east-1" });

  const logGroupName = `/aws/lambda/${functionName}`;

  const describeLogStreamCommand = new DescribeLogStreamsCommand({
    logGroupName,
    descending: true,
    limit: 1,
    orderBy: "LastEventTime",
  });

  const { logStreams } = await client.send(describeLogStreamCommand);

  assert(logStreams && logStreams.length === 1);

  const lasLogStream = logStreams[0];

  const getLogEventsCommand = new GetLogEventsCommand({
    logStreamName: lasLogStream.logStreamName,
    logGroupIdentifier: logGroupName,
    limit: 10,
    startFromHead: true,
  });

  const logEvents = await client.send(getLogEventsCommand);

  const outputFilename = "log.txt";
  writeFileSync(outputFilename, "");

  logEvents.events?.forEach((event) => {
    let message: string | object;

    assert(event.message);

    try {
      message = JSON.stringify(JSON.parse(event.message), null, 4) + "\n";
    } catch {
      message = event.message;
    }

    appendFileSync(
      outputFilename,
      `Log Event: ${new Date(event.ingestionTime!).toLocaleString("pt-br")}\n`
    );

    appendFileSync(outputFilename, `${message}\n`);
  });
}

main();
