import { City } from "../types/City";

export const getCitiesTypePoliciesMerge = (
  existing: City[] = [],
  incoming: City[],
  { args }: { args: any }
): City[] => {
  const offset: number = args?.input.offset ?? 0;
  const merged: City[] = existing ? existing.slice(0) : [];
  for (let i = 0; i < incoming.length; i++) {
    merged[i + offset] = incoming[i];
  }
  return merged;
};

export const getCitiesTypePoliciesRead = (
  existing: City[],
  { args }: { args: any }
): City[] => {
  const offset = args?.input.offset ?? 0;
  const limit = args?.input.limit ?? existing?.length;
  return existing && existing.slice(offset, offset + limit);
};
