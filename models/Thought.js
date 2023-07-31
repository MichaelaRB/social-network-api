const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
        type: String,
        required: true,
        validate: {
            validator: function(text) {
                return /^[\s\S]{1,280}$/.test(text);
            }
        }
    },
    createdAt: {
        type: Date,
        required: true,
        unique: true,
        default: Date.now(),
        },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);



thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });


const Thought = model('thought', thoughtSchema);

module.exports = Thought;
