import express from "express";
import { createFlight, filterFlight, getAllFlights, getFlight} from "../controllers/flightController.js";

const flightRoute = express.Router();

flightRoute.route('/').post(createFlight);
flightRoute.route('/').get(getAllFlights)
flightRoute.route('/:key').get(filterFlight);
flightRoute.route('/:code').get(getFlight);

export { flightRoute };