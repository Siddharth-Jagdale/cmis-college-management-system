// ============================================================
// CMIS - models/Fees.js
// Mongoose schema for student fee records
// ============================================================

const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
      unique: true, // One fee record per student
    },
    feesPaid: {
      type: Number,
      required: [true, "Fees paid amount is required"],
      min: [0, "Fees paid cannot be negative"],
      default: 0,
    },
    feesPending: {
      type: Number,
      required: [true, "Fees pending amount is required"],
      min: [0, "Fees pending cannot be negative"],
      default: 0,
    },
    totalFees: {
      type: Number,
      default: 0,
    },
    lastPaymentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: compute total from paid + pending
feesSchema.virtual("computedTotal").get(function () {
  return this.feesPaid + this.feesPending;
});

const Fees = mongoose.model("Fees", feesSchema);
module.exports = Fees;
