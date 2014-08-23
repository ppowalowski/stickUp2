(function ($) {
    var contentTop = [];
    var content = [];
    var lastScrollTop = 0;
    var scrollDir = '';
    var itemClass = '';
    var itemHover = '';
    var menuSize = null;
    var stickyHeight = 0;
    var stickyMarginB = 0;
    var currentMarginT = 0;
    var topMargin = 0;
    var top;

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
        var $me = $(this);
        // adding a class to users div
        $me.addClass('stuckMenu');
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

        stickyHeight = parseInt($me.height());
        stickyMarginB = parseInt($me.css('margin-bottom'));
        currentMarginT = parseInt($me.next().closest('div').css('margin-top'));
        top = parseInt($me.offset().top);
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

        if (top < scroll + topMargin) {
            var $stuckMenu = $('.stuckMenu');

            $stuckMenu
                .addClass('isStuck')
                .next()
                .closest('div')
                .css({
                    'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
                }, 10);

            $stuckMenu.css("position", "fixed");

            $('.isStuck').css({
                top: '0px'
            }, 10, function () {

            });
        }

        if (scroll + topMargin < top) {
            var $stuckMenu = $('.stuckMenu');

            $stuckMenu
                .removeClass('isStuck')
                .next()
                .closest('div')
                .css({
                    'margin-top': currentMarginT + 'px'
                }, 10);

            $stuckMenu.css("position", "relative");
        }
    }

    function setItemHover(position) {
        $('.' + itemClass).removeClass(itemHover);
        $('.' + itemClass + ':eq(' + position + ')').addClass(itemHover);
    }

    $(window).on('scroll', baseScrollHandlerFn);
    $(document).on('scroll', stickUpScrollHandlerFn);

}(jQuery));