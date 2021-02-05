var city = "denver";

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
                    console.log(data.current.uvi);

                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to get UVI');
        });
};

// Event Listener for Search Button
var searchBTN = document.getElementById("search-button")
document.addEventListener("click", clickFunction);

// Function to retrieve search query
function clickFunction() {
    console.log("click function log");

};

