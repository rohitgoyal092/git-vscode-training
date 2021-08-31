import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { addPetUpdate } from "../components/helpers/addPetUpdate";
import { deletePetUpdate } from "../components/helpers/deletePetUpdate";
import { editPetUpdate } from "../components/helpers/editPetUpdate";
import Loader from "../components/Loader";
import { Modal } from "../components/Modal";
import PetsList from "../components/PetsList";
import {
  ALL_PETS,
  DELETE_A_PET,
  EDIT_A_PET,
  NEW_PET,
} from "../graphql_queries/pets";
import { useCreatePetMutation } from "../hooks/useCreatePetMutation";
import { useDeletePetMutation } from "../hooks/useDeletePetMutation";
import { useEditPetMutation } from "../hooks/useEditPetMutation";
import {
  MODAL_ACTION_TYPES,
  MODAL_STATES,
  useModalManager,
} from "../hooks/useModalManager";

export default function Pets() {
  const [modal, dispatchModal] = useModalManager();
  const { data, loading, error, refetch } = useQuery(ALL_PETS, {
    notifyOnNetworkStatusChange: true,
  });
  const {
    createPet,
    newPetOptions,
    optimisticResponse: createPetOptimisticResponse,
  } = useCreatePetMutation(NEW_PET, { update: addPetUpdate });

  const {
    editPet,
    editPetOptions,
    optimisticResponse: editOptimisticResponse,
  } = useEditPetMutation(EDIT_A_PET, { update: editPetUpdate });

  const {
    deletePet,
    deletePetOptions,
    optimisticResponse: deleteOptimisticResponse,
  } = useDeletePetMutation(DELETE_A_PET, {
    update: deletePetUpdate,
  });

  const onAddClick = () => {
    dispatchModal({
      type: MODAL_ACTION_TYPES.SET_ADD,
      onSubmit: (input) => {
        console.log(input);
        createPet({
          variables: { newPet: { name: input.name, type: input.type } },
          optimisticResponse: createPetOptimisticResponse(input),
        });
        dispatchModal({ type: MODAL_ACTION_TYPES.SET_CLOSE });
      },
    });
  };

  const onEditClick = (pet) => {
    dispatchModal({
      type: MODAL_ACTION_TYPES.SET_EDIT,
      pet,
      onSubmit: (input) => {
        editPet({
          variables: {
            pet: { id: input.id, name: input.name, type: input.type },
          },
          optimisticResponse: editOptimisticResponse(pet, input),
        });
        dispatchModal({ type: MODAL_ACTION_TYPES.SET_CLOSE });
      },
    });
  };

  const onDeleteClick = (pet) => {
    deletePet({
      variables: {
        id: pet.id,
      },
      optimisticResponse: deleteOptimisticResponse(pet),
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (
    error ||
    newPetOptions.error ||
    editPetOptions.error ||
    deletePetOptions.error
  ) {
    const error1 =
      error ||
      newPetOptions.error ||
      editPetOptions.error ||
      deletePetOptions.error;

    return <p>{`Error occurred: ${error1}`}</p>;
  }

  if (modal.mode !== MODAL_STATES.CLOSED) {
    return <Modal />;
  }

  return (
    <React.Fragment>
      <div className="page pets-page">
        <section>
          <div className="top-nav">
            <div className="top-nav-heading">
              <h1>Pets</h1>
            </div>
            <div className="top-nav-buttons">
              <div className="top-nav-new-pet">
                <button
                  onClick={() => {
                    onAddClick();
                  }}
                >
                  new pet
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    refetch();
                  }}
                >
                  Refetch
                </button>
              </div>
            </div>
          </div>
        </section>
        <section>
          <PetsList
            pets={data.pets}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        </section>
      </div>
    </React.Fragment>
  );
}
