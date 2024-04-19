const userTab=document.querySelector('[your-tab]');
const searchTab=document.querySelector('[search-tab]');
const searchArea=document.querySelector('.search-form');
const locationArea=document.querySelector('.location-container');
const buffer=document.querySelector('.loading-container');
const searchInfo=document.querySelector('.place-container');
const grantAccessBtn=document.querySelector('.grant-location-btn');
const searchInput=document.querySelector('.search-text');

const API_KEY= "d1845658f92b31c64bd94f06f7188c9c";
let currentTab=userTab;
currentTab.classList.add('current-tab');
getFromSessionStorage();
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');
        if(!searchArea.classList.contains('active')){ //search tab is clicked, so remove location and display container
            locationArea.classList.remove('active');
            searchInfo.classList.remove('active'); 
            searchArea.classList.add("active");
        }
        else{//user tab is clicked
            searchArea.classList.remove("active");
            searchInfo.classList.remove("active");
            getFromSessionStorage(); //used to take coordinates if have alredy find them and is we have not found them  out yet then this func will find them
        }
    }
}

function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-Coordinates"); // this variable will contain coordinates if they are present in session storage
    // session storage is used to store data in web pages,The sessionStorage object stores data for only one session.
    if(!localCoordinates){
        // if coordinates are not present then enable location container to take coordinates
        locationArea.classList.add("active");
    }
    else{
        // if coordinates are presnt then make them readable and call function to fetch weather
        const coordinates=JSON.parse(localCoordinates);
        // A common use of JSON is to exchange data to/from a web server.When receiving data from a web server, the data is always a string. Parse the data with JSON.parse(), and the data becomes a JavaScript object.
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    console.log("hi4");
    const {lat,long}=coordinates;
    console.log("coordinates= " + lat + long);
    // take latitude and longitude
    locationArea.classList.remove("active");
    // remove grant location container
    buffer.classList.add("active");
    // make loader visible
    try{
        // fetch API
        console.log("1");
        const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        console.log("2");
        const data = await response.json();
        
        console.log("3");
        buffer.classList.remove('active');
        console.log("4");
        searchInfo.classList.add('active');
        console.log("5");
        renderWeatherInfo(data);
        console.log("6");
        console.log(data);

    }

    catch(e){
        //alert('kyu nahi chalra bhai');
        buffer.classList.remove('active');
        console.log("nahi chala fetch");
    }
}
function renderWeatherInfo(weatherData){
    const name=document.querySelector('.place-name');
    const countryIcon=document.querySelector('.country-icon');
    const weatherType=document.querySelector('.weather-type');
    const weatherIcon=document.querySelector('.weather-img');
    const temp=document.querySelector('.temperature');
    const windSpeed=document.querySelector('.speed');
    const tempHumid=document.querySelector('.humidity');
    const tempClouds=document.querySelector('.clouds');
    console.log("1.1");
    name.innerText=weatherData?.name;
    
    console.log("1.2");
    countryIcon.src=`https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    
    console.log("1.3");
    weatherType.innerText=weatherData?.weather?.[0]?.main;
    console.log("1.4");
    console.log(weatherData?.weather?.[0]?.icon);
    // weatherIcon.src= `https://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon}@2x.png`;
    // console.log("weather icon"+weatherIcon.alt);
    
    console.log(`https://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon}@2x.png`);
    temp.innerText=`${weatherData?.main?.temp.toFixed(2)} °C`;
    console.log("1.6");
    windSpeed.innerText=`${weatherData?.wind?.speed}m/s`;
    console.log("1.7");
    tempHumid.innerText=`${weatherData?.main?.humidity}%`;
    console.log("1.8");
    tempClouds.innerText=`${weatherData?.clouds?.all}%`;
    console.log("1.9");

}
grantAccessBtn.addEventListener("click", getLocation);
function getLocation(){
    console.log("hi");
    if(navigator.geolocation){
        console.log("hi2");
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("location on karle bro");
    }
}
function showPosition(position){
    const userCoordinates ={
        lat: position.coords.latitude,
        long: position.coords.longitude,
    }
    console.log("hi3 "+ userCoordinates);
    sessionStorage.setItem("user-Coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
searchArea.addEventListener("submit", (e)=>{
    e.preventDefault() ;
    let cityName=searchInput.value;
    if(cityName==null){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})
async function fetchSearchWeatherInfo(city){
    console.log("Fetching weather info");
    buffer.classList.add("active");
    locationArea.classList.remove("active");
    searchInfo.classList.remove('active'); 
    try{
        console.log("1");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        console.log("1");
        const data= await response.json();
        console.log("1");
        buffer.classList.remove("active");
        console.log("1");
        searchInfo.classList.add("active");
        console.log("1");
        renderWeatherInfo(data);
        console.log("1");

    }
    catch(e){
        throw new Error;
    }
}