import express from 'express';
import { createCity, getAllCities } from '../controllers/cityController.js';

const cityRoute = express.Router();

cityRoute.route('/').post(createCity);
cityRoute.route('/').get(getAllCities);

export { cityRoute };