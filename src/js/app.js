'use strict';

var app = (function (window, document, $) {
    var docElem = document.documentElement,
            _userAgentInit = function () {
                docElem.setAttribute('data-useragent', navigator.userAgent);
            },
            _init = function () {
                _userAgentInit();
                $('.sticky-menu').stickUp({
                    scrollHide:true,
                    zIndex:100
                });
                $('.sticky-keep').stickUp({
                    topMargin:110,
                    keepInWrapper:true,
                    wrapperSelector:'.row.container'
                });
                $('.sticky-content').stickUp({
                    
                });
                $('.sidebar').stickUp({
                    keepInWrapper:true,
                    topMargin:110,
                    wrapperSelector:'.row.container'
                });
                $('.sidebar-1').stickUp({
                    keepInWrapper:true,
                    topMargin:20,
                    lazyHeight: $('.sticky-menu').outerHeight(),
                    wrapperSelector:'.row.container'
                });
            };
//            jQuery(window).on('scroll',function(e){
//                if(jQuery(this).scrollTop()>1000){
//                    $('.sidebar-1').css('min-height','105vh');
//                }
//            });
    return {
        init: _init
    };
})(window, document, jQuery);

(function () {
    app.init();
})();
 