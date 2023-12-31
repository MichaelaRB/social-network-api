const { ObjectId } = require('mongoose').Types;
const User  = require('../models/User');
const Thought = require('../models/Thought');

var createdDate = new Date;
let day = createdDate.getDate();
let month = createdDate.getMonth() + 1;
let year = createdDate.getFullYear();
createdDate = month+"/"+day+"/"+year;


module.exports= {
    //get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().populate('reactions');
            
            return res.json(thoughts);
        }  catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        },

    //get a single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({_id: req.params.thoughtId}).populate('reactions');

            if(!thought) {
                return res.status(404).json({ message: 'There is no thought with that ID' });
            }

            res.json({
                thought,
            });
        } catch(err) {
            console.log(err);
            return res.status(500).json(err);
        }
        },

    //create a new thought
    async createThought(req, res) {
        try {
            const user = await User.findOne(
                { _id: req.params.userId },
            );
            const name = user.username;
            const thought = await Thought.create({
                ...req.body,
                username: name,
            });

            user.thoughts.push(thought._id);

            await user.save();

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },
    
    // Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    
            if (!thought) {
                res.status(404).json({ message: 'This thought does not exist.' });
            }
            
            res.json({ message: 'The thought has been deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
            );
    
            if (!thought) {
                res.status(404).json({ message: 'This thought does not exist!' });
            }
    
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createReaction(req,res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
              );
        
              if (!thought) {
                return res
                  .status(404)
                  .json({ message: 'This thought does not exist.' });
              }
        
              res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
              );
        
              if (!thought) {
                return res
                  .status(404)
                  .json({ message: 'This thought does not exist.' });
              }
        
              res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
}
