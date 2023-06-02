import "dotenv-flow/config";

import apicache from "apicache";
import { collectionController } from "./collections/collection.controller";
import { collectionSchema } from "./collections/collection.schema";
import { collectionsController } from "./collections/collections.controller";
import cors from "cors";
import express from "express";
import { inscriptionController } from "./inscriptions/inscription.controller";
import { inscriptionSchema } from "./inscriptions/inscription.schema";
import { inscriptionsController } from "./inscriptions/inscriptions.controller";
import rateLimit from "express-rate-limit";
import { validate } from "./validate.middleware";

const app = express();

const limiter = rateLimit({
  max: 60,
  windowMs: 60 * 1000,
  legacyHeaders: false,
  standardHeaders: true,
});

const cache = apicache.options({
  headers: {
    "cache-control": "no-cache",
  },
}).middleware;

app.use(cors());
app.use(limiter);
app.use(cache("1 minute"));

app.get("/collections/:id", collectionController);
app.get("/collections", validate(collectionSchema), collectionsController);

app.get("/inscriptions/:id", inscriptionController);
app.get("/inscriptions", validate(inscriptionSchema), inscriptionsController);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
