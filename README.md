# BJs-Online-Ordering
Created by @andressegundo, @wrcooper, @hslu13, @jsteichen, @bensherriff.

BJs Online Ordering is our web application project built for CMPS 183. It is an online ordering website for the UCSC dining location Banana Joe's.

## Features
The front page is updated with popular and featured items. Users can create an account to store their order history for fast ordering and manage their profile information. BJs Online Ordering is available to all, however students at UCSC are able to make a student account by adding their UCSC ID and email. Furthermore, orders purchased by students are tax-exempt.

The menu page consists of a list of every item currently available to be purchased and everything about that item, including a picture, description, allergens, nutritional info, price, etc. Users can customize their order specifically to their liking by requesting additional order comments or changes (i.e. no pickles, no sauce...). Users can also add more detailed comments for their order in the comment box. After ordering, users can review their orders in their cart or go forward and purchase.

We use the Stripe API to purchase orders. Upon placing an order, the user will get a (rough) time estimate of when their order will be ready and their order will be recorded for the employees to fulfill.

## Technologies Used
* GitHub - Host our code
* HTML5/CSS/Javascript
* Vue - vue.js framework used in collaboration with our database
* Web2Py - Required for the class, used to build the server and site
* SQLite - database we used
* Stripe - payment functionality
* Python - Database functions written in python
