import dbConnect from "@/utils/dbConnect";
import Scores from "@/models/Scores";

export default async function handler(req, res) {
    await dbConnect();
    const scores = await Scores.find({ score: { $regex: "-" } }).select('-_id -__v');
    res.status(200).json({ result: scores });
}