# Flight Search Application

This application finds flights among the mock data suitable for the filters you choose.

## Installation

You don't need to install something. I deployed this project for amadeus ui case. Just download this repo in zip format. (Since it will be difficult to load the requirements for each project, I share all the codes openly. Please do not share the project with third parties.)

## Usage
After the downloading you can run this project with "npm start" command on vscode.

```bash
npm start
```

## Key Features

![flight_application](https://github.com/kutaymalik/amadeus-study-case-ui/assets/56682209/0296cce8-23d6-4d65-9c21-f0306bd28dfb)

- You can search the flight with the options of departure airport, arrival airport, departure, date, return date.

- If you choose a one-way flight, you do not need to enter a return date

- Flights suitable for your search are sorted according to the area you want.

- All search types are handled.

- All requests are made to a mock data.

- Mock data was created with mock api, this mock api has nodejs and python formats.

- The case of receiving empty data has been handled.

## Credits

This software uses the following open source packages:

- nodejs
- express
- mongoose
- nodemon
- ejs
- slugify
- dotenv
- bootstrap
