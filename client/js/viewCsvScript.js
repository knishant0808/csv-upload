document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('tbody tr');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();

        tableRows.forEach(function (row) {
            const rowCells = row.querySelectorAll('td');
            let matchFound = false;

            rowCells.forEach(function (cell) {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    matchFound = true;
                }
            });

            if (matchFound) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    const sortTable = (columnName) => {
        // Get the table, rows, and the index of the column to sort
        const table = document.querySelector('table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const columnIndex = Array.from(table.querySelectorAll('thead th')).findIndex(th => th.textContent.trim() === columnName);

        // Sort the rows based on the content of the selected column
        rows.sort(function (a, b) {
            const cellA = a.querySelectorAll('td')[columnIndex].textContent.trim();
            const cellB = b.querySelectorAll('td')[columnIndex].textContent.trim();
            return cellA.localeCompare(cellB);
        });

        // Reverse the order if the current order is ascending
        const currentOrder = table.getAttribute('data-order') || 'asc';
        if (currentOrder === 'asc') {
            rows.reverse();
            table.setAttribute('data-order', 'desc');
        } else {
            table.setAttribute('data-order', 'asc');
        }

        // Remove existing rows from the table
        const tbody = table.querySelector('tbody');
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        // Append the sorted rows to the table
        rows.forEach(function (row) {
            tbody.appendChild(row);
        });
    };

    // Attach click event listeners to the header cells for sorting
    const headerCells = document.querySelectorAll('thead th');
    headerCells.forEach(function (cell) {
        cell.addEventListener('click', function () {
            const columnName = cell.textContent.trim();
            sortTable(columnName);
        });
    });
});
