#Weather Widget
Creates a weather widget using forecast.io API

## Getting Started

Include using Bower (all scripts are located within bower_components directory):

```
bower install weather-widget
```

OR, download zip and include scripts manually. All production-ready scripts are in the dist/ directory.

```
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="weather-widget.js"></script>
```


### Local Storage
In order for Weather-Widget to take advantage of Local Storage functionality, use Local-Storage-Lite at https://github.com/BlueBiteLLC/Local-Storage-Lite
* This is automatically included as a bower dependency

Be sure to include the local storage lite script before weather-widget.js. This enables browser caching. Custom cache times can be configured by specifying a cacheTime value as an option.

### Geolocating
In order for Weather-Widget to take advantage of Geolocation functionality, use Geolocate-Lite at https://github.com/BlueBiteLLC/Geolocate-Lite
* This is automatically included as a bower dependency

As with local-storage-lite, include this before weather-widget.js. This will automatically poll the user for their coordinates on page load. For additional configuration options visit the repo page stated above.

**Note: The Weather Widget will function just fine without either of these scripts.**

### Styles
Include css file in head:

```
<link rel="stylesheet" href="weather-widget.css">
```


### Set Up the Widget

```
<div class="my-class"></div>
```

Initialize widget
* A forecast.io api key is needed. Get yours at https://developer.forecast.io/ *

```javascript
<script>
$('.my-class').weatherWidget({
    cacheTime: 20,
    lat: 40.748441,
    lon: -73.985793,
    key: '**********'
});
</script>
```

Option | Type | Default | Description
------ | ---- | ------- | -----------
lat|float|null|Latitude
lon|float|null|Longitude
key|string|null|Forecast.io API key
cacheTime|int|30|How long we should cache the API results in minutes. Not applicable if local-storage-lite script is included
geoLocate|bool|true|Whether or not we should attempt to geolocate. Not applicable if geolocate-lite script is not included
celsius|bool|false|Set to true to convert results to celsius


### Make bare requests without widget

```javascript
<script>
  $.weatherWidget.pollAPI({
      cacheTime: 0,
      lat: 40.748441,
      lon: -73.985793
  }, function(data) {
      console.log('here\'s some data: ', data);
  });
</script>
```
