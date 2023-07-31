const { Schema, model } = require('mongoose');
const createdDate = Date.now;

createdDate = createdDate.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

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
        default: this.createdDate,
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
