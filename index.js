'use-strict';

const url="https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest";
const APIkey = "BLnD9vbttpdXhyvlXImgyUXASEkcU2bUvSpa89fw";

function handleLocation(latitude, longitude){
    console.log("in the handleLocation function");
    console.log("latitude: " + latitude + " longitude: " + longitude);
}

function getUserLocation(){
    console.log("In the geolocation function");
    geo = navigator.geolocation;
    if ("geolocation" in navigator) {
        console.log("Geolocation is available");
      } else {
          console.log("Geolocation is NOT available");
      }
   
    geo.getCurrentPosition(function(position) {
        handleLocation(position.coords.latitude, position.coords.longitude);
      });
}

function displayList(responseJson){
    console.log("in the displaylist function");
    console.log(responseJson.fuel_stations);
    for (let i=0; i<responseJson.fuel_stations.length; i++){
        let stationName = responseJson.fuel_stations[i].station_name;
        let distance = responseJson.fuel_stations[i].distance;
        let fuel = responseJson.fuel_stations[i].fuel_type_code;
        let accessCode = responseJson.fuel_stations[i].access_days_time;
        let accessType = responseJson.fuel_stations[i].access_code;
        let streetAddress = responseJson.fuel_stations[i].street_address;
        let city = responseJson.fuel_stations[i].city;
        appendString = `<h2>${stationName}</h2><p>${distance}</p><p>${fuel}</p><p>${accessCode}</p><p>${accessType}</p><p>${streetAddress}</p><p>${city}</p>`;
        $('.js-result-list').append(appendString);

    }
}


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }


function getData(location, radius, limit){
    console.log("in the getData function");
    const params = {
        format: "json",
        location: `${location}`,
        radius: `${radius}`,
        limit: `${limit}`,
        api_key: APIkey
    };

    const queryString = formatQueryParams(params);
    let queryUrl = url + '?' + queryString;
    console.log(queryUrl);

    fetch(queryUrl)
    .then(response => response.json())
    .then(responseJson => displayList(responseJson))
    .catch(err => console.log(err));
    
}



function WatchForm(){
    console.log("In the WatchForm function");
    $('form').submit(function(){
        //obtain the search parameters from the form
        const location = $('#location').val();
        const radius = $('#radius').val();
        const limit = $('#limit').val();
        getData(location,radius,limit);
        event.preventDefault();
    });
}


$(function(){
console.log("App Started");
WatchForm();
$('#radius').val(5);
$('#limit').val(20);
getUserLocation();

});