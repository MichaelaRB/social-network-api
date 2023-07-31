const { Schema, model } = require('mongoose');
var createdDate = new Date;
const reactionSchema = require('./Reaction');

let day = createdDate.getDate();
let month = createdDate.getMonth() + 1;
let year = createdDate.getFullYear();
createdDate = month+"/"+day+"/"+year;

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
