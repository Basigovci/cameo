// Funkcija za dinamičko uključivanje HTML datoteke
    function includeHTML(filename) {
        fetch(filename)
            .then(response => response.text())
            .then(data => {
                document.getElementById('dynamicContent').innerHTML = data;
            })
            .catch(error => console.error('Error:', error));
    }

     function loadHome() {
       includeHTMLMap('home.html', function () {
        InitializeDashboardMap(); // Call InitializeDashboardMap() after including HTML
    });
    }

     function loadMultiStepForm() {
       includeHTML('multistepform.html');
       //includeHTML('XXX.html');
    }
    function loadWeatherVisualcrossing() {
        includeHTML('weathervisualcrossing.html');
    }
    function loadMicroservices() {
        includeHTML('microservices.html');
    }
    function loadMapExplorer() {
       includeHTMLMap('mapexplorer.html', function () {
        loadMap(); // Call loadMap() after including HTML
    });
    }
    function loadDAG() {
        includeHTML('dag.html');
    }
    function loadMLOps() {
        includeHTML('mlops.html');
    }
    function loadTaskManagement() {
        includeHTML('taskmanagement.html');
    }
    function loadUserManagement() {
        includeHTML('usermanagement.html');
    }

     function loadClassificationBasic() {
        includeHTML('classificationbasic.html');
    }
    function loadOpenWeatherMapAPI() {
        includeHTML('openweathermapapi.html');
    }

loadHome();

    function hideHome() {
            document.getElementById('dynamicContent').innerHTML = '';
        }

////////////////////////////////////////////////////////////

// Add event listener for file input
    document.getElementById('file-upload').addEventListener('change', function () {
        // Get the selected file
        var file = this.files[0];

        // Get the list container
        var listContainer = document.getElementById('list-group');

        // Create a list item
        var listItem = document.createElement('li');
        listItem.className = 'list-group-item list-group-item-action';

        // Extract filename without extension
        var fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');

        var listItemContent = `
            <div class="d-flex w-100 justify-content-between align-items-center">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault${listContainer.children.length}">
                    <label class="form-check-label" for="flexCheckDefault${listContainer.children.length}" style="font-weight: bold;">
                        ${fileNameWithoutExtension}
                    </label>
                </div>
                <small>${getCurrentDate()}</small>
            </div>
            <small>${getFileExtension(file.name)}</small>
        `;

        listItem.innerHTML = listItemContent;

        // Find the header element
        var headerElement = document.getElementById('my-bucket');

        // Insert the new list item after the header
        headerElement.insertAdjacentElement('afterend', listItem);
    });

    // Function to add My Bucket
    function addMyBucket(event) {
        // Stop event propagation to prevent the input click event from firing twice
        event.stopPropagation();

        // Open the file selection dialog
        document.getElementById('file-upload').click();
    }

     // Function to move the file to My Bucket
    function movetoMyBucket(filename, typefile) {
        // Get the list container
        var listContainer = document.getElementById('list-group');

        // Create a list item
        var listItem = document.createElement('li');
        listItem.className = 'list-group-item list-group-item-action';

        var listItemContent = `
            <div class="d-flex w-100 justify-content-between align-items-center">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault${listContainer.children.length}">
                    <label class="form-check-label" for="flexCheckDefault${listContainer.children.length}" style="font-weight: bold;">
                        ${filename}
                    </label>
                </div>
                <small>${getCurrentDate()}</small>
            </div>
            <small>${typefile}</small>
        `;

        listItem.innerHTML = listItemContent;

        // Find the header element
        var headerElement = document.getElementById('my-bucket');

        // Insert the new list item after the header
        headerElement.insertAdjacentElement('afterend', listItem);
    }



    // Function to get the current date in the format MM/DD/YYYY
 function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}

    // Function to get the file extension
    function getFileExtension(filename) {
        return filename.split('.').pop();
    }