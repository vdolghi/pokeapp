import express from "express";
import mongoose from "mongoose";
import router from "./app/routes/app.routes.mjs";
import cors from "cors";
import helmet from "helmet";

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://pokereader:pokereader@mongocluster.kbfar.mongodb.net/pokedb?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
        });

        console.log('MongoDB connected!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

connectDB();

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use('/api', router);

server.get('/', (req, res) => {
    res.json({"message": "Welcome to the PokeAPI!"});
});

let PORT = 8080;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});