
    const resultCard$ = $('.current');
    const cardTitle$ = $('.card-title')
    const cardSubtitle$ = $('.card-subtitle');
    const displayTemp$ = $('#temp');
    const displayWind$ = $('#wind');
    const displayHumidity$ = $('#humidity');

    function getApi() {
        let url = "http://api.openweathermap.org/data/2.5/weather?q=Boston&units=imperial&id=524901&appid=a1d66d99e4fef075a52f8388265e5590";

        $.get(url)
            .then(function(data) {
                console.log(data.name);
                let date = moment.unix(data.dt).format("dddd, MMMM Do YYYY");

                cardTitle$.text(data.name);
                cardSubtitle$.text(date);
                displayTemp$.text(data.main.temp);
                displayWind$.text(data.wind.speed);
                displayHumidity$.text(data.main.humidity);

            });
    };


    getApi();















