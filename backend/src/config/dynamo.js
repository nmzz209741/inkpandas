import AWS from "aws-sdk";

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: "local",
  endpoint: "http://localhost:8000",
  accessKeyId: "local",
  secretAccessKey: "local",
});

class DynamoDBWrapper {
  async get(tableName, id) {
    const params = {
      TableName: tableName,
      Key: { id },
    };

    try {
      const { Item } = await documentClient.get(params).promise();
      return Item || null;
    } catch (error) {
      console.error(`DynamoDB GET Error: ${error.message}`, { tableName, id });
      throw error;
    }
  }

  async query(tableName, indexName, keyName, keyValue) {
    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: `${keyName} = :value`,
      ExpressionAttributeValues: {
        ":value": keyValue,
      },
    };

    try {
      const { Items } = await documentClient.query(params).promise();
      return Items || [];
    } catch (error) {
      console.error(`DynamoDB QUERY Error: ${error.message}`, {
        tableName,
        indexName,
      });
      throw error;
    }
  }

  async getAll(tableName, { limit = 50, lastKey = null } = {}) {
    const params = {
      TableName: tableName,
      Limit: limit,
      ...(lastKey && { ExclusiveStartKey: lastKey }),
    };

    try {
      const { Items, LastEvaluatedKey } = await documentClient
        .scan(params)
        .promise();
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

    const params = {
      TableName: tableName,
      Item: {
        ...item,
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      await documentClient.put(params).promise();
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

    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    try {
      const { Attributes } = await documentClient.update(params).promise();
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
    const params = {
      TableName: tableName,
      Key: { id },
    };

    try {
      await documentClient.delete(params).promise();
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

    const params = {
      RequestItems: {
        [tableName]: batchItems,
      },
    };

    try {
      await documentClient.batchWrite(params).promise();
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
