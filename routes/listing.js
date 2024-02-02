const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// const upload = multer({dest : "upload/"});


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
        
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.update))
    .delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroy));

//Edit Route
router.get("/:id/edit" , isLoggedIn,
    isOwner,
    wrapAsync(listingController.edit));

module.exports = router;

//-------------------------------------------------------------------------------------------------------------
//Index Route
// router.get("/",wrapAsync(listingController.index));

// // Show Route
// router.get("/:id",wrapAsync(listingController.show));

//Create Route
// router.post("/", isLoggedIn, validateListing
//         ,wrapAsync(listingController.create));

//Update Route
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.update));

//Delete Route
// router.delete("/:id" , isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroy));

