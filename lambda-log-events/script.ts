import assert from "node:assert";
import chalk from "chalk";
import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  GetLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

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
  });

  const { logStreams } = await client.send(describeLogStreamCommand);

  assert(logStreams && logStreams.length === 1);

  const lasLogStream = logStreams[0];

  const getLogEventsCommand = new GetLogEventsCommand({
    logStreamName: lasLogStream.logStreamName,
    logGroupIdentifier: logGroupName,
    limit: 5,
  });

  const logEvents = await client.send(getLogEventsCommand);

  logEvents.events?.forEach((event) => {
    let message: string | object;

    assert(event.message);

    try {
      message = JSON.stringify(JSON.parse(event.message), null, 4);
    } catch {
      message = event.message;
    }

    console.log(
      `${chalk.green("Log Event")}: ${new Date(
        event.ingestionTime!
      ).toLocaleString("pt-br")}`
    );
    console.log(`${message}\n`);
  });
}

main();
