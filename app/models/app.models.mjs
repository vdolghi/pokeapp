import mongoose from "mongoose";

const {model, Schema} = mongoose;

const PokemonSchema = Schema({
  name: String,
  height: {type: Number},
  weight: {type: Number},
  abilities: [
      {
          abilityHiddenFlag: Boolean,
          abilitySlot: {type: Number},
          abilityName: String,
      }
  ],
  firstItem: {
      itemName: String,
      itemUrl: String
  }
},
 {collection: "pokemons"});

const Pokemon = model("Pokemon", PokemonSchema);

export default Pokemon;