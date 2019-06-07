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
    
}

function displayList(responseJson){
    $('.js-result-list').empty();
    console.log("in the displaylist function");
    console.log(responseJson.fuel_stations);
    if(responseJson.fuel_stations.length === 0){
      alert("There are no nearby stations that match your search criteraia. Please try your search again.")
    }
    for (let i=0; i<responseJson.fuel_stations.length; i++){
        let stationName = responseJson.fuel_stations[i].station_name;
        let distance = responseJson.fuel_stations[i].distance.toFixed(2);
        //let fuel = responseJson.fuel_stations[i].fuel_type_code;
        let accessCode = responseJson.fuel_stations[i].access_days_time;
        let accessType = responseJson.fuel_stations[i].access_code;
        let streetAddress = responseJson.fuel_stations[i].street_address;
        let city = responseJson.fuel_stations[i].city;
        let state = responseJson.fuel_stations[i].state;
        let postalcode = responseJson.fuel_stations[i].zip;
        let phone = responseJson.fuel_stations[i].station_phone;
        let stationLatitude = responseJson.fuel_stations[i].latitude;
        let stationLongitude = responseJson.fuel_stations[i].longitude;
        let mapUrl = mapsSelector(stationLatitude,stationLongitude);

        let fuel = "";
        switch (responseJson.fuel_stations[i].fuel_type_code){
          case "all": 
          fuel = "All";
          break;
          case "BD":
            fuel = "Biodiesel (B20 and above)";
            break;
          case "CNG":
            fuel = "Compressed Natural Gas";
            break;
          case "E85":
            fuel = "Ethanol (E85)";
            break;
          case "ELEC":
            fuel = "Electric";
            break;
          case "HY":
            fuel = "Hydrogen";
            break;
          case "LNG":
            fuel = "Liquefied Natural Gas";
            break;
          case "LPG":
            fuel = "Liquefied Petroleum";
            break;
        }


        appendString = `<h2>${stationName}</h2>
        <ul><li>Distance from Location: ${distance} miles</li>
        <li>Fuel Type: ${fuel}</li>
        <li>Hours: ${accessCode}</li>
        <li>Address: ${streetAddress}</li>
        <li>${city}, ${state} ${postalcode}</li>
        <li>Phone: ${phone}</li>
        <a href="${mapUrl}" target="_blank">Open Map</a></ul>`;
        $('.js-result-list').append(appendString);

    }
   
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

    fetch(queryUrl)
    .then(response => response.json())
    .then(responseJson => displayList(responseJson))
    .catch(err => console.log(err));
}

function getData(type, searchLocation, radius, limit, fuelType){
    console.log("in the getData function");
    
    const params = {
        format: "json",
        access: "public",
        radius: `${radius}`,
        limit: `${limit}`,
        fuel_type: `${fuelType}`,
        status: "E",
        api_key: APIkey
    };

    if(type === 'manual-location-search'){
        params.location = `${searchLocation}`;
        fetchRequest(params);
    }
    else{
        geo = navigator.geolocation;
        if ("geolocation" in navigator) {
        console.log("Geolocation is available");
        geo.getCurrentPosition(function(position) {
          console.log("entered the getCurrentPosition function");
          params.latitude = `${position.coords.latitude}`;
          params.longitude = `${position.coords.longitude}`;
          fetchRequest(params);
          
        },
        function error(err) {
          alert("Geolocation is not available. Please enter a location to search.");
          console.warn(`ERROR(${err.code}): ${err.message}`);
        });
        
        } 
        else {
          console.log("Geolocation is NOT available");
          alert("Geolocation is not available. Please enter a location to search.");
        }
   
    
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
        const fuelType = $('select').val();
        getData(searchType, searchLocation,radius,limit,fuelType);
        event.preventDefault();
    });
}

function getFormType(){
  $("input[type='radio']").click(function (){
    let formType = $("input[type='radio']:checked").val();
    console.log(formType);
    if(formType === 'geolocation-search'){
      $('.js-location-input').hide();
      $('.js-form-input').show();
    }
    else{
      $('.js-location-input').show();
      $('.js-form-input').show();
    }

  });
  WatchForm();
}

function initializeApp(){
  $('#radius').val(5);
  $('#limit').val(20);
  $('.js-location-input').hide();
  $('.js-form-input').hide();
}

$(function(){
console.log("App Started");
initializeApp();

getFormType();

});