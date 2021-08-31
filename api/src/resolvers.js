/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your scheama
 */

module.exports = {
  Query: {
    pets(_, { input }, { models }) {
      return models.Pet.findMany(input || {});
    },
    pet(_, { id }, { models }) {
      return models.Pet.findOne({ id });
    },
    user(_, __, { models }) {
      return models.User.findOne();
    },
  },
  Mutation: {
    addPet(_, { input }, { models, user }) {
      const pet = models.Pet.create({ ...input, user: user.id });
      console.log("end : ", pet);
      return pet;
    },
    deletePet(_, { id }, { models, user }) {
      //console.log("here", id, models, user);
      return models.Pet.remove({ id, user: user.id });
    },
    editPet(_, { pet }, { models, user }) {
      return models.Pet.edit({ ...pet, user: user.id });
    },
  },
  Pet: {
    owner(pet, _, { models }) {
      return models.User.findOne({ id: pet.user });
    },
    img(pet) {
      return pet.type === "DOG"
        ? "https://placedog.net/300/300"
        : "http://placekitten.com/300/300";
    },
  },
  User: {
    pets(user, _, { models }) {
      return models.Pet.findMany({ user: user.id });
    },
  },
};
