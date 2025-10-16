```javascript
// Function to fetch and parse CSV data
async function fetchCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').slice(1).map(row => row.split(','));
}

// Function to fetch JSON data
async function fetchJSON(url) {
    const response = await fetch(url);
    return response.json();
}

// Function to calculate total sales
async function calculateTotalSales() {
    let totalSales = 0;

    // Check if data.csv exists and fetch it
    try {
        const csvData = await fetchCSV('./data.csv');
        csvData.forEach(row => {
            const sales = parseFloat(row[1]); // Assuming SALES is in the second column
            if (!isNaN(sales)) {
                totalSales += sales;
            }
        });
    } catch (error) {
        console.error('Error fetching or parsing data.csv:', error);
    }

    // Check if rates.json exists and fetch it for conversion
    let conversionRate = 1; // Default to 1 if no conversion needed
    try {
        const rates = await fetchJSON('./rates.json');
        conversionRate = rates.conversionRate || 1; // Assuming conversionRate is a key in the JSON
    } catch (error) {
        console.error('Error fetching rates.json:', error);
    }

    // Apply conversion if necessary
    totalSales *= conversionRate;

    // Update the DOM and localStorage
    document.getElementById('total-sales').textContent = `Total Sales: $${totalSales.toFixed(2)}`;
    localStorage.setItem('totalSales', totalSales);
}

// Run the calculation on page load
document.addEventListener('DOMContentLoaded', calculateTotalSales);
```