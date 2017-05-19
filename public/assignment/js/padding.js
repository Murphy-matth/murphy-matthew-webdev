/**
 * Adds padding to the body for the header.
 */

(function() {
    var onResize = function() {
        // apply dynamic padding at the top of the body according to the fixed navbar height
        jQuery("body").css("padding-top", jQuery(".navbar-fixed-top").height());
    };

    // attach the function to the window resize event
    jQuery(window).resize(onResize);

    // call it also when the page is ready after load or reload
    jQuery(function() {
        onResize();
    });
})();