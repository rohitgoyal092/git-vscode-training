import { useMutation } from "@apollo/react-hooks";
import React from "react";

export const useDeletePetMutation = (gQuery, options) => {
  const [deletePet, deletePetOptions] = useMutation(gQuery, options);

  const optimisticResponse = React.useCallback((input) => {
    return {
      __typename: "Mutation",
      deletePet: {
        id: input.id,
        name: input.name,
        type: input.type,
        img: "https://via.placeholder.com/300",
        __typename: "Pet",
        owner: {
          __typename: "User",
          id: input.owner.id,
        },
      },
    };
  }, []);

  return { deletePet, deletePetOptions, optimisticResponse };
};
