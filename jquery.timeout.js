(function($){
    var TimeOut = function(context, fn, delay) {
        this.context = context;
        this.fn      = fn;
        this.delay   = delay;
        this.timeout = null;
    }
    
    TimeOut.prototype = { 
        destroy: function() {
            if (this.timeout) {
                window.clearTimeout(this.timeout);
                this.timeout = null;
            }
        },
        exec: function() {
            var fn  = this.fn;
            var ctx = this.context;
            this.destroy();
            this.timeout = window.setTimeout(function() {
                fn.apply(ctx, arguments);
            }, this.delay);        
        }
    };
    
    $.extend($.fn, {
        /**
         * Timeout Executes a callback function after a specified time in ms.
         * This is the jQuery plugin that provides a wrapper to TimeOut it is a polymorphic function 
         * that also takes commands in string form, but must first be initialized with a callback (at a minimum)
         * it fires once per group of elements and can be called repeatedly insuring that the callback will occur only 
         * at the set timeout AFTER the last call
         *
         * Usage:
         *  $(element).timeout(function(){}, 500); // the 'this' inside of your callback will be bound to the jQuery object
         *  $(element).timeout(function(){}, 500, someObject); // this inside the callback will now be bound to someObject
         *  $(element).timeout("destroy"); // destroy the timeout
         */ 
        timeout: function(fn, delay, context) {
            // we create a instance of TimeOut that is kept as an expando of the jQuery object 
            var instance = $.data(this, "TimeOut");
            var isFn     = $.isFunction(fn);
            if (!instance && isFn) {
                instance = $.data(this, "TimeOut", new TimeOut(context || this, fn, delay || 500));
            } else {
                throw new Error("You must initialize timeout with a callback")
            }
            // execute the proper method
            instance[isFn ? "exec" : fn]();
            // be nice to other plugins
            return this;
        }
    });
    
})(jQuery);