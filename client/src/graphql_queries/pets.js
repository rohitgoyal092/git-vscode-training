import gql from "graphql-tag";

export const PETS_FIELDS = gql`
  fragment PetsFields on Pet {
    id
    name
    type
    img
    owner {
      id
    }
  }
`;

export const ALL_PETS = gql`
  query AllPets {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

export const NEW_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

export const DELETE_A_PET = gql`
  mutation DeleteAPet($id: ID!) {
    deletePet(id: $id) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

export const EDIT_A_PET = gql`
  mutation EditAPet($pet: PetEditInputType!) {
    editPet(pet: $pet) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;
