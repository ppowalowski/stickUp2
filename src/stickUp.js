(function ($, window, document) {
    var StickUp = function(elem, opts) {
        var lastScrollTop = 0,
        scroll = 0,
        scrollDir = '',
        scrollDistance = 0,
        active = false,
        bottom = false,
        hold = false,
        disabled = false,
        landscape = false,
        portrait = false,
        stickyHeight = 0,
        outerHeight = 0,
		currentOuterHeight = 0,
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
            lazyHeight: 0,
            topMargin: "auto",
            keepInWrapper: false,
            wrapperSelector: '',
            zIndex: 99,
            syncPosition:false,
			namespaceClass: "stuckElement",
			fixedClass: "isStuck",
            disableOn:function(){
                return true;
            }
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
                
        unStick = function () {
            console.log('stickUp:beforeUnstick');
            var eventArgs = {
                cancel: false
            };

            $element.trigger('stickUp:beforeUnstick', [eventArgs]);
            if (eventArgs.cancel) {
                return;
            }

            console.log('unStick()');
            $placeholder.remove();
            $element.removeClass(options.fixedClass)
            .css({ 
                maxWidth:"",
                marginTop: "", 
                marginLeft:"",
                marginRight:"",
                position: "",
                top: "",
                left: "", 
                right: "",
                bottom:"",
                width: ""
            });
            active = false;
            bottom = false;
            hold = false;
            if(options.syncPosition)
                syncMargins();

            $element.trigger('stickUp:unstick');
            console.log('stickUp:unstick');
        },
                
        holdIt = function(forceBottom){
            console.log('holdIt()');
            $element.before($placeholder.css('height', outerHeight));
            var offsetParent = $placeholder.offsetParent();
            
            if (forceBottom){
                $element.css({
                    position: "absolute"
                });
                var topOffset = 
                    ($parent.offset().top + $parent.outerHeight()) //bottom of container
                    - offsetParent.offset().top - currentOuterHeight //parent-position - elementHeight
                    - parseInt($parent.css("paddingBottom"));
            }
            console.log($parent.offset().top + $parent.outerHeight());
            console.log(offsetParent.offset().top - currentOuterHeight);
            $element.css({
                position: "absolute",
                marginTop: topMargin,
                bottom:"",
                left:$placeholder.position().left,
                top: forceBottom? topOffset : $element.offset().top - offsetParent.offset().top - topMargin
            });
        },

        stickIt = function () {
            console.log('stickUp:beforeStick');
            var eventArgs = {
                cancel: false
            };

            $element.trigger('stickUp:beforeStick', [eventArgs]);
            if (eventArgs.cancel) {
                return;
            }

            console.log('stickIt()');
            active = true;
            $element.before($placeholder.css('height', outerHeight));
            $element.addClass(options.fixedClass);
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

            $element.trigger('stickUp:stick');
            console.log('stickUp:stick');
        },

        stickAtBottom = function () {
            console.log('stickAtBottom');
            $element.before($placeholder.css('height', outerHeight));
            $element.addClass(options.fixedClass);
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

        syncWidth = function () {
            if($placeholder.width()!==$element.outerWidth())
                $element.outerWidth($placeholder.outerWidth());
        },

        syncPosition = function () {
            //retrieve margin
            left = $placeholder.offset().left;
            if(left !== $element.offset().left);
                $element.offset({'left':left});
        },

        syncMargins = function () {
            //retrieve margin
            $placeholder.css({
                'margin-left':$element.css('margin-left'),
                'margin-right':$element.css('margin-left')
            });
            $element.css({
                 "margin-left" :$placeholder.css('margin-left'),
                 "margin-right" :$placeholder.css('margin-right')
            });
        },

        stickUpScrollHandlerFn = function (event) {
            if(!options.disableOn()){
                if(!disabled){
                    console.log('disable');
                    unStick();
                    disabled = true;
                }
                return;
            }else if(disabled){
                disabled = false;
            }
            if(options.keepInWrapper && !$parent.is(':visible')) {
                return;
            }
            scroll = $(event.target).scrollTop();
            scrollDir = (scroll >= lastScrollTop) ? 'down' : 'up';
            scrollDistance = Math.abs(lastScrollTop - scroll);
            viewportHeight = $(window).outerHeight();
            scrollBottom = scroll+viewportHeight;
            lastScrollTop = scroll;
            elementOffset = $element.offset().top;
            stickyHeight = parseInt($element.outerHeight()+topMargin)+parseInt($element.css('marginBottom'));
			if (!active && !hold && !bottom) {
                outerHeight = parseInt($element.outerHeight(true));
                if(!bottom && !hold)
                    stickpoints.top = parseInt($element.offset().top);
                else
                stickpoints.top = parseInt($placeholder.offset().top);
                left = parseInt($element.offset().left)+5;
            }
			currentOuterHeight = parseInt($element.outerHeight())+parseInt($element.css('margin-bottom'))+topMargin;
            if(options.keepInWrapper)
                stickpoints.bottom = $parent.offset().top+$parent.outerHeight()-parseInt($parent.css('paddingBottom'));
            else
                stickpoints.bottom = $(document).outerHeight();
            elementOffsetBottom = $element.offset().top+currentOuterHeight;
            
            if(stickyHeight>viewportHeight){
                portrait = true;
                if(landscape){
                    offset = 0;
                    if(hold)
                        holdIt();
                    landscape = false;
                }
                if( hold && scrollDir === 'up' && scroll <= elementOffset - topMargin){
                    console.log('sticktop');
                    stickIt();
                    active = true;
                    bottom = false;
                    hold = false;
                }
                if( !active && !bottom
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
                if(scrollBottom >= stickpoints.bottom && options.keepInWrapper //scroll past stickpoint while keepInWrapper
                && (!bottom && !hold //not applied yet
                || parseInt(elementOffsetBottom-topMargin) !== parseInt(stickpoints.bottom))){ // or element past stickpoint
                    console.log('forceBottom');
                    holdIt(true);
                    active = false;
                    bottom = true;
                    hold = true;
                }
            }else{
                landscape = true;
                if(portrait){
                    if(hold)
                        holdIt();
                    portrait = false;
                }
                // Google like reappearance on upward scroll
                if (options.scrollHide)
                    offset = stickyHeight + options.lazyHeight; //negative offset for initial hiding
                else
                    offset = options.lazyHeight;
                
                if(!active && !bottom && scroll >= stickpoints.top - topMargin + offset 
                || bottom && hold && scroll <= elementOffset - topMargin + offset){
                    console.log('sticktop');
                    stickIt();
                    active = true;
                    bottom = false;
                    hold = false;
                }
                //FORCE BOTTOM
                if(options.keepInWrapper
                && parseInt(elementOffsetBottom - topMargin) !== parseInt(stickpoints.bottom)
                && scroll >= stickpoints.bottom - currentOuterHeight + offset){
                    console.log('forceBottom p');
                    holdIt(true);
                    active = false;
                    bottom = true;
                    hold = true;
                }
                //Calculate lazyHeight and autoHide
                if (active) {
                    var topValue = parseInt($element.css('top'));
                    if (scrollDir === 'up' && topValue !== 0) {
                        var newTopValue = scrollDistance > -topValue ? 0 : topValue + scrollDistance;
                        $element.css('top', newTopValue + 'px');
                    } else if (scrollDir === "down" && topValue > -offset) {
                        var newTopValue = scrollDistance > offset + topValue ? -offset : topValue - scrollDistance;
                        $element.css('top', newTopValue + 'px');
                    }
                }
            }
            //UNSTICK
            if ((active || hold || bottom) && scroll <= stickpoints.top - topMargin) {
                console.log('unstick');
                unStick();
            }
            //RESPONSIVE baby ;-)
			if(active || hold || bottom)
				syncWidth();
            
            //Special cases which need a specified position like margin:0 centered elements
            if(options.syncPosition && active || hold)
				syncPosition();
            //console.log("active ",active,"hold ",hold,"bottom ",bottom);

            $element.trigger('stickUp:scroll');
        },

        stickUpResponsiveHandlerFn = function (event) {
            if(hold){
                holdIt();
                bottom = false;
            }
            console.log('resize');
                stickUpScrollHandlerFn(event);

        };

        //init
        var initialize = function(elem,opts){
            $element = $(elem);
            // adding a class to users div
            $element.addClass(options.namespaceClass);
            //getting options
            if (opts) {
                $.extend(true, options, opts);
            } 
            topMargin = (options.topMargin !== null) ? getTopMargin() : 0;
            if(options.lazyHeight)
                topMargin = topMargin + options.lazyHeight;
            if(options.keepInWrapper){
                if(options.wrapperSelector !== '')
                    $parent = $element.closest(options.wrapperSelector);
                //if no Wrapper available use offsetParent
                if(!$parent.length)
                    $parent = $element.parent();
            }else{
                $parent = $('body');
            }
            if(options.zIndex)
                $element.css('z-index',options.zIndex);
            
            if(syncPosition){
                syncMargins();
            }
            
            $(window).on('scroll.stickUp', stickUpScrollHandlerFn);
            $(window).on('resize.stickUp', stickUpResponsiveHandlerFn);
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
