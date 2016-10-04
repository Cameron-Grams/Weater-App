var displayData = {
  city: document.querySelector("#city"),
  temperature: document.querySelector("#temperature"),
  weather: document.querySelector("#weather"),
  icon: document.querySelector("#icon"),
  source: document.querySelector("#source")
  };

function getWeather(latitude, longitude, displayValue) {
  if (window.XMLHttpRequest){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(){
      var response = JSON.parse(xhr.responseText);
      displayData.city.innerHTML = response.name;
      displayData.temperature.innerHTML = response.main.temp;
      var detailWeather = response.weather[0];
      var description = detailWeather.description;

      flickrLoad(latitude, longitude, description); 

      displayData.weather.innerHTML = description;
      displayData.icon.src = "http://openweathermap.org/img/w/" + detailWeather.icon + ".png";
    }, false);

    xhr.addEventListener("error", function(err){
      alert("Initial request error");
      }, false);

    var target = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=54e7bed8487f1b7de520fa68a9080abe&units=" + displayValue;

  xhr.open("GET", target, true);
  xhr.send();
  } else {
    alert("Initial XMLHttpRequest");
  }
}


function flickrLoad(latitude, longitude, description){
    var searchDesc, splitDesc;
    splitDesc = description.split(" ");
    searchDesc = splitDesc.slice(-1)[0];
    console.log(searchDesc);

    if (window.XMLHttpRequest){
    var body = document.getElementsByTagName('body')[0];
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(){
        var response = xhr;
        var fullText = response.responseText;
        var segment = (fullText.slice(14, -14)) + "}";
        var fullJSON = JSON.parse(segment); 
        var imgURL = fullJSON.photos.photo[0].url_l;
        var img = new Image();
        img.src = imgURL;
        body.style.backgroundImage = 'url(' + imgURL + ')';       

    }, false);
    xhr.open("GET", "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c004bd46564d26383d37d88c1cbd4154&lat=" + latitude + "&lon=" + longitude + "&accuracy=1&tags=" + searchDesc + "&sort=relevance&extras=url_l&format=json", true);
    xhr.send();
}}


function findIP( displayValue = "imperial"){
  if (window.XMLHttpRequest){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(){
        var response = JSON.parse(xhr.responseText);
        console.log(response.lat, response.lon);
        getWeather(response.lat, response.lon, displayValue);
        displayData.source.innerHTML = "From: " + response.query;
    }, false);
    xhr.open("GET", "http://ip-api.com/json", true);
    xhr.send();
}}

findIP();



document.getElementById("units").onclick = changeUnits;
var updateUnit = {count:1};

function changeUnits(){

    var displayValue, apiValue;
    var value = parseInt(document.getElementById("units").value);
    updateUnit.count += value;

    console.log(updateUnit.count);
    if (updateUnit.count % 2 == 0){
        displayValue = "Celsius";
        apiValue = "metric";
    } else if (updateUnit.count % 2 == 1){
        displayValue = "Farenheit";
        apiValue = "imperial";
    }
    document.getElementById("units").innerHTML = "Currently: " + displayValue + "<br> Change Units?";
    findIP( apiValue);
    return updateUnit;
}





