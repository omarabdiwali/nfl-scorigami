Scorigami
================

![Website](https://i.imgur.com/Lj9cSFn.png)

## Overview

Scorigami is a collection of web applications that track unique scores in various sports, also known as "scorigami." Scorigami is a concept thought up by Jon Bois, referring to a score that has never been seen before in a sport's history. These applications fetch the latest game data from ESPN and tweet it from their respective Twitter accounts, checking if a scorigami has occured.

## Projects

The Scorigami project consists of multiple sub-projects, each tracking a different sport:

* **NBA Scorigami**: Tracks unique NBA scores and tweets from [@NBAScorigamis](https://x.com/NBAScorigamis)
	+ Visit the website at: https://scorigami-nba.vercel.app
	+ [Source code](https://github.com/omarabdiwali/scorigami/tree/main/nba)
* **NFL Scorigami**: Tracks unique NFL scores and tweets from [@NFLScorigamiBot](https://x.com/NFLScorigamiBot)
	+ Visit the website at: https://nfl-scorigami.vercel.app
	+ [Source code](https://github.com/omarabdiwali/scorigami/tree/main/nfl)

## Technical Details

All sub-projects are built using Next.js and use the following technologies:

* **Frontend**: Next.js, React
* **Backend**: Next.js API routes
* **Database**: MongoDB (using Mongoose for ORM)
* **Twitter API**: Twitter-api-v2 library for interacting with the Twitter API

## Setup

To set up a sub-project, navigate to its directory and follow the setup instructions in its README:

1. Clone the repository: `git clone https://github.com/omarabdiwali/scorigami.git`
2. Move into the sub-project directory (e.g. `nba` or `nfl`)
3. Install dependencies: `npm install`
4. Create a `.env` file with the following environment variables:
	* `API_KEY`: Twitter API key
	* `API_KEY_SECRET`: Twitter API key secret
	* `ACCESS_TOKEN`: Twitter access token
	* `ACCESS_TOKEN_SECRET`: Twitter access token secret
	* `MONGODB_URI`: MongoDB connection string
	* `MUTEX_ID`: MongoDB Document ID, used to limit the changes to one user at a time
5. Start the application: `npm run dev`

## Usage

To use a sub-project, follow the usage instructions in its README:

1. Open the application in a web browser: `http://localhost:3000`
2. Click the "Fetch Latest Game Data" button to fetch the latest game data
3. The application will display the latest scorigami data and tweet new scores from its Twitter account