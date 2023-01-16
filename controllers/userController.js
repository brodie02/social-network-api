const { User, Thought } = require('../models')

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err))
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err))
    },
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err))
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                ? res.status(404).json({ message: 'No user with that ID'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err))
    },
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => {
                if(!user) {
                    res.status(404).json({ message: 'No user with that ID' })
                } else {
                    Thought.deleteMany({ _id: { $in: user.thoughts } }),
                    res.json("User Deleted") 
                }
            }
            )
            .catch((err) => res.status(500).json(err))
    },
    addFriendToUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) => 
                !user
                ? res.status(404).json({ message: 'No user with that ID'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err))
    },
    deleteFriendFromUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) => 
                !user
                ? res.status(404).json({ message: 'No user with that ID'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err))
    }
}