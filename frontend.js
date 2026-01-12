var table = document.getElementById("temp_table");
var btn = document.getElementById("filterButton");

btn.addEventListener("click", pressFunc)
var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', 'fixedYearlyPopulation.json');
httpRequest.onload = function() {
	var jsonData = filterData(JSON.parse(httpRequest.responseText));
	writeData(jsonData);
};
httpRequest.send();


function pressFunc() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', 'fixedYearlyPopulation.json');
	httpRequest.onload = function() {
		var jsonData = filterData(JSON.parse(httpRequest.responseText));
		writeData(jsonData);
	};
	httpRequest.send();
	
};

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