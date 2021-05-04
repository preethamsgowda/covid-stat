let mapH = (function() {
    var methods = {};
    methods.getISO2 = function(e) {
        return e.target.feature.properties.ISO2;
    };
    methods.getLatLng = function(e) {
        return e.latlng;
    };
    methods.getLayerPoint = function(e) {
        return e.layerPoint;
    };
    methods.getCountryName = function(e) {
        return e.target.feature.properties.NAME;
    };
    // Expose the public methods
    return methods;
})();