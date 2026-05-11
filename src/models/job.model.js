import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
         
    description: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "draft",
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ organizationId: 1, status: 1 });

export default mongoose.model("Job", jobSchema);