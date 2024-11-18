import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const careCharacteristics = [
    {
      name: 'Cuidados básicos de higiene',
      description:
        'Auxílio no banho, higiene íntima, escovação dos dentes, troca de fraldas e ajuda para vestir-se e manter a aparência pessoal.',
      updatedAt: new Date(),
    },
    {
      name: 'Administração de medicamentos',
      description:
        'Supervisão e lembretes para tomar medicamentos conforme prescrição médica, além de monitoramento de sinais vitais como pressão arterial e glicemia quando necessário.',
      updatedAt: new Date(),
    },
    {
      name: 'Acompanhamento em consultas médicas',
      description:
        'Acompanhamento em consultas médicas e exames, auxiliando na compreensão e no seguimento das orientações médicas e recomendações dos profissionais de saúde.',
      updatedAt: new Date(),
    },
    {
      name: 'Auxílio na alimentação',
      description:
        'Assistência na alimentação para pessoas com dificuldades e acompanhamento de dietas específicas para condições como diabetes e hipertensão.',
      updatedAt: new Date(),
    },
    {
      name: 'Mobilidade e exercícios',
      description:
        'Auxílio na movimentação dentro de casa, incluindo ajuda para levantar da cama e uso de cadeira de rodas, além de acompanhamento em atividades físicas leves recomendadas.',
      updatedAt: new Date(),
    },
    {
      name: 'Companhia e suporte emocional',
      description:
        'Fornecimento de apoio emocional através de conversas e atividades de lazer como jogos, leituras e passeios, respeitando as limitações individuais.',
      updatedAt: new Date(),
    },
    {
      name: 'Prevenção de acidentes',
      description:
        'Monitoramento e garantia da segurança doméstica, com foco na prevenção de quedas e outros acidentes, especialmente para pessoas com problemas de mobilidade ou memória.',
      updatedAt: new Date(),
    },
    {
      id: 'a1b2c3d4-5e6f-7g8h-9i10-j11k12l13m14',
      name: 'Cuidados essenciais do dia a dia',
      description:
        'Conjunto de cuidados básicos essenciais incluindo supervisão geral, acompanhamento nas atividades diárias, auxílio na locomoção dentro de casa, apoio na organização do ambiente e garantia do bem-estar e segurança do idoso.',
      updatedAt: new Date(),
    },
  ];

  for (const characteristic of careCharacteristics) {
    await prisma.careCharacteristic.create({
      data: characteristic,
    });
  }

  console.log('Seed completed: Care characteristics added');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
