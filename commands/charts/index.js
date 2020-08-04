const vega = require('vega');
const express = require('express');
const lite = require('vega-lite')
const app = module.exports = express();
const bodyParser = require('body-parser');

//TODO: Add file support for getting graph from CSV
//TODO:

/*Example request body:
{
		"type": "bar"
    "values": [{"Year": "2005", "Price": 280}, {"Year": "2006", "Price": 550}],
    "xName": "Year",
    "yName": "Price"
}*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/charts', function(req, res) {
	var vegaLightSpec = {
	  $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
	  description: 'API bar chart',
	  data: {
	    values: []
	  },
	  mark: req.body.type,
	  encoding: {
	    x: {field: '', type: 'ordinal'},
	    y: {field: '', type: 'quantitative'}
	  }
	};

	vegaLightSpec["data"]["values"] = req.body.values
	vegaLightSpec["encoding"]["x"]["field"]= req.body.xName
	vegaLightSpec["encoding"]["y"]["field"] = req.body.yName
	let vegaspec = lite.compile(vegaLightSpec).spec
	var view = new vega.View(vega.parse(vegaspec),
	{renderer: "none"})
	view.toSVG().then(svg => {
	  	res.send(`${svg}`);
		});
})
