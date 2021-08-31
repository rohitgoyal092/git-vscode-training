import { ALL_PETS } from "../../graphql_queries/pets";

export const deletePetUpdate = (cache, { data: { deletePet } }) => {
  const pets = cache.readQuery({ query: ALL_PETS }).pets;
  cache.writeQuery({
    query: ALL_PETS,
    data: {
      pets: pets.filter((pet) => {
        return pet.id !== deletePet.id;
      }),
    },
  });
};
