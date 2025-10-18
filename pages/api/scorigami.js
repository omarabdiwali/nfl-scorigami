import dbConnect from "@/utils/dbConnect";
import getScorigamiData from "@/utils/fetchScores";
import Scores from "@/models/Scores.js";
import { TwitterApi } from "twitter-api-v2";

const acquireLock = async () => {
  await dbConnect();
  // using the 'count' field as the mutex, with 0 being its open, and 1 with it locked.
  const mutex = await Scores.findById(process.env.MUTEX_ID);
  if (mutex.count == 1) throw new Error("Mutex is currently locked.");
  mutex.count = 1;
  mutex.save();
}

const releaseLock = async () => {
  await dbConnect();
  // using the 'count' field as the mutex, with 0 being its open, and 1 with it locked.
  const mutex = await Scores.findById(process.env.MUTEX_ID);
  mutex.count = 0;
  mutex.save();
}

const checkNewGames = async () => {
  let acquired = false;
  try {
    await acquireLock();
    acquired = true;
    return await getScorigamiData();
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    if (acquired) await releaseLock();
  }
}

const tweetScores = async (tweets) => {
  let newTweets = 0;
  const twitterClient = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_KEY_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET
  })

  try {
    for (const tweet of tweets) {
      await twitterClient.v2.tweet(tweet);
      newTweets += 1;
    }
    return `${newTweets}/${tweets.length} new tweets posted!`
  } catch (e) {
    console.log(e);
    return `${newTweets}/${tweets.length} new tweets posted!`;
  }
}

export default async function handler(req, res) {
  const tweetData = await checkNewGames();
  if (tweetData.length > 0) {
    const newTweets = await tweetScores(tweetData);
    console.log(newTweets);
    res.status(200).json({ result: newTweets })
  } else {
    res.status(200).json({ result: "Nothing new..." });
  }
}