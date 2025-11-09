function test() {
	filter = document.getElementById("formId").value;
	document.getElementById("temp_table").innerHTML = "";
	$(document).ready(function () {

		$.getJSON("fixedYearlyPopulation.json", function (data) {
			
			var temp = '';
			
			$.each(data, function (key, value) {
				boolVar = false;
				if(value.whatYear == filter || 
					value.growthRate == filter ||
					value.deathsMln == filter ||
					value.birthsMln == filter ||
					value.mostPopulousCountry == filter ||
					value.slowestGrowingCountry == filter ||
					value.nextYearPredictionMln == filter ||
					value.numberOfCountries == filter ||
					value.numberOfPeopleMln == filter ||
					filter == "") {
					    boolVar = true;
						}
					$.each(value.fastestGrowingCountries, function(key, countryData) {
						if(countryData.nameOfCountry == filter || countryData.growthRate == filter) {
							boolVar = true;
						}
					});
						if(boolVar == true) {
				   
							temp += '<tr>'; 
							
							temp += '<td>' + value.whatYear + '</td>';
							temp += '<td>' + value.growthRate + '</td>';
							temp += '<td>' + value.deathsMln + '</td>';
							temp += '<td>' + value.birthsMln + '</td>';
							temp += '<td>' + value.mostPopulousCountry + '</td>';
							temp += '<td>' + value.slowestGrowingCountry + '</td>';
							temp += '<td>' + value.nextYearPredictionMln + '</td>';
							temp += '<td>' + value.numberOfCountries + '</td>';
							temp += '<td>' + value.numberOfPeopleMln + '</td>';
							
							temp += '<td>'; 
							temp += '<ul>'; 
							
							$.each(value.fastestGrowingCountries, function(key, countryData) {
								temp += '<li>' + countryData.nameOfCountry + ' (' + countryData.growthRate + ')' + '</li>';
							});
							temp += '</ul>'; 
							temp += '</td>';  
							
							temp += '</tr>';
						}
				
			});
			
			$('#temp_table').append(temp);
			
		});

	});
};

test();