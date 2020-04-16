
// function to create base map
function createMap(earthquakeData) {
   
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

// Base Layer
var baseMaps = {
    "Light Map": lightmap
  };

// Layer for markers
var overlayMaps = {
    "Earthquakes": earthquakeData
};

var map = L.map("map", {
    center: [37.8, -96],
    zoom: 4,
    layers: [lightmap, earthquakeData]
});


// Creating legend
var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magEarthquakes = [0, 1, 2, 3, 4, 5],
        labels = [];

    for (var i = 0; i < magEarthquakes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magEarthquakes[i] + 1) + '"></i> ' +
            magEarthquakes[i] + (magEarthquakes[i + 1] ? '&ndash;' + magEarthquakes[i + 1] + '<br>' : '+');
        }
    
    return div;
    };
    
legend.addTo(map);

// Bring together layers
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

// Colorcode circles
function getColor(mag) {
    return mag > 5 ? '#FF4833' :
           mag > 4 ? '#FF7133' :
           mag > 3 ? '#FFB533' :
           mag > 2 ? '#FFDE33' :
           mag > 1 ? '#D7FF33' :
           mag > 0 ? '#74FF33' :
                      '#41FF33';
  }


// Response holds the data
function createMarkers(response) {
    console.log(response.features);
    // console.log(response.features[1].properties);
    var earthquakes = response.features;

    var earthquakeMarkers = [];
    for (var index=0; index < response.features.length; index++) {
        var feature = response.features[index];
   
        var longitude = feature.geometry.coordinates[0]
        var latitude = feature.geometry.coordinates[1]
    
        // console.log(latitude)
        // console.log(longitude)

        var earthquakeMarker = L.circle([latitude, longitude], {
            fillColor: getColor(feature.properties.mag),
            // color: getColor(feature.properties.mag),
            color: 'black',
            weight: 0.5,
            opacity: 1,
            radius: feature.properties.mag * 50000,
            fillOpacity: 0.7
        }) 
        .bindPopup("<h3>Earthquake Magnitude: " + feature.properties.mag + "</h3><hr><h3>Location: " + feature.properties.place + "</h3>")
        earthquakeMarkers.push(earthquakeMarker);
    }
    
    createMap(L.layerGroup(earthquakeMarkers)); 
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);




// // Checking dataset
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data){
//     console.log(data);
// });

