const mongoose = require('mongoose')

const Reminder = mongoose.model('Notes', {
          	
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt:{
	type : Date,
	default: Date.now	
    },		
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = Reminder
