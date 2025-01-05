const listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let allListing = await listing.find();
    res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let listings = req.body.listing;
    let newData = new listing(listings);
    newData.owner = req.user._id;
    newData.image = { url, filename };
    await newData.save();
    req.flash('success','New listing added');

    res.redirect("/listings");
};

module.exports.showListing = async ( req,res ) => {
    let { id } = req.params;
    let data = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if( !data ){
        req.flash('error','listing does not exist');
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ data })
};

module.exports.renderEditForm = async ( req, res ) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    if( !data ){
        req.flash('error','listing does not exist');
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ data })
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
        throw new expressError(400, "send valid data for the listing")
    }
    await listing.findByIdAndUpdate(id, req.body.listing);
    req.flash('success', 'listing updated!');

    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    req.flash('success', 'listing deleted!');
    
    res.redirect("/listings");
};