

// DECLARE VARIABLES
// ***************************
d3.json('samples.json').then(sampleData => {
  var metadata = sampleData.metadata;
  var names = sampleData.names
  var samples = sampleData.samples

// **************************************
// POPULATE THE TEST SUBJECT ID DROPDOWN
// **************************************
var message = ("Select Subject");
d3.select("#selDataset").append("option")
.attr("value", message).html(message);

var dropdown = d3.select("#selDataset");
names.forEach((item) => {
   var row = dropdown.append("option")
  .attr("value", item);
  row.text(item);
});
// **************************************
// POPULATE DEMOGRAPHICS TABLE AND FILTER DATA
const dropdownchange = () => {

// SELECT DEMOGRAPHICS TABLE ELEMENTS
//-------------------------------
  var demoTable = d3.select("#demographics-table");
// CLEAR PREVIOUS TABLE
//---------------------
  demoTable.html("")
  var inputElement = d3.select("#selDataset");
  var tableBody = demoTable.append("tbody");
  var inputValue = inputElement.property("value");

// DATA FILTERING DATA BASED ON SELECTION
//------------------------------------------
var filteredData = metadata.filter(item => item.id == inputValue);
var filteredSamples = samples.filter(item => item.id == inputValue);

// POPULATING TABLE WITH SELECTION DATA
//-------------------------------------
filteredData.forEach((item) => {
  let row = tableBody.append("tr");
  Object.entries(item).forEach(value => {
      let cell = row.append("tr");
      cell.text("");
      cell.text(`${value[0]}: ${value[1]}`);
  })
});
// ****************************************
// SLICING/REVERSING DATA FOR HORIZONTAL BAR CHART
// ***********************************************
var SlicedSampleValues = filteredSamples[0].sample_values.slice(0,10).reverse();
var slicedOTUs = filteredSamples[0].otu_ids.slice(0,10).reverse().map(data => `OTU ` + data);
var slicedLabels = filteredSamples[0].otu_labels.slice(0,10).reverse();
// ******************************************
// PLOT HORIZONAL BAR CHART
// ************************************
var trace1 = {
  x: SlicedSampleValues,
  y: slicedOTUs,
  text: slicedLabels,
  type: "bar",
  orientation: "h"
};
var bardata = [trace1];
var barlayout = {
    title: "Top 10 OTUs in Sample",
    xaxis: {title: "Prevalence in Sample"},
    yaxis: {title: "OTU ID Number"}  
};
Plotly.newPlot("bar", bardata, barlayout);
// **************************************
//BUBBLE CHART
// *************************************
var size = filteredSamples[0].sample_values;

var trace2 = {
  x: filteredSamples[0].otu_ids,
  y: filteredSamples[0].sample_values,
  text: filteredSamples[0].otu_labels,
  mode: 'markers',
  marker: {
    size: size,
    sizeref: .1,
    sizemode: 'area',
    color: filteredSamples[0].otu_ids,
}}
var bubbledata = [trace2]
var bubblelayout = {
  title: "OTU Prevalence in Sample",
  xaxis: {title: 'OTU ID Number'},
  yaxis: {title: 'Prevalence in Sample'},
}

Plotly.newPlot("bubble", bubbledata, bubblelayout)
// **********************************************
// CLOSE FUNCTION
};
// EVENT TRIGGER
dropdown.on("change", dropdownchange);
// CLOSE DATA RETRIEVAL AREA
});
