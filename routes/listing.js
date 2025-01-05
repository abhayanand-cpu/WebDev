const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isloggedin, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage }); 

router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isloggedin, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)); //create route

//new route
router.get("/new", isloggedin, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //show route
    .put(isloggedin, isOwner, validateListing, wrapAsync(listingController.updateListing)) //update route
    .delete(isloggedin, isOwner, wrapAsync(listingController.destroyListing)); //destroy route

//edit route
router.get("/:id/edit",isloggedin, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;