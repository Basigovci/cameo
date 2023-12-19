    // Define dropZoneId globally or within the same scope as the functions
    var dropZoneId = "drop-zone";
    var inputFile;
    var uploadedFiles = []; // Keep track of uploaded files
    var filenamesContainer = $('#filename');

    // Function to handle file removal on close button click
    function removeFile(index) {
        uploadedFiles.splice(index, 1);
        displayFiles();
    }

    // Function to display uploaded files
    function displayFiles() {
        filenamesContainer.html('');
        $.each(uploadedFiles, function (index, file) {
            var counter = index + 1;
            filenamesContainer.append('<span class="fa-stack fa-lg"><i class="fa fa-file fa-stack-1x "></i><strong class="fa-stack-1x" style="color:#FFF; font-size:12px; margin-top:2px;">' + counter + '</strong></span> ' + file.name + '&nbsp;&nbsp;<span class="fa fa-times-circle fa-lg closeBtn" title="remove" onclick="removeFile(' + index + ')"></span><br>');
        });
    }

    // Function to clear uploaded files
    function clearFiles() {
        uploadedFiles = [];
        displayFiles();
        // Clear the input field
        inputFile.val('');
    }

    // Function to handle file upload
    function uploadFile() {
        // Your custom logic for handling file upload
        console.log("Uploading file...");
        // Add your logic here to process the uploaded files
    }

    // Function to be called on drop zone mouseover
    function handleMouseOver(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#" + dropZoneId).addClass("mouse-over");
        var x = e.pageX;
        var y = e.pageY;

        if (!(x < oleft || x > oright || y < otop || y > obottom)) {
            inputFile.offset({
                top: y - 15,
                left: x - 100
            });
        } else {
            inputFile.offset({
                top: -400,
                left: -400
            });
        }
    }

    // Function to be called on drop zone drop
    function handleDrop() {
        $("#" + dropZoneId).removeClass("mouse-over");
    }

    // Function to be called on file input change
    function handleFileInputChange(e) {
        var fileNum = e.target.files.length;

        for (var i = 0; i < fileNum; i++) {
            uploadedFiles.push(e.target.files[i]);
        }

        displayFiles(); // Display uploaded files
        // Clear the input field
        inputFile.val('');
    }

    // Add event listeners
    $(document).ready(function () {
        inputFile = $("#file");
        inputFile.on('change', handleFileInputChange);

        $("#" + dropZoneId).on("drop", handleDrop);
        $("#" + dropZoneId).on("dragover", handleMouseOver);
    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Global variable to store weatherData
  let weatherData;

  function SavetoBucket() {
    // Perform the necessary actions to save to the Bucket
    // For now, let's just display an alert
    alert("API response has been successfully saved to the Bucket!!");
  }

  // Function to dynamically generate form fields based on a JSON object
  function generateFormFields(jsonObj) {
    var formFieldsList = document.getElementById('formFieldsList');

    for (var key in jsonObj) {
      if (jsonObj.hasOwnProperty(key)) {
        var listItem = document.createElement('li');
        listItem.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ":";

        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', key);
        input.setAttribute('class', 'form-control');
        input.required = true;

        listItem.appendChild(input);
        formFieldsList.appendChild(listItem);
      }
    }
  }

  // Function to submit the form
  function getRequestBody() {
    var form = document.getElementById('jsonForm');
    var formData = new FormData(form);

    var jsonObject = {};
    formData.forEach(function (value, key) {
      jsonObject[key] = value;
    });

    var jsonString = JSON.stringify(jsonObject, null, 2);
    console.log(jsonString);

    // Set the jsonString to the jsonBody textarea
    document.getElementById('jsonBody').value = jsonString;
  }

  // Function to send Visual Crossing Weather request
  function sendVisualCrossingWeatherRequest() {
    const button = document.getElementById('serviceButton');
    const spinner = document.getElementById('serviceSpinner');
    const buttonText = document.getElementById('serviceButtonText');

    // Disable button, show spinner, and change text
    button.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.innerText = 'Running';
         getRequestBody();
    // Call the actual service function
    const apiUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
    const jsonBody = JSON.parse(document.getElementById('jsonBody').value);

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid response from server');
        }
        return response.json();
    })
    .then(data => {
        // Handle the weather data as needed
        console.log(data);
        weatherData = data; // Store the weatherData globally
        APIresponse(data); // Call the APIresponse function with the received data;

        // Re-enable button, hide spinner, and change text back
        button.disabled = false;
        spinner.style.display = 'none';
        buttonText.innerText = 'Run Service';
    })
    .catch(error => {
        // Handle fetch or JSON parsing errors
        console.error('POST Error:', error);
        alert(error);

        // Re-enable button, hide spinner, and change text back
        button.disabled = false;
        spinner.style.display = 'none';
        buttonText.innerText = 'Run Service';

        // Propagate the error to the caller if needed
        throw error;
    });
}


  // Function to download JSON
function DownloadJSON() {
  // Check if weatherData is available
  if (weatherData) {
    // Save weatherData to a file named weatherData.json
    const jsonContent = JSON.stringify(weatherData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'weatherData.json';
    document.body.appendChild(link); // Append the link to the document
    link.click(); // Programmatically click the link
    document.body.removeChild(link); // Remove the link from the document after the download
  } else {
    alert("Weather data not available. Please fetch the data first.");
  }
}
  // Function to handle API response
  function APIresponse(data, table = null, depth = 0) {
    if (!table) {
        // Create an HTML table with Bootstrap classes
        table = document.createElement('table');
        table.classList.add('table', 'table-bordered', 'table-striped');
    }

    // Create table header if depth is 0
    if (depth === 0) {
        const headerRow = table.createTHead().insertRow(0);
        headerRow.style.backgroundColor = '#26AE60'; // Background color
        headerRow.style.color = '#FFFFFF'; // Text color

        const parameterHeader = headerRow.insertCell(0);
        parameterHeader.innerHTML = '<b>Attribute</b>'; // Bold the header

        const valueHeader = headerRow.insertCell(1);
        valueHeader.innerHTML = '<b>Value</b>'; // Bold the header
    }

    // Populate the table with API response data
    for (const [parameter, value] of Object.entries(data)) {
        const row = table.insertRow();
        const parameterCell = row.insertCell(0);
        parameterCell.textContent = parameter;

        const valueCell = row.insertCell(1);
        if (typeof value === 'object' && value !== null) {
            // If the value is an object, recursively call APIresponse for nested data
            APIresponse(value, table, depth + 1);
        } else {
            valueCell.textContent = value;
        }
    }

    // Display the table in the responseTable div if depth is 0
    if (depth === 0) {
        const responseTableDiv = document.getElementById('responseTable');
        responseTableDiv.innerHTML = '';
        responseTableDiv.appendChild(table);
    }
}

function sendClassificationBasic() {
  // Get the button, spinner, and text elements for the service button
  const serviceButton = document.getElementById('serviceButton');
  const serviceSpinner = document.getElementById('serviceSpinner');
  const serviceButtonText = document.getElementById('serviceButtonText');

  // Disable the service button, show the spinner, and change the text to "Running"
  serviceButton.disabled = true;
  serviceSpinner.style.display = 'inline-block';
  serviceButtonText.textContent = 'Running';

  // Perform your fetch or any asynchronous operation
  fetch('http://localhost:8000/cameo/classificationbasicSDQ/')
    .then(response => response.json())
    .then(data => {
      // Handle the response data as needed
      weatherData = data; // Assign the data to the weatherData variable
      APIresponse(data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      alert('Error fetching data. See console for details.');
    })
    .finally(() => {
      // Re-enable the service button, hide the spinner, and change the text back to "Run Service"
      serviceButton.disabled = false;
      serviceSpinner.style.display = 'none';
      serviceButtonText.textContent = 'Run Service';
    });
}

function sendWeatherOpenWeatherMapAPI() {
  // Get values from specific form fields
  const city = document.getElementsByName('q')[0].value; // Get the value of the input field with name 'q'
  const apiKey = document.getElementsByName('appid')[0].value; // Get the value of the input field with name 'appid'
  // Check if required fields are not empty
  if (!city || !apiKey) {
    alert("Please fill in all required fields.");
    return;
  }

  // Construct the API URL with form values
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // Example for making a GET request to retrieve weather data
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      weatherData = data; // Assign the data to the weatherData variable
      APIresponse(weatherData); // Call the APIresponse function with the received data
    })
    .catch(error => {
      console.error('GET Error:', error);
    });
}

function HelloCameo() {
     alert("**C A M E O**");
 }

