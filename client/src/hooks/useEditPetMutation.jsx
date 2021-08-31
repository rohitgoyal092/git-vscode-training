import { useMutation } from "@apollo/react-hooks";
import React from "react";

export const useEditPetMutation = (gQuery, options) => {
  const [editPet, editPetOptions] = useMutation(gQuery, options);

  const optimisticResponse = React.useCallback((oldInput, newInput) => {
    return {
      __typename: "Mutation",
      editPet: {
        id: newInput.id,
        name: newInput.name,
        type: newInput.type,
        img:
          oldInput.type === newInput.type
            ? oldInput.img
            : "https://via.placeholder.com/300",
        __typename: "Pet",
        owner: {
          __typename: "User",
          id: oldInput.owner.id,
        },
      },
    };
  }, []);

  return { editPet, editPetOptions, optimisticResponse };
};
