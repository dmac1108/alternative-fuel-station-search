'use-strict';

const url="https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest";
const APIkey = "BLnD9vbttpdXhyvlXImgyUXASEkcU2bUvSpa89fw";

$('.js-result-list').on('click', '.ellipsis', function(e){
  console.log("ellipsis toggled");
  console.log($(this));
        $(this).toggleClass("hide-hours");
        $(this).closest($("li")).find("p.mini-hours").toggleClass("hide-hours");
        $(this).closest($("li")).find("span.extra-hours").toggleClass("hide-hours");
        
});

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

function getFuelName(fuel){
  console.log("In the get fuel name function");
  let fuelName = "";
  switch (fuel){
    case "all": 
    fuelName = "All";
    break;
    case "BD":
      //green
      fuelName = "Biodiesel (B20 and above)";
      break;
    case "CNG":
      //blue
      fuelName = "Compressed Natural Gas";
      break;
    case "E85":
      //yellow
      fuelName = "Ethanol (E85)";
      break;
    case "ELEC":
      //red
      fuelName = "Electric";
      break;
    case "HY":
      //grey
      fuelName = "Hydrogen";
      break;
    case "LNG":
      //blue
      fuelName = "Liquefied Natural Gas";
      break;
    case "LPG":
      //brown
      fuelName = "Liquefied Petroleum";
      break;
  }
  
  return fuelName;
}

function getFuelColor(fuel){
  console.log("In the get fuel color code function");
  let fuelClassName = "";
  switch (fuel){
    case "all": 
    break;
    case "BD":
      //green
      fuelClassName = "green";
      break;
    case "CNG":
      //blue
      fuelClassName = "blue";
      break;
    case "E85":
      //yellow
      fuelClassName = "yellow";
      break;
    case "ELEC":
      //red
      fuelClassName = "red";
      break;
    case "HY":
      //grey
      fuelClassName = "grey";
      break;
    case "LNG":
      //blue
      fuelClassName = "blue";
      break;
    case "LPG":
      //brown
      fuelClassName = "brown";
      break;
  }
  
  return fuelClassName;
}

function displayList(responseJson){
  console.log("in the displaylist function");
    //empty previous results  
    $('.js-result-list').empty();
    //hide the search parameters to bring the results in the forefront
    $('.js-form-input').hide();
    //console.log(responseJson.fuel_stations);

    //alert the user if there are no stations meeting the search criteria
    if(responseJson.fuel_stations.length === 0){
      alert("There are no nearby stations that match your search criteria. Please try your search again.")
    }
    //iterate over the fuel_stations array to get information for each stations. Then, create a header, subheading and list
    //component for relevant station information

    for (let i=0; i<responseJson.fuel_stations.length; i++){
        let stationName = responseJson.fuel_stations[i].station_name;
        let distance = responseJson.fuel_stations[i].distance.toFixed(2);
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
        //update the fual name based on the list value
        
        let fuel = getFuelName(responseJson.fuel_stations[i].fuel_type_code);
        let fuelClass = getFuelColor(responseJson.fuel_stations[i].fuel_type_code);

        appendString = `<div class="${fuelClass}"><h2><a href="${mapUrl}" target="_blank"><img src="./assets/map-vector-free-icon-set-34.png" alt="map icon"></a> ${stationName}</h2>
        <h3><a href="${mapUrl}" target="_blank">${streetAddress} ${city}, ${state} ${postalcode}</a> (${distance} miles)</h3>
        <ul>
        <li >Fuel Type:  ${fuel}</li>
        <li>Phone:  <a href="tel:${phone}">${phone}</a></li>`;
        
        //if the hours text is greater than 30 characters, use the first 30 characters with a button to expand if desired
        hoursString = accessCode.length <= 30 ?  ` <li>Hours: ${accessCode}</span></li></ul><div>` : 
        "<li> <p class='mini-hours'>Hours:" + accessCode.substring(0,30) + "</p><button class='ellipsis'><span class='button-label'>...</span></button><span id='" + i + "'class='extra-hours hide-hours'>Hours:" + accessCode + "</span></li></ul></div>";
        console.log(hoursString);

        $('.js-result-list').append(appendString + hoursString);

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
  $('.js-form-input').hide();
}

$(function(){
console.log("App Started");
initializeApp();

getFormType();

});