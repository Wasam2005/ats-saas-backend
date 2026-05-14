import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
      applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
      },

      interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      scheduledAt: {
        type: Date,
        required: true,
      },

      status: {
        type: String,
        enum: ["scheduled","completed","cancelled"],
        default: "scheduled",
      },

      feedback: {
        type: String,
        trim: true,
        default: "",
      },

      score: {
        type: Number,
        min: 0,
        max: 10,
        default: null,
      },

      organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
      },
    },
    {timestamps: true,}
  );


interviewSchema.index({
  organizationId: 1,
  applicationId: 1,
});

interviewSchema.index({
  interviewerId: 1,
  scheduledAt: 1,
});



export default mongoose.model("Interview",interviewSchema);