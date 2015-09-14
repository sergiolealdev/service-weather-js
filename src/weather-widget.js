(function($, ls) {
	"use strict";

	/*
	 * Only gets called when we're using $('$el').weatherWidget format
	 */
	var WeatherWidget = function(el, customOptions) {
		var _ = this;
		_.$el = $(el).addClass('weather-grid');
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

	WeatherWidget.prototype.makeWidget = function(apiData) {
		console.log(apiData);
		var currently = apiData.currently;
		var _ = this;
		var header = '<h1>' + currently.temperature + ' degrees</h1>';
		header += '<h2>' + currently.summary + '</h2>';
		var $header = $(header);
		_.$el.append($header);
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