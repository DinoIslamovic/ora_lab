const pg = require('pg');
const R = require('ramda');
const fs = require('fs');
const express = require('express');
const { EventEmitter } = require('events');

const cs = 'postgresql://postgres:bazepodataka@localhost:5432/fixedYearlyPopulation';

const client = new pg.Client(cs);

const app = express();

client.connect();

client.query('SELECT * FROM censusyear').then(res => {

	const data = res.rows;

	//console.log('all data');
	data.forEach(row => {
		//console.log(`whatYear: ${row.whatyear}`);
	})


}).finally(() => {
	client.end()
});

fs.readFile('input.txt', (err, data) => {
	if(err) throw err;
	
	//console.log(data.toString());
});


const eventEmitter = new EventEmitter();
/*
eventEmitter.on('buttonPress', () => {
	console.log('pressed');
})
	*/


app.get('/', (request, response) => {
	fs.readFile('./index.html', 'utf8', (err, html) => {
		if(err) {
			response.status(500).send("server error");
		}

		response.send(html);
	})
})

app.get('/datatable.html', (request, response) => {
	fs.readFile('./datatable.html', 'utf8', (err, html) => {
		if(err) {
			response.status(500).send("server error");
		}

		response.send(html);
	})
})
app.get('/style.css', (request, response) => {
	fs.readFile('./style.css', 'utf8', (err, html) => {
		if(err) {
			response.status(500).send("server error");
		}

		response.send(html);
	})
})
app.get('/frontend.js', (request, response) => {
	fs.readFile('./frontend.js', 'utf8', (err, html) => {
		if(err) {
			response.status(500).send("server error");
		}

		response.send(html);
	})
})

app.get('/fixedYearlyPopulation.json', (request, response) => {
	fs.readFile('./fixedYearlyPopulation.json', 'utf8', (err, html) => {
		if(err) {
			response.status(500).send("server error");
		}

		response.send(html);
	})
})


app.get('/buttonPress', (request, response) => {
	
	client.connect();

	client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear').then(res => {
		response.send(res);
		/*
		const data = res.rows;

		console.log('all data');
		data.forEach(row => {
			console.log(`whatYear: ${row.whatyear}`);
		})
		*/


	}).finally(() => {
		client.end()
	});
	
	
})

app.listen(process.env.PORT || 3000, () => console.log("http://localhost:3000"));