const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');
const Thought = require('../models/Thought');


module.exports= {
    //get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            
            if(!users) return res.status(404).json({ message: "There are no users!"});
            return res.json(users);
        }  catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        },

    //get a user by id
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId})
            .select('-__v')
            .lean();

            if(!user) {
                return res.status(404).json({ message: 'There is no user with that ID' });
            }

            res.json({
                user,
            });
        } catch(err) {
            console.log(err);
            return res.status(500).json(err);
        }
        },

    //create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },

  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.students } });
      res.json({ message: 'The user and their thoughts have been deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

    //add a new friend to the user's friend list
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId }},
                { runValidators: true, new: true}
            );

            if(!user) {
                return res.status(404).json({ message: "There is no user with this ID" });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //removes a friend from the user's friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: { $in: req.params.friendId }}},
                { runValidators: true, new: true}
            );

            if(!user) {
                return res.status(404).json({ message: "There is no user with this ID" });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    }
}
