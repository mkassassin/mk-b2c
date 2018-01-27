var mongoose = require('mongoose');

var FollowUserTypeSchema = mongoose.Schema({
    UserId: { type : String , required : true, },
    FollowingUserId:{ type : String , required : true,  },
    ActiveStates:{type : String, required: true}
    }, 
    { timestamps: true }
);




var FollowTopicTypeSchema = mongoose.Schema({
    UserId: { type : String , required : true, },
    FollowingTopicId:{ type : String , required : true,  },
    ActiveStates:{type : String, required: true}
    }, 
    { timestamps: true }
);



var varFollowUserType = mongoose.model('FollowUserType', FollowUserTypeSchema, 'FollowUsers');

var varFollowTopicType = mongoose.model('FollowTopicType', FollowTopicTypeSchema, 'FollowTopics');

module.exports = {
    FollowUserType : varFollowUserType,
    FollowTopicType : varFollowTopicType
};