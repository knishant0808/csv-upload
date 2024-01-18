// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Get the search input element and all table row elements
    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('tbody tr');

    // Add an event listener to handle input events on the search input
    searchInput.addEventListener('input', function () {
        // Convert the search term to lowercase for case-insensitive comparison
        const searchTerm = searchInput.value.toLowerCase();

        // Iterate over each table row
        tableRows.forEach(function (row) {
            // Get all cell elements in the current row
            const rowCells = row.querySelectorAll('td');
            let matchFound = false;

            // Check each cell to see if it contains the search term
            rowCells.forEach(function (cell) {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    matchFound = true;
                }
            });

            // Display the row if a match is found, otherwise hide it
            if (matchFound) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Function to sort the table based on the column header clicked
    const sortTable = (columnName) => {
        // Select the table element and convert the rows to an array for sorting
        const table = document.querySelector('table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        // Find the index of the column to sort by matching the header text
        const columnIndex = Array.from(table.querySelectorAll('thead th')).findIndex(th => th.textContent.trim() === columnName);

        // Sort the rows based on the content of the cells in the selected column
        rows.sort(function (a, b) {
            const cellA = a.querySelectorAll('td')[columnIndex].textContent.trim();
            const cellB = b.querySelectorAll('td')[columnIndex].textContent.trim();

            // Detect and handle different data types for sorting
            if (isDateColumn(columnName)) {
                // Parse and compare dates
                const dateA = new Date(cellA);
                const dateB = new Date(cellB);
                return dateA - dateB;
            } else if (isNumeric(cellA) && isNumeric(cellB)) {
                // Compare as numbers
                return parseFloat(cellA) - parseFloat(cellB);
            } else {
                // Default to string comparison
                return cellA.localeCompare(cellB);
            }
        });

        // Toggle the sorting order between ascending and descending
        const currentOrder = table.getAttribute('data-order') || 'asc';
        if (currentOrder === 'asc') {
            rows.reverse();
            table.setAttribute('data-order', 'desc');
        } else {
            table.setAttribute('data-order', 'asc');
        }

        // Append the sorted rows back to the table body
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows
        rows.forEach(row => tbody.appendChild(row));
    };

    // Function to determine if a column contains date values
    // This should be customized based on your table's column names
    function isDateColumn(columnName) {
        return columnName.endsWith('Date'); // Example: identifies columns ending with 'Date' as date columns
    }

    // Function to check if a value is numeric
    function isNumeric(value) {
        // Returns true if the value is not NaN and can be converted to a floating point number
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    // Attach click event listeners to each header cell for sorting functionality
    document.querySelectorAll('thead th').forEach(cell => {
        cell.addEventListener('click', () => sortTable(cell.textContent.trim()));
    });
});