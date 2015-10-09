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

		if(_.defaults.geoLocate
			&& typeof geoLite !== 'undefined'
			&& geoLite.locateOnLoad) {
				document.body.addEventListener('onLocateSuccess', function() {
					var coords = {
						lat: geoLite.lat,
						lon: geoLite.lon
					};
					customOptions = $.extend(customOptions, coords);
					_.init();
				});
				document.body.addEventListener('onLocateFail', function() {
					_.init();
				});
		} else {
			_.init();
		}
	};

	/*
	 * Default Values
	 */
	var defaults = {
		lat: '40.748441',
		lon: '-73.985793',
		url: 'https://api.forecast.io/forecast/',
		key: '50efc01999c6c329ae64ade7449047fe',
		cacheTime: 30,
		geoLocate: true,
		celsius: false
	};

	/*
	 * Convert fahranheit to celsius
	 */
	var convert = function(f) {
	    return Math.round((f - 32) * 5/9);
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
		_.options = options;
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
		var shouldConvert = this instanceof WeatherWidget && this.options.celsius ? true : false,
			currently = apiData.currently,
			hourly = apiData.hourly.data,
			daily = apiData.daily.data,
			_ = this,


			currentTemp = Math.round(shouldConvert ? convert(currently.temperature) : currently.temperature);


		var symbol = this.options.celsius ? 'C' : 'F';

		var $widget = $('<div>')
			.addClass('widget')
			.addClass('weather');

		/* Main Header */
		var $header = $('<header>').addClass('title');

		var $expandButton = 
			$('<a>')
				.addClass('expand')
				.addClass('more')
				.attr('href', '#')
				.text('7 Day Forecast');

		$header.append(
			$('<h2>')
				.addClass('name')
				.text('Local Weather')
		).append(
			$('<span>')
				.addClass('description')
				.text('Current Conditions')
		).append(
			$expandButton
		);
		$widget.append($header);

		/* Current Section */
		var $current = $('<section>').addClass('current');
		$current.append(
			$('<img>')
				.addClass('icon')
				.attr('src', 'dist/img/' + currently.icon + '.png')
		).append(
			$('<span>')
				.addClass('temperature')
				.html(currentTemp + '&deg;' + symbol)
		).append(
			$('<span>')
				.addClass('description')
				.text(currently.summary)
		)
		$widget.append($current);


		/* Hours Section */
		var $hourly = $('<section>').addClass('hourly');

		var hourPrototype = $('<div>')
			.addClass('hour')
			.addClass('five')
			.append(
				$('<span>').addClass('time')
			)
			.append(
				$('<img>').addClass('icon')
			)
			.append(
				$('<span>').addClass('temperature')
			);

		for(var i = 0; i < 5; i++) {
			var temp = Math.round(hourly[i + 1].temperature),
				icon = hourly[i + 1].icon,
				hour = (new Date()).getHours() + i,
				ampm = hour >= 12 ? 'pm' : 'am';
			temp = shouldConvert ? convert(temp) : temp;
			if(hour > 23) {
				hour = Math.abs(23 - hour);
				ampm = 'am';
			}
			hour = hour % 12;
			hour = hour ? hour : 12;

			var hourClone = hourPrototype.clone();

			hourClone.find('.time')
				.text(hour + ampm);

			hourClone.find('.icon')
				.attr('src', 'dist/img/' + icon + '.png');

			hourClone.find('.temperature')
				.html(temp + '&deg;');

			$hourly.append(hourClone);
		}
		$widget.append($hourly);

		/* Forecast Section */
		var $expandWrapper = $('<div>')
			.addClass('expand-wrapper')
			.addClass('hide');

		var $forecasts = $('<section>').addClass('forecasts');

		$forecasts.append(
			$('<header>')
				.addClass('forecast')
				.append(
					$('<span>')
						.addClass('day')
						.text('7 Day Forecast')
				)
				.append(
					$('<span>')
						.addClass('high')
						.text('High')
				)
				.append(
					$('<span>')
						.addClass('low')
						.text('Low')
				)
		);


		for(var k = 0; k < 7; k++) {
			var day = days[new Date(daily[k + 1].time * 1000).getDay()],
				icon = daily[k + 1].icon,
				max = Math.round(daily[k + 1].temperatureMax),
				min = Math.round(daily[k + 1].temperatureMin);
			max = shouldConvert ? convert(max) : max;
			min = shouldConvert ? convert(min) : min;

			$forecasts.append(
				$('<div>')
					.addClass('forecast')
					.append(
						$('<span>')
							.addClass('day')
							.text(day)
					)
					.append(
						$('<img>')
							.addClass('icon')
							.attr('src', 'dist/img/' + icon + '.png')
					)
					.append(
						$('<span>')
							.addClass('high')
							.html(max + '&deg;')
					)
					.append(
						$('<span>')
							.addClass('low')
							.html(min + '&deg;')
					)
			);
		}

		$expandWrapper.append($forecasts);
		$widget.append($expandWrapper);


		$expandButton.on('click', function(){

			if ($expandWrapper.hasClass('hide')) {
				$expandButton.removeClass('more').addClass('less');
				$expandWrapper.slideDown().removeClass('hide');
			} else {
				$expandButton.removeClass('less').addClass('more');
				$expandWrapper.slideUp().addClass('hide');
			}

		});

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