const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  timetable: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      slots: [
        {
          startTime: {
            type: String, // e.g., "9:00 AM 
            required: true
          },
          endTime:{
            type : String,
            required : true
          },
          subject: {
            type: String, // e.g., "Mathematics"
            required: true
          },
          activity: {
            type: String, // optional, e.g., "Lecture", "Tutorial", "Lab"
            required: false
          }
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Timetable", timetableSchema);

