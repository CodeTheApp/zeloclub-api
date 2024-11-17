import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient({ region: 'us-east-1' });

async function getParameter(name: string): Promise<string> {
  try {
    const command = new GetParameterCommand({
      Name: `/zeloclub/prod/${name}`,
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);
    if (!response.Parameter?.Value) {
      throw new Error(`Parameter ${name} not found`);
    }
    return response.Parameter.Value;
  } catch (error) {
    console.error(`Error loading parameter ${name}:`, error);
    throw error;
  }
}

export async function loadEnv() {
  try {
    // Carregar todas as variáveis em paralelo
    const [
      databaseUrl,
      jwtSecret,
      sendgridApiKey,
      awsBucketName,
      awsRegion,
      awsAccessKeyId,
      awsSecretAccessKey,
      auth0BaseUrl,
      auth0IssuerBaseUrl,
      auth0ClientId,
      auth0ClientSecret,
      auth0Audience,
      auth0Secret,
    ] = await Promise.all([
      getParameter('DATABASE_URL'),
      getParameter('JWT_SECRET'),
      getParameter('SENDGRID_API_KEY'),
      getParameter('AWS_BUCKET_NAME'),
      getParameter('AWS_REGION'),
      getParameter('AWS_ACCESS_KEY_ID'),
      getParameter('AWS_SECRET_ACCESS_KEY'),
      getParameter('AUTH0_BASE_URL'),
      getParameter('AUTH0_ISSUER_BASE_URL'),
      getParameter('AUTH0_CLIENT_ID'),
      getParameter('AUTH0_CLIENT_SECRET'),
      getParameter('AUTH0_AUDIENCE'),
      getParameter('AUTH0_SECRET'),
    ]);

    // Definir todas as variáveis de ambiente
    process.env.DATABASE_URL = databaseUrl;
    process.env.JWT_SECRET = jwtSecret;
    process.env.SENDGRID_API_KEY = sendgridApiKey;
    process.env.AWS_BUCKET_NAME = awsBucketName;
    process.env.AWS_REGION = awsRegion;
    process.env.AWS_ACCESS_KEY_ID = awsAccessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = awsSecretAccessKey;
    process.env.AUTH0_BASE_URL = auth0BaseUrl;
    process.env.AUTH0_ISSUER_BASE_URL = auth0IssuerBaseUrl;
    process.env.AUTH0_CLIENT_ID = auth0ClientId;
    process.env.AUTH0_CLIENT_SECRET = auth0ClientSecret;
    process.env.AUTH0_AUDIENCE = auth0Audience;
    process.env.AUTH0_SECRET = auth0Secret;

    console.log(
      'Environment variables loaded successfully from Parameter Store'
    );

    // Log para debug (remova em produção)
    console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);
  } catch (error) {
    console.error('Failed to load environment variables:', error);
    throw error;
  }
}
