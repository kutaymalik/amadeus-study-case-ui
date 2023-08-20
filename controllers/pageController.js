import express from 'express';

import { City } from "../models/City.js"

const createCity = async(req, res) => {
    try {
        const city = await City.create({
            name: req.body.name,
        });
        res.status(201).json({
            status: 'success',
            city,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllCities = async(req, res) => {
    try {
        const query = await req.query.search;

        let filter = {};

        if(query) {
            filter = {name: query};
        }
        
        if(!query) {
            filter.name = "";
        }

        const cities = await City.find({
            $or:[
                {name: {$regex: '.*' + filter.name + '.*', $options: 'i'}}
            ]
        }).sort('name');
        res.status(200).render('index', {
            cities,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getIndexPage = async(req, res) => {

    try {
        const query = await req.query.search;

        let filter = {};

        if(query) {
            filter = {name: query};
        }
        
        if(!query) {
            filter.name = "";
        }

        const cities = await City.find({
            $or:[
                {name: {$regex: '.*' + filter.name + '.*', $options: 'i'}}
            ]
        }).sort('name');
        res.status(200).render('index', {
            cities,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export {getIndexPage, createCity, getAllCities};