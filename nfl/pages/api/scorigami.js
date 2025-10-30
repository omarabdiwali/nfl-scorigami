import getScorigamiData from "@/utils/fetchScores";
import { TwitterApi } from "twitter-api-v2";

const checkNewGames = async () => {
  try {
    return await getScorigamiData();
  } catch (e) {
    console.log(e.message);
    return [];
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
  const { token } = req.body;
  if (token !== process.env.LAMBDA_TOKEN) {
    res.status(200).json({ result: "Invalid authentication..." });
    return;
  }
  
  const tweetData = await checkNewGames();
  if (tweetData.length > 0) {
    const newTweets = await tweetScores(tweetData);
    console.log(newTweets);
    res.status(200).json({ result: newTweets })
  } else {
    res.status(200).json({ result: "Nothing new..." });
  }
}