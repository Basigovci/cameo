
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

// Function to load the map
function loadMap() {
    var map = L.map('map').setView([53.30661705415085, -6.218640259055979], 7);
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

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

