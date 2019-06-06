'use-strict';

const url="https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest";
const APIkey = "BLnD9vbttpdXhyvlXImgyUXASEkcU2bUvSpa89fw";

/*function handleLocation(latitude, longitude){
    console.log("in the handleLocation function");
    console.log("latitude: " + latitude + " longitude: " + longitude);
    const coordinates = [latitude, longitude];
    return coordinates;

}*/

function getUserLocation(){
    console.log("In the geolocation function");
    geo = navigator.geolocation;
    if ("geolocation" in navigator) {
        console.log("Geolocation is available");
      } else {
          console.log("Geolocation is NOT available");
      }
   
    geo.getCurrentPosition(function(position) {
        console.log("entered the getCurrentPosition function");
        handleLocation(position.coords.latitude, position.coords.longitude);
        $('.location').append(`<p>${position.coords.latitude}</p>`);

      });
}

function mapsSelector(latitude, longitude) {
  let mapUrl = "";
  if /* if we're on iOS, open in Apple Maps */
    ((navigator.platform.indexOf("iPhone") != -1) || 
     (navigator.platform.indexOf("iPad") != -1) || 
     (navigator.platform.indexOf("iPod") != -1)){
     mapUrl = `maps://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`;
    }
  else /* else use Google */{
    mapUrl = `https://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`;
    }
    return mapUrl
    //window.open(mapUrl);
}

function displayList(responseJson){
    $('.js-result-list').empty();
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
        let stationLatitude = responseJson.fuel_stations[i].latitude;
        let stationLongitude = responseJson.fuel_stations[i].longitude;
        let mapUrl = mapsSelector(stationLatitude,stationLongitude);
        console.log(mapUrl);
        appendString = `<h2>${stationName}</h2><p>${distance}</p><p>${fuel}</p><p>${accessCode}</p><p>${accessType}</p><p>${streetAddress}</p><p>${city}</p><a href="${mapUrl}" target="_blank">Open Map</a>`;
        $('.js-result-list').append(appendString);

    }
    //displayMap();
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function fetchRequest(params){
    console.log("in the fetchRequest function");
    const queryString = formatQueryParams(params);
    let queryUrl = url + '?' + queryString;
    //console.log(queryUrl);

    fetch(queryUrl)
    .then(response => response.json())
    .then(responseJson => displayList(responseJson))
    .catch(err => console.log(err));
}




function getData(type, searchLocation, radius, limit){
    console.log("in the getData function");
    
    const params = {
        format: "json",
        radius: `${radius}`,
        limit: `${limit}`,
        api_key: APIkey
    };

    if(type === 'manual-location-search'){
        params.location = `${searchLocation}`;
        console.log(params);
        fetchRequest(params);
    }
    else{
        geo = navigator.geolocation;
        if ("geolocation" in navigator) {
        console.log("Geolocation is available");
        } 
        else {
          console.log("Geolocation is NOT available");
        }
   
    geo.getCurrentPosition(function(position) {
        console.log("entered the getCurrentPosition function");
        //handleLocation(position.coords.latitude, position.coords.longitude);
        params.latitude = `${position.coords.latitude}`;
        params.longitude = `${position.coords.longitude}`;
        console.log(params);
        $('.location').append(`<p>${position.coords.latitude}</p>`);
        fetchRequest(params);
        
      });
    }

}



function WatchForm(){
    console.log("In the WatchForm function");
    $('form').submit(function(){
        //determine which search type the user chose
        let searchLocation = "";
        let searchType = $("input[type='radio']:checked").val();
        if(searchType != 'geolocation-search'){
            searchLocation = $('#location').val();
        }
        const radius = $('#radius').val();
        const limit = $('#limit').val();
        getData(searchType, searchLocation,radius,limit);
        event.preventDefault();
    });
}


$(function(){
console.log("App Started");
WatchForm();
$('#radius').val(5);
$('#limit').val(20);


});