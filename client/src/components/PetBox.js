import React from "react";

const PetBox = ({ pet, onEditClick, onDeleteClick }) => {
  return (
    <React.Fragment>
      <div className="pet">
        <figure>
          <img src={pet.img + `?pet=${pet.id}`} alt="" />
        </figure>
        <div className="pet-name">{pet.name}</div>
        <div className="pet-type">{pet.type}</div>
        <div className="pet-buttons">
          <div>
            <button onClick={() => onEditClick(pet)}>Edit pet</button>
          </div>
          <div>
            <button onClick={() => onDeleteClick(pet)}>Delete</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PetBox;
