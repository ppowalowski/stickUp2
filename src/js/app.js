'use strict';

var app = (function (document, $) {
    var docElem = document.documentElement,
            _userAgentInit = function () {
                docElem.setAttribute('data-useragent', navigator.userAgent);
            },
            _init = function () {
                $('.sticky-menu').stickUp({
                    scrollHide:true,
                    zIndex:100
                });
                $('.sticky-keep').stickUp({
                    topMargin:100,
                    keepInWrapper:true,
                    wrapperSelector:'.row.container'
                });
                $('.sticky-content').stickUp({
                    
                });
                $('.sidebar-1').stickUp({
                    keepInWrapper:true,
                    topMargin:120,
                    wrapperSelector:'.row.container'
                });
                $('.sidebar').stickUp({
                    keepInWrapper:true,
                    topMargin:120,
                    wrapperSelector:'.row.container'
                });
                _userAgentInit();
            };
    return {
        init: _init
    };
})(document, jQuery);

(function () {
    app.init();
})();
 