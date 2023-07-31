const { Schema, Types } = require('mongoose');
var createdDate = new Date();

let day = createdDate.getDate();
let month = createdDate.getMonth() + 1;
let year = createdDate.getFullYear();
createdDate = month+"/"+day+"/"+year;

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
      type: Date,
      default: this.createdDate,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;
