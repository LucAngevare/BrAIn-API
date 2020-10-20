const express = require('express');
const app = module.exports = express();
const convert = require('convert-units')
const fs = require("fs")
var from, to;

class UnitConversion {
    constructor(unitTo, unitFrom, valTo, valFrom) {
      const units = {
        "temperature": ["K", "C", "F", "Ra", "Re"],
        "mass": ["Kg", "Hg", "Dag", "g", "Dg", "Cg", "Mg", "lb", "oz", "St"],
        "speed": ["m/s", "km/h", "mph", "knot", "ft/s"],
        "length": ["fm", "Å", "in", "mil", "ft", "yd", "mi", "RE", "AU", "ly", "pc", "km", "hm", "dam", "m", "dm", "cm", "mm"],
        "money": ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "HKD", "NZD", "SEK", "KRW", "SGD", "NOK", "MXN", "INR", "RUB", "ZAR", "TRY", "BRL", "TWD", "DKK", "PLN", "THB", "IDR", "HUF", "CZK", "ILS", "CLP", "PHP", "AED", "COP", "SAR", "MYR", "RON"],
        "time": ["millisecond", "second", "minute", "hour", "day", "week", "month", "year", "century", "decade", "millennium", "kiloyear", "era"],
        "electrical currency": ["c/s", "A"],
        "force": ["dyn", "sn", "tf", "lbf", "pdl", "kip", "kgf", "N"],
        "pressure": ["Pa", "kPa", "MPa", "psi", "torr", "atm", "bar"],
        "energy": ["J", "W", "kWh", "kW", "cal", "BTU", "Quad", "therm", "hp", "Mcf"],
        "volume": ["m³", "dm³", "cm³", "l", "dl", "cl", "ml", "fl oz", "in³", "ft³", "yd³", "gal", "bbl", "pt"],
        "area": ["km²", "m²", "dm²", "cm²", "mm²", "ha", "a", "ca", "mile²", "in²", "yd²", "ft²", "ro", "acre", "nautical mile²"],
        "density": ["kg/L", "kg/m³", "g/mL", "t/m³", "kg/dm³", "g/cm³", "Mg/m³", "oz/cu in", "lb/cu in", "lb/cu ft", "lb/cu yd", "lb/gal", "lb/bu", "lb/pt"],
        "timezones": ["UTC", "GMT", "PST", "MST", "CST", "EST", "PDT", "MDT", "CDT", "EDT"]
      }
      //TODO: Make it myself
      this.unitTo = unitTo;
      this.unitFrom = unitFrom,
      this.valTo = valTo;
      this.valFrom = valFrom;

      const conversionTable = units.find()
    }
}

/**
 * This is the route to convert from and to specific units.
 * @name Unit Conversion
 * @route {GET} /unit-conversion/:amount/:from/:to
 * @routeparam {number} [amount=1] This is the starting amount you want to convert from.
 * @routeparam {string} from This is the unit of conversion you want to start from.
 * @routeparam {string} to This is the unit of conversion you want to convert to.
 * @todo I'm using a module for all of it now, I want to change that. I'm planning on converting to and from SI units, I have already made a JSON file of all units I want to convert and with that I'm going to use to convert from unit to SI unit to conversion unit, it'd probably be less reliable but I'm not really going for reliability with this route, more to just get a general idea of how to convert the two values.

 * @return {Object} This will return an object of either the error, or an object of the starting unit, ending unit and converted value.
 */
app.get('/unit-conversion/:amount/:from/:to', function(req, res) {
  if (typeof parseInt(req.params["amount"]) !== "number") return res.json({ success: false, failureReason: "NaN" });
  const jsonObject = JSON.parse(fs.readFileSync(__dirname + "/units.json"))

  const from = jsonObject[req.params["from"]] || req.params["from"];
  const to = jsonObject[req.params["to"]] || req.params["to"]

  try {
    const returnVal = convert(parseInt(req.params["amount"])).from(from).to(to)
    res.json({ success: true, from: from, to: to, returnVal: returnVal })
  } catch(err) {
    res.json({ success: false, from: from, to: to, failureReason: err.toString() })
  }
})

/**
 * The path to check which unit conversions are possible
 * @name All possible conversions
 * @route {GET} /unit-conversion/possibleconversions
 * @return {Object} This will return an object of all possible conversion units and the description of them.
 */
app.get('/unit-conversion/possibleconversions', function(req, res) {
  res.json({ "possible conversions": convert().possibilities(), "conversions description": convert().list() })
})
