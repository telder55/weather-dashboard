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
                //Logs Icon
                console.log("Icon: ", data.weather[0].icon);
                // Logs and Longitude
                console.log("Longitude:", data.coord.lon);
                // Logs and Longitude
                console.log("Latitude:", data.coord.lat);
                
                // Creating URL for icon image
                var iconURL = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

                // Adding to Screen
                currentCard.innerHTML = "";
                var cityDate = document.createElement("h4");
                var cityTemp = document.createElement("p");
                var cityHumidity = document.createElement("p");
                var cityWind = document.createElement("p");
               

                //Filling in Elements
                cityDate.textContent = city + " " + dt.toLocaleString();
                cityTemp.textContent = "Temperature: " + data.main.temp + " F";
                cityHumidity.textContent = "Humidity: " + data.main.humidity + "%";
                cityWind.textContent = "Wind Speed: " + data.wind.speed + " MPH";
                
                // Creating IMG Tag with ID #current-icon
                $('#current-area').html($('<img>', {id: 'current-icon'}, {src: 'iconURL'}));
                // Adding src URL to IMG Tag 
                $('#current-icon').attr('src', iconURL);

                //Appending Elements
                currentCard.appendChild(cityDate);
                currentCard.appendChild(cityTemp);
                currentCard.appendChild(cityHumidity);
                currentCard.appendChild(cityWind);
                currentCardParent.appendChild(currentCard);

                // Adding URL to DOM
                $('#weather-icon').attr('src', iconURL);

                // Calling UV Index Function
                getUVI(data.coord.lon, data.coord.lat);

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
        var cityWeatherOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=3a551c8fc73e4638743bd3a7d220e283`;
        fetch(cityWeatherOneCall).then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    //logs all current weather data in object
                    console.log(data);
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

                    // 5-Day Forecast Section
                    // Day 1 Date 
                    console.log();
                    // Day 1 icon
                    console.log(data.daily[1].weather[0].icon);
                    // Day 1 Temp
                    console.log(data.daily[1].temp.day);
                    // Day 1 Humidity
                    console.log(data.daily[1].humidity);


                    // For Loop to move through array and grab 5-day forecast data. 



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