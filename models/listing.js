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
        type:String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUSLFIi3NC7K_R1AF-8IC9yo6IpJHM7o8HKQ&s",
        set:(v) =>
            v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUSLFIi3NC7K_R1AF-8IC9yo6IpJHM7o8HKQ&s"
            : v
        
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