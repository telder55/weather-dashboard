// Setting Global Variables
var currentCardParent = document.getElementById("current-area");
var currentCard = document.createElement("div");

var fiveDayParent = document.getElementById("five-day");
var fiveDayCard = document.createElement("div");



function getWeather(city) {
    // Getting City Date and Time
    var DateTime = luxon.DateTime;
    var dt = DateTime.local();

    // 1-5 days after current date
    var dayOne = DateTime.local().plus({ days: 1 }).toLocaleString();
    var dayTwo = DateTime.local().plus({ days: 2 }).toLocaleString();
    var dayThree = DateTime.local().plus({ days: 3 }).toLocaleString();
    var dayFour = DateTime.local().plus({ days: 4 }).toLocaleString();
    var dayFive = DateTime.local().plus({ days: 5 }).toLocaleString();

    // Call API by City Name
    var cityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=3a551c8fc73e4638743bd3a7d220e283`;

    //getting city weather and coordinates
    fetch(cityWeather).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                // Creating URL for icon image
                var iconURL = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

                // Adding to Screen
                currentCard.innerHTML = "";
                var cityDate = document.createElement("h4");
                var cityTemp = document.createElement("p");
                var cityHumidity = document.createElement("p");
                var cityWind = document.createElement("p");

                //Filling in Elements
                cityDate.textContent = city + " " + dt.toLocaleString();
                cityTemp.textContent = "Temperature: " + Math.round(data.main.temp) + " F";
                cityHumidity.textContent = "Humidity: " + Math.round(data.main.humidity) + "%";
                cityWind.textContent = "Wind Speed: " + Math.round(data.wind.speed) + " MPH";

                // Creating IMG Tag with ID #current-icon
                $('#current-area').html($('<img>', { id: 'current-icon' }));
                // Adding src URL to IMG Tag 
                $('#current-icon').attr('src', iconURL);

                //Appending Elements
                currentCard.appendChild(cityDate);
                currentCard.appendChild(cityTemp);
                currentCard.appendChild(cityHumidity);
                currentCard.appendChild(cityWind);
                currentCardParent.appendChild(currentCard);

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

    // Getting UV Index and 5-Day Forecast
    function getUVI(lon, lat) {
        var cityWeatherOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=3a551c8fc73e4638743bd3a7d220e283`;
        fetch(cityWeatherOneCall).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

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

                    // For Loop to move through array and grab 5-day forecast data. 
                    var weatherArray = data.daily
                    for (var i = 1; i < 6; i++) {

                        // Create Variables for Each Day
                        var dayIcon = weatherArray[i].weather[0].icon;
                        var dayTemp = weatherArray[i].temp.day;
                        var dayHumidity = weatherArray[i].humidity;

                        // Creating URL for icon image
                        var fiveDayIconURL = "http://openweathermap.org/img/w/" + dayIcon + ".png";

                        if (!($('#five-day-box' + i).length)) {
                            // Create DIV with ID 'five-day'
                            $('#five-day').append($('<div>', { id: 'five-day-box' + i, class: 'five-day' }, + '</div>'))

                            // Create Icon Element
                            $('#five-day-box' + i).append($('<img>', { id: 'five-icon' + i },));
                            // Adding src URL to IMG Tag 
                            $('#five-icon' + i).attr('src', fiveDayIconURL);

                            // Create 5-day Temperature 
                            $('#five-day-box' + i).append($('<p>', { id: 'temp' + i },));
                            $('#temp' + i).text("Temp: " + Math.round(dayTemp) + " F");

                            // Create 5-day Humidity
                            $('#five-day-box' + i).append($('<p>', { id: 'humidity' + i }, + "Humidity: " + dayHumidity + "%" + '</p>'));
                            $('#humidity' + i).text("Humidity: " + Math.round(dayHumidity) + "%");


                            // Add Date P Tag
                            $('#five-day-box' + i).prepend($('<p>', { id: 'date' + i }, + '</p>'));


                        } else {
                            // Update 5-Day Icons
                            $('#five-icon' + i).attr('src', fiveDayIconURL);

                            // Update 5-day Temperature
                            $('#temp' + i).text("Temp: " + Math.round(dayTemp) + " F");

                            // Update 5-day Humidity
                            $('#humidity' + i).text("Humidity: " + Math.round(dayHumidity) + "%");
                        }

                    }
                    // Adding Dates to 5-day boxes
                    $('#date1').text(dayOne);
                    $('#date2').text(dayTwo);
                    $('#date3').text(dayThree);
                    $('#date4').text(dayFour);
                    $('#date5').text(dayFive);

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


var cityHistoryArray = JSON.parse(localStorage.getItem("cityHistoryArray")) || [];

function getQuery(event) {
    event.preventDefault();
    var searchText = document.getElementById("search-text").value;
    setCity(searchText);
    getWeather(searchText);
    populateCity();
};

function setCity(query) {
    cityHistoryArray.push(query)
    var storageEntry = JSON.stringify(cityHistoryArray)
    localStorage.setItem("cityHistoryArray", storageEntry)
};


function populateCity() {
    $('#city-history').html("")
    var arrayLength = cityHistoryArray.length <= 5 ? cityHistoryArray.length : 5;
    for (let i = 0; i < arrayLength; i++) {
        $("#city-history").append($('<li>').addClass("list-group-item").text(cityHistoryArray[i]))

    }
    addHandler()
}
populateCity();

// Event Listener for Search History

function addHandler() {
    var searchItem = document.querySelectorAll(".list-group-item")
    searchItem.forEach(element => {
        element.addEventListener("click", function () {
            getWeather(element.innerText)
        });
    
    });
}
