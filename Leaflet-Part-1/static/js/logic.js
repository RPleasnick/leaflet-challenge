// Creating the map object
let myMap = L.map("map", {
    center: [40.7128, -90.0057],
    zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// This function increases the size of the radius
function multiRadius(x) {

    return x * 4
}

// The function that will determine the color a marker based on the depth of the earthquake
function chooseColor(depth) {
    if (depth >= 90) return "#ea2c2c";
    else if (depth >= 70) return "#ea822c";
    else if (depth >= 50) return '#ee9c00';
    else if (depth >= 30) return '#eecc00';
    else if (depth >= 10) return "#d4ee00";
    else return '#98ee00';
}

// Getting our GeoJSON data
d3.json(queryUrl).then(function (data) {
    console.log(data);
    // Our style object
    function myStyle(feature) {
        return {
            color: "black",
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.5,
            weight: 0.5,
            radius: multiRadius(feature.properties.mag)
        };
    }
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // Passing in our style object
        style: myStyle,

        // Binding a popup to each layer
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<strong> ${feature.properties.place} </strong><br /><br />Magnitue: ${feature.properties.mag} <br /> Depth: ${feature.geometry.coordinates[2]}`);
        }

    }).addTo(myMap);

    // Set up the legend.
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");

        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"];

        // Loop through our intervals and generate a label with a colored square for each interval.
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: "
                + colors[i]
                + "'>&nbsp;</i> "
                + grades[i]
                + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        console.log(div.innerHTML)
        return div;
    };
    // legend.onAdd = function (map) {
    //     let div = L.DomUtil.create("div", "info legend");
    //     let depths = [0, 10, 30, 50, 70, 90];
    //     let labels =[];
    //     // let labels = ['#33FF66', "#FFFF33", '#FFCC66', '#FF9933', "#FF6633", "#FF3333" ];


    //     // // Define the legend content
    //     // let legendContent = "<h4>Depth of Earthquake</h4>" +
    //     //     "<div class='labels'>" +
    //     //     "<div class='label'>Label 1</div>" +
    //     //     "<div class='label'>Label 2</div>" +
    //     //     "<div class='label'>Label 3</div>" +
    //     //     "</div>";

    //     // Loop through depth ranges and colors
    //     for (let i = 0; i < depths.length; i++) {
    //         div.innerHTML += '<i style="background:' + getColor(depths[i] +1) + '"></i> ' +
    //             depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' <br>' : '+ ');
    //     }

    //     console.log(div.innerHTML)

    //     return div;

    // };

    // Add the legend to the map
    legend.addTo(myMap);

    // let labels = [];

    // // Add the minimum and maximum.
    // let legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
    //     "<div class=\"labels\">" +
    //     "<div class=\"min\">" + limits[0] + "</div>" +
    //     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //     "</div>";

    // div.innerHTML = legendInfo;

    // limits.forEach(function (limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    // });

    // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    // return div;


    // Adding the legend to the map
    // legend.addTo(myMap);

});
