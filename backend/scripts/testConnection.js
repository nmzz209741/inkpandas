import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'local',
  secretAccessKey: 'local'
});

dynamodb.listTables({}, (err, data) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Connected! Tables:', data.TableNames);
  }
});