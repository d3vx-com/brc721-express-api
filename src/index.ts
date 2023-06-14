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

const whitelist = [
  /.*(\.|https:\/\/)8ased.com$/,
  /.*(\.|https:\/\/)brc721.com$/,
  /.*(\.|https:\/\/)brc-721.pro$/,
  /.*(\.|https:\/\/)brc721scan.io$/,
  /.*(\.|https:\/\/)brclaunchpad.io$/,
];

const limiter = rateLimit({
  windowMs: 60 * 1000,
  legacyHeaders: false,
  standardHeaders: true,
  max: async (request) => {
    const hostname = request.hostname;
    if (whitelist.some((h) => h.test(hostname))) return 0;
    else return 120;
  },
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

morgan.token<Request>("host", function (req) {
  return req.hostname;
});

app.use(cors());
app.use(limiter);
app.use(cache("1 minute", exclude("/bitcoin")));
app.use(
  morgan(":method :url :status :host :res[content-length] - :response-time ms")
);

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
