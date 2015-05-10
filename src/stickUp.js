(function ($, window, document) {
    var StickUp = function(elem, opts) {
        var lastScrollTop = 0,
        scroll = 0,
        scrollDir = '',
        scrollDistance = 0,
        active = false,
        bottom = false,
        hold = false,
        stickyHeight = 0,
        outerHeight = 0,
        viewportHeight = 0,
        scrollBottom = 0,
        elementOffset = 0,
        elementOffsetBottom = 0,
        $element = $(),
        topMargin = 0,
        offset = 0,
        $placeholder = $('<div style="margin-top:0;margin-bottom:0; padding:0"></div>'),
        $parent = $(),
        stickpoints = {
            top:0,
            bottom:0,
            custom:[]
        },
        left,
        //defaults
        options = {
            scrollHide: false,
            topMargin: "auto",
            forcestickTop: false,
            keepInWrapper: true,
            wrapperSelector: '',
            zIndex: 99,
            syncPosition:false
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
        unStick = function(){
            $placeholder.remove();
            $element.removeClass('isStuck')
            .css({ 
                maxWidth:"",
                marginTop: topMargin, 
                position: "",
                top: "",
                left: "", 
                right: "",
                width: ""
            });
            active = false;
            bottom = false;
            hold = false;
        },
        holdIt = function(forceBottom){
            $element.before($placeholder.css('height', outerHeight));
            $element.css({
                marginTop: 0,
                position: "absolute"
            });
            var offsetParent = $placeholder.offsetParent();
            
            if (forceBottom){
                if (offsetParent.is('body')){
                    var  bottomOffset = 
                        ($parent.offset().top + $parent.outerHeight())
                        - offsetParent.outerHeight()
                        - parseInt($parent.css("paddingBottom")); 
                console.log('fu',offsetParent.outerHeight());
                }else{
                    var bottomOffset = 
                        ($parent.offset().top + $parent.outerHeight()) //parent offset bottom
                      - (offsetParent.offset().top + offsetParent.outerHeight()) //offsetparent offset bottom
                      - parseInt($parent.css("paddingBottom")); //parent padding
                }
            }
            console.log('pp',$placeholder.position());
            $element.css({
                top:"",
                left:$placeholder.position().left,
                bottom: forceBottom? -bottomOffset : - (elementOffsetBottom - topMargin - (offsetParent.offset().top + offsetParent.outerHeight()))
            });
        },
        stickIt = function(){
            active = true;
            $element.before($placeholder.css('height', outerHeight));
            $element.addClass('isStuck');
            var topDistance = -offset;

            $element.css({
                //maxWidth: parseInt($element.outerWidth()),
                marginTop: topMargin,
                position: "fixed",
                top: topDistance + 'px',
                left:"",
                right:"",
                //right: "auto",
                bottom:""
            });
        },
        stickAtBottom = function(){
            $element.before($placeholder.css('height', outerHeight));
            $element.addClass('isStuck');
            var bottomDistance = -offset;//-offset;

            $element.css({
                //maxWidth: parseInt($element.outerWidth()),
                marginTop: topMargin,
                position: "fixed",
                top: "",
                left:"",
                right:"",
                //right: "auto",
                bottom:bottomDistance
            });
        },
        syncWidth = function(){
            if($placeholder.width()!==$element.outerWidth())
                $element.outerWidth($placeholder.outerWidth());
        },
        syncPosition = function(){
            console.log($placeholder.offset().left);
            left = $placeholder.offset().left;
            if(left !== $element.offset().left);
                $element.offset({'left':left});
        },

        stickUpScrollHandlerFn = function (event) {
            scroll = $(event.target).scrollTop();
            scrollDir = (scroll >= lastScrollTop) ? 'down' : 'up';
            scrollDistance = Math.abs(lastScrollTop - scroll);
            viewportHeight = $(window).outerHeight();
            scrollBottom = scroll+viewportHeight;
            lastScrollTop = scroll;
            elementOffset = $element.offset().top;
			if (!active) {
                stickyHeight = parseInt($element.outerHeight()+topMargin);
                outerHeight = parseInt($element.outerHeight(true));
                if(!bottom && !hold)
                    stickpoints.top = parseInt($element.offset().top);
                stickpoints.top = parseInt($placeholder.offset().top)
                left = parseInt($element.offset().left)+5;
            }
            if(options.keepInWrapper)
                stickpoints.bottom = $parent.offset().top+$parent.outerHeight()-parseInt($parent.css('paddingBottom'));
            elementOffsetBottom = $element.offset().top+outerHeight;
            
//            console.log(elementOffsetBottom);
//            console.log(scrollBottom);
//            console.log(stickpoints.bottom);
            
            
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
            if(stickyHeight>viewportHeight){
                if( hold && scrollDir === 'up' && scroll <= elementOffset - topMargin){
                    console.log('sticktop');
                    stickIt();
                    active = true;
                    bottom = false;
                    hold = false;
                }
                if( (hold || !active) && !bottom
                && (!options.keepInWrapper || options.keepInWrapper && scrollBottom <= stickpoints.bottom)
                && scrollBottom >= elementOffsetBottom - topMargin
                ){
                    console.log('stickAtBottom');
                    stickAtBottom();
                    bottom = true;
                    active = true;
                    hold = false;
                }
                if(!hold && active && bottom && scrollDir === 'up' 
                || !hold && active && !bottom && scrollDir === 'down' 
                && elementOffsetBottom >= scrollBottom){
                    console.log('holdIt');
                    holdIt();
                    active = false;
                    bottom = false;
                    hold = true;
                }
                //FORCE BOTTOM
                if(!bottom && !hold && options.keepInWrapper 
                && scrollBottom >= stickpoints.bottom 
                || elementOffsetBottom - topMargin > stickpoints.bottom
                || scrollBottom >= stickpoints.bottom && elementOffsetBottom < stickpoints.bottom){
                    console.log('forceBottom');
                    holdIt(true);
                    active = false;
                    bottom = true;
                    hold = true;
                }
            }else{
                if(!hold && !active && scroll >= elementOffset - topMargin 
                || bottom && hold && scroll <= elementOffset - topMargin){
                    console.log('sticktop');
                    stickIt();
                    active = true;
                    bottom = false;
                    hold = false;
                }
                //FORCE BOTTOM
                if( !bottom && !hold && options.keepInWrapper 
                && scroll >= stickpoints.bottom - outerHeight - topMargin){
                    console.log('forceBottom');
                    holdIt(true);
                    active = false;
                    bottom = true;
                    hold = true;
                }
            }
            //UNSTICK
            if (scroll <= stickpoints.top) {
                console.log('unstick');
                unStick();
            }
            //RESPONSIVE baby ;-)
			if(active || hold || bottom)
				syncWidth();
            
            //Special cases which need a specified position like margin:0 centered elements
            if(options.syncPosition && active && !hold)
				syncPosition();
            console.log("active ",active,"hold ",hold,"bottom ",bottom)
        },
        stickUpResponsiveHandlerFn = function(event){
            stickUpScrollHandlerFn({target: document});

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
            if(options.keepInWrapper){
                if(options.wrapperSelector !== '')
                    $parent = $element.closest(options.wrapperSelector);
                //if no Wrapper available use offsetParent
                if(!$parent.length)
                    $parent = $element.offsetParent();
            }else{
                $parent = $('body');
            }
            if(options.zIndex)
                $element.css('z-index',options.zIndex);
            
            if(syncPosition){
                //retrieve margin
                $placeholder.css({
                   'margin-left':$element.css('margin-left'),
                   'margin-right':$element.css('margin-left')
                });
                $element.css({
                    "margin-left" :$placeholder.css('margin-left'),
                    "margin-right" :$placeholder.css('margin-right'),
                });
            }
            
            
            $(document).on('scroll.stickUp', stickUpScrollHandlerFn);
            $(window).on('resize.stickUp', function(e){
                console.log('reize');
                stickUpScrollHandlerFn(e);
            });
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