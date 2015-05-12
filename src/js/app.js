'use strict';

var app = (function (document, $) {
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
                    topMargin:130,
                    keepInWrapper:true,
                    wrapperSelector:'.row.container'
                });
                $('.sticky-content').stickUp({
                    
                });
                $('.sidebar').stickUp({
                    keepInWrapper:true,
                    topMargin:130,
                    wrapperSelector:'.row.container'
                });
                $('.sidebar-1').stickUp({
                    keepInWrapper:true,
                    topMargin:130,
                    wrapperSelector:'.row.container'
                });
            };
    return {
        init: _init
    };
})(document, jQuery);

(function () {
    app.init();
})();
 