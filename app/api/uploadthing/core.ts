import { FileRouter, createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

const auth = (req: Request) => ({ id: 'fakeID' });

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user) throw new UploadThingError('Unthorized');

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`Upload complete for userID: ${metadata.userId}`);
      console.log(`File url: ${file.ufsUrl}`);

      return {
        uploadBy: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
