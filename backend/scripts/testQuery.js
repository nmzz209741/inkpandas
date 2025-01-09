import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

const testQuery = async () => {
  const tableName = "Users";
  const indexName = "EmailIndex";
  const keyName = "email";
  const keyValue = "test@yopmail.com";

  console.log("Query Parameters:", { tableName, indexName, keyName, keyValue });

  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: `${keyName} = :value`,
    ExpressionAttributeValues: {
      ":value": keyValue,
    },
  });

  try {
    const response = await client.send(command);
    const { Items = [] } = response; // Default to empty array if Items is undefined
    console.log("Query Result:", Items);

    if (Items.length === 0) {
      console.warn("No matching items found.");
    }
  } catch (error) {
    console.error("Query Error:", error.message, error);
  }
};

testQuery();