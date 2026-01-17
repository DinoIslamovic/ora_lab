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
			response.send("[]");
		}
		else {
			response.send(res.rows[0].json_agg);
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
			response.send("[]");
		}
		else {
			response.send(res.rows[0].json_agg);
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
			response.send("[]");
		}
		else {
			response.send(res.rows[0].json_agg);
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
			response.send("[]");
		}
		else {
			response.send(res.rows[0].json_agg);
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
			response.send("[]");
		}
		else {
			response.send(res.rows[0].json_agg);
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
			response.send("[]");
		}
		else {
			response.send(res.rows[0].json_agg);
		}
	})
	
});







app.listen(process.env.PORT || 3000, () => console.log("http://localhost:3000"));