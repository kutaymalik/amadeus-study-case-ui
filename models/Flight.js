import mongoose from "mongoose";
import slugify from "slugify";

const FlightSchema = new mongoose.Schema({
    departureAirport: {
        type: String,
        ref: 'City',
    },
    arrivalAirport: {
        type: String,
        ref: 'City',
    },
    departureDate: {
        type: Date,
        required: true,
    },
    arrivalDate: {
        type: Date,
    },
    flightCode: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    flightLength: {
        type: Number,
        required: true,
    },
    slugArrAir: {
        type: String,
    },
    slugDepAir: {
        type: String,
    },
})

FlightSchema.pre('validate', function(next) {
    this.slugArrAir = slugify(this.arrivalAirport, {
        lower: true,
        strict: true
    })
    this.slugDepAir = slugify(this.departureAirport, {
        lower: true,
        strict: true,
    })
    next();
})

const Flight = mongoose.model('Flight', FlightSchema)

export { Flight };