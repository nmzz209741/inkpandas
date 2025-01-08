import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

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
