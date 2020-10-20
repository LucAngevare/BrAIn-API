const express = require('express');
const app = module.exports = express()
const bodyParser = require('body-parser');
const lite = require('vega-lite');
const vega = require('vega');

//FIXME: SIR model currently returning undefined and going past Infinity?

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * ...<br>Did a pandemic just hit and do you want to check how fatal that would be for humanity using a calculation method that is only backed up by <a href="https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology#The_SIR_model">Wikipedia</a> that's programmed by someone that's 14 years old? No? Moving on...
 * @name SIR Epidemic Model
 * @route {POST} /simulation/sir
 * @bodyparam {number} alpha This is the basic reproduction number, so the amount of chance that this virus/bacteria/disease spreads.
 * @bodyparam {number} beta This is the average amount of contacts the person has, making this value smaller means that no matter how fast it can spread, it will be contained between this amount of people
 * @bodyparam {number} I0 This is the amount of starting agents, that means the amount of people who start out with the virus/bacteria/disease.
 * @bodyparam {number} N This is the constant starting population number
 * @bodyparam {number} delT This is the size of the steps in time the graph will be taking
 * @bodyparam {number} maxTime This is the amount of time the graph you generate will go on to
 * @todo Change from chart-js to vega-lite as chart-js is extremely unreliable.
 * @return {Object} An object that consists of the original values, the basic reproduction number, object of values in coordinance to your delT and the chart encoded in, you guessed it, Base64.
 */
app.post('/simulation/sir', async (req, res) => {
  let chart = null;
  let skipEvery = 2;
  let R0 = (Number(req.body.beta) / Number(req.body.alpha));
  computeAndGraph(R0);

  function computeAndGraph(R0) {
    let alpha = Number(req.body.alpha);
    let beta = Number(req.body.beta);
    let I0 = Number(req.body.I0);
    let N = Number(req.body.N);
    let delT = Number(req.body.delT);
    let maxTime = Number(req.body.maxTime);

    if (delT == 0) return;

    let I_ar = [];
    let S_ar = [];
    let R_ar = [];
    let t_ar = [];

    let I = I0;
    let S = N;
    let R = 0;

    let counter = 0;
    for (let t = 0; t <= maxTime; t += delT) {
      let delS = -beta * S * I / N * delT;
      let delI = beta * S * I / N * delT - alpha * I * delT;
      let delR = alpha * I * delT;
      S += delS;
      I += delI;
      R += delR;
      if (counter % skipEvery == 0) {
        I_ar.push(I);
        S_ar.push(S);
        R_ar.push(R);
        t_ar.push(Number(t.toFixed(2)));
      }
      console.log(`Counter is at ${counter}, S: ${S}, I: ${I}, R: ${R}, T: ${Number(t.toFixed(2))}`)
      counter++;
    }
    const output = {
      S: S_ar,
      I: I_ar,
      R: R_ar,
      T: t_ar
    }
    let dates = []
    for (let i=0; i<maxTime;i+=delT) {
      dates.push(i)
    }

    const SIR_graph = drawChart(output, maxTime)
    res.send(`${SIR_graph}`);
    console.log(SIR_graph)
  }

  function drawChart(output, maxTime) {
    var vegaLightSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "description": `The SIR epidemic model with a max time of ${maxTime}`,
      "data": {
        "values": [{
          "Time": output.T,
          "Susceptible": output.S,
          "Infected": output.I,
          "Recovered": output.R
        }]
      },
      "transform": [
        {"flatten": ["Time", "Susceptible", "Infected", "Recovered"]},
        {"fold": ["Susceptible", "Infected", "Recovered"], "as": ["SIR", "Population"]}
      ],
      "mark": {"type": "line", "point": {"filled": false, "fill": "white"}},
      "encoding": {
        "x": {"field": "Time", "type": "quantitative"},
        "y": {"field": "Population", "type": "quantitative"},
        "color": {"field": "SIR", "type": "nominal"}
      }
    }
    let vegaspec = lite.compile(vegaLightSpec).spec
  	var view = new vega.View(vega.parse(vegaspec),
  	{renderer: "none"})
  	view.toSVG().then(svg => {
  		return svg
  	});
  }
})

/**
 * I really have no fun description for this, you can get a graph of how well a species survives with a few known variables with this route.
 * @name Population Growth Predictive Model
 * @route {POST} /simulation/population
 * @bodyparam {string} [MaleToFemaleRatio="1/1"] This is the amount of females for males, this variable and the description is named confusingly but you're supposed to give the amount of females for males, so "females/males".
 * @bodyparam {number} reproductionAmount This is the amount the average sample of the species reproduces
 * @bodyparam {number} population This is the amount of starting agents, that means the starting size of the species.
 * @todo I'm planning on adding a few more values, for example the amount of miscarriages, the average age of death, etc
 * @todo I'm planning on returning a graph of values, this requires a rewrite of basically the entire code however
 * @return {Object} An object that consists of the total amount of eggs and total amount of alive samples and a boolean of extinction.
 */
app.post('/simulation/population', function(req, res) {
  var eggs = [];
  var MtF_ratio = req.body.MaleToFemaleRatio || "1/1";
  const maleForFemale = Math.round(MtF_ratio.toString().split("/")[1] || 1)
  const femaleForMale = Math.round(MtF_ratio.toString().split("/")[0] || req.body.MaleToFemaleRatio)
  var FemalePop = 2;
  var R0 = parseInt(req.body.reproductionAmount);
  var tick = 0;
  var MalePop = Math.round(parseInt(req.body.population) * (maleForFemale / femaleForMale));
  var FemalePop = Math.round(parseInt(req.body.population) - femaleForMale);

  for (let i=0; i<20; i++) {
    eggs.push(0)
  }

  while (true) {
    tick += 1

    for (let x=0; x<FemalePop; x++) {
      var death = Math.floor(Math.random() * 10000);
      if (death <= 243) {
        FemalePop -= 1
      }
      //TODO: Grow exponentially with age
    }

    for (let x=0; x<MalePop; x++) {
      death = Math.floor(Math.random() * 10000);
      if (death <= 243) {
        MalePop -= 1
      }
      //TODO: Grow exponentially with age
    }
    console.log(`Female population: ${FemalePop} \n Male population: ${MalePop} \n Eggs: ${eggs} \n Tick: ${tick}`)

    for (let i=0; i<eggs.length; i++) {
      if (eggs[i] = 0) return;
      //const miscarriageChance = req.body.miscarriageChance || 0;
      //if (Math.floor(Math.random() * 100) < miscarriageChance) return false;
      const sexroll = Math.floor(Math.random() * parseInt(femaleForMale));
      const actualRatio = Math.floor(parseInt(maleForFemale) / parseInt(femaleForMale)) * 100;

      if (sexroll <= actualRatio) {
        (new Promise((resolve, reject) => MalePop += eggs[i]))
          .then(() => eggs[i] = 0)
          .catch((err) => console.error(err))
      } else {
        (new Promise((resolve, reject) => FemalePop += eggs[i]))
          .then(() => eggs[i] = 0)
          .catch((err) => console.error(err))
      }
    }

    if (MalePop >=1) {
      for (let x=0; x < FemalePop; x++) {
        var egg = Math.floor(Math.random() * 100)
        if (egg <= R0) {
          eggs[Math.floor(Math.random() * 20)] = Math.floor(Math.random() * 4)
        }
      }
    } else if (FemalePop >= 1) {
      for (let i=0; i < MalePop; i++) {
        var egg = Math.floor(Math.random() * 100)
        if (egg <= R0) {
          eggs[Math.floor(Math.random() * 20)] = Math.floor(Math.random() * 4)
        }
      }
    }

      if (FemalePop + MalePop >= 20000) {
        console.log("Population max reached")
        return res.send(`Maximum population reached. Female population: ${FemalePop}, Male population: ${MalePop}`)
      } else if (!(FemalePop + eggs.reduce((a, b) => a + b, 0))) {
        console.log("Extinction")
        return res.send("Population extinct. Total eggs:" + eggs[0] || eggs.length)
      }
    }
  })
