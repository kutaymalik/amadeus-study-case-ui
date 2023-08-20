import express from 'express';
import { getIndexPage, createCity, getAllCities } from '../controllers/pageController.js';


const pageRoute = express.Router();

pageRoute.route('/').get(getIndexPage);
pageRoute.route('/').post(createCity);
pageRoute.route('/city').get(getAllCities);

export { pageRoute };