$(function () {

    function getApi() {
        let url = "http://api.openweathermap.org/data/2.5/weather?q=Boston&id=524901&appid=a1d66d99e4fef075a52f8388265e5590";

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data.weather)
                let card = document.createElement('h3');
                card.innerHTML = data.weather[0].main;
                $('.container').append(card);

            })
    };


    getApi();

});











