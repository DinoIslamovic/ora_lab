const pg = require('pg');
const R = require('ramda');
const fs = require('fs');

const cs = 'postgresql://postgres:bazepodataka@localhost:5432/fixedYearlyPopulation';

const client = new pg.Client(cs);

client.connect();

client.query('SELECT * FROM censusyear').then(res => {

	const data = res.rows;

	console.log('all data');
	data.forEach(row => {
		console.log(`whatYear: ${row.whatyear}`);
	})


}).finally(() => {
	client.end()
});

fs.readFile('input.txt', (err, data) => {
	if(err) throw err;
	
	console.log(data.toString());
});