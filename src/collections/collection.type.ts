export type CollectionRequest = {
  id?: string;
  limit?: number;
  cursor?: string;
  sort?: "desc" | "asc";
  order?: "createdAt" | "blockHeight";
};
