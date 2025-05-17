// generates a table based on user input for rows and columns.

function generateTable() {
    let rows = Number(document.getElementById('rows').value);
    let cols = Number(document.getElementById('cols').value);
    let tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';

    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.padding = '8px';
            td.textContent = `Row ${i + 1}, Col ${j + 1}`;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);
}