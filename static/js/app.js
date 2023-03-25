url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let dataBase = {};

d3.json(url).then(function(data) {
  dataBase = data;
  init(data);
  //Enable the dropdown seletion after storing the data from url and initializing the web page
  document.getElementById("selDataset").removeAttribute("disabled")
});


function init(data){
  dropDown(data.names);
  sample_array = dataBase.samples.filter(item => item.id === "940");
  metaData = dataBase.metadata.filter(item => item.id === 940);
  // init bar plot
  barPlot(sample_array,true);
  // init bubble plot
  bubblePlot(sample_array,true);
  // init HTML panel
  panelDemo(metaData);
};


function optionChanged(value){
  console.log(value);
  sample_array = dataBase.samples.filter(item => item.id === value);
  metaData = dataBase.metadata.filter(item => item.id === parseInt(value));
  barPlot(sample_array,false);
  bubblePlot(sample_array,false);
  panelDemo(metaData);
};


function dropDown(names_id){
  //array to store html to add to the select list
  var html = [];
  //loop through the array
  for (var i = 0; i < names_id.length; i++) {
  //add the option elements to the html array
    html.push("<option>" + names_id[i] + "</option>");
  }
  document.getElementById("selDataset").innerHTML = html.join("");
};

function panelDemo(metaData){
  //array to store html to add to the select list
  var html = [];
  //loop through the array
  for (var key in metaData[0]) {
  //add the option elements to the html array
    var value = metaData[0][key];
    html.push('<h6>'+ key + ':' + value +'</h6>');
  }
  document.getElementById("sample-metadata").innerHTML = html.join("");
}


function barPlot(inputArray, isInit){
  // Slice the first 10 objects for plotting
  let otu_idsTen = inputArray[0].otu_ids.slice(0,10);
  let sample_valuesTen = inputArray[0].sample_values.slice(0,10);
  let otu_labelsTen = inputArray[0].otu_labels.slice(0,10);
  
  let data = [{
    x: sample_valuesTen.reverse(),
    y: otu_idsTen.reverse().map(item => ` OTU ${item}`),
    type: "bar",
    orientation:"h",
    // hovertemplate: otu_labelsTen
    text:otu_labelsTen
  }];

  let layout = {
    // title: "Top 10 OTU",
    height: 600,
    width: 400
  };

  if (isInit){
    Plotly.newPlot("bar", data, layout);
  }
  else{
    console.log(data);
    Plotly.restyle("bar", 'y',  [otu_idsTen.map(item => ` OTU ${item}`)]);
    Plotly.restyle("bar", 'x',  [sample_valuesTen]);
  }
};


function bubblePlot(inputArray, isInit){

  var trace1 = {
    x: inputArray[0].otu_ids,
    y: inputArray[0].sample_values,
    text: inputArray[0].otu_labels,
    mode: 'markers',
    marker: {
      size: inputArray[0].sample_values,
      color: inputArray[0].otu_ids,
      colorscale: 'Portland',
      showscale:true
    }
  };
  
  var data = [trace1];
  
  var layout = {
    // title: 'Marker Size',
    showlegend: false,
    height: 600,
    width: 1200
  };

  if (isInit){
    Plotly.newPlot("bubble", data, layout);
  }
  else{
    Plotly.restyle("bubble", 'y',  [inputArray[0].sample_values]);
    Plotly.restyle("bubble", 'x',  [inputArray[0].otu_ids]);
    Plotly.restyle("bubble", 'text',  [inputArray[0].otu_labels]);
    Plotly.restyle("bubble", 'marker.size',  [inputArray[0].sample_values]);
    Plotly.restyle("bubble", 'marker.color',  [inputArray[0].otu_ids]);
  }
};