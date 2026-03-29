import 'dotenv/config';
import prisma from './libs/prisma';
import { hashPassword } from './libs/bcrypt';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      active: true,
    },
  });
  console.log('✅ Admin user created:', admin.username);

  // Create dev user
  const devPassword = await hashPassword('dev123');
  const dev = await prisma.user.upsert({
    where: { username: 'dev1' },
    update: {},
    create: {
      username: 'dev1',
      password: devPassword,
      role: 'dev',
      active: true,
    },
  });
  console.log('✅ Dev user created:', dev.username);

  // Create sample chamado
  const chamado = await prisma.chamado.create({
    data: {
      nome: 'Problema no sistema de pagamentos',
      cliente: 'Empresa XYZ',
      usuarioId: dev.id,
      valor: 1500.0,
      status: 'aberto',
    },
  });
  console.log('✅ Sample chamado created:', chamado.nome);

  // Create sample tarefas
  await prisma.tarefa.create({
    data: {
      chamadoId: chamado.id,
      descricao: 'Análise inicial do problema reportado pelo cliente',
      dtInicio: new Date(Date.now() - 3600000),
      dtFim: new Date(Date.now() - 1800000),
      status: 'fechado',
    },
  });

  await prisma.tarefa.create({
    data: {
      chamadoId: chamado.id,
      descricao: 'Investigação no código de integração com gateway de pagamento',
      dtInicio: new Date(Date.now() - 1800000),
      status: 'aberto',
    },
  });

  console.log('✅ Sample tarefas created');
  console.log('\n🎉 Seed completed!');
  console.log('   Admin: admin / admin123');
  console.log('   Dev:   dev1  / dev123');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
