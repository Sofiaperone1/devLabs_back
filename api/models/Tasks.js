import { Schema, model } from "mongoose";

const Tasks = new Schema({
  description: {
    type: String,
    unique: true,
  },
  date: {
    type: String,
  }
});

export default model("Tasks", Tasks);
