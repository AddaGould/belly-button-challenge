// 1. Use D3 to read in samples.json
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and initialize the visualizations
d3.json(url).then(function(data) {
    // 2. Initialize the visualizations
    init(data);
    createBubbleChart(data);
    updatePlotly(data, 0); // Initial plot update with the first sample
});

// 2. Create a horizontal bar chart w/ dropdown menu
function init(data) {
    // Default dataset
    let defaultDataset = data.samples[0];

    // Extracting data for default dataset
    let otuIDs = defaultDataset.otu_ids.slice(0, 10).reverse();
    let sampleValues = defaultDataset.sample_values.slice(0, 10).reverse();
    let otuLabels = defaultDataset.otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart
    let trace1 = {
        x: sampleValues,
        y: otuIDs.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    let dataBar = [trace1];

    let layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", dataBar, layout);

    // Selecting the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Populate dropdown menu with options
    data.samples.forEach((sample, index) => {
        dropdownMenu.append("option").attr("value", index).text(`Sample ${index}`);
    });

    // Event listener for dropdown menu
    dropdownMenu.on("change", updatePlotly);
}

// 3. Create a bubble chart to display each sample
function createBubbleChart(data) {
    // Extracting data for default dataset
    let otuIDs = data.samples[0].otu_ids;
    let sampleValues = data.samples[0].sample_values;
    let otuLabels = data.samples[0].otu_labels;

    // Create the trace for the bubble chart
    let trace = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIDs,
            colorscale: 'Picnic',
            opacity: 0.6,
            colorbar: {
                title: 'OTU ID'
            }
        }
    };

    // Create the data array for the plot
    let dataBubble = [trace];

    // Define the layout
    let layout = {
        title: 'Bubble Chart for Each Sample',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    // Plot the bubble chart
    Plotly.newPlot('bubble', dataBubble, layout);
}

// 5. Update all visualizations w/ user selection
function updatePlotly(data, selectedSampleIndex) {
    // Get the selected dataset
    let selectedDataset = data.samples[selectedSampleIndex];

    // Extracting data for selected dataset
    let otuIDs = selectedDataset.otu_ids.slice(0, 10).reverse();
    let sampleValues = selectedDataset.sample_values.slice(0, 10).reverse();
    let otuLabels = selectedDataset.otu_labels.slice(0, 10).reverse();

    // Update the horizontal bar chart
    Plotly.restyle("bar", "x", [sampleValues]);
    Plotly.restyle("bar", "y", [otuIDs.map(id => `OTU ${id}`)]);
    Plotly.restyle("bar", "text", [otuLabels]);

    // Update the bubble chart
    Plotly.restyle('bubble', 'x', [otuIDs]);
    Plotly.restyle('bubble', 'y', [sampleValues]);
    Plotly.restyle('bubble', 'text', [otuLabels]);
    Plotly.restyle('bubble', 'marker.size', [sampleValues]);
    Plotly.restyle('bubble', 'marker.color', [otuIDs]);
    Plotly.restyle('bubble', 'marker.colorbar.title', 'OTU ID');

    // Update display of sample metadata
    displayMetadata(selectedDataset.metadata);
}

// 4. Display sample metadata key-value pairs in JSON object
function displayMetadata(metadata) {
    // Get the container element
    let container = document.getElementById("metadata-container");

    // Clear any existing content
    container.innerHTML = "";

    // Iterate over the key-value pairs and create <p> elements to display them
    for (let key in metadata) {
        if (metadata.hasOwnProperty(key)) {
            let value = metadata[key];
            let paragraph = document.createElement("p");
            paragraph.textContent = `${key}: ${value}`;
            container.appendChild(paragraph);
        }
    }
}