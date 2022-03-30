import Pokemon from "../models/app.models.mjs";
import axios from "axios";
import {StatusCodes} from "http-status-codes";

// Populate database
const populate = async(req, res) => {
    let countNew = 0;
    // if there is no need to populate yet
    let count = await Pokemon.find().estimatedDocumentCount();
    if (count>100) {
      res.status(StatusCodes.OK).send({message: "Database has more than enough records - no need to populate"});
      return;
      }
    // we will create an array with the urls of all 1st generation pokemons
    const respFirstGen = await axios.get('https://pokeapi.co/api/v2/generation/1/');
    let pokeName = [];
    respFirstGen.data.pokemon_species.forEach(item=> {
      pokeName.push(item.name);
    });
    // iterate over endpoint with name, query, and add all extracted data to DB
    for (let n of pokeName) {
      // first, check if it doesn't already exist in DB
      const element = await Pokemon.findOne({name: n});
      if (!element) {
          countNew++;
          let respName = await axios.get("https://pokeapi.co/api/v2/pokemon/" + n);
          let thisName = n;
          let thisHeight = respName.data.height;
          let thisWeight = respName.data.weight;
          let theseAbilities = respName.data.abilities;
          let theseAbilitiesNew = [];
          theseAbilities.forEach(item => {
            let element = {
              abilityHiddenFlag: item.is_hidden,
              abilitySlot: item.slot,
              abilityName: item.ability.name
            };
            theseAbilitiesNew.push(element);

          });
          let thisItem = {
            itemName: "",
            itemUrl: ""
          };
          if (respName.data.held_items.length > 0) {
            thisItem.itemName = respName.data.held_items[0].item.name;
            thisItem.itemUrl = respName.data.held_items[0].item.url;
          }
          let thisPoke = new Pokemon({
            name: thisName,
            height: thisHeight,
            weight: thisWeight,
            abilities: theseAbilitiesNew,
            firstItem: thisItem
          });
          let data = await thisPoke.save();
        }
     
    }
    res.status(StatusCodes.OK).send({message: `Database populated with ${countNew} new records.`});
}

// Create and save a new pokemon
const create = async(req, res) => {
  const pokemon = new Pokemon({
    name: req.body.name,
    height: req.body.height,
    weight: req.body.weight,
    abilities: req.body.abilities,
    firstItem: req.body.firstItem
  });

    try {
        let data = await pokemon.save();
        res.send(data);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: err.message || "An error occurred while creating the pokemon.",
        });
    }
}
 
// Retrieve all pokemons from the database
 const getAll = async(req, res) => {
    try {
        let data = await Pokemon.find();
        res.send(data);
      } catch (err) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: err.message || "An error occurred while retrieving the pokemons.",
          });
      }
};

// Retrieve the pokemon by id
const getOne = async(req, res) => {
    try {
      let data = await Pokemon.findById(req.params.id);
      if (!data) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: "Pokemon not found with id " + req.params.id,
        });
      }
      res.send(data);
    } catch(err) {
        if (err.kind === "ObjectId") {
            return res.status(StatusCodes.NOT_FOUND).send({
              message: "Pokemon not found with id " + req.params.id,
            });
          }
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Error retrieving pokemon with id " + req.params.id,
          });
    }    
};

// Update a pokemon identified by the id in the request
const update = async(req, res) => {
    try {
        let data = await Pokemon.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                height: req.body.height,
                weight: req.body.weight,
                abilities: req.body.abilities,
                firstItem: req.body.firstItem
            },
            { new: true } );

            if (!data) {
                return res.status(StatusCodes.NOT_FOUND).send({
                  message: "Pokemon not found with id " + req.params.id,
                });
              }
              res.send(data);
    } catch(err) {
        if (err.kind === "ObjectId") {
            return res.status(StatusCodes.NOT_FOUND).send({
              message: "Pokemon not found with id " + req.params.id,
            });
          }
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Error updating pokemon with id " + req.params.id,
          });
    }   
};

// Delete a pokemon with the specified id in the request
const deleteOne = async(req, res) => {
    try {
        let data = await Pokemon.findByIdAndRemove(req.params.id);
        if (!data) {
            return res.status(StatusCodes.NOT_FOUND).send({
                  message: "Pokemon not found with id " + req.params.id,
                });
        }
        res.send({message: "Pokemon successfully deleted!"});
    } catch(err) {
        if (err.kind === "ObjectId") {
            return res.status(StatusCodes.NOT_FOUND).send({
              message: "Pokemon not found with id " + req.params.id,
            });
          }
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Error deleting pokemon with id " + req.params.id,
          });
    }   
};

const deleteAll = async(req, res) => {
    try {
        await Pokemon.deleteMany();
        res.send({message: "All pokemons deleted!"});
    } catch(err) {
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Error deleting pokemons",
          });
    }   
};

const Poke = {populate, create, getAll, getOne, update, deleteOne, deleteAll};

export default Poke;