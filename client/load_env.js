import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

const loadEnv = () => {
  const envFilePath = join(__dirname, '.env');
  const envFileContent = readFileSync(envFilePath);
  const envConfig = config({ path: envFilePath });
  return envConfig.parsed;
};

export default loadEnv;
