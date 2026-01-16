//const pg = require('pg');
//const R = require('ramda');

//const { drop } = require("ramda");

//const cs = 'postgresql://postgres:bazepodataka@localhost:5432/fixedYearlyPopulation';

//const client = new pg.Client(cs);

//client.connect();

//const fs = require('fs');

//pg_ctl -D "C:/Program Files/PostgreSQL/17/data" stop

var table = document.getElementById("temp_table");
var btn = document.getElementById("filterButton");
var whatToSearch = document.getElementById("formId");


btn.addEventListener("click", pressFunc)
/*
var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', 'fixedYearlyPopulation.json');
httpRequest.onload = function() {
	var jsonData = filterData(JSON.parse(httpRequest.responseText));
	writeData(jsonData);
};
httpRequest.send();
*/

function pressFunc() {
	var formvalue = document.getElementById("formId").value;
	var dropdown = document.getElementById("selectField").value;
	var sendData = '{"formvalue":"'+formvalue+'","dropdown":"'+dropdown+'"}';
	var params = 'formvalue='+formvalue+'&dropdown='+dropdown;

	
	var postData = new XMLHttpRequest();
	postData.open('POST', 'getParams', true);
	postData.setRequestHeader('Content-type', 'application/json');
	postData.send(sendData)
	

	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', 'buttonPress');
	httpRequest.setRequestHeader('Content-type', 'application/json');
	httpRequest.onload = function() {
		//console.log("yo0");
		var jsonData = filterData(JSON.parse(httpRequest.responseText));
		//console.log(jsonData);
		writeData(jsonData);
	};
	httpRequest.send(sendData); 
	/*
	fetch("/buttonPress", {method: 'GET'}).then(function(response) {
		if(response.ok) {
			console.log('Click was recorded');
			//console.log(response.json);
			//return;
		}
		throw new Error('Request failed.');
	}).then(function(data) {
		var jsonData = filterData(JSON.parse(data));
		writeData(jsonData);
    }).catch(function(error) {
      console.log(error);
    });
	*/
	//writeData(filterData(response));
	
};
pressFunc();

function filterData(unfilteredData) {
	var filteredData = unfilteredData;
	return filteredData;
}

function writeData(data) {
	document.getElementById("temp_table").innerHTML = ""; 
	var inputString = ""
	//for(j = 0; j < data.length; j++) {
		var i = 0;
		for(var i = 0; i < data.length; i++) {
			inputString += "<tr>";
			inputString += "<th>" + data[i].whatYear + "</th>";
			inputString += "<th>" + data[i].growthRate + "</th>";
			inputString += "<th>" + data[i].deathsMln + "</th>";
			inputString += "<th>" + data[i].birthsMln + "</th>";
			inputString += "<th>" + data[i].mostPopulousCountry + "</th>";
			inputString += "<th>" + data[i].slowestGrowingCountry + "</th>";
			inputString += "<th>" + data[i].nextYearPredictionMln + "</th>";
			inputString += "<th>" + data[i].numberOfCountries + "</th>";
			inputString += "<th>" + data[i].numberOfPeopleMln + "</th>";
			inputString += "<th><table style=\"width:300px\">";
			inputString += "<tr><th style=\"width:200px\">" + data[i].fastestGrowingCountries[0].nameOfCountry + "</th><th style=\"width:100px\">" + data[i].fastestGrowingCountries[0].growthRate + "</th></tr>";
			inputString += "<tr><th style=\"width:200px\">" + data[i].fastestGrowingCountries[1].nameOfCountry + "</th><th style=\"width:100px\">" + data[i].fastestGrowingCountries[1].growthRate + "</th></tr>";
			inputString += "<tr><th style=\"width:200px\">" + data[i].fastestGrowingCountries[2].nameOfCountry + "</th><th style=\"width:100px\">" + data[i].fastestGrowingCountries[2].growthRate + "</th></tr>";
			inputString += "</table>";
			inputString += "</tr>";
		}
		//inputString += "</tr>";
	//}
	table.insertAdjacentHTML('afterbegin', inputString);
}

/*
client.query('SELECT * FROM censusyear').then(res => {

    const data = res.rows;

    console.log('all data');
    data.forEach(row => {
        console.log(`whatYear: ${row.whatyear}`);
    })


}).finally(() => {
    client.end()
});*/