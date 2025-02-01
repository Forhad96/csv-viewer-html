 // Constants
 const DELIMITER = ',';
 const NEWLINE = '\n';
 const QUOTE_REGEX = /^"|"$/g; // Removes leading/trailing quotes
 const REPLACEMENT_REGEX = /�/g; // Replaces '�' with '-'

 let csvData = { headers: [], data: [] };
 let currentPage = 0;
 const rowsPerPage = 50; // Number of rows to display per page

 document.addEventListener('DOMContentLoaded', () => {
     document.getElementById('file')?.addEventListener('change', handleFileChange);
     document.getElementById('prevPage')?.addEventListener('click', handlePrevPage);
     document.getElementById('nextPage')?.addEventListener('click', handleNextPage);
 });

 function handleFileChange(event) {
     const file = event.target.files?.[0];
     if (file) readFile(file);
 }

 function readFile(file) {
     const reader = new FileReader();
     reader.onload = (event) => {
         csvData = parseCSV(event.target.result);
         currentPage = 0; // Reset to the first page
         renderTable(currentPage);
     };
     reader.readAsText(file);
 }

 function parseCSV(csvText) {
     if (!csvText) return { headers: [], data: [] };

     // Split the CSV into rows and filter out empty rows
     const [headerRow, ...rows] = csvText.split(NEWLINE).map(row => row.trim()).filter(Boolean);

     // Parse headers and replace '�' with '-'
     const headers = headerRow
         .split(DELIMITER)
         .map(header => header.replace(QUOTE_REGEX, '').trim().replace(REPLACEMENT_REGEX, '-'));

     // Parse data rows and replace '�' with '-'
     const data = rows.map(row =>
         row.split(DELIMITER).map(column =>
             column.replace(QUOTE_REGEX, '').trim().replace(REPLACEMENT_REGEX, '-')
         )
     );

     return { headers, data };
 }

 function renderTable(page) {
     const tableElement = document.getElementById('table');
     if (!tableElement) return;

     // Clear the table
     tableElement.innerHTML = '';

     // Append the header row
     tableElement.appendChild(createRow(csvData.headers, 'th'));

     // Calculate the start and end indices for the current page
     const start = page * rowsPerPage;
     const end = start + rowsPerPage;
     const pageData = csvData.data.slice(start, end);

     // Append data rows for the current page
     pageData.forEach(row => tableElement.appendChild(createRow(row, 'td')));

     // Update pagination info
     document.getElementById('pageInfo').textContent = `Page ${page + 1} of ${Math.ceil(csvData.data.length / rowsPerPage)}`;
 }

 function createRow(columns, cellTag) {
     const rowElement = document.createElement('tr');
     columns.forEach(text => {
         const cell = document.createElement(cellTag);
         cell.textContent = text;
         rowElement.appendChild(cell);
     });
     return rowElement;
 }

 function handlePrevPage() {
     if (currentPage > 0) {
         currentPage--;
         renderTable(currentPage);
     }
 }

 function handleNextPage() {
     if ((currentPage + 1) * rowsPerPage < csvData.data.length) {
         currentPage++;
         renderTable(currentPage);
     }
 }