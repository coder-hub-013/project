const User = require("../models/user");


module.exports.renderSignUpForm =  (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res) => {
    try {
        let {username, email, password} = req.body;
        const existingUser = await User.findOne({email : email});
        if(existingUser) {
            req.flash("error", "Email is already registered");
            return res.redirect("/signup");
        }

        const newUser = new User({email,username});
        const registedUser = await User.register(newUser, password);
        console.log(registedUser);
        req.login(registedUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust")
            res.redirect("/listings");
        })

    } catch (e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) => {
    req.flash("success","Welcome to wanderlust: You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "You are Logged out!");
        res.redirect("/listings");
    });
};