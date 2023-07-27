const { Schema, model } = require('mongoose');

// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
        type: String,
        required: true,
        validate: {
            validator: function(text) {
                return /^[a-z0-9_\.-!?@]{1,280}$/.test(text);
            }
        }
    },
    createdAt: {
        type: Date,
        required: true,
        unique: true,
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, "Please use a valid email"],
        },
    username: {
        type: String,
        required: true,
    },
    reactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reaction',
        },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);


userSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });


const Thought = model('thought', thoughtSchema);

module.exports = Thought;
