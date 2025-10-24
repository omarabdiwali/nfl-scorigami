import dbConnect from "@/utils/dbConnect";
import NBAScores from "@/models/NBAScores";

export default async function handler(req, res) {
    await dbConnect();
    const scores = await NBAScores.find({ score: { $regex: "-" } }).select('-_id -__v');
    res.status(200).json({ result: scores });
}