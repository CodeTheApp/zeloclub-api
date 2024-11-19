import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const careCharacteristics = [
    {
      id: 'e77da67e-ecbe-4e0d-911a-7c0ad88de07d',
      name: 'Cuidados básicos de higiene',
      description:
        'Auxílio no banho, higiene íntima, escovação dos dentes, troca de fraldas e ajuda para vestir-se e manter a aparência pessoal.',
      updatedAt: new Date(),
    },
    {
      id: '52f119da-9d8e-4502-8745-a2787d2fd0f9',
      name: 'Administração de medicamentos',
      description:
        'Supervisão e lembretes para tomar medicamentos conforme prescrição médica, além de monitoramento de sinais vitais como pressão arterial e glicemia quando necessário.',
      updatedAt: new Date(),
    },
    {
      id: '98d6407f-01f5-4b0e-8674-76247a87dc56',
      name: 'Acompanhamento em consultas médicas',
      description:
        'Acompanhamento em consultas médicas e exames, auxiliando na compreensão e no seguimento das orientações médicas e recomendações dos profissionais de saúde.',
      updatedAt: new Date(),
    },
    {
      id: '3ba92095-4244-4b7b-a19b-1680c7b99943',
      name: 'Auxílio na alimentação',
      description:
        'Assistência na alimentação para pessoas com dificuldades e acompanhamento de dietas específicas para condições como diabetes e hipertensão.',
      updatedAt: new Date(),
    },
    {
      id: 'b0ca38b1-140c-4477-a555-0e5ea265ddc2',
      name: 'Mobilidade e exercícios',
      description:
        'Auxílio na movimentação dentro de casa, incluindo ajuda para levantar da cama e uso de cadeira de rodas, além de acompanhamento em atividades físicas leves recomendadas.',
      updatedAt: new Date(),
    },
    {
      id: '2d32cf83-59a0-4dbb-bd4d-fa1c69f9aba5',
      name: 'Companhia e suporte emocional',
      description:
        'Fornecimento de apoio emocional através de conversas e atividades de lazer como jogos, leituras e passeios, respeitando as limitações individuais.',
      updatedAt: new Date(),
    },
    {
      id: '7e4a0c34-3634-44a2-9028-34324ac05c5a',
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
