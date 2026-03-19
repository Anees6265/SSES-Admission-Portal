const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  sn: { type: String },
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  track: {
    type: String,
    enum: ['Satwas','Nemawar','Harda','Khategaon','Kannod','Bherunda','Gopalpur','Timarni','Narmadapuram','Seoni Malva'],
    required: true,
  },
  mobileNo: { type: String },
  whatsappNo: { type: String },
  subject: { type: String },
  fullAddress: { type: String },
  otherTrack: { type: String },
  photo: { type: String, default: null },
  marksheet: { type: String, default: null },
  status: {
    type: String,
    enum: ['Applied', 'Verified', 'Admitted', 'Rejected'],
    default: 'Applied',
  },
  remarks: { type: String, default: '' },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
