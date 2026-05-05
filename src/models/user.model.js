import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
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

    password: {
      type: String,
      required: true,
    },

    organizationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization",
  required: true,
  index: true,
},

    role: {
      type: String,
      enum: ["owner", "admin", "recruiter", "interviewer"],
      default: "recruiter",
      required: true,
    },

    isActive: {
  type: Boolean,
  default: true,
  index: true,
}

  },
  { timestamps: true }
);

userSchema.index(
  { organizationId: 1, role: 1 },
  {
    unique: true,
    partialFilterExpression: { role: "owner" },
  }
);

userSchema.index(
  { email: 1, organizationId: 1 },
  { unique: true }
);

export default mongoose.model("User", userSchema);
