$(function () {
    const searchSideBar$ = $('.sidebar');
    const savedSideBar$ = $('.sidebar-saved');
    const sevenDayDiv$ = $('.sevenDay');
    const resultCard$ = $('.card');
    const cardTitle$ = $('.card-title')
    const cardSubtitle$ = $('.card-subtitle');
    const displayTemp$ = $('#temp');
    const displayWind$ = $('#wind');
    const displayHumidity$ = $('#humidity');
    const userInput$ = $('input');
    const newBtn$ = $('.btn-primary');
    const savedBtn$ = $('#savedBtn');
    let storageArray = JSON.parse(localStorage.getItem('cityInfo')) || [];

//function to get weather data from the api and render it on the screen, and stores the search query in local storage
    function getCurrentApi() {
        let userInput = userInput$.val();
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&id=524901&appid=a1d66d99e4fef075a52f8388265e5590`;

        $.get(url)
            .fail(function () {
                alert('404 Error');
            })

            .done(function (data) {
                if (userInput === "") {
                    let alert = $('<h4>').addClass('alert');
                    alert.text('Enter a City!');
                    searchSideBar$.append(alert);
                    $('h4').remove('.alert');
                } else {
                    console.log(data, "CURRENT");
                    $('h4').remove('.alert');
                    let cityObj = {
                        city: userInput,
                        lat: data.coord.lat,
                        lon: data.coord.lon
                    }
                    let lat = data.coord.lat;
                    let lon = data.coord.lon;

                    storageArray.push(cityObj);
                    localStorage.setItem('cityInfo', JSON.stringify(storageArray));

                    let date = moment.unix(data.dt).format("dddd, MMMM Do YYYY");
                    resultCard$.addClass('show');
                    cardTitle$.text(data.name);
                    cardSubtitle$.text(date);
                    displayTemp$.text(data.main.temp);
                    displayWind$.text(data.wind.speed);
                    displayHumidity$.text(data.main.humidity);
                    getSevenDay(lat, lon);
                }

            });
    };
// made another function to access the extended forecast.  I could not find a way to search the api for forecast info using the city name, only the latitude and longitude.
// I decided to try passing the lat and long data from the city search into the extended forecast search to access that data, and it kind of worked. Also renders the forecast cards 
//dynamically
    function getSevenDay(lat, lon) {
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=a1d66d99e4fef075a52f8388265e5590`;

        fetch(url)
            .then(function (response) {
                if (!response.ok) {
                    throw response.json();
                }

                return response.json();
            })
            .then(function (data) {
                console.log(data.daily, "7DAY");
                sevenDayDiv$.html("");
                data.daily.forEach(function(item, index) {
                    let weatherIconCode = data.daily[index].weather[0].icon;
                    let date = moment.unix(data.daily[index].dt).format("dddd, MMMM Do YYYY");
                    sevenDayDiv$.addClass('show');
                    let dailyCard = document.createElement('div');
                    dailyCard.className = 'card flex-fill';
                    let cardBody = document.createElement('div');
                    cardBody.className = 'card-body';
                    let cardTitle = document.createElement('h5');
                    cardTitle.className = 'card-title';
                    cardTitle.textContent = date;
                    let subTitle = document.createElement('h6');
                    subTitle.className = 'card-subtitle mb-2';
                    subTitle.textContent = data.daily[index].weather[0].main;
                    let weatherImage = document.createElement('img');
                    weatherImage.setAttribute("src", `http://openweathermap.org/img/w/${weatherIconCode}.png`);
                    let temp = document.createElement('p');
                    temp.className = 'card-text';
                    temp.textContent = `Temp: ${data.daily[index].temp.day} °F`;
                    let wind = document.createElement('p');
                    wind.className = 'card-text';
                    wind.textContent = `Wind: ${data.daily[index].wind_speed} MPH`;
                    let humidityVal = document.createElement('p');
                    humidityVal.className = 'card-text';
                    humidityVal.textContent = `Humidity: ${data.daily[index].humidity} %`;
                    sevenDayDiv$.append(dailyCard);
                    dailyCard.append(cardBody);
                    cardBody.append(cardTitle);
                    cardBody.appendChild(subTitle);
                    cardBody.appendChild(weatherImage);
                    cardBody.appendChild(temp);
                    cardBody.appendChild(wind);
                    cardBody.appendChild(humidityVal);

                })
                

            })
            .catch(function (error) {
                console.error(error);
            });

    };
//function to render the buttons for the saved user searches
    function RenderSavedBtns() {
        if (storageArray === null) {
            return;
        } else {
            storageArray.forEach(function (item, index) {
                let cityBtn = document.createElement('button');
                cityBtn.className = 'btn btn-secondary my-2';
                cityBtn.setAttribute('id', 'savedBtn')
                cityBtn.innerHTML = storageArray[index].city;
                savedSideBar$.append(cityBtn);

            });
        };
    };



    newBtn$.click(function () {
        getCurrentApi();
    });

    savedSideBar$.on('click', savedBtn$, function (e) {
        e.stopPropagation();
        let city = $(e.target).text();
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&id=524901&appid=a1d66d99e4fef075a52f8388265e5590`;
        console.log(city);

        $.get(url)
            .fail(function () {
                alert('Error');
            })

            .done(function (data) {
                let date = moment.unix(data.dt).format('dddd, MMMM Do YYYY');
                let lat = data.coord.lat;
                let lon = data.coord.lon;
                resultCard$.addClass('show');
                cardTitle$.text(data.name);
                cardSubtitle$.text(date);
                displayTemp$.text(data.main.temp);
                displayWind$.text(data.wind.speed);
                displayHumidity$.text(data.main.humidity);
                getSevenDay(lat, lon);
            });


    });

    RenderSavedBtns();

});


































