import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

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

const docClient = DynamoDBDocumentClient.from(client);

class DynamoDBWrapper {
  async get(tableName, id) {
    const command = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    try {
      const { Item } = await docClient.send(command);
      return Item || null;
    } catch (error) {
      console.error(`DynamoDB GET Error: ${error.message}`, { tableName, id });
      throw error;
    }
  }

  async query(
    tableName,
    indexName,
    keyName,
    keyValue,
    limit = 50,
    lastKey = null
  ) {
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: `${keyName} = :value`,
      ExpressionAttributeValues: {
        ":value": keyValue,
      },
      Limit: limit,
      ...(lastKey && { ExclusiveStartKey: lastKey }),
    });
    try {
      const { Items, LastEvaluatedKey } = await docClient.send(command);
      return {
        items: Items || [],
        lastKey: LastEvaluatedKey,
      };
    } catch (error) {
      console.error(`DynamoDB QUERY Error: ${error.message}`, {
        tableName,
        indexName,
      });
      throw error;
    }
  }

  async getAll(tableName, { indexName, limit = 50, lastKey = null } = {}) {
    const command = new ScanCommand({
      TableName: tableName,
      Limit: limit,
      IndexName: indexName,
      ...(lastKey && { ExclusiveStartKey: lastKey }),
    });

    try {
      const { Items, LastEvaluatedKey } = await docClient.send(command);
      return {
        items: Items || [],
        lastKey: LastEvaluatedKey,
      };
    } catch (error) {
      console.error(`DynamoDB SCAN Error: ${error.message}`, { tableName });
      throw error;
    }
  }

  async put(tableName, item) {
    if (!item.id) {
      item.id = Date.now().toString();
    }

    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...item,
        updatedAt: new Date().toISOString(),
      },
    });

    try {
      await docClient.send(command);
      return item;
    } catch (error) {
      console.error(`DynamoDB PUT Error: ${error.message}`, {
        tableName,
        id: item.id,
      });
      throw error;
    }
  }

  async update(tableName, id, attributes) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.entries(attributes).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    const command = new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    try {
      const { Attributes } = await docClient.send(command);
      return Attributes;
    } catch (error) {
      console.error(`DynamoDB UPDATE Error: ${error.message}`, {
        tableName,
        id,
      });
      throw error;
    }
  }

  async delete(tableName, id) {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: { id },
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error(`DynamoDB DELETE Error: ${error.message}`, {
        tableName,
        id,
      });
      throw error;
    }
  }

  async batchWrite(tableName, items) {
    const batchItems = items.map((item) => ({
      PutRequest: {
        Item: {
          ...item,
          updatedAt: new Date().toISOString(),
        },
      },
    }));

    const command = new BatchWriteCommand({
      RequestItems: {
        [tableName]: batchItems,
      },
    });

    try {
      await docClient.send(command);
      return items;
    } catch (error) {
      console.error(`DynamoDB BATCH WRITE Error: ${error.message}`, {
        tableName,
      });
      throw error;
    }
  }
}

export const dynamo = new DynamoDBWrapper();
