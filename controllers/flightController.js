import slugify from "slugify";
import { Flight } from "../models/flight.js";
import { City } from "../models/City.js";

global.count=1;

const generateFlightCode = (departureAirport, arrivalAirport, departureDate) => {
    const departureCode = departureAirport.slice(0, 2).toUpperCase();
    const arrivalCode = arrivalAirport.slice(0, 2).toUpperCase();
    const dt = new Date(departureDate);
    const dateCode = dt.toISOString().slice(2, 10).replace(/-/g, "");

    const flightCode = `${departureCode}${arrivalCode}${dateCode}`;

    return flightCode;
}

const flightLengthCalc = (departureDate, arrivalDate) => {
    let depDate = new Date(departureDate);
    let arrDate = new Date(arrivalDate);
    let differenceVal = (depDate.getTime() - arrDate.getTime()) / 1000;
    differenceVal /= 60;
    return Math.abs(Math.round(differenceVal));
}

const priceCalc = (departureDate, arrivalDate) => {
    let length = flightLengthCalc(departureDate, arrivalDate);

    let price = Math.round((1297 / 18) * (length / 60));

    return price;
}

const createFlight = async(req, res) => {

    try {
        const {departureAirport, arrivalAirport, departureDate, arrivalDate} = req.body;

        const flightCode = generateFlightCode(departureAirport, arrivalAirport, departureDate);
        const flightLength = flightLengthCalc(departureDate, arrivalDate);
        const price = priceCalc(departureDate, arrivalDate);

        const flight = await Flight.create({
            departureAirport,
            arrivalAirport,
            departureDate,
            arrivalDate,
            flightCode,
            flightLength,
            price,
        })


        res.status(201).json({
            status: 'success',
            flight,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getFlight = async(req, res) => {
    try {
        const flight = await Flight.findOne({ flightCode: req.params.code });

        res.status(200).send(flight);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find();
        res.status(200).render('flights', {
            flights
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const filterFlight = async (req, res) => {
    const query_da = slugify(String(req.query.searchda), {
        lower: true,
        strict: true,
    });

    const query_aa = slugify(String(req.query.searchaa), {
        lower: true,
        strict: true
    });

    const query_dt = new Date(req.query.checkindt);
    const query_at = new Date(req.query.checkinat);
    
    let sortby = req.query.sortby;

    const cities = City.find();

    let filter = {};

    if(query_da && !query_aa) {
        filter = { slugDepAir: query_da };
        let cond = false;
        try {
            const flights = await Flight.find({
                $or:[
                    { slugDepAir: {$regex: '.*' + filter.slugDepAir + '.*' , $options: 'i'}}
                ]
            }).sort(sortby);

            if(flights.length != 0) {
                res.status(200).render('flights', {
                    flights,
                    cond
                })
            }
            else {
                res.status(204).render('index', {cities});
            }
    
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    else if(query_aa && !query_da) {
        let cond = false;
        filter = { slugArrAir: query_aa };
        try {
            const flights = await Flight.find({
                $or:[
                    { slugArrAir: {$regex: '.*' + filter.slugArrAir + '.*' , $options: 'i'}},
                ]
            }).sort(sortby);
    
            if(flights.length != 0) {
                res.status(200).render('flights', {
                    flights,
                    cond
                })
            }
            else {
                res.status(204).render('index', {cities});
            }
    
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    else if(query_da && query_aa) {
        filter = { slugDepAir: query_da, slugArrAir: query_aa };
        let cond = true;
        try {
            const inflights = await Flight.find({
                $and:[
                    { slugDepAir: filter.slugDepAir },
                    { slugArrAir:filter.slugArrAir},
                ]
            }).sort(sortby);

            const outflights = await Flight.find({
                $and:[
                    { slugDepAir: filter.slugArrAir },
                    { slugArrAir: filter.slugDepAir },
                ]
            }).sort(sortby);

            if(inflights.length != 0) {
                res.status(200).render('flights', {
                    inflights,
                    outflights,
                    cond
                })
            }
            else if(inflights.length == 0) {
                res.status(204).render('index', {cities});
            }
    
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    else if(query_aa && query_da && query_dt && !query_at) {
        try {
            let cond = false;
            const flights = await Flight.find({
                    $and:[
                        { slugDepAir: query_da },
                        { slugArrAir: query_aa },
                        { departureDate: query_dt },
                    ]
            }).sort(sortby);

            console.log(flights);
            
            if(flights.length != 0) {
                res.status(200).render('flights', {
                    flights,
                    cond
                })
            }
            else {
                res.status(204).render('index', {cities});
            }
    
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    else if(query_aa && query_da && query_dt && query_at) {
        try {
            let cond = true;
            const outflights = await Flight.find({
                    $and:[
                        { slugDepAir: query_da },
                        { slugArrAir: query_aa },
                        { departureDate: query_dt },
                    ]
            }).sort(sortby);

            const inflights = await Flight.find({
                $and:[
                    { slugDepAir: query_aa },
                    { slugArrAir: query_da },
                    { departureDate: query_at },
                ]
            }).sort(sortby);


            console.log(inflights);
            console.log(outflights);
            
            if(inflights.length != 0 && outflights != 0) {
                res.status(200).render('flights', {
                    inflights,
                    outflights,
                    cond
                })
            }
            else {
                res.status(204).render('index', {cities});
            }
    
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    else {
        const flights = await Flight.find().sort(sortby);
        let cond = false;
        res.status(200).render('flights', {
            flights,
            cond
        })
    }
}



export { createFlight, filterFlight, getAllFlights, getFlight };