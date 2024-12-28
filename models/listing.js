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
        default: "https://unsplash.com/photos/a-painting-of-a-snowy-village-with-houses-Jw0vl8gLrxM",
        set:(v) =>
            v === "" ? "https://unsplash.com/photos/a-painting-of-a-snowy-village-with-houses-Jw0vl8gLrxM"
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
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if( listing )
        await review.deleteMany({_id: { $in: listing.reviews}})
})

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;