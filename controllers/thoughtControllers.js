const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');


module.exports= {
    //get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            
            return res.json(thoughts);
        }  catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        },

    //get a single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({_id: req.params.thoughtId})
            .select('-__v')
            .lean();

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
            const thought = await Thought.create(req.body);
            const user = await User.findOne(
                { _id: req.params.userId },
            );

            user.thoughts.push(thought._id);

            await user.save();

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
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
            const reaction = await Reaction.create(req.body);
            const thought = await Thought.findOne(
                { _id: req.params.thoughtId },
            );

            thought.reactions.push(reaction._id);

            await thought.save();

            res.json(reaction);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
    
            if (!thought) {
                res.status(404).json({ message: 'This thought does not exist.' });
            };
            
            const reactIndex = thought.reactions.findIndex(
                (reactionId) => reactionId.toString() === req.params.reactionId
            );

            thought.reactions.splice(reactIndex, 1);

            await thought.save();

            res.json({ message: 'The reaction has been deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
}