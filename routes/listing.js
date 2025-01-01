const express = require('express');
const route = express.Router();
const listing = require('../models/listing.js')
const wrapAsync = require('../utils/wrapAsync.js');
const expressError = require('../utils/expressError.js');
const { listingSchema } = require('../schema.js');
const { isloggedin } = require('../middleware.js');


const validateListing = ( req, res, next ) => {
    let { error } = listingSchema.validate(req.body);

    if ( error ) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg)
    }else{
        next();
    }
}

route.get("/", wrapAsync(async (req,res) => {
    let allListing = await listing.find();
    res.render("listings/index.ejs",{allListing});
}))

route.get("/new", isloggedin, (req, res) => {
    res.render("listings/new.ejs")
})

route.post("/",isloggedin, validateListing,wrapAsync(async ( req, res ) => {
    
    let listings = req.body.listing;
    let newData = new listing(listings);
    await newData.save();
    req.flash('success','New listing added');

    res.redirect("/listings");
}));

route.get("/:id", isloggedin, wrapAsync(async ( req,res ) => {
    let { id } = req.params;
    let data = await listing.findById(id).populate("reviews");
    if( !data ){
        req.flash('error','listing does not exist');
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ data })
}))

route.get("/:id/edit",isloggedin, wrapAsync(async ( req, res ) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    if( !data ){
        req.flash('error','listing does not exist');
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ data })
}))

route.put("/:id", isloggedin, validateListing, wrapAsync(async ( req, res ) => {
    let { id } = req.params;
    if( !req.body.listing ){
        throw new expressError(400, "send valid data for the listing")
    }
    await listing.findByIdAndUpdate(id,req.body.listing);
    req.flash('success','listing updated!');

    res.redirect(`/listings/${id}`);
}))

//delete route
route.delete("/:id", isloggedin, wrapAsync(async ( req, res ) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    req.flash('success','listing deleted!');
    
    res.redirect("/listings");
}))

module.exports = route;