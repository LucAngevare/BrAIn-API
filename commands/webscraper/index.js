const express = require('express');
const app = module.exports = express()

function summary(link, images, res) {
	console.log(link)
	request(link, function(error, response, body) {
		var HTMLtoPlainText = body.split("<body>").pop().split("<p>")[1].replace(/<[^>]+>/g, '').split(".")[0];
		//TODO: Test on non-wikipedia sites
		if (error) res.send('yeah no you have an error, time to get bodging!');
		if (response.statusCode !== 200) res.send(response.statusCode)
		//Add author
		if (images) {
			imageTag = body.split("<body>").pop().split("<img")[1].split(/src="/)[1].split("\"")[0];
			if (imageTag.includes(".jpg") || imageTag.includes(".png") || imageTag.includes(".jpeg") || imageTag.includes(".gif") || imageTag.includes(".tiff")) {
				imageLink = imageTag
			} else {
				imageLink = imageTag + "/favicon.ico"
			}
		}
		res.json({
			statusCode: response.statusCode,
			link: imageTag,
			firstLine: HTMLtoPlainText
		})
	});
}

app.post('/webScraper', function(req, res) { //add a way to check if you want images, author's name, etc.
	//using post method because adding link and some toggleable features is going to get you to 255 chars pretty damn quickly
	link = req.body.link.toString();
	imageBool = req.body.images;
	authorBool = req.body.author;

	if (!link.includes("http")) {
		res.send('invalid link');
		return false
	} //Check if it is a link (not the best way but the fastest)
	else {
		summary(link, imageBool, res) //This returns the summary
	}
})