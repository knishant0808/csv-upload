// Listen for the 'submit' event on the form with ID 'uploadForm'
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a FormData object from the form. 
    // This will contain all the form fields including the file to be uploaded.
    const formData = new FormData(this);

    // Use the fetch API to send an asynchronous POST request to the server
    // The request is sent to the '/file/upload' endpoint
    fetch('/file/upload', {
        method: 'POST', // Specify the method as POST
        body: formData // Attach the form data as the request body
    })
    .then(response => response.json()) // Parse the JSON response from the server
    .then(data => {
        // Handle the response data
        if (data.message === 'File uploaded successfully!') {
            // If the file upload is successful, redirect the user to the home page
            window.location.href = '/';
        } else {
            // If the server returns an error (e.g., file already exists), display an alert with the error message
            alert(data.error);
            // Redirect to the home page even in case of error
            window.location.href = '/';
        }
    })
    .catch(error => {
        // Catch and handle any errors that occur during the fetch request (e.g., network errors)
        alert('An error occurred: ' + error.message);
        // Redirect to the home page in case of any errors
        window.location.href = '/';
    });
});
