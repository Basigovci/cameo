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
        includeHTML('home.html');
    }
     function loadMultiStepForm() {
        includeHTML('multistepform.html');
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

