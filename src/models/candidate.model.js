import mongoose from "mongoose";

const { Schema } = mongoose;

const candidateSchema = new Schema(
{
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    
    skills: {
      type: [String],
      default: [],
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
},
{timestamps:true}
);
candidateSchema.index(
    { organizationId:1 ,email : 1},
    {unique:true}
)

export default mongoose.model("Candidate", candidateSchema );
