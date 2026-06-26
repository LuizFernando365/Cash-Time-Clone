import { db, usersTable, tasksTable, conversationsTable, messagesTable } from "@workspace/db";
import { randomUUID } from "crypto";

async function seed() {
  console.log("🌱 Seeding database...");

  await db.delete(messagesTable);
  await db.delete(conversationsTable);
  await db.delete(tasksTable);
  await db.delete(usersTable);

  const adminId = randomUUID();
  const user2Id = randomUUID();
  const user3Id = randomUUID();
  const user4Id = randomUUID();

  const users = [
    {
      id: adminId,
      name: "Administrador",
      email: "adm",
      passwordHash: "123",
      avatarInitials: "AD",
      avatarBg: "rgba(124,58,237,.2)",
      avatarColor: "#A78BFA",
      bio: "Administrador do sistema CashTime.",
      city: "Apucarana",
      plan: "pro",
      rankLevel: 5,
      rankPoints: 980,
      tasksCompleted: 42,
      totalEarned: 3200,
    },
    {
      id: user2Id,
      name: "Carla Souza",
      email: "carla@email.com",
      passwordHash: "123",
      avatarInitials: "CS",
      avatarBg: "rgba(52,211,153,.12)",
      avatarColor: "#34D399",
      bio: "Entrego rápido e com cuidado.",
      city: "Apucarana",
      plan: "free",
      rankLevel: 2,
      rankPoints: 210,
      tasksCompleted: 8,
      totalEarned: 480,
    },
    {
      id: user3Id,
      name: "Rafael F.",
      email: "rafael@email.com",
      passwordHash: "123",
      avatarInitials: "RF",
      avatarBg: "rgba(251,191,36,.12)",
      avatarColor: "#FCD34D",
      bio: "Design gráfico e edição de fotos.",
      city: "Londrina",
      plan: "pro",
      rankLevel: 5,
      rankPoints: 1200,
      tasksCompleted: 65,
      totalEarned: 5800,
    },
    {
      id: user4Id,
      name: "Marcos Alves",
      email: "marcos@email.com",
      passwordHash: "123",
      avatarInitials: "MA",
      avatarBg: "rgba(124,58,237,.2)",
      avatarColor: "#A78BFA",
      bio: "Suporte técnico e redes.",
      city: "Apucarana",
      plan: "free",
      rankLevel: 4,
      rankPoints: 650,
      tasksCompleted: 27,
      totalEarned: 1950,
    },
  ];

  await db.insert(usersTable).values(users);
  console.log(`✅ ${users.length} users created`);

  const task1Id = randomUUID();
  const task2Id = randomUUID();
  const task3Id = randomUUID();
  const task4Id = randomUUID();

  const tasks = [
    {
      id: task1Id,
      title: "Ajuda para configurar roteador wi-fi e resolver queda de sinal",
      description:
        "Preciso de alguém com conhecimento em redes para configurar meu roteador e resolver problemas de queda de sinal no apartamento. A configuração inclui ajuste de canal, senha WPA2 e verificação de cabos.",
      category: "Tech",
      categoryEmoji: "💻",
      price: 65,
      estimatedTime: "até 1h",
      location: "1.2 km · Apucarana",
      isRemote: false,
      lat: "-23.551",
      lng: "-51.461",
      tags: ["Redes", "Wi-Fi", "Roteador"],
      status: "open",
      highlight: true,
      creatorId: user4Id,
    },
    {
      id: task2Id,
      title: "Buscar encomenda nos Correios e entregar em endereço próximo",
      description:
        "Preciso que alguém retire minha encomenda nos Correios (Centro) e entregue no meu endereço. A encomenda é pequena, cabe numa mochila.",
      category: "Entrega",
      categoryEmoji: "📦",
      price: 30,
      estimatedTime: "~45 min",
      location: "0.8 km · Centro",
      isRemote: false,
      lat: "-23.548",
      lng: "-51.458",
      tags: [],
      status: "open",
      highlight: false,
      creatorId: user2Id,
    },
    {
      id: task3Id,
      title: "Editar 3 fotos de produto para loja do Instagram",
      description:
        "Preciso editar 3 fotos de produto (fundo branco, ajuste de cor, brilho e contraste) para publicar na minha loja do Instagram. Envio as fotos originais por WhatsApp.",
      category: "Criativo",
      categoryEmoji: "🎨",
      price: 50,
      estimatedTime: "~1h30",
      location: "🌐 Remoto · sem localização",
      isRemote: true,
      tags: [],
      status: "open",
      highlight: false,
      creatorId: adminId,
    },
    {
      id: task4Id,
      title: "Montagem de móvel comprado online (estante 5 prateleiras)",
      description:
        "Comprei uma estante de 5 prateleiras numa loja online e preciso de ajuda para montar. Todas as peças estão aqui, só falta a montagem.",
      category: "Casa",
      categoryEmoji: "🏠",
      price: 80,
      estimatedTime: "~2h",
      location: "2.5 km · Zona Sul",
      isRemote: false,
      lat: "-23.561",
      lng: "-51.472",
      tags: ["Montagem", "Móveis"],
      status: "open",
      highlight: false,
      creatorId: user3Id,
    },
  ];

  await db.insert(tasksTable).values(tasks);
  console.log(`✅ ${tasks.length} tasks created`);

  const conv1Id = randomUUID();
  const conversations = [
    {
      id: conv1Id,
      taskId: task1Id,
      participantA: adminId,
      participantB: user4Id,
      lastMessage: "Olá! Vi sua tarefa de configuração de roteador, posso ajudar.",
      lastMessageAt: new Date(),
    },
  ];

  await db.insert(conversationsTable).values(conversations);

  const messages = [
    {
      id: randomUUID(),
      conversationId: conv1Id,
      senderId: adminId,
      content: "Olá! Vi sua tarefa de configuração de roteador, posso ajudar.",
      read: true,
    },
    {
      id: randomUUID(),
      conversationId: conv1Id,
      senderId: user4Id,
      content: "Oi! Que ótimo, quando você pode vir?",
      read: false,
    },
  ];

  await db.insert(messagesTable).values(messages);
  console.log(`✅ ${conversations.length} conversations + ${messages.length} messages created`);
  console.log("🎉 Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
