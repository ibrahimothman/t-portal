import Papa from 'papaparse';

export async function fetchCSV(path) {
    const res = await fetch(path);
    const text = await res.text();
    
    const { data, errors } = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimitersToGuess: [',', '\t', '|', ';'], // Handle different delimiters
    });
    
    if (errors.length > 0) {
        console.warn('CSV errors:', errors);
    }
    
    return data;
}