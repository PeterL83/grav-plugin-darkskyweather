/**
 * @abstract JavaScript Wrapper for the Forecast.io API using JSONP !!!!!!!!!!!!!!!!!!!!!
 * @link !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * @author Peter Luptak <luptakinfo@gmail.com>
 * @license MIT Lilcense
 * @copyright Copyright (C) 2018, Peter Luptak
 */

var lat, lon, k, weekday, lang, refreshTime, ifPageWeather, windDirection;
var url     = "https://api.forecast.io/forecast/";
var units   = "auto";
var exclude = "minutely,hourly,alerts,flags";

window.addEventListener("load", function(event) {
	let forecast = new Forecast();
	let freshWeather = null;
	let weatherTime = forecast.getCookie("weatherTime");
	let needRefresh = ((Date.now() - weatherTime) > refreshTime*60000) ? true : false;

	if (needRefresh || ifPageWeather) {
		freshWeather = forecast.fetchData();
		setTimeout(function() { forecast.storeWeather(freshWeather) },500);
		setTimeout(function() { forecast.widgetWeather(); },1000);
	} else {
		forecast.widgetWeather();
	}

	if (ifPageWeather) {
		forecast.pageWeather(freshWeather);
	}
});

function Forecast() {
	this.fetchData = function() {
		return $.ajax({
			url: url + k + '/' + lat + ',' + lon + "?units=" + units + "&lang=" + lang + "&exclude=" + exclude,
			dataType: "jsonp"
		});
	}

	this.setIcon = function(icontext) {
		let iconext   = ".png";
		let iconfile  = 'na';
		let iconsmap  = {
			'clear-day' : '32',
			'clear-night' : '31',
			'rain' : '11',
			'snow' : '14',
			'sleet' : '18',
			'wind' : '24',
			'fog' : '20',
			'cloudy' : '26',
			'partly-cloudy-day' : '30',
			'partly-cloudy-night' : '29'
		};
		if (icontext && (typeof iconsmap[icontext] !== "undefined")) {
			iconfile = iconsmap[icontext];
		}
		return (iconfile + iconext);
	}

	this.formDate = function(timestamp,mode) {
		let date = new Date(timestamp * 1000);
		if (mode == 1) {
			return (weekday[date.getDay()].toLowerCase() + ', ' + date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear());
		} else if (mode == 2) {
			return (weekday[date.getDay()].substr(0,3) + ' (' + date.getDate() + '.' + (date.getMonth()+1) + '.)');
		} else if (mode == 3) {
			return (date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes());
		} else if (mode == 4) {
			return (weekday[date.getDay()] + ' (' + date.getDate() + '.' + (date.getMonth()+1) + '.)');
		} else {
			return "none";
		}
	}

	this.windBearing = function(windB) {
		return windDirection[Math.round(windB / 22.5) % windDirection.length];
	}

	this.setStoreData = function(key, value) {
		if (localStorage) {
			localStorage.setItem(key, value);
		} else {
			document.cookie = key + '=' + value;
		}
	}

	this.getStoreData = function(key) {
		if (localStorage) {
			return localStorage.getItem(key);
		} else {
			return this.getCookie(key);
		}
	}

	this.getCookie = function(key) {
		let cookie = `; ${document.cookie}`.match(`;\\s*${key}=([^;]+)`);
		return cookie ? cookie[1] : '';
	}

	this.storeWeather = function(weat) {
		localStorage.clear();
		document.cookie = "weatherTime=" + Date.now();

		weat.then(data => this.setStoreData("ds-icon",'middle/' + this.setIcon(data.currently.icon)));
		weat.then(data => this.setStoreData("ds-time",this.formDate(data.currently.time,1) + "  (" + this.formDate(data.currently.time,3) + ")"));
		weat.then(data => this.setStoreData("ds-summary",data.currently.summary));
		weat.then(data => this.setStoreData("ds-currtemp",data.currently.temperature.toFixed(1) + "&deg;C"));
		weat.then(data => this.setStoreData("ds-apptemp",data.currently.apparentTemperature.toFixed(1) + "&deg;C"));
		weat.then(data => this.setStoreData("ds-windspeed",(data.currently.windSpeed/0.278).toFixed(0) + " km/h"));
		weat.then(data => this.setStoreData("ds-pressure",data.currently.pressure.toFixed(0) + " hPa"));
		weat.then(data => this.setStoreData("ds-uvindex",data.currently.uvIndex));

		for (let i = 1; i < 4; i++) {
			weat.then(data => this.setStoreData("ds-time"+i,this.formDate(data.daily.data[i].time,2)));
			weat.then(data => this.setStoreData("ds-iconsrc"+i,'small/' + this.setIcon(data.daily.data[i].icon)));
			weat.then(data => this.setStoreData("ds-icontit"+i,data.daily.data[i].summary));
			weat.then(data => this.setStoreData("ds-temp"+i,data.daily.data[i].temperatureLow.toFixed(0) + "&deg;C - " + data.daily.data[i].temperatureHigh.toFixed(0) + "&deg;C"));
		}
	}

	this.widgetWeather = function() {
		$("#ds-time").append(this.getStoreData("ds-time"));
		$("#ds-summary").append(this.getStoreData("ds-summary"));
		$("#ds-currtemp").append(this.getStoreData("ds-currtemp"));
		$("#ds-apptemp").append(this.getStoreData("ds-apptemp"));
		$("#ds-windspeed").append(this.getStoreData("ds-windspeed"));
		$("#ds-pressure").append(this.getStoreData("ds-pressure"));
		$("#ds-uvindex").append(this.getStoreData("ds-uvindex"));

		for (let i = 1; i < 4; i++) {
			$("#ds-time"+i).append(this.getStoreData("ds-time"+i));
			$("#ds-icon"+i).attr('src',$("#ds-icon1").attr('data-src')+(this.getStoreData("ds-iconsrc"+i)));
			$("#ds-icon"+i).attr('title',(this.getStoreData("ds-icontit"+i)));
			$("#ds-temp"+i).append(this.getStoreData("ds-temp"+i));
		}

		$.when( $("#ds-icon").attr('src',$("#ds-icon").attr('data-src')+(this.getStoreData("ds-icon"))) )
			.then(function() {
				$("#ds-icon").removeAttr("data-src");
				for (let i = 1; i < 4; i++) { $("#ds-icon"+i).removeAttr("data-src"); }
				$("#ds-box").removeClass("hidden");
			});
	}

	this.pageWeather = function(weat) {
		weat.then(data => $("#ds-fptime").append(this.formDate(data.currently.time,1) + "  (" + this.formDate(data.currently.time,3) + ")"));
		weat.then(data => $("#ds-fpsummary").append(data.currently.summary));
		weat.then(data => $("#ds-fpcurrtemp").append(data.currently.temperature.toFixed(1) + "&deg;C"));
		weat.then(data => $("#ds-fpapptemp").append(data.currently.apparentTemperature.toFixed(1) + "&deg;C"));
		weat.then(data => $("#ds-fphumidity").append((data.currently.humidity*100).toFixed(0) + "%"));
		weat.then(data => $("#ds-fpwindspeed").append((data.currently.windSpeed/0.278).toFixed(0) + " km/h"));
		weat.then(data => $("#ds-fpwindbearing").append(this.windBearing(data.currently.windBearing)));
		weat.then(data => $("#ds-fppressure").append(data.currently.pressure.toFixed(0) + " hPa"));
		weat.then(data => $("#ds-fpsunrise").append(this.formDate(data.daily.data[0].sunriseTime,3)));
		weat.then(data => $("#ds-fpsunset").append(this.formDate(data.daily.data[0].sunsetTime,3)));
		weat.then(data => $("#ds-fpuvindex").append(data.currently.uvIndex));

		for (let i = 1; i < 8; i++) {
			weat.then(data => $("#ds-fptime"+i).append(this.formDate(data.daily.data[i].time,4)));
			weat.then(data => $("#ds-fpicon"+i).attr('src',$("#ds-fpicon1").attr('data-src')+('small/' + this.setIcon(data.daily.data[i].icon))));
			weat.then(data => $("#ds-fpicon"+i).attr('title',(data.daily.data[i].summary)));
			weat.then(data => $("#ds-fptemp"+i).append(data.daily.data[i].temperatureLow.toFixed(0) + "&deg;C - " + data.daily.data[i].temperatureHigh.toFixed(0) + "&deg;C"));
			weat.then(data => $("#ds-fphumidity"+i).append((data.daily.data[i].humidity*100).toFixed(0) + "%"));
			weat.then(data => $("#ds-fpwind"+i).append((data.daily.data[i].windSpeed/0.278).toFixed(0) + " km/h " + this.windBearing(data.currently.windBearing)));
			weat.then(data => $("#ds-fpsun"+i).append("&#x25b2; " + this.formDate(data.daily.data[i].sunriseTime,3) + " &#x25bc; " + this.formDate(data.daily.data[i].sunsetTime,3)));
		}

		weat.then(data => $.when( $("#ds-fpicon").attr('src',$("#ds-fpicon").attr('data-src')+(this.setIcon(data.currently.icon))) )
			.then(function() {
				$("#ds-fpicon").removeAttr("data-src");
				for (let i = 1; i < 8; i++) { $("#ds-fpicon"+i).removeAttr("data-src"); }
			}));

		let forecasturl = 'https://darksky.net/forecast/' + lat + ',' + lon + '/' + ((lang == 'sk') ? 'ca12' : 'auto' ) + '/en';
		$("#ds-fpforecastinfo").attr('href',forecasturl);
	}
}

