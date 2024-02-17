var satelliteImageKeywords  = [
  // Agriculture
  "Crop monitoring",
  "Farmland mapping",
  "Agricultural land classification",
  "Crop health assessment",
  "Crop yield estimation",
  "Irrigation mapping",
  "Vegetation index analysis",
  "Drought detection",
  "Crop disease detection",
  "Precision agriculture mapping",
  "Land cover change analysis",
  "Soil moisture mapping",
  "Crop phenology monitoring",
  "Field boundary delineation",
  "Farm management planning",
  "Harvest monitoring",
  "Agricultural productivity analysis",
  "Crop type classification",
  "Pest infestation monitoring",

  // Climate
  "Climate change monitoring",
  "Temperature mapping",
  "Precipitation analysis",
  "Sea level rise monitoring",
  "Glacier monitoring",
  "Ice sheet mapping",
  "Extreme weather events",
  "Drought assessment",
  "Flood mapping",
  "Storm tracking",
  "Carbon sequestration analysis",

  // Forestry
  "Forest cover mapping",
  "Deforestation monitoring",
  "Forest degradation assessment",
  "Biomass estimation",
  "Forest fire detection",
  "Tree species identification",
  "Forest health monitoring",
  "Illegal logging detection",
  "Forest management planning",
  "Forest regeneration analysis",

  // Marine
  "Coastal monitoring",
  "Coral reef mapping",
  "Marine biodiversity assessment",
  "Ocean temperature analysis",
  "Fisheries management",
  "Marine pollution detection",
  "Habitat mapping",
  "Marine protected area monitoring",
  "Tidal analysis",
  "Algal bloom detection",
  "Sea ice monitoring"
];


function autocomplete(inputId, keywords) {
  var inputElement = document.getElementById(inputId);

  // Create a new datalist element
  var datalistElement = document.createElement('datalist');
  datalistElement.id = inputId + '-list';

  // Add options to the datalist element
  keywords.forEach(function(keyword) {
    var optionElement = document.createElement('option');
    optionElement.value = keyword;
    datalistElement.appendChild(optionElement);
  });

  // Append the datalist to the input element
  inputElement.setAttribute('list', datalistElement.id);
  inputElement.parentNode.insertBefore(datalistElement, inputElement.nextSibling);
}


/////////////////////////-------------------------------------------
function connectInputToMap(inputId, map) {
  var inputElement = document.getElementById(inputId);

  // Add event listener to the input element
  inputElement.addEventListener('input', function(e) {
    var selectedLocation = e.target.value;
    if (selectedLocation) {
      var geocodeUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(selectedLocation);

      // Make a request to the geocoding API
      fetch(geocodeUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.length > 0) {
            var latitude = parseFloat(data[0].lat);
            var longitude = parseFloat(data[0].lon);
            map.setView([latitude, longitude], 10);
          }
        })
        .catch(function(error) {
          console.log('Error:', error);
        });
    }
  });
}
