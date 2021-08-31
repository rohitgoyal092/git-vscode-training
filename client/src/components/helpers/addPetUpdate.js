import { ALL_PETS } from "../../graphql_queries/pets";

export const addPetUpdate = (cache, { data: { addPet } }) => {
  const pets = cache.readQuery({ query: ALL_PETS }).pets;
  cache.writeQuery({
    query: ALL_PETS,
    data: { pets: [addPet, ...pets] },
  });
};
