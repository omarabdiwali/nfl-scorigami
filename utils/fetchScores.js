import dbConnect from './dbConnect';
import Scores from './Scores';

const getRequest = async (url) => {
    return await fetch(url).then(res => res.json()).then(data => { return data; });
}

const translateDate = (stringDate) => {
    const date = new Date(stringDate);
    const localeDate = date.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    return new Date(localeDate);
}

const translateDateToString = (date) => {
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
        scorigami = `No Scorigami. That score has happened ${exists.count} ${exists.count == 1 ? "time" : "times"} before, most recently on ${translateDateToString(new Date(exists.date))} (${exists.versus}).`
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

const validateContinuation = (lastScore, date, versus) => {
    if (new Date(lastScore.date) - date > 0) return 0;
    if (versus == lastScore.versus && date - new Date(lastScore.date) == 0) return 2;
    if (date - new Date(lastScore.date) > 0) return 1;
    return 0;
}

const validInfo = (data, keys) => {
    for (const key of keys) {
        if (data[key] == null || data[key] == undefined) return false;
    }
    return true;
}

const getScorigamiData = async () => {
    await dbConnect();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let passedLastScore = false;

    const tweetsToPost = [];
    const lastScore = await Scores.findById(process.env.LATEST_ID);
    const url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
    const data = await getRequest(url);
    const keys = ["date", "winner", "winnerScore", "loser", "loserScore"];
    
    for (const event of data.events) {
        const gameData = {};
        const completed = event.status.type.completed;
        const date = event.date.substring(0, 10);
        gameData.date = translateDate(date);

        if (!completed) continue;
        if (!event.competitions[0] || !event.competitions[0].competitors) {
            console.log(`[FETCHSCORES] - Invalid check:\n${JSON.stringify(gameData, null, 2)}`);
            continue;
        }

        for (const team of event.competitions[0].competitors) {
            if (team.winner && gameData.winner == undefined) {
                gameData.winner = team.team.displayName;
                gameData.winnerScore = team.score;
            } else if (gameData.loser == undefined) {
                gameData.loser = team.team.displayName;
                gameData.loserScore = team.score;
            } else {
                gameData.winner = team.team.displayName;
                gameData.winnerScore = team.score;
            }
        }

        if (!validInfo(gameData, keys)) {
            console.log(`[FETCHSCORES] - Invalid info:\n${JSON.stringify(gameData, null, 2)}`);
            continue;
        }

        const versus = `${gameData.winner} vs ${gameData.loser}`;
        const scoreKey = `${gameData.winnerScore}-${gameData.loserScore}`;        
        
        if (!passedLastScore) {
            const cont = validateContinuation(lastScore, gameData.date, versus);
            passedLastScore = (cont == 1 || cont == 2);
            if (cont == 0 || cont == 2) continue;
        }

        gameData.versus = versus;
        gameData.score = scoreKey;
        const toTweet = await constructTweet(gameData);
        tweetsToPost.push(toTweet);
    }

    return tweetsToPost;
}

export default getScorigamiData;


// const getScorigamiData = async (lastScore, year) => {
//     await dbConnect();
//     const tweetsToPost = [];
//     let passedPrevScore = false;

//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     const url = `https://www.pro-football-reference.com/years/${year}/games.htm#games`
//     const data = await getRequest(url);
//     const dom = new JSDOM(data);
//     const doc = dom.window.document;
//     const thElements = doc.querySelectorAll('th[scope="row"]');
//     const trElements = Array.from(thElements).map(th => th.closest('tr'));

//     for (const tr of trElements) {
//         const date = tr.querySelector('td[data-stat="game_date"]').textContent;
//         const winner = tr.querySelector('td[data-stat="winner"]').textContent.replace('*', '').trim();
//         const loser = tr.querySelector('td[data-stat="loser"]').textContent;
//         const winnerScore = tr.querySelector('td[data-stat="pts_win"]').textContent;
//         const loserScore = tr.querySelector('td[data-stat="pts_lose"]').textContent;
//         const versus = `${winner} vs ${loser}`;
//         const scoreKey = `${winnerScore}-${loserScore}`;
        
//         if (scoreKey == "-" && date == "Playoffs") continue;
//         if (!passedPrevScore) {
//             const cont = validateContinuation(lastScore, date, versus);
//             passedPrevScore = (cont == 1 || cont == 2);
//             if (cont == 0 || cont == 2) continue;
//         }
//         if (scoreKey == "-") break;
        
//         const constructData = { winner, loser, winnerScore, loserScore, versus, score: scoreKey, date: new Date(date) }
//         const toTweet = await constructTweet(constructData);
//         tweetsToPost.push(toTweet);
//     }

//     return tweetsToPost;
// }