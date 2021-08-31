const nanoid = require("nanoid");

const createPetModel = (db) => {
  return {
    remove({ id, ...props }) {
      const deletedPet = db.get("pet").filter({ id: id }).value()[0];
      db.get("pet").remove({ id: id }).write();
      return deletedPet;
    },
    edit({ id, ...props }) {
      db.get("pet")
        .find({ id: id })
        .assign({ ...props, id })
        .value();
      return db.get("pet").find({ id: id }).value();
    },
    findMany(filter) {
      return db
        .get("pet")
        .filter(filter)
        .orderBy(["createdAt"], ["desc"])
        .value();
    },

    findOne(filter) {
      return db.get("pet").find(filter).value();
    },

    create(pet) {
      const newPet = { id: nanoid(), createdAt: Date.now(), ...pet };

      db.get("pet").push(newPet).write();
      return newPet;
    },
  };
};

module.exports = createPetModel;
