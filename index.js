const pg = require('pg');
//const R = require('ramda');
const fs = require('fs');
const express = require('express');
const { EventEmitter } = require('events');

const cs = 'postgresql://postgres:bazepodataka@localhost:5432/fixedYearlyPopulation';

const client = new pg.Client(cs);
client.connect();

const app = express();
app.use(express.json()); 
//client.connect();

client.query('SELECT * FROM censusyear').then(res => {

	const data = res.rows;

	//console.log('all data');
	data.forEach(row => {
		//console.log(`whatYear: ${row.whatyear}`);
	})


});

 


//const eventEmitter = new EventEmitter();
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


var formvalue, dropdown;
app.post('/getParams', (request, response) => {
	//console.log(request.body);
	formvalue = request.body.formvalue;
	dropdown = request.body.dropdown;
	response.send();
})


app.get('/buttonPress', (request, response) => {
	var allin = "FALSE", whatYear = "FALSE", growthRate = "FALSE", deathsMln = "FALSE", birthsMln = "FALSE", mostPopulousCountry = "FALSE";
	var slowestGrowingCountry = "FALSE", nextYearPredictionMln = "FALSE", numberOfCountries = "FALSE", numberOfPeopleMln = "FALSE", fastestGrowingCountries = "FALSE";
	if(formvalue=="") {
		formvalue ='0';
		allin="TRUE";
	}
	formvalue = '\''+formvalue+'\'';
	switch(dropdown) {
		case "wildcard":
			//console.log("wildcard")
			whatYear="TRUE";
			growthRate="TRUE";
			deathsMln="TRUE";
			birthsMln="TRUE";
			mostPopulousCountry="TRUE";
			slowestGrowingCountry="TRUE";
			nextYearPredictionMln="TRUE";
			numberOfCountries="TRUE";
			numberOfPeopleMln="TRUE";
			fastestGrowingCountries="TRUE";
			break;
		case "whatYear":
			whatYear="TRUE";
			break;
		case "growthRate":
			growthRate="TRUE";
			break;
		case "deathsMln":
			deathsMln="TRUE";
			break;
		case "birthsMln":
			birthsMln="TRUE";
			break;
		case "mostPopulousCountry":
			mostPopulousCountry="TRUE";
			break;
		case "slowestGrowingCountry":
			slowestGrowingCountry="TRUE";
			break;
		case "nextYearPredictionMln":
			nextYearPredictionMln="TRUE";
			break;
		case "numberOfCountries":
			numberOfCountries="TRUE";
			break;
		case "numberOfPeopleMln":
			numberOfPeopleMln="TRUE";
			break;
		case "fastestGrowingCountries":
			fastestGrowingCountries="TRUE";
			break;
	}
	/*console.log('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
		nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
		SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
		\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
		\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
		censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
		ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear \
		WHERE (cast(censusyear.whatyear AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+whatYear+') OR\
		(cast(censusyear.growthrate AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+growthRate+') OR\
		(cast(censusyear.deathsmln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+deathsMln+') OR\
		(cast(censusyear.birthsmln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+birthsMln+') OR\
		(cast(censusyear.mostpopulouscountry AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+mostPopulousCountry+') OR\
		(cast(censusyear.slowestGrowingCountry AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+slowestGrowingCountry+') OR\
		(cast(censusyear.nextYearPredictionMln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+nextYearPredictionMln+') OR\
		(cast(censusyear.numberOfCountries AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+numberOfCountries+') OR\
		(cast(censusyear.numberOfPeopleMln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+numberOfPeopleMln+') OR\
		(cast(groupedCountries.whatYear AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+fastestGrowingCountries+') OR '+allin); */
	//client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear WHERE cast(fixedYearlyPopulation.whatyear AS TEXT) LIKE \'%'+searchString+'%\'').then(res => {
	/*client.query('COPY (WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
		nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
		SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
		\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
		\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
		censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
		ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear \
		WHERE (cast(censusyear.whatyear AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+whatYear+') OR\
		(cast(censusyear.growthrate AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+growthRate+') OR\
		(cast(censusyear.deathsmln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+deathsMln+') OR\
		(cast(censusyear.birthsmln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+birthsMln+') OR\
		(cast(censusyear.mostpopulouscountry AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+mostPopulousCountry+') OR\
		(cast(censusyear.slowestGrowingCountry AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+slowestGrowingCountry+') OR\
		(cast(censusyear.nextYearPredictionMln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+nextYearPredictionMln+') OR\
		(cast(censusyear.numberOfCountries AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+numberOfCountries+') OR\
		(cast(censusyear.numberOfPeopleMln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+numberOfPeopleMln+') OR\
		(cast(groupedCountries.whatYear AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+fastestGrowingCountries+') OR '+allin+') TO \'./filteredData.json\' WITH (FORMAT JSON)')
	*/
	//client.query('COPY (SELECT * FROM censusdata) TO \'./filteredData.csv\' WITH (FORMAT CSV, HEADER)');
	client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
		nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
		SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
		\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
		\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
		censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
		ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear \
		WHERE (cast(censusyear.whatyear AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+whatYear+') OR\
		(cast(censusyear.growthrate AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+growthRate+') OR\
		(cast(censusyear.deathsmln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+deathsMln+') OR\
		(cast(censusyear.birthsmln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+birthsMln+') OR\
		(cast(censusyear.mostpopulouscountry AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+mostPopulousCountry+') OR\
		(cast(censusyear.slowestGrowingCountry AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+slowestGrowingCountry+') OR\
		(cast(censusyear.nextYearPredictionMln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+nextYearPredictionMln+') OR\
		(cast(censusyear.numberOfCountries AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+numberOfCountries+') OR\
		(cast(censusyear.numberOfPeopleMln AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+numberOfPeopleMln+') OR\
		(cast(groupedCountries.whatYear AS TEXT) LIKE \'%\' || cast('+formvalue+' AS TEXT) || \'%\' AND '+fastestGrowingCountries+') OR '+allin).then(res => {
		//console.log(res.rows[0].json_agg);
		if(res.rows[0].json_agg == null) {
			response.send("[]");
		}
		else {
			response.send(res.rows[0].json_agg);
		}
		


	});

	
	
})



app.get('/api/v1/data/all', (request, response) => {
	client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
		nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
		SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
		\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
		\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
		censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
		ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear').then(res => {
		if(res.rows[0].json_agg == null) {
			response.status(404).send({status: 404, response: "[]"});
		}
		else {
			response.status(200).send({status: 200, response: res.rows[0].json_agg});
		}
	})
});

app.get('/api/v1/data/specific/:id', (request, response) => {
	//console.log(request.params.id);
	
	client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
					nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
					SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
					\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
					\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
					censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
					ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear \
					WHERE cast(censusyear.whatyear AS TEXT) = cast('+request.params.id+' AS TEXT)').then(res => {
		//console.log("success");
		if(res.rows[0].json_agg == null) {
			response.status(404).send({status: 404, response: "[]"});
		}
		else {
			response.status(200).send({status: 200, response: res.rows[0].json_agg});
		}
	})
	
});

app.get('/api/v1/data/before2020', (request, response) => {
	//console.log(request.params.id);
	
	client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
					nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
					SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
					\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
					\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
					censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
					ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear \
					WHERE censusyear.whatyear < 2020').then(res => {
		//console.log("success");
		if(res.rows[0].json_agg == null) {
			response.status(404).send({status: 404, response: "[]"});
		}
		else {
			response.status(200).send({status: 200, response: res.rows[0].json_agg});
		}
	})
	
});

app.get('/api/v1/data/after2020', (request, response) => {
	//console.log(request.params.id);
	
	client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
					nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
					SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
					\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
					\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
					censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
					ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear \
					WHERE censusyear.whatyear >= 2020').then(res => {
		//console.log("success");
		if(res.rows[0].json_agg == null) {
			response.status(404).send({status: 404, response: "[]"});
		}
		else {
			response.status(200).send({status: 200, response: res.rows[0].json_agg});
		}
	})
	
});

app.get('/api/v1/data/chinaBiggest', (request, response) => {
	//console.log(request.params.id);
	
	client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
					nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
					SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
					\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
					\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
					censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
					ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear \
					WHERE cast(censusyear.mostPopulousCountry AS TEXT) = \'China\'').then(res => {
		//console.log("success");
		if(res.rows[0].json_agg == null) {
			response.status(404).send({status: 404, response: "[]"});
		}
		else {
			response.status(200).send({status: 200, response: res.rows[0].json_agg});
		}
	})
	
});

app.get('/api/v1/data/indiaBiggest', (request, response) => {
	//console.log(request.params.id);
	
	client.query('WITH groupedCountries AS (SELECT whatyear, json_agg(json_build_object(\'nameOfCountry\', \
					nameofcountry,\'growthRate\', growthrate) ORDER BY growthrate DESC) AS countriesArray FROM fastestGrowingCountries GROUP BY whatyear) \
					SELECT json_agg(json_build_object(\'whatYear\', censusyear.whatyear, \'growthRate\', censusyear.growthRate, \
					\'deathsMln\', censusyear.deathsMln,\'birthsMln\', censusyear.birthsmln,\'mostPopulousCountry\', censusyear.mostpopulouscountry,\
					\'slowestGrowingCountry\', censusyear.slowestgrowingcountry,\'nextYearPredictionMln\', censusyear.nextyearpredictionmln,\'numberOfCountries\', \
					censusyear.numberofcountries,\'numberOfPeopleMln\', censusyear.numberofpeoplemln,\'fastestGrowingCountries\', groupedCountries.countriesArray) \
					ORDER BY censusyear.whatyear DESC) FROM censusyear JOIN groupedCountries ON censusyear.whatyear = groupedCountries.whatyear \
					WHERE cast(censusyear.mostPopulousCountry AS TEXT) = \'India\'').then(res => {
		//console.log("success");
		if(res.rows[0].json_agg == null) {
			response.status(404).send({status: 404, response: "[]"});
		}
		else {
			response.status(200).send({status: 200, response: res.rows[0].json_agg});
		}
	})
	
});

app.post('/api/v1/data/insert', (request, response) => {
	//console.log(request.query);
	if (!request.query.whatYear || !request.query.growthRate || !request.query.deathsMln || !request.query.birthsMln || !request.query.mostPopulousCountry || !request.query.slowestGrowingCountry || !request.query.nextYearPredictionMln || !request.query.numberOfCountries || !request.query.numberOfPeopleMln) {
		return response.status(400).send({response: "Error with parameters"});
	}
	const whatYear = request.query.whatYear, growthRate = request.query.growthRate, deathsMln = request.query.deathsMln, birthsMln = request.query.birthsMln, mostPopulousCountry = request.query.mostPopulousCountry;
	const slowestGrowingCountry = request.query.slowestGrowingCountry, nextYearPredictionMln = request.query.nextYearPredictionMln, numberOfCountries = request.query.numberOfCountries, numberOfPeopleMln = request.query.numberOfPeopleMln;
	valuesArray = [whatYear, growthRate, deathsMln, birthsMln, mostPopulousCountry, slowestGrowingCountry, nextYearPredictionMln, numberOfCountries, numberOfPeopleMln];
	if(!request.query.country1name || !request.query.country1growth ||!request.query.country2name || !request.query.country2growth ||!request.query.country3name || !request.query.country3growth) {
		return response.status(400).send({response: "Error with parameters"});
	}
	const country1name = request.query.country1name, country1growth = request.query.country1growth;
	const country2name = request.query.country2name, country2growth = request.query.country2growth;
	const country3name = request.query.country3name, country3growth = request.query.country3growth;
	valuesArray2 = [whatYear, country1name, country1growth, country2name, country2growth, country3name, country3growth]
	//console.log(valuesArray2);
	try {
		client.query({text:'INSERT INTO censusyear (whatYear, growthRate, deathsMln, birthsMln, mostPopulousCountry, slowestGrowingCountry, nextYearPredictionMln, numberOfCountries, numberOfPeopleMln) \
					VALUES(cast($1 AS integer), cast($2 as float), cast($3 as integer), cast($4 as integer), cast($5 as text), cast($6 as text), cast($7 as integer), cast($8 as integer), cast($9 as integer))', values: valuesArray});
		//console.log("0");
		client.query({
				text: 'INSERT INTO fastestgrowingcountries (nameofcountry, growthrate, whatyear) VALUES \
						(cast($1 as text), cast($2 as float), cast($3 as integer))',
				values: [country1name, country1growth, whatYear]
			});
		//console.log("1");
		client.query({
				text: 'INSERT INTO fastestgrowingcountries (nameofcountry, growthrate, whatyear) VALUES \
						(cast($1 as text), cast($2 as float), cast($3 as integer))',
				values: [country2name, country2growth, whatYear]
			});
		//console.log("2");
		client.query({
				text: 'INSERT INTO fastestgrowingcountries (nameofcountry, growthrate, whatyear) VALUES \
						(cast($1 as text), cast($2 as float), cast($3 as integer))',
				values: [country3name, country3growth, whatYear]
			}).then(res => {
				response.status(201).send({response: {whatYear: whatYear, growthRate: growthRate, other: "..."}});
		});
	}
	catch(err) {
		response.status(500).send({response: "Database error"});
	}
	
});

app.put('/api/v1/data/modify/:whatYear', (request, response) => {
	const thisYear = request.params.whatYear;
	if(!request.params.whatYear) {
		return response.status(400).send({status: 400, response: "Missing whatYear key"})
	}
	client.query('SELECT * FROM censusyear WHERE whatyear = cast('+request.params.whatYear+' AS integer)').then(res => {
		//console.log(res.rows.length);
		if(res.rows.length == 0) {
			response.status(404).send({status: 404, response: "There is no data under whatyear="+thisYear});
		}
		else {
			var update_string = "whatYear = "+request.params.whatYear;
			if(request.query.growthRate) {
				update_string += ", growthRate = "+request.query.growthRate;
			}
			if(request.query.deathsMln) {
				update_string += ", deathsMln = "+request.query.deathsMln;
			}
			if(request.query.birthsMln) {
				update_string += ", birthsMln = "+request.query.birthsMln;
			}
			if(request.query.mostPopulousCountry) {
				update_string += ", mostPopulousCountry = \'"+request.query.mostPopulousCountry+"\'";
			}
			if(request.query.slowestGrowingCountry) {
				update_string += ", slowestGrowingCountry = \'"+request.query.slowestGrowingCountry+"\'";
			}
			if(request.query.nextYearPredictionMln) {
				update_string += ", nextYearPredictionMln = "+request.query.nextYearPredictionMln;
			}
			if(request.query.numberOfCountries) {
				update_string += ", numberOfCountries = "+request.query.numberOfCountries;
			}
			if(request.query.numberOfPeopleMln) {
				update_string += ", numberOfPeopleMln = "+request.query.numberOfPeopleMln;
			}
			console.log(update_string);
			try {
				client.query('UPDATE censusyear SET '+update_string+' WHERE whatYear = cast('+request.params.whatYear+' AS integer)').then(res => {
					response.status(200).send({status: 200, response: "Data at whatYear="+request.params.whatYear+" has been modified"});
				});
			}
			catch(err) {
				response.status(304).send({status: 304, response: "Data has not been modified due to an error"});
			}
		}
	})
	
	

});

app.delete('/api/v1/data/delete/:whatYear', (request, response) => {
	if(!request.params.whatYear) {
		return response.status(400).send({status: 400, response: "Missing whatYear key"})
	}
	const whatYear = request.params.whatYear;
	try {
		client.query({text: 'DELETE FROM fastestgrowingcountries WHERE whatyear = cast($1 as integer)', values: [whatYear]});
		client.query({text: 'DELETE FROM censusyear WHERE whatyear = cast($1 as integer)', values: [whatYear]}).then(res => {
			response.status(410).send({status: 410, response: "Data at year "+whatYear+" has been deleted"});
		});
	}
	catch(err) {
		response.status(500).send({status: 500, response: "Database error"});
	}
});






app.listen(process.env.PORT || 3000, () => console.log("http://localhost:3000"));