# API
~~Heya, so this is my API, and thereby the new and improved README.md~~ pfsssh you call that new? [yeah right broski](https://BrAIn-API.tk/)

This API is really a general use API that will be used to connect systems and create an IoT system (eventually, not at that point just yet :P), I'm working on adding additional, more complex, routes to it along with fixing up the routes that I currently have (express acts a bit funky when working in a more modular way like I am here). I have an actual ton more things that I want to do and a ton of things that I want to either do differently or make it more complex (being more self-sufficient on certain things for example), you can find a To-Do list of my tasks here: https://trello.com/b/rtyhPHep


# BrAIn API Documentation
**Heya, welcome to the documentation of my API, which is called the BrAIn API**

This API is made to connect, which means that everything in this API is globally connected to every client you wish to make. This API is not finished but I will be updating this documentation every update I make to the [GitHub repo](https://github.com/LucAngevare/BrAIn-API) and I will also be making a change log, all over at the docs: https://BrAIn-API.tk/. Check out the list of what I'm planning to add over at the [Trello board](https://trello.com/b/rtyhPHep)!

### BrAIn, what's the story behind the name?

It may not seem like it but BrAIn has a bit of a history. I had this subject at school that was called W&T (science and mechanics basically) where we had to do research, make research papers and make stuff. We had this subject for 3 years and at the end of this subject we had to take on a bit of a bigger project, it didn't matter if we finished it or not as long as your dreams were big enough and your documentation and logs were good enough.
Back then I was absolutely obsessed with assistants even though I was just starting out with programming.
That was when I (with 2 other people) came up with the idea to make an assistant, it would look like the Google Home but with a glass case so you could see the hardware and it would cool better. We would use a Raspberry Pi (model B, it was some time ago) for the hardware and program it in Python because that was the only programming language I had experience in. I would be in charge of programming it (I had chosen the name before I knew this project would even be a thing), a friend of mine would take care of making the case (which was probably the hardest job, he had to try and make glass round) and the last person would be in charge of the hardware. In conclusion, everything failed, we switched to clear plastic instead of glass for the case, the program had failed completely and the API I made for the Speech to Text had gone down just a few days before, the speaker was way too soft and the microphone had been wrongly soldered. We got a B though so I mean it wasn't all too bad.
I could have chosen another name for this but honestly this name just brings back so many memories and it's not a bad name so I think I'm gonna keep it, and it kind of feels like I'm finishing an old project in my friends' names so it's too good to not re-purpose.

### Who is this for?
This project is for anyone who wants to make their own IoT smart home but wants to make their own clients, this API is made to connect systems so anyone who is advanced enough to program their own client (or piggy-back on pre-made clients that I made) can use this.

### Prerequisites
* You need to have a version of NodeJS with NPM installed on your machine (this might not be necessary if I release an executable)
* You need to have [these modules](https://github.com/LucAngevare/BrAIn-API/blob/master/package.json) installed, you can install these by going to the root of the directory with the command line and running `npm install` there.

### Usage
The API is fairly easy to use, if you have the modules installed, it's just a matter of going to the root of the directory with the command line and running `npm start` there.

### Issues
I'm somewhat new to development still (been programming since the end of 2016), so bugs are not that surprising, I've also used some new, bodgey techniques here although hidden behind some beautiful scripts 😊
When filing for an issue, please include the API version, OS details and what I could do to reproduce this issue so I can fix this ASAP!

### Want to contribute?
I would absolutely love it if you were to contribute to my API, the more help I can get on this the better it'll become and the more I can learn from others.
Bug reports and pull requests are absolutely welcome on [my GitHub repo](https://github.com/LucAngevare/BrAIn-API). This project is intended to be a safe, welcoming space for collaboration, which is why I would love it if you made issues and/or pull requests, however, contributors still are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

#### What if I want to help but can't contribute?
There's more than enough ways you can help! For example:
* Something broken? File an issue! Bonus points if you try to fix it. It helps if you include the API version, OS details and what I could do to reproduce this issue!
* Good at breaking something? Look through [the list of things that need testing](https://github.com/LucAngevare/BrAIn-API/blob/master/docs/testMe.md) and do your absolute best to completely wreak my work (please file an issue after though :P)
* Look through [open issues](https://github.com/LucAngevare/BrAIn-API/issues?state=open) and see if there's a topic or application you happen to have experience with!
* Got any ideas for what to add to this? Shoot me a DM on [my Discord](https://discord.com/users/478903410159255572) and I'll add it to the [Trello board](https://trello.com/b/rtyhPHep)
