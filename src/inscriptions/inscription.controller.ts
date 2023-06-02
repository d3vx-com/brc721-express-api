import { Request, Response } from "express";

import { db } from "../db";
import { exclude } from "../exclude.util";
import set from "lodash/set";

export const inscriptionController = async (req: Request, res: Response) => {
  const inscription = await db.inscriptionManifest.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!inscription) {
    return res.status(404).json({
      error: "Inscription not found",
    });
  }

  exclude(inscription, ["raw"]);

  if (!inscription.valid) {
    return res.status(200).json(inscription);
  }

  const reveal = await db.revealManifest.findFirst({
    where: {
      valid: true,
      collectionId: inscription.collectionId,
    },
  });

  const metadata = reveal?.metadataURL;
  set(
    inscription,
    "tokenURI",
    metadata ? `${metadata}${inscription.position}` : null
  );

  return res.status(200).json(inscription);
};
