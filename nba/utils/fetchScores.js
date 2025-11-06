import dbConnect from './dbConnect';
import NBAScores from '@/models/NBAScores';
import ProcessedGames from '@/models/ProcessedGames';

const getRequest = async (url) => {
    return await fetch(url).then(res => res.json()).then(data => { return data; });
}

const getNestedProperty = (data, keys) => {
    let current = data;
    let prevKey = null;
    const errorMessage = `Key '${keys.join(".")}' does not exist.`

    for (const key of keys) {
        if (current === null || current === undefined) throw new Error(`${errorMessage} Missing ${prevKey}.${key}.`);
        current = current[key];
        prevKey = key;
    }

    if (current === undefined) throw new Error(errorMessage);
    return current;
}

const validateData = (data, keys) => {
    for (const key of keys) {
        if (data[key] === null || data[key] === undefined) {
            throw new Error(`Missing data field '${key}': ${JSON.stringify(data, null, 2)}`);
        }
    }
}

const normalizeDate = (stringDate) => {
    const date = new Date(stringDate);
    const localeDate = date.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    return new Date(localeDate + "T12:00Z");
}

const translateDateToString = (date) => {
    const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = date.getUTCFullYear();
    const month = allMonths[date.getUTCMonth()];
    const day = date.getUTCDate();

    return `${month} ${day}, ${year}`;
}

const ordinalEnding = (number) => {
    const i = number % 10, j = number % 100;
    if (i == 1 && j !== 11) return "st";
    if (i == 2 && j !== 12) return "nd";
    if (i == 3 && j !== 13) return "rd";
    return "th";
}

const hasBeenProcessed = async (id) => {
    try {
        await dbConnect();
        const processed = await ProcessedGames.findOne({ id })
        return (processed != null);
    } catch (e) {
        throw new Error("Getting processed games failed:", e.message || e);
    }
}

const addProcessedGame = async (id) => {
    try {
        await dbConnect();
        await ProcessedGames.create({ id });
    } catch (e) {
        throw new Error(`Error adding processed game ${id}:`, e.message || e);
    }
}

const orderValues = (data, winnerFirst, prevScore=true) => {
    if (prevScore) {
        const teams = data.split(" vs ");
        if (winnerFirst) return data;
        else return `${teams.at(1)} vs ${teams.at(0)}`;
    } else {
        if (winnerFirst) return `${data.winner} ${data.winnerScore}\n${data.loser} ${data.loserScore}`;
        else return `${data.loser} ${data.loserScore}\n${data.winner} ${data.winnerScore}`
    }
}

const constructTweet = async (data) => {
    await dbConnect();
    const gameScore = `${orderValues(data, data.winnerFirst, false)}\n\n`;
    const exists = await NBAScores.findOne({ score: data.score });
    let scorigami = "";
    
    if (exists) {
        const stringDate = translateDateToString(new Date(exists.date));
        const lastGame = orderValues(exists.versus, data.winnerFirst);
        scorigami = `No Scorigami. That score has happened ${exists.count} ${exists.count == 1 ? "time" : "times"} before, most recently on ${stringDate} (${lastGame}).`
        exists.count += 1;
        exists.date = new Date(data.date);
        exists.versus = data.versus;
        exists.save();
    } else {
        const totalScores = await NBAScores.countDocuments({});
        scorigami = `That's Scorigami!! It's the ${totalScores}${ordinalEnding(totalScores)} unique final score in NBA History!`;
        const modelData = { score: data.score, versus: data.versus, date: new Date(data.date), count: 1 };
        await NBAScores.create(modelData).catch(err => console.log(err));
    }

    await addProcessedGame(data.id);
    return gameScore + scorigami;
}

const getScorigamiData = async () => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const keys = ["id", "date", "winner", "winnerScore", "loser", "loserScore"];
        const tweetsToPost = [];
        const url = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";
        const data = await getRequest(url);
        
        for (const event of data.events) {
            let winnerFirst = true;
            const gameData = {};
            const id = getNestedProperty(event, ["id"]);
            const completed = getNestedProperty(event, ["status", "type", "completed"]);
            const date = getNestedProperty(event, ["date"]);

            gameData.id = id;
            gameData.date = normalizeDate(date);

            if (!completed || await hasBeenProcessed(id)) continue;
            for (const team of getNestedProperty(event, ["competitions", 0, "competitors"])) {
                if (getNestedProperty(team, ["winner"]) && gameData.winner == undefined) {
                    gameData.winner = getNestedProperty(team, ["team", "displayName"]);
                    gameData.winnerScore = getNestedProperty(team, ["score"]);
                } else if (gameData.loser == undefined) {
                    gameData.loser = getNestedProperty(team, ["team", "displayName"]);
                    gameData.loserScore = getNestedProperty(team, ["score"]);
                    winnerFirst = (gameData.winner !== undefined)
                } else {
                    gameData.winner = getNestedProperty(team, ["team", "displayName"]);
                    gameData.winnerScore = getNestedProperty(team, ["score"]);
                }
            }

            validateData(gameData, keys);
            gameData.versus = `${gameData.winner} vs ${gameData.loser}`;
            gameData.score = `${gameData.winnerScore}-${gameData.loserScore}`;
            gameData.winnerFirst = winnerFirst;
            const tweet = await constructTweet(gameData);
            tweetsToPost.push(tweet);
        }

        return tweetsToPost;
    } catch (error) {
        console.error("Error fetching scorigami data:", error.message || error);
        return [];
    }
}

export default getScorigamiData;
