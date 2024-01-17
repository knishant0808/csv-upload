document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    fetch('/file/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'File uploaded successfully!') {
            window.location.href = '/'; // Redirect on successful upload
        } else {
            alert(data.error); // Display error message
            window.location.href = '/'; // Redirect also if the file exists
        }
    })
    .catch(error => {
        alert('An error occurred: ' + error.message); // Handle network errors
        window.location.href = '/'; // Redirect also in case of network error
    });
});
