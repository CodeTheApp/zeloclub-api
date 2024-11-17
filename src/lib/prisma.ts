import { PrismaClient } from '@prisma/client';

// Declarar globalmente para evitar múltiplas instâncias no ambiente de desenvolvimento
declare global {
  // Isso garante que o Prisma não seja recriado em cada hot reload no desenvolvimento
  var prisma: PrismaClient | undefined;
}

// Cria uma instância do Prisma ou reutiliza a existente no desenvolvimento
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Habilite logs conforme necessário
  });

// Em ambientes que não sejam de produção, armazena a instância global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Opcional: Conecte explicitamente no início para garantir que a conexão está ativa
(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma client successfully connected');
  } catch (error) {
    console.error('Error connecting Prisma client:', error);
    process.exit(1); // Sai do processo em caso de erro crítico
  }
})();
