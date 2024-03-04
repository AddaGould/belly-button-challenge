// 1. Use D3 to read in samples.json
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to fetch data and initialize visualizations
function init() {
    // Fetch the JSON data
    d3.json(url).then(function(data) {
        // Initialize the visualizations
        createBarChart(data);
        createBubbleChart(data);
        
        // Populate dropdown menu with sample IDs
        populateDropdown(data);

        // Event listener for dropdown menu
        d3.select("#selDataset").on("change", function() {
            // Get the selected sample ID
            let selectedSampleID = +d3.select(this).property("value");

            // Update metadata and visualizations
            buildMetadata(data, selectedSampleID);
            updateVisualizations(data, selectedSampleID);
        });

        // Display metadata and visualizations for the first sample
        let initialSampleID = data.metadata[0].id;
        buildMetadata(data, initialSampleID);
        updateVisualizations(data, initialSampleID);
    });
}

// Function to populate dropdown menu with sample IDs
function populateDropdown(data) {
    let dropdownMenu = d3.select("#selDataset");
    dropdownMenu.html(""); // Clear existing options

    data.metadata.forEach(sample => {
        dropdownMenu.append("option").attr("value", sample.id).text(`Sample ${sample.id}`);
    });
}

// 2. Function to create horizontal bar chart
function createBarChart(data) {
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

// 4. Function to display the sample metadata
function buildMetadata(data, sampleID) {
    let metadata = data.metadata.find(sample => sample.id === sampleID);
    let PANEL = d3.select("#sample-metadata");

    PANEL.html(""); // Clear any existing metadata

    Object.entries(metadata).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
}

// 5. Function to update visualizations based on selected sample
function updateVisualizations(data, sampleID) {
    // Get the selected dataset
    let selectedDataset = data.samples.find(sample => sample.id == sampleID);

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
    buildMetadata(data, sampleID);
}

// 6. Call the init function to start the process
init();