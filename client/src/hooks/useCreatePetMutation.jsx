import { useMutation } from "@apollo/react-hooks";
import React from "react";

export const useCreatePetMutation = (gQuery, options) => {
  const [createPet, newPetOptions] = useMutation(gQuery, options);

  const optimisticResponse = React.useCallback((input) => {
    return {
      __typename: "Mutation",
      addPet: {
        name: input.name,
        id: toString(Math.floor(Math.random() * 100000)),
        type: input.type,
        img: "https://via.placeholder.com/300",
        __typename: "Pet",
        owner: {
          __typename: "User",
          id: toString(Math.floor(Math.random() * 100000)),
        },
      },
    };
  }, []);

  return { createPet, newPetOptions, optimisticResponse };
};
