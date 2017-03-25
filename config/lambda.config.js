import process from 'process';

const { name, description, version } = require('../package.json');

let accessKeyId, secretAccessKey, role, region;
if (process.env.CI) {
  accessKeyId = process.env.aws_accessKeyId;
  secretAccessKey = process.env.aws_secretAccessKey;
  role = process.env.aws_role;
  region = process.env.aws_region;
} else {
  ({ accessKeyId, secretAccessKey, role, region } = require('./aws.config.json'));
}

export default {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  role: role,
  functionName: name,
  description: `${description} (version ${version})`,
  region: region,
  handler: 'index.handler'
};
