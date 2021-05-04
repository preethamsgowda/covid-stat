let corner1 = L.latLng(84.23194746223983, 179.64843750000003),
  corner2 = L.latLng(-59.71209717332291, -178.9453125),
  bounds = L.latLngBounds(corner1, corner2);

let map = L.map("map", {
  zoom: 2,
  minZoom: 2,
  maxZoom: 5,
  maxBounds: bounds,
}).fitBounds([bounds]);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  noWrap: true,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

loadGeoCoordinates = () => {
  d3.json("geoCoordinates_3.json", function (json) {
    function style(feature) {
      return {
        fillColor: "#E3E3E3",
        weight: 1,
        opacity: 0.4,
        color: "white",
        fillOpacity: 0.3,
      };
    }
    C = L;
    C.geojson = L.geoJson(json, {
      onEachFeature: onEachFeature,
      style: style,
    }).addTo(map);

    function onEachFeature(feature, layer) {
      layer.on({
        click: onCountryClick,
        mouseover: onCountryHighLight,
        mouseout: onCountryMouseOut,
      });
    }
  });
};

loadGeoCoordinates();

/**
 * Callback for mouse out of the country border. Will take care of the ui aspects, and will call
 * other callbacks after done.
 * @param e the event
 */
function onCountryMouseOut(e) {
  C.geojson.resetStyle(e.target);
  //	$("#countryHighlighted").text("No selection");

  var countryName = e.target.feature.properties.name;
  var countryCode = e.target.feature.properties.iso_a2;
  //callback when mouse exits a country polygon goes here, for additional actions
}

/**
 * Callback for when a country is clicked. Will take care of the ui aspects, and it will call
 * other callbacks when done
 * @param e
 */
function onCountryClick(e) {
  //callback for clicking inside a polygon
  // console.log("e: ", e);

  let iso2 = mapH.getISO2(e);
  let latLng = mapH.getLatLng(e);
  let country = mapH.getCountryName(e);

  //L.marker([latLng.lat, latLng.lng]).addTo(map);
  //e.target.bindTooltip("<bold>" + country + "</bold><hr/>my tooltip text<br>").openTooltip();
  let popup = L.popup()
    .setLatLng(latLng)
    .setContent("<h2>" + country + "</h2><hr/><h3>Loading...</h3>")
    .openOn(map);

  apiH.getDataForIso2(iso2, data => {
    if (data.length < 1) {
      popup.setContent(
        "<h2>" + country + "</h2>" + "<hr/>" + "<h3>No Data Available.</h3>"
      );
      return;
    }

    lastRecord = data[data.length - 1];
    popup.setContent(
      "<h2>" +
        country +
        "</h2>" +
        "<hr/>" +
        "<h3>Confirmed cases: " +
        numeral(lastRecord.Confirmed).format("0,0") +
        "</h3>" +
        "<h3>Recovered: " +
        numeral(lastRecord.Recovered).format("0,0") +
        "</h3>" +
        "<h3>Deaths: " +
        numeral(lastRecord.Deaths).format("0,0") +
        "</h3>"
    );
  });
}

/**
 * Callback for when a country is highlighted. Will take care of the ui aspects, and it will call
 * other callbacks after done.
 * @param e
 */
function onCountryHighLight(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }

  var countryName = e.target.feature.properties.name;
  var countryCode = e.target.feature.properties.iso_a2;
  //callback when mouse enters a country polygon goes here, for additional actions
}
