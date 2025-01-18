import { PostState, PostType, PrismaClient } from '@prisma/client';

const FIRST_POST_UUID = '6d308040-96a2-4162-bea6-2338e9976540';
const SECOND_POST_UUID = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';

function getPosts() {
  return [
    {
      id: FIRST_POST_UUID,
      postType: PostType.Text,
      userId: FIRST_USER_ID,
      isRepost: false,
      originUserId: null,
      originPostId: null,
      state: PostState.Draft,
      likesCount: 0,
      commentsCount: 0,
      publicDate: new Date().toISOString(),
      tags: {
        connectOrCreate: [
          {
            create: { title: '#someTag1' },
            where: { title: '#someTag1' },
          },
        ],
      },
      extraProperty: {
        name: 'Тестовый name',
        announce: 'Тестовый announce',
        text: 'Тестовый text',
      },
      comments: [],
    },
    {
      id: SECOND_POST_UUID,
      postType: PostType.Photo,
      userId: SECOND_USER_ID,
      isRepost: false,
      originUserId: null,
      originPostId: null,
      state: PostState.Draft,
      likesCount: 0,
      commentsCount: 0,
      publicDate: new Date().toISOString(),
      tags: {
        connectOrCreate: [
          {
            create: { title: '#someTag2' },
            where: { title: '#someTag2' },
          },
        ],
      },
      extraProperty: {
        photo:
          'https://assets.htmlacademy.ru/previews/797/20231226_7720a938-150.png',
      },
      comments: [
        {
          message: 'Это действительно отличная книга!',
          userId: FIRST_USER_ID,
        },
        {
          message:
            'Надо будет обязательно перечитать. Слишком много информации.',
          userId: SECOND_USER_ID,
        },
      ],
    },
  ];
}

async function seedDb(prismaClient: PrismaClient) {
  const mockPosts = getPosts();

  for (const post of mockPosts) {
    await prismaClient.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        postType: post.postType,
        userId: post.userId,
        isRepost: post.isRepost,
        originUserId: post.originUserId,
        originPostId: post.originPostId,
        state: post.state,
        likesCount: 0,
        commentsCount: post.comments.length,
        publicDate: post.publicDate,
        tags: post.tags,
        comments: post.comments.length
          ? {
              create: post.comments,
            }
          : undefined,
        extraProperty: {
          create: post.extraProperty,
        },
      },
    });
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
