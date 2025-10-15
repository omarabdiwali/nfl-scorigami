import dbConnect from "@/utils/dbConnect";
import getScorigamiData from "@/utils/fbref";
import Scores from "@/utils/Scores.js";
import { TwitterApi } from "twitter-api-v2";

const checkNewGames = async () => {
  await dbConnect();
  const year = 2025;
  const latest = await Scores.findOne({ score: "latest" });
  return await getScorigamiData(latest, year);
}

const tweetScores = async (tweets) => {
  const twitterClient = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_KEY_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET
  })

  for (const tweet of tweets) {
    await twitterClient.v2.tweet(tweet);
  }

  return `${tweets.length} new tweets posted!`;
}

export default async function handler(req, res) {
  const tweetData = await checkNewGames();
  if (tweetData.length > 0) {
    const newTweets = await tweetScores(tweetData);
    console.log(newTweets);
    res.status(200).json({ result: newTweets })
  } else {
    console.log("Nothing new...");
    res.status(200).json({ result: "Nothing new..." });
  }
}