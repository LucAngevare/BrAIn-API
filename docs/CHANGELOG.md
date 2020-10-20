# Changelog
For the plans of what I will be adding to this program, check https://trello.com/rtyhPHep/. Don't forget to help contribute ;)

## V0.0.3 - 20/10/2020
Added:
* QR code generator
* QR code reader
* Radix sorting algorithm
* API statistics viewer, this checks for CPU temperature, usage and amount of times a specific route and the API in general got visited.
* XSS vulnerability checker, this is a route that automatically checks if a website is vulnerable to cross-site scripting attacks. It checks for this in text areas and URLs.
* Torrent downloader, this path downloads magnet/http(s) torrent links.
* Sudoku generator/solver, this path generates a sudoku board (and preview) and also solves it for you

Changed:
* The preview of the color palette
* CDN, I changed it so it's easier to bulk edit the content (with actions such as: bulk download, bulk delete and bulk upload)
* ToDo list route, I changed the objects it accepted so you can add due dates, subtasks, etc. This also makes it more modular so you can build on top of this with your client.
* Quote (backdrop) generator, I changed it so you can choose what (type of random) backdrop your quote gets. I also switched from HTML to canvas so it would take less long to load and take a screenshot on dedicated hardware.
* index.js, I changed it so it used a command handler instead of having 30 million lines telling it which routes it should require. This makes index.js a ton cleaner and it makes troubleshooting this program a lot easier.


## V0.0.2.1 - 03/10/20
Added:
* **The docs**
	I made the docs here, I tried using readthedocs.io but I couldn't get the navigation or anything to work, so I quickly made the decision to generate the docs using JSDoc, and hosting those HTML files. (Thanks for all your help [@idhank](https://github.com/iddev5)!) Check the docs out here: http://BrAIn-API.tk/

## V0.0.1 & 0.0.2 - 15/04/20 & 19/07/20
Added:
* Content Delivery Network, this makes it so you can upload certain things and view these on a dedicated static website.
* Chart from array
* Color palette generator
* Site diagnostic checker (checks for speed in site loading and overall website diagnostics)
* ToDo list route
* Quote (backdrop) generator
* Joke generator
* Riddle generator

Changed:
* (Almost) all storage systems are now in mongoose rather than CSV or SQL, this to make it more useful for clients on the same internet connection to use the same database if the path does not show it by itself.
* All my API keys were in the code in V0.0.1, I changed it to store those in environment variable.

## V0.0.1
This was the start of my API, I had an idea of making an API so I could make a discord bot, voice assistant and other programs, all connected to one server. For this I decided to make an API. Only later I got the idea to actually make it useful for others, by making it used for connecting systems.

