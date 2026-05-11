import mongoose from "mongoose";

const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    stage: {
      type: String,
      enum: [
        "applied",
        "screening",
        "technical",
        "hr",
        "offer",
        "hired",
        "rejected",
      ],
      default: "applied",
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


applicationSchema.index(
  {
    candidateId: 1,
    jobId: 1,
    organizationId: 1,
  },
  {unique: true,}
);


applicationSchema.index({organizationId: 1,stage: 1,});

export default mongoose.model("Application",applicationSchema);