import { boolean, number, object, string } from "yup";

const INSCRIPTION_LENGTH = 66;
const MAX_DELIMITER_COUNT = 10;
const MAX_INSCRIPTIONS_PER_REQUEST = 10;

const MAX_IDS_LENGTH =
  MAX_INSCRIPTIONS_PER_REQUEST * INSCRIPTION_LENGTH + MAX_DELIMITER_COUNT;

export const inscriptionSchema = object({
  cursor: string(),
  valid: boolean(),
  collectionId: string(),
  inscriberAddress: string(),
  initialOwnerAddress: string(),
  ids: string().min(INSCRIPTION_LENGTH).max(MAX_IDS_LENGTH),
  limit: number().min(1).max(100).default(50),
  sort: string().oneOf(["desc", "asc"]).default("desc"),
  order: string()
    .oneOf(["position", "createdAt", "updatedAt", "blockHeight"])
    .default("createdAt"),
}).noUnknown();
