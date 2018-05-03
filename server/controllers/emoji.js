const Emoji = require('../models/schemas/emoji');

module.exports.getRecentEmoji = async (req, res) => {
    try {
        const emoji = await Emoji.findOne({ username: req.user.username });
        res.json(emoji);
    } catch (e) {
        res.json([]);
    }
};

module.exports.updateRecentEmoji = async (req, res) => {
    const recentEmoji = req.body.recentEmoji;
    try {
        await Emoji.findOneAndUpdate(
            { username: req.user.username },
            { $push: { titles: recentEmoji } },
            { upsert: true });
    } catch (ex) {
        console.error(`Update recent emoji failed for user ${req.user.username}. ${ex}`);

        return res.sendStatus(400);
    }

    res.sendStatus(200);
};
