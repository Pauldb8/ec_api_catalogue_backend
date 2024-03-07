import mongoose, { Document, Schema } from 'mongoose';

interface IApi extends Document {
  id: string;
  // Define other properties of your API entities here
}

const ApiSchema: Schema = new Schema({
  //   id: { type: String, default: () => uuidv4(), unique: true, required: true },
  // Add other fields here as needed
});

export default mongoose.model<IApi>('Api', ApiSchema);
