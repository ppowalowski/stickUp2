(function ($) {
    
    var contentTop = [],
    content = [],
    lastScrollTop = 0,
    scrollDir = '',
    itemClass = '',
    itemHover = '',
    menuSize = null,
    stickyHeight = 0,
    stickyMarginB = 0,
    currentMarginT = 0,
    $element = $(),
    currentMarginT = 0,
    topMargin = 0,
    top,
    vartop = 0,
    varscroll = 0,
    contentView = $(),
    testView = $();

    function getTopMargin(options) {
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
    }

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

        stickyHeight = parseInt($element.height());
        stickyMarginB = parseInt($element.css('margin-bottom'));
        currentMarginT = parseInt($element.next().closest('div').css('margin-top'));
        top = parseInt($element.offset().top);
    };

    function baseScrollHandlerFn(event) {
        var st = $(event.target).scrollTop();
        scrollDir = (st > lastScrollTop) ? 'down' : 'up';
        lastScrollTop = st;
    }

    function stickUpScrollHandlerFn() {
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

        if (top < scroll + topMargin && !$element.hasClass('isStuck')) {

            $element
                .addClass('isStuck')
                .next()
                .closest('div')
                .css({
                    'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
                }, 10);

            $element.css("position", "fixed");

            $element.css({ 
                top: '0px'
            }, 10, function () {

            });
        }

        if (scroll + topMargin < top && $element.hasClass('isStuck')) {

            $element
                .removeClass('isStuck')
                .next()
                .closest('div')
                .css({
                    'margin-top': currentMarginT + 'px'
                }, 10);

            $element.css("position", "relative");
        }
    }

    function setItemHover(position) {
        $('.' + itemClass).removeClass(itemHover);
        $('.' + itemClass + ':eq(' + position + ')').addClass(itemHover);
    }

    $(window).on('scroll', baseScrollHandlerFn);
    $(document).on('scroll', stickUpScrollHandlerFn);

}(jQuery));