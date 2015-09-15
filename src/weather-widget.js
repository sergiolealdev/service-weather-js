(function($, ls) {
	"use strict";

	/*
	 * Only gets called when we're using $('$el').weatherWidget format
	 */
	var WeatherWidget = function(el, customOptions) {
		var _ = this;
		_.$el = $(el).addClass('weather-widget');
		_.defaults = defaults;

		_.init = function() {
			_.pollAPI(customOptions, _.makeWidget);
		};

		_.init();
	};

	/*
	 * Default Values
	 */
	var defaults = {
		lat: '40.748441',
		lon: '-73.985793',
		url: 'https://api.forecast.io/forecast/',
		key: '50efc01999c6c329ae64ade7449047fe',
		// How long we'd like to store the request results (minutes)
		cacheTime: 30
	};

	/*
	 * Configure parameters for API
	 */
	WeatherWidget.prototype.makeURL = function(options) {
		return options.url + options.key + '/' + options.lat + ',' + options.lon;
	};

	/*
	 * Main API polling function
	 */
	WeatherWidget.prototype.pollAPI = function(options, callback) {
		var _ = this,
			options = $.extend(defaults, options),
			url = _.makeURL(options),
			data = ls ? ls.get(url, options.cacheTime) : false;

		if(data) {
			callback.call(_, data);
			return false;
		}
		$.ajax({
			dataType: 'jsonp',
			url: url,
			success: function(data) {
				if(ls)
					ls.set(url, data);
				if(callback) {
					callback.call(_, data);
				}
			},
			error: function(e) {
				console.log(e);
			}
		});
	};

	var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	WeatherWidget.prototype.makeWidget = function(apiData) {
		var currently = apiData.currently,
			hourly = apiData.hourly.data,
			daily = apiData.daily.data;
		var _ = this;
		var $header = $(
			'<h1>' + currently.temperature + '&deg;</h1>' +
			'<h2>' + currently.summary + '</h2>'
		);
		var $hourly = $('<div class="hourly"></div>');
		var $daily = $('<div class="daily"></div>');


		for(var i = 0; i < 5; i++) {
			var temp = Math.round(hourly[i+1].temperature),
				icon = hourly[i+1].icon,
				hour = (new Date()).getHours() + i,
				ampm = hour >= 12 ? 'pm' : 'am';
			if (hour > 23) {
				hour = Math.abs(23 - hour);
				ampm = 'am';
			}
			hour = hour % 12;
			hour = hour ? hour : 12;

			$hourly
				.append($(
					'<div><span class="time">' + hour + ampm + '</span>' +
					'<span class="icon ' + icon + '"></span>' +
					'<span class="temp">' + temp + '&deg;</span></div>'
				));
		}

		$daily.append($(
			'<div class="daily-title">' +
			'<span>7 Day Forecast</span><span>High</span><span>Low</span>' +
			'</div>'
		));
		for(var k = 0; k < 7; k++) {
			var day = days[new Date(daily[k].time * 1000).getDay()],
				icon = daily[k].icon,
				max = Math.round(daily[k].temperatureMax),
				min = Math.round(daily[k].temperatureMin);
			$daily
				.append($(
					'<div><span class="day">' + day + '</span>' +
					'<span class="icon ' + icon + '"></span>' +
					'<span class="max">' + max + '&deg;</span>' +
					'<span class="min">' + min + '&deg;</span></div>'
				));
		}
		var $widget = _.$el
			.append($header)
			.append($hourly)
			.append($daily);

		_.$el.append($widget);
	};

	// Extend JQuery fn for $('$id').weatherWidget()
	$.fn.weatherWidget = function(options) {
		return this.each(function() {
			(new WeatherWidget(this, options));
		});
	};

	// Extend JQuery for $.weatherWidget()
	// ONLY prototype(static) methods
	$.extend({
		weatherWidget: WeatherWidget.prototype
	});

})(jQuery, typeof lsLite != 'undefined' ? lsLite : null);