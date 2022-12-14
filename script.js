//Dom hooks for elements that will take input
var searcherEl = document.querySelector("#searcher");
var cardContainerEl = document.querySelector(".cardContainer");
var todayContainerEl = document.querySelector(".todayContainer");
var buttonContainerEl = document.querySelector(".buttonContainer");
//var cityButtonsEl = document.querySelector("")
//DOM hooks for elements that will display feedback
var todayEl = document.querySelector(".today");
var tomorrowEl = document.querySelector("#tomorrow");
var dayThreeEl = document.querySelector("#dayThree");
var dayFourEl = document.querySelector("#dayFour");
var dayFiveEl = document.querySelector("#dayFive");
//misc vars
var rhysApiKey = "8efdcf6890084b049f69cd42d7792cd8";
var scriptArray = []

function updateOrCreateStorage(cityInput){//run this whenever user submits. makes an array called scriptArray and a local storage array and updates them .
	var scriptArray = JSON.parse(localStorage.getItem("storageArray")); //gets whatever might be in local storage and assignes it to var scriptArray
	if(scriptArray == null) {//if scriptArray is null because nothing was presently in storageArray , 
		var scriptArray = [cityInput];//go ahead and fill scriptArray from the most recent user input instead.
		localStorage.setItem("storageArray", JSON.stringify(scriptArray));//and then also store it in local storage for next time.
	} else{
		scriptArray.unshift(cityInput);//if there already is something in local storage, grab that for the script array
		localStorage.setItem("storageArray", JSON.stringify(scriptArray));	
	}
	makeButtons(scriptArray);
}

function makeButtons(scriptArray){//receives scriptArray, a list of previously selected cities, and makes buttons for each city.
	buttonContainerEl.innerHTML =""; //clears previous buttons
	for (let i = 0; i < scriptArray.length; i++) {
	var cityButton = document.createElement("button");//makes a button but doesn't put it anywhere
	cityButton.innerHTML = scriptArray[i]; //gives the button text from scriptArray
	buttonContainerEl.appendChild(cityButton); //appends the button onto the button container
	}
}
function getLatLon(cityInput) {
		var latLonQueryUrl =
			"https://api.openweathermap.org/geo/1.0/direct?q=" +
			cityInput +
			"&appid=" +
			rhysApiKey;
		fetch(latLonQueryUrl)
			.then(function (response) {
				if (!response.ok) {
					alert("the city name you chose isn't resulting in any coordinates");
					throw response.json();
				}
				return response.json(); //rehydrates
			})
			.then(function (coordinates) {	
				if (coordinates.length==0){//sometimes the weather API returns an empty array instead of throwing a 400 or 404 so...
					alert("the city name you chose isn't resulting in any coordinates");//then alert
				}
				else {		
				var lat = coordinates[0].lat;
				var lon = coordinates[0].lon;	
				//updateOrCreateStorage(cityInput);//puts the successful city name into the storage array
				getToday(lat, lon); //passes lat and lon to the getToday function
				getWeather(lat, lon); //passes lat and lon to the getWeather function}
			}
			});
	}
function getToday(lat, lon) {
	var todayQueryURL =
		"https://api.openweathermap.org/data/2.5/weather?lat=" +
		lat +
		"&lon=" +
		lon +
		"&appid=" +
		rhysApiKey;
	fetch(todayQueryURL)
		.then(function (response) {
			if (!response.ok) {
				throw response.json();
			}
			return response.json(); 
		})
		.then(function (weather1) {
			putTodayinDOM(weather1); //passes the weather object to putTodayinDOM
		});
}
function putTodayinDOM(todaysStuff) {
todayContainerEl.innerHTML = ""; //clears previous "Today" weather reports

	var city = todaysStuff.name; // Why the heck won't this appear in the DOM????????
	console.log(todaysStuff.name+" is the name of the city that for some reason won't appear along with the date, temp, wind and humidity");
	var date = moment().format("MMM Do YY"); 
	var tempK = todaysStuff.main.temp;
	var tempF = (tempK - 273.15) * (9 / 5) + 32;
	var wind = todaysStuff.wind.speed;
	var humidity = todaysStuff.main.humidity;

	var cardDiv = document.createElement("div");
	cardDiv.classList.add("todayCard"); //gives styling to the today forcast

	var examplez = document.createElement("div");
	examplez.innerHTML = "examplez";

	var lineZero = document.createElement("div");
	lineZero.innerHTML = city;//WHY WONT THIS SHOW UP IN THE DOM????

	var lineOne = document.createElement("div");
	lineOne.innerHTML = date;+" is today's date";//shows up fine

	var lineTwo = document.createElement("div");
	lineZero.innerHTML = "Temperature: " + Math.round(tempF) + " (Farenheit)";//shows up fine

	var lineThree = document.createElement("div");
	lineThree.innerHTML = "Wind Speed: " + wind + "MPH";//shows up fine

	var lineFour = document.createElement("div");
	lineFour.innerHTML = "Humidity: " + humidity + "%";//shows up fine

	cardDiv.appendChild(lineZero); //These five lines append the five weather stats to cardDiv...
	cardDiv.appendChild(lineOne);
	cardDiv.appendChild(lineTwo);
	cardDiv.appendChild(lineThree);
	cardDiv.appendChild(lineFour);
	todayContainerEl.appendChild(cardDiv); //... and this appends cardDiv to the cardContainerEl
}
function getWeather(lat, lon) {
	//receives lat and lon as first and second things passed
	var weatherQueryURL =
		"http://api.openweathermap.org/data/2.5/forecast?lat=" +
		lat +
		"&lon=" +
		lon +
		"&appid=" +
		rhysApiKey;

	fetch(weatherQueryURL)
		.then(function (response) {
			//waiting for fetch promise to resolve
			if (!response.ok) {
				throw response.json();
			}
			return response.json(); //rehydrates
		})
		.then(function (weather) {
			putWeatherinDOM(weather); //passes the weather object to putWeatherinDOM
		});
}
function putWeatherinDOM(weatherstuff) {
	cardContainerEl.innerHTML = ""; //clears previous weather reports

	for (let i = 0; i < 35; i = i + 8) {
		var city = weatherstuff.city.name;
		var date = weatherstuff.list[i].dt_txt;
		var tempK = weatherstuff.list[i].main.temp;
		var tempF = (tempK - 273.15) * (9 / 5) + 32;
		var wind = weatherstuff.list[i].wind.speed;
		var humidity = weatherstuff.list[i].main.humidity;
		var cardDiv = document.createElement("div");
		cardDiv.classList.add("individualCard"); //gives styling to the five day forcast cards
	
		var lineZero = document.createElement("div");
		lineZero.innerHTML = city; //city?

		var lineOne = document.createElement("div");
		lineOne.innerHTML = date;

		var lineTwo = document.createElement("div");
		lineTwo.innerHTML = "Temperature: " + Math.round(tempF) + " (Farenheit)";

		var lineThree = document.createElement("div");
		lineThree.innerHTML = "Wind Speed: " + wind + "MPH";

		var lineFour = document.createElement("div");
		lineFour.innerHTML = "Humidity: " + humidity + "%";

		cardDiv.appendChild(lineZero); //These five lines append the five weather stats to cardDiv...
		cardDiv.appendChild(lineOne);
		cardDiv.appendChild(lineTwo);
		cardDiv.appendChild(lineThree);
		cardDiv.appendChild(lineFour);
		cardContainerEl.appendChild(cardDiv); //... and this appends cardDiv to the cardContainerEl
	}
}
searcherEl.addEventListener("submit", handleSearcherSubmit); // executes handleSearcherSubmit when a form submit happens to searcherEl
function handleSearcherSubmit(event) { //This needs to somehow listen for a submit from the form called "searcher" in the HTML
	event.preventDefault();
	var cityInput = document.querySelector("#searcher-input").value; 
	getLatLon(cityInput);//calls getLatLon which in turn calls getToday (which calls putTodayinDom) and getWeather(which calls putWeatherinDOM)
	updateOrCreateStorage(cityInput)
}
buttonContainerEl.addEventListener("click", function (event) {
	var buttonText = $(event.target).text();//grabs the city name text from the button and calls it buttonText
	getLatLon(buttonText);//hands off the city name from the button text to getLatLon, same as submitting from the form submit.
})
