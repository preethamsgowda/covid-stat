let apiH = (function() {
    let methods = {};
    let countries;
    methods.loadCountries = function() {
        fetch('https://api.covid19api.com/countries')
            .then(res => res.json())
            .then(data => countries = data)
    };
    methods.getDataForIso2 = function(iso2, cb) {
        let countrySlug = this.getSlugForIso2(iso2);
        fetch("https://api.covid19api.com/total/country/" + countrySlug)
            .then(response => response.json())
            .then(data => cb(data));
    };
    methods.getSlugForIso2 = function(iso2) {
        return countries.find(o => o.ISO2 === iso2).Slug;
    };
    // Expose the public methods
    return methods;
})();

$(document).ready(function() {
    apiH.loadCountries();
});