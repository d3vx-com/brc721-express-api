import { boolean, number, object, string } from "yup";

export const inscriptionSchema = object({
  cursor: string(),
  valid: boolean(),
  collectionId: string(),
  inscriberAddress: string(),
  initialOwnerAddress: string(),
  limit: number().min(1).max(100).default(50),
  sort: string().oneOf(["desc", "asc"]).default("desc"),
  order: string()
    .oneOf(["position", "createdAt", "updatedAt", "blockHeight"])
    .default("createdAt"),
}).noUnknown();
