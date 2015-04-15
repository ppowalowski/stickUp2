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
    offset = 0,
    scrollDistance = 0,
    $placeholder = $('<div style="margin:0"></div>'),
    top,
    options = {
        scrollHide: true
    },

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

    stickUpScrollHandlerFn = function(event) {
        var scroll = $(event.target).scrollTop();
        scrollDir = (scroll >= lastScrollTop) ? 'down' : 'up';
        scrollDistance = Math.abs(lastScrollTop-scroll);
        lastScrollTop = scroll;
        
        // permanently measure initial sizes to avoid errors with loading images
        // and dynamic elements in document
        if(!active){
            stickyHeight = parseInt($element.outerHeight(true));
            top = parseInt($element.offset().top);
        }
        
        // highlighting
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
        
        // Google like reappearance on upward scroll
        if(options.scrollHide){
            offset = $element.outerHeight();
            if(active){
                var topValue = parseInt($element.css('top'));
                var maxTop = $element.outerHeight();
                if (scrollDir === 'up') {
                   var newTopValue = scrollDistance > -topValue ? 0 : topValue + scrollDistance;
                    $element.css('top',newTopValue+'px'); 
                }else if(scrollDir === "down" && topValue > -maxTop){
                   var newTopValue = scrollDistance > maxTop+topValue ? -maxTop : topValue - scrollDistance;
                    $element.css('top',newTopValue+'px'); 
                }
            }
        }
        
        //STICK IT
        if (top + offset < scroll + topMargin && !$element.hasClass('isStuck')) {
            window.requestAnimationFrame(function() {
                active = true;
                $element.before($placeholder.css('height',$element.outerHeight()));
                $element.addClass('isStuck');
                
                var topDistance = -offset ;
                
                $element.css({ 
                    position: "fixed",
                    top: topDistance+'px'
                });
            });
        }
        
        //UNSTICK
        if (scroll + topMargin < top && $element.hasClass('isStuck')) {
            window.requestAnimationFrame(function() {
                $placeholder.remove();
                $element.removeClass('isStuck')
                .css({
                    position: "relative",
                    top: ""
                });
        
                active = false;
            });
        }
    },

    setItemHover = function(position) {
        $('.' + itemClass).removeClass(itemHover);
        $('.' + itemClass + ':eq(' + position + ')').addClass(itemHover);
    };
    
    $.fn.stickUp = function (opts) {
        $element = $(this);
        // adding a class to users div
        $element.addClass('stuckMenu');
        //getting options
        var objn = 0;
        if (options){
			$.extend(true, options, opts);
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
        $(document).on('scroll.stickUp', stickUpScrollHandlerFn);
        //initial round ;-)
        stickUpScrollHandlerFn({target:document});
        
        //chainability
        return this;
    };
}(jQuery,window,document));