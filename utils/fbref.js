import { JSDOM } from 'jsdom';
import dbConnect from './dbConnect';
import Scores from './Scores';

const getRequest = async (url) => {
    return await fetch(url).then(res => res.text()).then(data => { return data; });
}

const translateDate = (date) => {
    const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = date.getUTCFullYear();
    const month = allMonths[date.getUTCMonth()];
    const day = date.getUTCDate();

    return `${month} ${day}, ${year}`;
}

const translateNumberEnding = (number) => {
    const i = number % 10, j = number % 100;
    if (i == 1 || j !== 11) return "st";
    if (i == 2 || j !== 12) return "nd";
    if (i == 3 || j !== 13) return "rd";
    return "th";
}

const constructTweet = async (data) => {
    await dbConnect();
    const gameScore = `${data.winner} ${data.winnerScore} - ${data.loser} ${data.loserScore}\nFinal\n\n`;
    const exists = await Scores.findOne({ score: data.score });
    let scorigami = "";
    
    if (exists) {
        scorigami = `No Scorigami. That score has happened ${exists.count} ${exists.count == 1 ? "time" : "times"} before, most recently on ${translateDate(new Date(exists.date))} (${exists.versus}).`
        exists.count += 1;
        exists.date = new Date(data.date);
        exists.versus = data.versus;
        exists.save();
    } else {
        const totalScores = await Scores.countDocuments({}) - 1;
        scorigami = `That's Scorigami! It's the ${totalScores}${translateNumberEnding(totalScores)} unique final score in NFL History.`;
        const modelData = { score: data.score, versus: data.versus, date: new Date(data.date), count: 1 };
        await Scores.create(modelData).catch(err => console.log(err));
    }

    const lastGameData = { versus: data.versus, date: data.date };
    await Scores.findByIdAndUpdate(process.env.LATEST_ID, lastGameData);
    return gameScore + scorigami;
}

const getScorigamiData = async (lastScore, year) => {
    await dbConnect();
    const tweetsToPost = [];
    let passedPrevScore = false;

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const url = `https://www.pro-football-reference.com/years/${year}/games.htm#games`
    const data = await getRequest(url);
    const dom = new JSDOM(data);
    const doc = dom.window.document;
    const thElements = doc.querySelectorAll('th[scope="row"]');
    const trElements = Array.from(thElements).map(th => th.closest('tr'));

    for (const tr of trElements) {
        const date = tr.querySelector('td[data-stat="game_date"]').textContent;
        const winner = tr.querySelector('td[data-stat="winner"]').textContent.replace('*', '').trim();
        const loser = tr.querySelector('td[data-stat="loser"]').textContent;
        const winnerScore = tr.querySelector('td[data-stat="pts_win"]').textContent;
        const loserScore = tr.querySelector('td[data-stat="pts_lose"]').textContent;
        const versus = `${winner} vs ${loser}`;
        const scoreKey = `${winnerScore}-${loserScore}`;
        
        if (scoreKey == "-" && date == "Playoffs") continue;
        if (!passedPrevScore && new Date(lastScore.date) - new Date(date) > 0) continue;
        if (!passedPrevScore && versus == lastScore.versus && new Date(date) - new Date(lastScore.date) == 0) {
            passedPrevScore = true;
            continue;
        }
        if (!passedPrevScore) continue;
        if (scoreKey == "-") break;
        
        const constructData = { winner, loser, winnerScore, loserScore, versus, score: scoreKey, date: new Date(date) }
        const toTweet = await constructTweet(constructData);
        tweetsToPost.push(toTweet);
    }

    return tweetsToPost;
}

export default getScorigamiData;