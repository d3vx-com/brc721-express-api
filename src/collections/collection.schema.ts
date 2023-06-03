import { number, object, string } from "yup";

export const collectionSchema = object({
  cursor: string(),
  search: string(),
  limit: number().min(1).max(100).default(50),
  sort: string().oneOf(["desc", "asc"]).default("desc"),
  order: string().oneOf(["createdAt", "blockHeight"]).default("createdAt"),
}).noUnknown();
