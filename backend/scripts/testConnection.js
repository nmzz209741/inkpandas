import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const clientConfig =
  process.env.NODE_ENV !== "production"
    ? {
        region: "local",
        endpoint: "http://dynamodb-local:8000",
        credentials: {
          accessKeyId: "local",
          secretAccessKey: "local",
        },
      }
    : {
        region: "ap-south-1",
      };

const client = new DynamoDBClient(clientConfig);

const testConnection = async () => {
  try {
    const command = new ListTablesCommand({});
    const { TableNames } = await client.send(command);
    console.log("Connected! Tables:", TableNames);
  } catch (error) {
    console.error("Error:", error);
  }
};

testConnection();
