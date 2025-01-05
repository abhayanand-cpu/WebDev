const mongoose = require('mongoose');
const review = require('./review.js');

const listingSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String
    },
    image: {
        url: String,
        filename: String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if( listing )
        await review.deleteMany({_id: { $in: listing.reviews}})
})

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;