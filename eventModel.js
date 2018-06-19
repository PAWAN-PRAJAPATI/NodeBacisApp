const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    event:"string",
    lat:"string",
    long:"string"

});

const Event = mongoose.model("Events",eventSchema);

module.exports = Event;