
// Function to include HTML content with callback
function includeHTMLMap(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("dynamicContent").innerHTML = this.responseText;
            if (callback) callback();
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}
// Define map and drawnLayerJSON as global variables
var map;
var drawnLayerJSON;
var drawnFeatures = new L.FeatureGroup();
// Create a custom control for the search panel
var searchPanelControl = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = `
  <div id="panelWhatWhere" class="row">
    <!-- First Row -->
    <div class="col mt-1 mx-1">
        <input type="text" class="form-control" placeholder="What" id="WhatBox" aria-label="What">
    </div>
    <div class="col mt-1 mx-1">
        <input type="text" id="WhereBox" class="form-control" placeholder="Where" aria-label="Where">
    </div>
    <div class="col mt-1 mx-1">
        <button id="spinnerButton" class="btn btn-primary" type="button" onclick="searchCopernicus()" style="width: 150px;">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
            Search
        </button>
        <img src="img/listenlayer1.png" alt="Listen Icon" width="32" height="32" id="listenIcon" style="cursor: pointer;">
<!-- Include the saveIcon with an onclick attribute -->
<img src="img/bookmark.png" alt="Save Icon" width="32" height="32" id="saveIcon" style="cursor: pointer;" onclick="toggleSavePanel()">
    </div>
    <!-- Second Row -->
    <div class="col-12 d-flex justify-content-end mt-1 mr-1">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onclick="togglePanelVisibility()">
            <label class="form-check-label mr-1" for="flexSwitchCheckDefault"> Advanced Search</label>
        </div>
    </div>
</div>
        `;
        // Prevent click events on the panel from propagating to the map
        L.DomEvent.disableClickPropagation(container);

        return container;
    }
});


function setupCloudCoverageRange() {
    // Get the range input and the span element where we'll display the selected value
    const rangeInput = document.getElementById('customRange3');
    const cloudCoverageValueSpan = document.getElementById('cloudCoverageValue');

    // Function to update the span element with the selected value from the range input
    function updateCloudCoverageValue() {
        cloudCoverageValueSpan.textContent = rangeInput.value;
    }

    // Call the update function initially to set the default value
    updateCloudCoverageValue();

    // Add an event listener to the range input to update the label when the value changes
    rangeInput.addEventListener('input', updateCloudCoverageValue);
}



function loadMap() {
    // Initialize map
    map = L.map('map').setView([53.30661705415085, -6.218640259055979], 7);
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Call drawMapControl after map initialization
    drawMapControl();
    // Add the custom control to the map
    map.addControl(new searchPanelControl());

    // Call the autocomplete function with the input id and keywords array
autocomplete('WhatBox', satelliteImageKeywords);
// Call the connectInputToMap function with the input id and map object
connectInputToMap('WhereBox', map);

var panelAdvancedSearch = document.getElementById('panelAdvancedSearch');
panelAdvancedSearch.style.display = 'none'; // Initially hide the panel

var panelQueryResults = document.getElementById('panelQueryResults');
panelQueryResults.style.display = 'none'; // Initially hide the panel

// Call the function to set up the range input functionality
setupCloudCoverageRange();


}

function drawMapControl() {

    map.addLayer(drawnFeatures);

    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnFeatures,
            remove: true
        },
        draw: {
            polygon: {
                shapeOptions: {
                    color: 'purple'
                }
            },
            polyline: {
                shapeOptions: {
                    color: 'red'
                }
            },
            rect: {
                shapeOptions: {
                    color: 'green'
                }
            },
            circle: {
                shapeOptions: {
                    color: 'steelblue'
                }
            }
        }
    });

    map.addControl(drawControl);

    // Event listener for draw:created
    map.on("draw:created", function(e) {
        drawnFeatures.eachLayer(function(layer) {
            map.removeLayer(layer);
        });

        var type = e.layerType;
        var layer = e.layer;
        console.log(layer.toGeoJSON());
        drawnLayerJSON = layer.toGeoJSON();
        textareaJSON.value = JSON.stringify(drawnLayerJSON);  ////  OVO VRATITI
        layer.bindPopup(`<p>${JSON.stringify(layer.toGeoJSON())}</p>`);
        drawnFeatures.addLayer(layer);
    });

    // Event listener for draw:edited
    map.on("draw:edited", function(e) {
        var layers = e.layers;
        var type = e.layerType;

        layers.eachLayer(function(layer) {
            console.log(layer);
        });
    });
}

function toggleSavePanel() {
        $('#savePanel').toggle();
        panelAdvancedSearch.style.display = 'none';
        panelQueryResults.style.display = 'none';
        var checkbox = document.getElementById('flexSwitchCheckDefault');
         // Uncheck the checkbox (switch off)
         checkbox.checked = false;

    }
 function closeSavePanel() {
    document.getElementById('savePanel').style.display = 'none';
  }


 // JavaScript to manage the selected state
document.addEventListener("DOMContentLoaded", function() {
    // Get all nav-links
    var navLinks = document.querySelectorAll('.nav-link');

    // Add event listener to each nav-link
    navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function(event) {
            // Remove 'selected' class from all nav-links
            navLinks.forEach(function(link) {
                link.classList.remove('selected');
            });

            // Add 'selected' class to the clicked nav-link
            event.currentTarget.classList.add('selected');
        });
    });
});

/////////////////




/////////////////







        // Function to load CSS for a small map
        function loadCSSMap() {
            // Create a style element
            var style = document.createElement('style');

            // Add CSS rules to the style element
            style.innerHTML = `
                                #map {
                    width: 300px;
                    height: 300px;
                }
            `;

            // Append the style element to the document head
            document.head.appendChild(style);

            alert("CSS for Small Map loaded!");
        }




function togglePanelVisibility() {
    if (panelAdvancedSearch.style.display === 'none') {
        panelAdvancedSearch.style.display = 'block';
        panelQueryResults.style.display = "none";
        savePanel.style.display = "none";
        document.getElementById('EndingDate').valueAsDate = new Date();
        document.getElementById('StartingDate').valueAsDate = new Date();
       // var panelQueryResults = document.getElementById("panelQueryResults");
       // panelQueryResults.style.display = "none";
       // var panel = document.getElementById('panelShowImage');
       // panel.style.display = 'none';


      } else {
        panelAdvancedSearch.style.display = 'none';
      }
  }

function searchCopernicus() {

   var spinner = document.querySelector("#spinnerButton .spinner-border");
    spinner.style.display = "inline-block";
    // Define variables
    // Get references to the date input elements
    const startingDateInput = document.getElementById('StartingDate');
    const endingDateInput = document.getElementById('EndingDate');

// Get the values from the date inputs when needed
    const start_date = startingDateInput.value;
    const end_date = endingDateInput.value;
   // Get all the checkboxes
const checkboxes = document.querySelectorAll('.form-check-input');

// Initialize data_collection as an empty string
let data_collection = '';

// Iterate through the checkboxes
checkboxes.forEach((checkbox) => {
    // Check if the checkbox is checked
    if (checkbox.checked) {
        // Get the value of the checkbox
        const value = checkbox.value;
        switch (value) {
            case "1":
                data_collection = 'SENTINEL-1';
                break;
            case "2":
                data_collection = 'SENTINEL-2';
                break;
            case "3":
                data_collection = 'SENTINEL-3';
                break;
            case "4":
                data_collection = 'SENTINEL-5P';
                break;
            case "5":
                data_collection = 'SENTINEL-6';
                break;
            default:
                break;
        }
    }
});

    //let aoi = "POINT(-6.224221 53.309291)'";


        jsonString=textareaJSON.value;
      let aoi; // Declare aoi variable

    try {
        const data = JSON.parse(jsonString); // Parse JSON string
        const geometryType = data.geometry.type; // Get geometry type

        // Extract coordinates based on geometry type and construct AOI format
        if (geometryType === 'Polygon') {
            const coordinates = data.geometry.coordinates[0].map(coord => coord.join(' ')).join(',');
            aoi = `POLYGON((${coordinates}))`;
        } else if (geometryType === 'Point') {
            const coordinates = data.geometry.coordinates.join(' ');
            aoi = `POINT(${coordinates})`;
        } else {
            // Handle unsupported geometry types
            console.error('Unsupported geometry type:', geometryType);
        }
    } catch (error) {
        console.error('Error while parsing JSON:', error);
    }
    aoi += "'";

    panelAdvancedSearch.style.display = 'none';
    panelQueryResults.style.display = 'block';
    // Find the checkbox element by its ID
    var checkbox = document.getElementById('flexSwitchCheckDefault');
    // Uncheck the checkbox (switch off)
    checkbox.checked = false;

    // Construct the filter for the Copernicus API URL
    const filter = `Collection/Name eq '${data_collection}' and ContentDate/Start gt ${start_date}T00:00:00.000Z and ContentDate/Start lt ${end_date}T00:00:00.000Z and OData.CSC.Intersects(area=geography'SRID=4326;${aoi})`;

    // Construct the API URL
    const apiUrl = `https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=${encodeURIComponent(filter)}`;

    // Create a link element
    const linkElement = document.createElement('a');
    linkElement.href = apiUrl;
    linkElement.textContent = 'Copernicus Data Link';


    // Example for making a GET request to retrieve data from Copernicus API
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Extracting desired fields
        const extractedData = data.value.map(item => {
            // Extracting Mission from S3Path
            const s3Path = item.S3Path;
            const missionMatch = s3Path.match(/Sentinel-[1-6]|Sentinal-5P/gi); // Match Sentinel-1 to Sentinel-6 and Sentinel-5P
            const mission = missionMatch ? missionMatch[0].toUpperCase() : 'Unknown'; // Extract first match and convert to uppercase

            return {
                Id: item.Id, // Include Id field
                GeoFootprint: item.GeoFootprint,
                Name: item.Name,
                Mission: mission, // Assign extracted mission
                Instrument: item.Name.split('_')[1],
                Size: item.ContentLength,
                SensingTime: item.ContentDate.Start
            };
        });

            // Display extractedData on HTML page
            displayDataOnPage(extractedData);
            spinner.style.display = "none";
        })
        .catch(error => {
            console.error('GET Error:', error);
            alert("An error occurred while fetching data from Copernicus API.");
        });
}

function displayDataOnPage(data) {
    const container = document.getElementById('dataContainer');
    container.innerHTML = ''; // Clear previous content

    // Set maximum card count to 3
    const maxCards = 3;
    let cardCount = 0;

    // Update the total rows count
    const totalRowsElement = document.getElementById('totalRows');
    totalRowsElement.textContent = data.length;

    data.forEach(item => {
        if (cardCount >= maxCards) {
            return; // Exit loop if maximum card count is reached
        }

        // Create card element
        const card = document.createElement('div');
        card.classList.add('card', 'mb-4');
        card.style.maxWidth = '600px';

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'p-2'); // Adjusted padding to p-2

        // Create row for the card
        const row = document.createElement('div');
        row.classList.add('row', 'g-0');

        // Create column for the image and button
        const imgBtnCol = document.createElement('div');
        imgBtnCol.classList.add('col-md-2', 'd-flex', 'align-items-center', 'p-0'); // Adjusted width to col-md-2, set padding to 0

        // Image container
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('d-flex', 'flex-column', 'align-items-center'); // Flexbox for centering

        // Image
        const img = document.createElement('img');
        img.src = 'img/s2a.png';
        img.classList.add('img-fluid', 'rounded-start');
        img.alt = 'Sentinel Image';
        img.width = '64';
        img.height = '64';
        img.style.margin = '2px';

        // Visualize button
        const visualizeBtn = document.createElement('button');
        visualizeBtn.type = 'button';
        visualizeBtn.classList.add('btn', 'btn-outline-success', 'btn-sm', 'mb-2'); // Add Bootstrap classes
        visualizeBtn.textContent = 'Visualize';

        // Append image and button to their container
        imgContainer.appendChild(img);
        imgContainer.appendChild(visualizeBtn);
        imgBtnCol.appendChild(imgContainer);

        // Create column for the details (Name, Mission, Instrument, Size, Sensing Time)
        const detailsCol = document.createElement('div');
        detailsCol.classList.add('col-md-10', 'p-0'); // Adjusted width to col-md-10, set padding to 0

        // Title (Name)
        const title = document.createElement('h7');
        title.classList.add('card-title');
        title.textContent = item.Name;

        // Mission, Instrument, Size
        const missionInstrumentSize = document.createElement('p');
        missionInstrumentSize.classList.add('card-text', 'mb-0'); // Reduced bottom margin to 0

        // Convert the size to MB
        const sizeInMB = `${(item.Size / (1024 * 1024)).toFixed(2)}MB`;

        // Set innerHTML with the bold labels
        missionInstrumentSize.innerHTML = `<strong>Mission:</strong> ${item.Mission} <strong>Instrument:</strong> ${item.Instrument} <strong>Size:</strong> ${sizeInMB}`;

        // Sensing Time
        const sensingTime = document.createElement('p');
        sensingTime.classList.add('card-text', 'mb-0'); // Reduced bottom margin to 0
        sensingTime.innerHTML = `<strong>Sensing Time:</strong> ${item.SensingTime}`;

// Create image elements for each image
const infoImage = createClickableImage('img/infoimage.png', '16', '16', '5px', infoImageClick);
const sniperTargetImage = createClickableImage('img/snipertarget.png', '16', '16', '5px', sniperTargetImageClick, { 'geoFootprint': JSON.stringify(item.GeoFootprint) });
const workplaceImage = createClickableImage('img/workplace.png', '16', '16', '5px', workplaceImageClick, { 'name': item.Name });
const downloadImage = createClickableImage('img/downloadimage.png', '16', '16', '5px', downloadImageClick, { 'id': item.Id });


        // Append the images to the details column
        detailsCol.appendChild(title);
        detailsCol.appendChild(missionInstrumentSize);
        detailsCol.appendChild(sensingTime);
        detailsCol.appendChild(infoImage); // Append the "Info" image
        detailsCol.appendChild(sniperTargetImage); // Append the "Sniper Target" image
        detailsCol.appendChild(workplaceImage); // Append the "Workplace" image
        detailsCol.appendChild(downloadImage); // Append the "Download" image

        // Append columns to the row
        row.appendChild(imgBtnCol);
        row.appendChild(detailsCol);

        // Append the row to the card body
        cardBody.appendChild(row);

        // Append the card body to the card
        card.appendChild(cardBody);

        // Append the card to the container
        container.appendChild(card);

        cardCount++; // Increment card count

        // Update the current rows count
        const currentRowsElement = document.getElementById('currentRows');
        currentRowsElement.textContent = cardCount;
    });
}

// Function to create a clickable image element
function createClickableImage(src, width, height, margin, clickHandler, data) {
    const image = document.createElement('img');
    image.src = src;
    image.width = width;
    image.height = height;
    image.style.marginLeft = margin; // Add margin to align it with Sensing Time
    image.style.cursor = 'pointer'; // Set cursor to pointer for indicating clickability
    image.addEventListener('click', clickHandler); // Attach click event handler

    // Set custom data attributes
    for (let key in data) {
        image.setAttribute('data-' + key, data[key]);
    }

    return image;
}


// Example click handlers
function infoImageClick() {
    alert('Product info');
}

function sniperTargetImageClick() {


const geoFootprintAttribute = this.getAttribute('data-geoFootprint');
const geoFootprintJSON = JSON.parse(geoFootprintAttribute);
    // Create a GeoJSON layer from the geoFootprintJSON
    const layer = L.geoJSON(geoFootprintJSON);

    // Bind a popup with the GeoJSON data to the GeoJSON layer
    layer.bindPopup(`<p>${JSON.stringify(geoFootprintJSON)}</p>`);

    // Clear existing GeoJSON layers from the drawnFeatures layer group
    drawnFeatures.clearLayers();

    // Add the new GeoJSON layer to the drawnFeatures layer group
    drawnFeatures.addLayer(layer);

    // Fit the map's view to the bounds of the newly added GeoJSON layer
    const bounds = layer.getBounds();
    map.fitBounds(bounds);
}



function workplaceImageClick() {
    const geoNameAttribute = this.getAttribute('data-name');
    const shortenedName = geoNameAttribute.slice(0, 8) + '...';
    movetoMyBucket(shortenedName, 'img');
}

function downloadImageClick() {
    const dataId = this.getAttribute('data-id');
    const access_token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJYVUh3VWZKaHVDVWo0X3k4ZF8xM0hxWXBYMFdwdDd2anhob2FPLUxzREZFIn0.eyJleHAiOjE3MDcxNjg2NTcsImlhdCI6MTcwNzE2ODA1NywianRpIjoiZWRmYTQ3MGMtMTA3Yy00Yjg2LWE3MzctZjUzMmEyMjhlMGQzIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5kYXRhc3BhY2UuY29wZXJuaWN1cy5ldS9hdXRoL3JlYWxtcy9DRFNFIiwiYXVkIjpbIkNMT1VERkVSUk9fUFVCTElDIiwiYWNjb3VudCJdLCJzdWIiOiJhMjAyODA1NC03YzgzLTRhM2QtYmM1YS1iYWFiZmZkZDJjNDEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjZHNlLXB1YmxpYyIsInNlc3Npb25fc3RhdGUiOiIxMzQxMjBhNi0xNmQzLTRkOGEtODBlZi0wMmFlYjg0M2IzYjQiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9sb2NhbGhvc3Q6NDIwMCIsIioiLCJodHRwczovL3dvcmtzcGFjZS5zdGFnaW5nLWNkc2UtZGF0YS1leHBsb3Jlci5hcHBzLnN0YWdpbmcuaW50cmEuY2xvdWRmZXJyby5jb20iXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLWNkYXMiLCJjb3Blcm5pY3VzLWdlbmVyYWwiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6IkFVRElFTkNFX1BVQkxJQyBvcGVuaWQgZW1haWwgcHJvZmlsZSBvbmRlbWFuZF9wcm9jZXNzaW5nIHVzZXItY29udGV4dCIsInNpZCI6IjEzNDEyMGE2LTE2ZDMtNGQ4YS04MGVmLTAyYWViODQzYjNiNCIsImdyb3VwX21lbWJlcnNoaXAiOlsiL2FjY2Vzc19ncm91cHMvdXNlcl90eXBvbG9neS9jb3Blcm5pY3VzX2dlbmVyYWwiLCIvb3JnYW5pemF0aW9ucy9kZWZhdWx0LWEyMDI4MDU0LTdjODMtNGEzZC1iYzVhLWJhYWJmZmRkMmM0MS9yZWd1bGFyX3VzZXIiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBc21pciBCdXRrb3ZpYyIsIm9yZ2FuaXphdGlvbnMiOlsiZGVmYXVsdC1hMjAyODA1NC03YzgzLTRhM2QtYmM1YS1iYWFiZmZkZDJjNDEiXSwidXNlcl9jb250ZXh0X2lkIjoiMTQzNjhhZjktZjlhMi00MDdkLWIzZDEtMWVjMzRjNzMyNTQ4IiwiY29udGV4dF9yb2xlcyI6e30sImNvbnRleHRfZ3JvdXBzIjpbIi9hY2Nlc3NfZ3JvdXBzL3VzZXJfdHlwb2xvZ3kvY29wZXJuaWN1c19nZW5lcmFsLyIsIi9vcmdhbml6YXRpb25zL2RlZmF1bHQtYTIwMjgwNTQtN2M4My00YTNkLWJjNWEtYmFhYmZmZGQyYzQxL3JlZ3VsYXJfdXNlci8iXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWJ1dGtvdmljQGhvdG1haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IkFzbWlyIiwiZmFtaWx5X25hbWUiOiJCdXRrb3ZpYyIsInVzZXJfY29udGV4dCI6ImRlZmF1bHQtYTIwMjgwNTQtN2M4My00YTNkLWJjNWEtYmFhYmZmZGQyYzQxIiwiZW1haWwiOiJhYnV0a292aWNAaG90bWFpbC5jb20ifQ.IIdU9hyukXGWGK45s2DYi9G6IJBZdqFtwzrNkNRB0L5aEBv4fRxUm4gZTz-B5eM5j-p4kexSxtklk8L2L8DIsQrQxX-pflJ9q6yRNl3iDL_-IgRgWtDQ5jksqXLDbCzMezEUARHoxkb4WdCOfvQJg2whthwh_8lcnzmcdgKVrdBiOA8sVKzTaRddUyyO0ru5iXXNPwkGK4CYqXT0_ZsZr4sJZENVnh5s_eunBTs6_qmxXZz03Z41ubEdwi_Vz9FH7KeDokqgWu4boh5A5DeB5cwL5iju27iPAWgriuR1ha7VaDl5mXO8OJSz7QAJApj1VpWxsQY63KjzNVO9GWoWDQ"

    // Confirm the download with the user
    const confirmDownload = confirm("Do you want to download the file?");
    if (!confirmDownload) {
        return; // Exit the function if the user cancels the download
    }

    const url = `https://zipper.dataspace.copernicus.eu/odata/v1/Products(${dataId})/$value`;
    const headers = {
        "Authorization": `Bearer ${access_token}`
    };

    fetch(url, {
        method: 'GET',
        headers: headers,
        mode: 'cors', // or 'no-cors' if the server doesn't allow CORS
        cache: 'no-cache',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

////////////////////////////////////////////////////////////////////////////

// Function to initialize the dashboard map
    function InitializeDashboardMap() {
        // Initialize the map
        var mapdashboard = L.map('mapdashboard').setView([53.4129, -8.2439], 6); // Set initial view to the center of Ireland with zoom level 7

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapdashboard);

        // Function to process and add markers from GeoJSON data
        function processEventDashboardData(data) {
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    var markerOptions = {
                        radius: 8,
                        fillColor: getDashboardColor(feature.properties.type),
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    };

                    return L.circleMarker(latlng, markerOptions);
                },
                onEachFeature: function(feature, layer) {
                    // Customize popup content here based on your data
                    var popupContent = "<b>" + feature.properties.type + "</b><br>" +
                                       feature.properties.date + "<br>" +
                                       feature.properties.description;
                    layer.bindPopup(popupContent);
                }
            }).addTo(mapdashboard);
        }

        // Load data from GeoJSON file
        $.getJSON('geojson/ireland_locations.geojson', function(data) {
            // Process the data and add markers to the map
            processEventDashboardData(data);
        });

        // Function to get color based on event type
        function getDashboardColor(type) {
            return type === 'fire' ? '#FEBF05' :
                   type === 'flood' ? '#0A829A' :
                   type === 'storm' ? '#7E0000' :
                   'green'; // Default color for other types
        }
    }

 function loadJSON() {

const FileInfoElement = document.getElementById('FileInfo');
FileInfoElement.textContent= '';

  drawnFeatures.eachLayer(function(layer) {
    map.removeLayer(layer);
  });

  const input = document.createElement('input');
  input.type = 'file';
  document.getElementById('textareaJSON').value = "";

  input.onchange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      const data = JSON.parse(content);

      drawnFeatures.clearLayers(); // Clear existing GeoJSON layers from the drawnFeatures layer group

      // Set drawnLayerJSON to the GeoJSON representation of the data object
      drawnLayerJSON = data;

      // Set textareaJSON.value with the JSON string representation of drawnLayerJSON
      textareaJSON.value = JSON.stringify(drawnLayerJSON, null, 2);

      const layer = L.geoJSON(data); // Create a Leaflet GeoJSON layer from the loaded data

      layer.bindPopup(`<p>${JSON.stringify(layer.toGeoJSON())}</p>`);
      drawnFeatures.addLayer(layer); // Add the new GeoJSON layer to the drawnFeatures layer group

      // Fit the map's view to the bounds of the newly added GeoJSON layer
      var bounds = layer.getBounds();
      map.fitBounds(bounds);
    };
     //alert(`File Name: ${file.name}\nFile Path: ${URL.createObjectURL(file)}`);
     FileInfoElement.textContent= `File: ${file.name}`;
    reader.readAsText(file);
  };
  input.click();
}