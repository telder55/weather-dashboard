// var city = "denver";
// var currentCity = "Chicago";
var currentCardParent = document.getElementById("current-area");
var currentCard = document.createElement("div");


function getWeather(city) {
    // Getting City Date and Time
    var DateTime = luxon.DateTime;
    var dt = DateTime.local();
    //Logs City Name and Time
    console.log(city, dt.toLocaleString());

    // Call API by City Name
    var cityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=3a551c8fc73e4638743bd3a7d220e283`;

    //getting city weather and coordinates
    fetch(cityWeather).then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                //logs all current weather data in object
                console.log(data);
                //logs current temperature in Fahrenheit
                console.log("Current Temp: ", data.main.temp);
                //logs current humidity as a percentage
                console.log("Current Humidity: ", data.main.humidity);
                //logs windspeed in MPH
                console.log("Current Wind Speed: ", data.wind.speed);
                // Logs and Longitude
                console.log("Longitude:", data.coord.lon);
                // Logs and Longitude
                console.log("Latitude:", data.coord.lat);

                // Adding to Screen
                currentCard.innerHTML = "";
                var cityDate = document.createElement("h4");
                var cityTemp = document.createElement("p");
                var cityHumidity = document.createElement("p");
                var cityWind = document.createElement("p");
                
            
                cityDate.textContent = city + " " + dt.toLocaleString();
                cityTemp.textContent = "Temperature: " + data.main.temp + " F";
                cityHumidity.textContent = "Humidity: " + data.main.humidity + "%";
                cityWind.textContent = "Wind Speed: " + data.wind.speed + " MPH";
                currentCard.appendChild(cityDate);
                currentCard.appendChild(cityTemp);
                currentCard.appendChild(cityHumidity);
                currentCard.appendChild(cityWind);
                currentCardParent.appendChild(currentCard);

                getUVI(data.coord.lon, data.coord.lat);

                // Change this function to make display!
                //   displayRepos(data, user);

                //pass coordinates to new function and then define the cityWeatherOneCall variable within that function and do a fetch there

            });

        } else {
            alert('Error: ' + response.statusText);
        }
    })
        .catch(function (error) {
            alert('Unable to connect to Weather');
        });

    // Getting UV Index
    function getUVI(lon, lat) {
        var cityWeatherOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=3a551c8fc73e4638743bd3a7d220e283`;
        fetch(cityWeatherOneCall).then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    //Logs Current UVI
                    console.log("Current UV Index: ", data.current.uvi);

                    //Adding UV Index to screen
                    var cityUV = document.createElement("p");
                    cityUV.textContent = "UV Index: " + data.current.uvi;
                    if (data.current.uvi >= 3 && data.current.uvi < 6) {
                        cityUV.classList.add("yellow")
                    } else if (data.current.uvi >= 6 && data.current.uvi < 8) {
                        cityUV.classList.add("orange")
                    } else if (data.current.uvi >= 8 && data.current.uvi <= 10) {
                        cityUV.classList.add("red");
                    } else cityUV.classList.add("green")
                    
                    currentCard.appendChild(cityUV);
                    


                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
            .catch(function (error) {
                alert('Unable to get UVI');
            });
    };



};


// Event Listener for Search Button
var searchBTN = document.getElementById("search-button");
searchBTN.addEventListener("click", getQuery);



function getQuery(event) {
    event.preventDefault();
    var searchText = document.getElementById("search-text").value;
    console.log(searchText);
    getWeather(searchText);
};

// Notes on getting from local storage