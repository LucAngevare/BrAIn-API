const vega = require('vega');
const express = require('express');
const lite = require('vega-lite')
const app = module.exports = express();
const bodyParser = require('body-parser');

//TODO: Add file support for getting graph from CSV
//TODO: Get matrix table values from equation

/*Example request body:
{
		"type": "bar"
    "values": [{"Year": "2005", "Price": 280}, {"Year": "2006", "Price": 550}],
    "xName": "Year",
    "yName": "Price"
}*/



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Need a chart image from a few values? This route has got you covered ;)
 * @example {
     "type": "bar",
     "values": [{"Year": "2005", "Price": 280}, {"Year": "2006", "Price": 550}],
     "xName": "Year",
     "yName": "Price"
 }
 * @name Chart Generator
 * @todo I plan on adding file support for generating a graph from a CSV.
 * @route {POST} /charts
 * @bodyparam {string} type The type of chart you are going to be generating
 * @bodyparam {Object[]} values The array of objects of all values you want to be showing. The objects need to be formatted exactly how you learned in math but with curly braces instead of parentheses for the coordinates, <br> {"nameOfTheX-Axis": value, "nameOfTheY-Axis": value}
 * @bodyparam {string} xName The name of your X-Axis
 * @bodyparam {string} yName The name of your Y-Axis
 * @return {SVG} Your returned image in the format of an SVG.
 */

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
