const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: String
  },
  status: {
    type: String,
    required: true,
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String
  },
  githubUsername: {
    type: String
  },
  Experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      currentlyWorking: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      current: {
        type: Boolean,
        default: false,
      },
      grade: {
        type: String
      },
    },
  ],
  social: 
    {
      github: {
        type: String
      },
      linkedin: {
        type: String
      },
      instagram: {
        type: String
      }
    }
});


module.exports = Profile = mongoose.model('profile',ProfileSchema)