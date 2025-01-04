const express = require('express');
const route = express.Router();
const listing = require('../models/listing.js')
const wrapAsync = require('../utils/wrapAsync.js');
const { isloggedin, isOwner, validateListing } = require('../middleware.js');


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
    newData.owner = req.user._id;
    await newData.save();
    req.flash('success','New listing added');

    res.redirect("/listings");
}));

route.get("/:id", wrapAsync(async ( req,res ) => {
    let { id } = req.params;
    let data = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if( !data ){
        req.flash('error','listing does not exist');
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ data })
}))

route.get("/:id/edit",isloggedin, isOwner, wrapAsync(async ( req, res ) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    if( !data ){
        req.flash('error','listing does not exist');
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ data })
}))

route.put("/:id", isloggedin, isOwner, validateListing, wrapAsync(async ( req, res ) => {
    let { id } = req.params;
    if( !req.body.listing ){
        throw new expressError(400, "send valid data for the listing")
    }
    await listing.findByIdAndUpdate(id,req.body.listing);
    req.flash('success','listing updated!');

    res.redirect(`/listings/${id}`);
}))

//delete route
route.delete("/:id", isloggedin, isOwner, wrapAsync(async ( req, res ) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    req.flash('success','listing deleted!');
    
    res.redirect("/listings");
}))

module.exports = route;