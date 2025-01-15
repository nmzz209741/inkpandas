import {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
  DeleteTableCommand,
  waitUntilTableNotExists,
} from "@aws-sdk/client-dynamodb";

const isDevelopment = process.env.NODE_ENV === "development";
const shouldPurge = process.env.PURGE === "true";

const clientConfig = isDevelopment
  ? {
      region: "local",
      endpoint: "http://localhost:8000",
      credentials: {
        accessKeyId: "local",
        secretAccessKey: "local",
      },
    }
  : {
      region: "ap-south-1",
    };

const client = new DynamoDBClient(clientConfig);

const tables = [
  {
    TableName: "Users",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
      { AttributeName: "email", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "EmailIndex",
        KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
  {
    TableName: "Articles",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
      { AttributeName: "createdAt", AttributeType: "S" },
      { AttributeName: "userId", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "CreatedAtIndex",
        KeySchema: [{ AttributeName: "createdAt", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
      {
        IndexName: "UserIdIndex",
        KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
];

const createTables = async () => {
  try {
    const listCommand = new ListTablesCommand({});
    const { TableNames: existingTables = [] } = await client.send(listCommand);

    if (shouldPurge && existingTables.length > 0) {
      console.log("Cleaning existing tables...");
      await Promise.all(
        existingTables.map(async (tableName) => {
          try {
            const deleteCommand = new DeleteTableCommand({
              TableName: tableName,
            });
            await client.send(deleteCommand);
            console.log(`Deleting table ${tableName}...`);

            await waitUntilTableNotExists(
              {
                client,
                maxWaitTime: 300,
                minDelay: 1,
                maxDelay: 4,
              },
              { TableName: tableName }
            );

            console.log(`Table ${tableName} deleted successfully`);
          } catch (error) {
            console.error(`Error deleting table ${tableName}:`, error);
            throw error;
          }
        })
      );
    }

    for (const params of tables) {
      try {
        const command = new CreateTableCommand(params);
        await client.send(command);
        console.log(`Table ${params.TableName} created successfully`);
      } catch (error) {
        if (error.name === "ResourceInUseException") {
          console.log(`Table ${params.TableName} already exists`);
        } else {
          console.error(`Error creating table ${params.TableName}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error managing tables:", error);
    process.exit(1);
  }
};

createTables();
