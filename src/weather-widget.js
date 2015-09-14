(function($) {
	"use strict";

	var lsLite = lsLite || null;

	/*
	 * Only gets called when we're using $('$el').weatherWidget format
	 */
	var WeatherWidget = function(el, customOptions) {

		var _ = this;
		_.$el = $(el).addClass('weather-grid');
		_.defaults = WeatherWidget.defaults;

		_.init = function() {
			// Merge defaults and customOptions into options
			_.options = $.extend(_.defaults, customOptions);

			var url = _.configureSearch(_.options);
			_.pollAPI(url, _.options.cacheTime, _.test);
		};

		_.init();
	};


	/*
	 * Default Values
	 */
	WeatherWidget.defaults = {
		lat: '40.748441',
		lon: '-73.985793',
		url: 'https://api.forecast.io/forecast/',
		key: '50efc01999c6c329ae64ade7449047fe',
		// How long we'd like to store the request results (minutes)
		cacheTime: 0
	};

	/*
	 * Configure parameters for API
	 */
	WeatherWidget.prototype.configureSearch = function(options) {
		return options.url + options.key + '/' + options.lat + ',' + options.lon;
	};

	/*
	 * Main API polling function
	 */
	WeatherWidget.prototype.pollAPI = function(url, cacheTime, callback) {
		var _ = this, data;
		if(_ instanceof WeatherWidget) {
			data = lsLite ? lsLite.get(url, cacheTime) : false;
		}
		if(data) {
			callback.call(_, data);
			return false;
		}
		$.ajax({
			dataType: 'jsonp',
			url: url,
			success: function(data) {
				console.log(data);
				if(lsLite)
					lsLite.set(url, data);
				if(callback) {
					callback.call(_, data);
				}
			},
			error: function(e) {
				console.log(e);
			}
		});
	};

	WeatherWidget.prototype.makeGrid = function(apiData) {
		console.log(apiData);
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

})(jQuery);