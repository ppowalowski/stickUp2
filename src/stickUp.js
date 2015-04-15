(function ($,window,document) {
    
    var contentTop = [],
    content = [],
    lastScrollTop = 0,
    scrollDir = '',
    itemClass = '',
    itemHover = '',
    menuSize = null,
    active = false,
    stickyHeight = 0,
    currentMarginT = 0,
    $element = $(),
    currentMarginT = 0,
    topMargin = 0,
    $placeholder = $('<div style="margin:0"></div>'),
    top,

    getTopMargin = function(options) {
        if (options.topMargin == 'auto') {
            return parseInt($('.stuckMenu').css('margin-top'));
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

    baseScrollHandlerFn = function(event) {
        var st = $(event.target).scrollTop();
        scrollDir = (st >= lastScrollTop) ? 'down' : 'up';
        lastScrollTop = st;
        if(!active){
            stickyHeight = parseInt($element.outerHeight(true));
            top = parseInt($element.offset().top);
        }
    },
     
    stickUpScrollHandlerFn = function() {
        var scroll = parseInt($(document).scrollTop());
        if (menuSize != null && content.length > 0) {
            for (var i = 0; i < menuSize; i++) {
                contentTop[i] = $('#' + content[i] + '').offset().top;
                function bottomView(i) {
                    var contentView = $('#' + content[i] + '').height() * .4;
                    if (scroll > (contentTop[i] - contentView)) {
                        setItemHover(i);
                    } else if (scroll < 50) {
                        setItemHover(0);
                    }
                }

                if (scrollDir == 'down' && scroll > contentTop[i] - 50 && scroll < contentTop[i] + 50) {
                    setItemHover(i);
                }

                if (scrollDir == 'up') {
                    bottomView(i, contentTop[i]);
                }
            }
        }
        
        //STICK IT
        if (top < scroll + topMargin && !$element.hasClass('isStuck')) {
            active = true;
            window.requestAnimationFrame(function() {
                $element.before($placeholder.css('height',$element.outerHeight()));
                $element.addClass('isStuck')
                    .css({ 
                        position: "fixed",
                        top: '0px'
                    });
            });
        }
        
        //UNSTICK
        if (scroll + topMargin < top && $element.hasClass('isStuck')) {
            window.requestAnimationFrame(function() {
                $placeholder.remove();
                $element
                    .removeClass('isStuck')
                    .next()
                    .closest('div')
                    .css({
                        'margin-top': currentMarginT + 'px'
                    });

                $element.css("position", "relative");
            });
            active = false;
        }
    },

    setItemHover = function(position) {
        $('.' + itemClass).removeClass(itemHover);
        $('.' + itemClass + ':eq(' + position + ')').addClass(itemHover);
    };

    $.fn.stickUp = function (options) {
        $element = $(this);
        // adding a class to users div
        $element.addClass('stuckMenu');
        //getting options
        var objn = 0;
        if (options != null) {
            var parts = options.parts;
            for (var key in  parts) {
                if (parts.hasOwnProperty(key)) {
                    content[objn] = parts[objn];
                    objn++;
                }
            }

            itemClass = options.itemClass;
            itemHover = options.itemHover;

            topMargin = (options.topMargin != null) ? getTopMargin(options) : 0;

            menuSize = $('.' + itemClass).size();
        }
        $(window).on('scroll.stickUp', baseScrollHandlerFn);
        $(document).on('scroll.stickUp', stickUpScrollHandlerFn);
        
        //initial round ;-)
        baseScrollHandlerFn({target:window});
        stickUpScrollHandlerFn({target:document});
        
        //chainability
        return this;
    };
}(jQuery,window,document));