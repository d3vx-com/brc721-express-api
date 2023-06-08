import "dotenv-flow/config";

import parser from "body-parser";
import apicache from "apicache";
import { collectionController } from "./collections/collection.controller";
import { collectionSchema } from "./collections/collection.schema";
import { collectionsController } from "./collections/collections.controller";
import cors from "cors";
import express, { Request } from "express";
import { inscriptionController } from "./inscriptions/inscription.controller";
import { inscriptionSchema } from "./inscriptions/inscription.schema";
import { inscriptionsController } from "./inscriptions/inscriptions.controller";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { validate, validateBody } from "./validate.middleware";
import { verifySchema } from "./bitcoin/verify.schema";
import { verifyController } from "./bitcoin/verify.controller";

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

const exclude = (path: string) => {
  return (req: Request) => {
    return !req.path.startsWith(path);
  };
};

app.use(cors());
app.use(limiter);
app.use(morgan("tiny"));
app.use(cache("1 minute", exclude("/bitcoin")));

app.get("/collections/:id", collectionController);
app.get("/collections", validate(collectionSchema), collectionsController);

app.get("/inscriptions/:id", inscriptionController);
app.get("/inscriptions", validate(inscriptionSchema), inscriptionsController);

app.post(
  "/bitcoin/verifymessage",
  [parser.json(), validateBody(verifySchema)],
  verifyController
);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
