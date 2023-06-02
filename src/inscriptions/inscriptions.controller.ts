import { Request, Response } from "express";

import { db } from "../db";
import { exclude } from "../exclude.util";
import { inscriptionSchema } from "./inscription.schema";
import set from "lodash/set";

export const inscriptionsController = async (req: Request, res: Response) => {
  const params = inscriptionSchema.cast(req.query);

  const inscriptions = await db.inscriptionManifest.findMany({
    orderBy: {
      [params.order]: params.sort,
    },
    where: {
      valid: params.valid,
      collectionId: params.collectionId,
      inscriberAddress: params.inscriberAddress,
      initialOwnerAddress: params.initialOwnerAddress,
    },
    take: params.limit,
    skip: params.cursor ? 1 : 0,
    cursor: params.cursor ? { id: params.cursor } : undefined,
  });

  const lastInscription = inscriptions[inscriptions.length - 1];
  const nextCursor = lastInscription ? lastInscription.id.toString() : null;

  const reveals = await db.revealManifest.findMany({
    where: {
      valid: true,
      collectionId: {
        in: inscriptions.map((c) => c.collectionId),
      },
    },
  });

  for (const inscription of inscriptions) {
    const reveal = reveals.find(
      (r) => r.collectionId === inscription.collectionId
    );

    const metadata = reveal?.metadataURL;

    set(
      inscription,
      "tokenURI",
      metadata ? `${metadata}${inscription.position}` : null
    );
    exclude(inscription, ["raw"]);
  }

  return res.status(200).json({ inscriptions, cursor: nextCursor });
};
