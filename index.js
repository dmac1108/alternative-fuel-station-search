'use-strict';

const url="https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest";
const APIkey = "BLnD9vbttpdXhyvlXImgyUXASEkcU2bUvSpa89fw";

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
    .then(responseJson => console.log(responseJson))
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

});