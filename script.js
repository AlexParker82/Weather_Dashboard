$(function () {
    const searchSideBar$ = $('.sidebar');
    const savedSideBar$ = $('.sidebar-saved');
    const resultCard$ = $('.card');
    const cardTitle$ = $('.card-title')
    const cardSubtitle$ = $('.card-subtitle');
    const displayTemp$ = $('#temp');
    const displayWind$ = $('#wind');
    const displayHumidity$ = $('#humidity');
    const userInput$ = $('input');
    const newBtn$ = $('.btn-primary');
    let storageArray = JSON.parse(localStorage.getItem('cityInfo'));;

    function getCurrentApi() {
        let userInput = userInput$.val();
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&id=524901&appid=a1d66d99e4fef075a52f8388265e5590`;

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
                    $('h4').remove('.alert');
                    let cityObj = {
                        city: userInput.trim(),
                        lat: data.coord.lat,
                        lon: data.coord.lon
                    }

                    storageArray.push(cityObj);
                    localStorage.setItem('cityInfo', JSON.stringify(storageArray));

                    let date = moment.unix(data.dt).format("dddd, MMMM Do YYYY");
                    resultCard$.addClass('show');
                    cardTitle$.text(data.name);
                    cardSubtitle$.text(date);
                    displayTemp$.text(data.main.temp);
                    displayWind$.text(data.wind.speed);
                    displayHumidity$.text(data.main.humidity);
                }

            });
    };

    function RenderSavedBtns() {

        console.log(storageArray);
        if (!storageArray) {
            return;
        } else {
            console.log(storageArray);
            storageArray.forEach(function (item, index) {
                let cityBtn = document.createElement('button');
                cityBtn.className = "btn btn-secondary my-2";
                cityBtn.innerHTML = storageArray[index].city;
                savedSideBar$.append(cityBtn);

            })
        }

    }

    RenderSavedBtns();

    newBtn$.click(function () {
        getCurrentApi();
        //RenderSavedBtns();
    })
});































