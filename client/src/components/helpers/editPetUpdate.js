import { ALL_PETS } from "../../graphql_queries/pets";

export const editPetUpdate = (cache, { data: { editPet } }) => {
  const pets = cache.readQuery({ query: ALL_PETS }).pets;
  cache.writeQuery({
    query: ALL_PETS,
    data: {
      pets: pets.map((pet) => {
        if (pet.id === editPet.id) {
          return editPet;
        }
        return pet;
      }),
    },
  });
};
