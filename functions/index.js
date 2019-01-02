const functions = require('firebase-functions');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const mongooseConfig = { useNewUrlParser: true };

const { username, password } = functions.config().mongo;
const mongoUri = `mongodb://${username}:${password}@ds017231.mlab.com:17231/api-rest`;
mongoose.connect(mongoUri, mongooseConfig);

const app = express();

const Pets = require('./Pets');
const createServer = () => {
    app.use(cors({ origin: true }));

    app.get('/pets', async(req, res) => {

        const result = await Pets.find({}).exec();
        res.send(result);
    });

    app.post('/pets', async(req, res) => {
        const { body } = req;
        const pet = new Pets(body);
        await pet.save();
        res.sendStatus(204);
    });

    app.get('/pets/:id/daralta', async(req, res) => {
        const { id } = req.params;
        await Pets.deleteOne({ _id: id }).exec();
        res.sendStatus(204);
    });

    return app;
}

exports.api = functions.https.onRequest(createServer());