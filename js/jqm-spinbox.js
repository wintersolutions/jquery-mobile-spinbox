/*
 * jQuery Mobile Framework : plugin to provide number spinbox.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-spinbox
 */

(function($) {
	$.widget( "mobile.spinbox", $.mobile.widget, {
		options: {
			// All widget options, including some internal runtime details
			dmin: false,
			dmax: false,
			theme: false,
			initSelector: "input[data-role='spinbox']",
			clickEvent: 'vclick',
			type: 'horizontal', // or vertical
			delay: 200 // every 0,2 s
		},
		_create: function() {
			var w = this, tmp,
				o = $.extend(this.options, this.element.jqmData('options')),
				d = {
					input: this.element,
					wrap: this.element.parent()
				};
				
			w.d = d;
			
			if ( w.d.input.jqmData('mini') === true ) {
				w.d.input.addClass('ui-mini');
			}
			
			w.d.wrap
				.removeClass('ui-input-text ui-shadow-inset ui-btn-shadow')
				.addClass('ui-controlgroup ui-controlgroup-'+o.type);
				
			if ( o.type === "horizontal" ) { 
				w.d.wrap.css({'display':'inline', 'whiteSpace':'nowrap', 'border':'none'}); 
				w.d.input.addClass('ui-slider-input');
			} else {
				w.d.input.css({'width':'auto'});
				w.d.wrap.css({'width':'auto','display':'inline-block'});
			}
			w.d.input.css({'textAlign':'center'});
			
			if ( o.theme === false ) {
				o.theme = $(this).closest('[data-theme]').attr('data-theme');
				if ( typeof o.theme === 'undefined' ) { o.theme = 'c'; }
			}
			
			
			if ( o.dmin === false ) { o.dmin = ( typeof w.d.input.attr('min') !== 'undefined' ) ? parseInt(w.d.input.attr('min'),10) : Number.MAX_VALUE * -1; }
			if ( o.dmax === false ) { o.dmax = ( typeof w.d.input.attr('max') !== 'undefined' ) ? parseInt(w.d.input.attr('max'),10) : Number.MAX_VALUE; }
			
			w.d.up = $('<div>')
				.buttonMarkup({icon: 'plus', theme: o.theme, iconpos: 'notext', corners:true, shadow:true, inline:o.type==="horizontal"})
				.css({'marginLeft':'0px', 'marginBottom':'0px', 'marginTop':'0px', 'paddingLeft':o.type==="horizontal"});
				
			w.d.down = $('<div>')
				.buttonMarkup({icon: 'minus', theme: o.theme, iconpos: 'notext', corners:true, shadow:true, inline:o.type==="horizontal"})
				.css({'marginRight':'0px', 'marginBottom':'0px', 'marginTop':'0px', 'paddingRight':o.type==="horizontal"?'.4em':'0px'});
				
			if ( o.type === 'horizontal' ) {
				w.d.down.prependTo(w.d.wrap); w.d.up.appendTo(w.d.wrap);
			} else {
				w.d.up.prependTo(w.d.wrap); w.d.down.appendTo(w.d.wrap);
			}
				
			$.mobile.behaviors.addFirstLastClasses._addFirstLastClasses(w.d.wrap.find('.ui-btn'), w.d.wrap.find('.ui-btn'), true);
			
			var handleClick = function (target, calculator) {
				var doIncrement = function () {
					value = calculator();
					w.increment(value);
				}
				if ( o.clickEvent != 'vmousedown' ) {
					target.on(o.clickEvent, function (e) {
						e.preventDefault();
						doIncrement();
					});
				} else {
					target.on({
							vmousedown : function (e) {
								e.preventDefault();
								doIncrement();	// Instantly increment click once
								interval = window.setInterval(
									function () { doIncrement(); }, 
		  						o.delay);
							},
							vmouseup : function () {
		  					window.clearInterval(interval);
							} 
					});
				}
			};
			
			handleClick(w.d.up, function() {return parseInt(w.d.input.val(),10) + 1 });
			handleClick(w.d.down, function() {return parseInt(w.d.input.val(),10) - 1 });
			
			if ( typeof $.event.special.mousewheel !== 'undefined' ) { // Mousewheel operation, if plugin is loaded
				w.d.input.on('mousewheel', function(e,d) {
					e.preventDefault();
					value = parseInt(w.d.input.val(),10) + ((d<0)?-1:1);
					w.increment(value);
				});
			}
		},
		disable: function(){
			// Disable the element
			this.d.input.attr("disabled",true);
			this.d.input.addClass("ui-disabled").blur();
			this.disabled = true;
		},
		enable: function(){
			// Enable the element
			this.d.input.attr("disabled", false);
			this.d.input.removeClass("ui-disabled");
			this.disabled = false;
		},
		increment: function(value){
			if ( !this.disabled ) {
				if ( value >= this.options.dmin && value <= this.options.dmax ) {
					this.d.input.val(value);
					this.d.input.trigger('change');
				}
			}
		}
	});
	  
	$( document ).bind( "pagecreate create", function( e ){
		$.mobile.spinbox.prototype.enhanceWithin( e.target, true );
	});
})( jQuery );
