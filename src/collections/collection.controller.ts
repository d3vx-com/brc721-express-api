import { Request, Response } from "express";

import { db } from "../db";
import { exclude } from "../exclude.util";
import set from "lodash/set";

export const collectionController = async (req: Request, res: Response) => {
  const collection = await db.collectionManifest.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!collection) {
    return res.status(404).json({
      error: "Collection not found",
    });
  }

  const reveal = await db.revealManifest.findFirst({
    where: {
      valid: true,
      collectionId: req.params.id,
    },
  });

  const metadata = reveal?.metadataURL;
  set(collection, "baseURI", metadata ? metadata : null);
  exclude(collection, ["raw"]);

  return res.status(200).json(collection);
};
