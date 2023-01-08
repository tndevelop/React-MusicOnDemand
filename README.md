# MusicOnDemand

MusicOnDemand is a prototype of a mobile application developed by students in the context of a Human Computer Interaction course at Politecnico of Turin. 
The app's goal is the one of being a place where musicians and people who organize live-music needing events can virtually meet, share contacts and eventually set up gigs.
The project was born from the users' experiences and puts their needs in the first place while shaping itself on the feedbacks received along the way. The development process involved different phases among which surveys, low-level prototypes and external evaluations.

## The content of the repository

This repository contains the code for the MusicOnDemand app. The app is based on React and Node, and it runs on a browser on both mobile devices and notebooks. Feel free to run it on a mobile device, or reduce your browser window via tools in the browser console.
The code is split among the client side, containing a React app, and the server side, containing a Node server and an sqlLite DB.

## App structure

The app is divided in 2 main sections, one allowing people to browse other musicians and the other allowing musicians to edit their profile informations. Login wasn't developed yet, therefore users in this example can modify informations from user 1 as if they did the login already.

## Running instructions

Provided you have node installed, follow these steps:
- clone repo
- open terminal on client folder
- type "npm -i"
- open another terminal on server folder
- type "npm -i"
- on the first terminal type "npm start"
- on the second terminal type "nodemon serverHCI.js"

## Notes

In order not to violate any copyright, no audio or video o image file associated with any existing artist is included in the repository. We are aware that this makes the app far less appealing than it would be on a production stage, but it was for us a necessary precaution.


## repository limits

This report is a temporary solution to show the work, while I figure out a way to securely publish the original repository with all the original commits. In fact some files have to be removed entirely from the original repository's history (as the original repo was not intended to be public in the first place).