export const useCreateCSVTemplate = async (fileName:string, headers:string[], rows:Array<Object>) => {

    // Create the CSV data
    let csvData = headers.join(',') + '\n';
    rows.forEach(row => {
        csvData += Object.values(row).join(',') + '\n';
    });

    // Create a Blob with the CSV data
    const csvBlob = new Blob([csvData], { type: 'text/csv' });

    // Create a URL for the Blob
    const csvUrl = URL.createObjectURL(csvBlob);

    // Create a link element
    const link = document.createElement('a');
    link.href = csvUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Remove the link element
    link.remove();
}