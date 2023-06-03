import { Request, Response } from "express";

import { collectionSchema } from "./collection.schema";
import { db } from "../db";
import { exclude } from "../exclude.util";
import set from "lodash/set";

export const collectionsController = async (req: Request, res: Response) => {
  const params = collectionSchema.cast(req.query);

  const collections = await db.collectionManifest.findMany({
    orderBy: {
      [params.order]: params.sort,
    },
    where: {
      OR: [
        {
          name: {
            contains: params.search,
          },
        },
        {
          symbol: {
            contains: params.search,
          },
        },
      ],
    },
    take: params.limit,
    skip: params.cursor ? 1 : 0,
    cursor: params.cursor ? { id: params.cursor } : undefined,
  });

  const lastCollection = collections[collections.length - 1];
  const nextCursor = lastCollection ? lastCollection.id.toString() : null;

  const reveals = await db.revealManifest.findMany({
    where: {
      valid: true,
      collectionId: {
        in: collections.map((c) => c.id),
      },
    },
  });

  for (const collection of collections) {
    const reveal = reveals.find((r) => r.collectionId === collection.id);
    const metadata = reveal?.metadataURL;
    set(collection, "baseURI", metadata ? metadata : null);
    exclude(collection, ["raw"]);
  }

  return res.status(200).json({ collections, cursor: nextCursor });
};
