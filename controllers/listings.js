const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({accessToken : mapToken});

module.exports.index = async (req,res) => {
    const AllListings = await Listing.find({})
    res.render("listings/index.ejs" , {AllListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
}

module.exports.show = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews", populate : {path : "author",} })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req,res,next) => {

    let response = await geoCodingClient.forwardGeocode({
        query : req.body.listing.location,
        limit : 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = await new Listing(req.body.listing);
    newListing.owner = req.user.id;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    // console.log(savedListing);

    req.flash("success", "User register successfully");
    res.redirect("/listings")  
};

module.exports.edit = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.update =  async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Updated");

    res.redirect(`/listings/${id}`);
};

module.exports.destroy =  async (req,res) => {
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing delete");
    res.redirect("/listings");

}