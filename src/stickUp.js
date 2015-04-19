(function ($, window, document) {
    var StickUp = function(elem, opts) {
        var contentTop = [],
        content = [],
        lastScrollTop = 0,
        scrollDir = '',
        itemHover = '',
        menuSize = null,
        active = false,
        stickyHeight = 0,
        outerHeight = 0,
        currentMarginT = 0,
        $element = $(),
        topMargin = 0,
        offset = 0,
        scrollDistance = 0,
        $placeholder = $('<div style="margin:0; padding:0"></div>'),
        top,
        //defaults
        options = {
            scrollHide: true,
            topMargin: "auto"
        },
        getTopMargin = function () {
            if (options.topMargin === 'auto') {
                return parseInt($element.css('marginTop'));
            } else {
                if (isNaN(options.topMargin) && options.topMargin.search("px") > 0) {
                    return parseInt(options.topMargin.replace("px", ""));
                } else if (!isNaN(parseInt(options.topMargin))) {
                    return parseInt(options.topMargin);
                } else {
                    console.log("incorrect argument, ignored.");
                    return 0;
                }
            }
        },
        stickUpScrollHandlerFn = function (event) {
            var scroll = $(event.target).scrollTop();
            scrollDir = (scroll >= lastScrollTop) ? 'down' : 'up';
            scrollDistance = Math.abs(lastScrollTop - scroll);
            lastScrollTop = scroll;

            // permanently measure initial sizes to avoid errors with loading images
            // and dynamic elements in document
            if (!active) {
                stickyHeight = parseInt($element.outerHeight()+topMargin);
                outerHeight = parseInt($element.outerHeight(true));
                top = parseInt($element.offset().top);
            }


            // Google like reappearance on upward scroll
            if (options.scrollHide) {
                offset = stickyHeight;
                if (active) {
                    var topValue = parseInt($element.css('top'));
                    var maxTop = stickyHeight;
                    if (scrollDir === 'up') {
                        var newTopValue = scrollDistance > -topValue ? 0 : topValue + scrollDistance;
                        $element.css('top', newTopValue + 'px');
                    } else if (scrollDir === "down" && topValue > -maxTop) {
                        var newTopValue = scrollDistance > maxTop + topValue ? -maxTop : topValue - scrollDistance;
                        $element.css('top', newTopValue + 'px');
                    }
                }
            }

            //STICK IT
            if (top + offset < scroll + topMargin && !$element.hasClass('isStuck')) {
                window.requestAnimationFrame(function () {
                    active = true;
                    $element.before($placeholder.css('height', outerHeight));
                    $element.addClass('isStuck');

                    var topDistance = -offset;

                    $element.css({
                        marginTop: topMargin,
                        position: "fixed",
                        top: topDistance + 'px'
                    });
                });
            }

            //UNSTICK
            if (scroll + topMargin <= top && $element.hasClass('isStuck')) {
                window.requestAnimationFrame(function () {
                    $placeholder.remove();
                    $element.removeClass('isStuck')
                    .css({
                        marginTop: "",
                        position: "relative",
                        top: ""
                    });

                    active = false;
                });
            }
        };
        //init
        var initialize = function(elem,opts){
            $element = $(elem);
            // adding a class to users div
            $element.addClass('stuckElement');
            //getting options
            if (opts) {
                $.extend(true, options, opts);
            }
            topMargin = (options.topMargin != null) ? getTopMargin() : 0;
            
            $(document).on('scroll.stickUp', stickUpScrollHandlerFn);
            //initial round ;-)
            stickUpScrollHandlerFn({target: document});
        };
        initialize.call(this, elem, opts);
    };

    $.fn.stickUp = function( options ) {
        return this.each(function() {
          new StickUp( this, options );
        });
    };
}(jQuery, window, document));