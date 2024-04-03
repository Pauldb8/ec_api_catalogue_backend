import mongoose, { Document, Schema } from 'mongoose';

interface IApi extends Document {
  id: string;
  name: string;
  description: string;
  context: string;
  businessOwner: string;
  technicalOwner: string;
  version: string;
  provider: string;
  openapiDefinition: object;
  featured: boolean;
  tenant: string;
}

const ApiSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  context: { type: String, required: true },
  businessOwner: { type: String, required: true },
  technicalOwner: { type: String, required: true },
  version: { type: String, required: true },
  provider: { type: String, required: true },
  openapiDefinition: { type: Schema.Types.Mixed, required: true },
  featured: { type: Boolean, required: true, default: false },
  tenant: { type: String, required: true },
});

export default mongoose.model<IApi>('Api', ApiSchema);
