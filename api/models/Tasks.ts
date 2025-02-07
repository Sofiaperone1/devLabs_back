/*import { Schema, model } from "mongoose";
import { type } from "os";

const Tasks = new Schema({
  description: {
    type: String,
    unique: true,
  },
  date: {
    type: String,
  },
  username: {
    type: String,
  }
});

export default model("Tasks", Tasks);*/
import { Schema, model, Document } from "mongoose";

export interface ITask extends Document {
  description: string;
  date?: string;
  username: string;
}

const TaskSchema = new Schema<ITask>({
  description: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: String,
  },
  username: {
    type: String,
    required: true
  }
});

export default model<ITask>("Tasks", TaskSchema);
