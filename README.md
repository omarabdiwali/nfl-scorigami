NFL Scorigami
================

![Website](https://i.imgur.com/RfIKD0U.png)

## Overview

NFL Scorigami is a web application that tracks unique NFL scores, also known as "scorigami." Scorigami is a concept thought up by Jon Bois, referring to a score that has never been seen before in NFL history. This application fetches the latest scorigami data from Pro-Football-Reference and tweets it from [@NFLScorigamiBot](https://x.com/NFLScorigamiBot).

#### Visit the website at: https://nfl-scorigami.vercel.app

## Features

* Fetches the latest scorigami data from Pro-Football-Reference
* Tweets new scorigami scores from the [@NFLScorigamiBot](https://x.com/NFLScorigamiBot) Twitter account
* Stores historical scorigami data in a database
* Provides a user interface to fetch the latest scorigami data

## Technical Details

The application is built using Next.js and uses the following technologies:

* **Frontend**: Next.js, React
* **Backend**: Next.js API routes
* **Database**: MongoDB (using Mongoose for ORM)
* **Twitter API**: Twitter-api-v2 library for interacting with the Twitter API
* **Web Scraping**: JSDOM for parsing HTML data from Pro-Football-Reference

The application consists of three main files:

* `index.js`: The frontend component that allows users to fetch the latest scorigami data
* `scorigami.js`: The API route that handles fetching scorigami data and tweeting new scores
* `fbref.js`: The utility file that handles web scraping and data processing for Pro-Football-Reference

## Setup

To set up the application, follow these steps:

1. Clone the repository: `git clone https://github.com/omarabdiwali/nfl-scorigami.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following environment variables:
	* `API_KEY`: Twitter API key
	* `API_KEY_SECRET`: Twitter API key secret
	* `ACCESS_TOKEN`: Twitter access token
	* `ACCESS_TOKEN_SECRET`: Twitter access token secret
	* `MONGODB_URI`: MongoDB connection string
	* `LATEST_ID`: MongoDB Document ID, used to keep track of the last added game
	* `MUTEX_ID`: MongoDB Document ID, used to limit the changes to one user at a time
4. Start the application: `npm run dev`

## Usage

To use the application, follow these steps:

1. Open the application in a web browser: `http://localhost:3000`
2. Click the "Fetch Scorigami Data" button to fetch the latest scorigami data
3. The application will display the latest scorigami data and tweet new scores from [@NFLScorigamiBot](https://x.com/NFLScorigamiBot)