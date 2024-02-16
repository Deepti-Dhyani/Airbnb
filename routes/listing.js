const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn , isOwner , validateListing, } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
//index Route
 .get( wrapAsync(listingController.index))
 
//create new listing route
 .post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createlisting)
 );


//new listing form route
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(listingController.renderNewForm )
);



//Show route
router.route("/:id")
.get(
  wrapAsync(listingController.showListing)
)
//updatelisting
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
//deletelisting
.delete(
   isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

//edit listing form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);



module.exports = router;
