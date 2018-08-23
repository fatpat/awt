/**
 * @file
 * JavaScript functions for the Client-side adaptive image module.
 *
 * Penceo altered version.
 */

(function ($) {
    Drupal.behaviors.csAdaptiveImage = {
        attach: function(context, settings) {
            // if (window.csAdaptiveImageInitialized) {
            //     return;
            // }
            //
            // window.csAdaptiveImageInitialized = true;

            var isLazy = true;

            if (isLazy && typeof $.fn.lazyload === 'undefined') {
                isLazy = false;
            }

            var getViewport = function() {
                var viewPortWidth;
                var viewPortHeight;

                // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
                if (typeof window.innerWidth !== 'undefined') {
                    viewPortWidth = window.innerWidth;
                    viewPortHeight = window.innerHeight;
                }

                // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
                else if (typeof document.documentElement !== 'undefined'
                    && typeof document.documentElement.clientWidth !== 'undefined'
                    && document.documentElement.clientWidth !== 0) {
                    viewPortWidth = document.documentElement.clientWidth;
                    viewPortHeight = document.documentElement.clientHeight;
                }

                // older versions of IE
                else {
                    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
                    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
                }
                return {
                    width: viewPortWidth,
                    height: viewPortHeight
                };
            };

            /**
             * Retrieves an adapted image based element's data attributes
             * and the current client width.
             */
            var getAdaptedImage = function(element, excluded_breakpoint) {
                var selected_breakpoint = 'max';
                var breakpoints = $(element).attr('data-adaptive-image-breakpoints');
                if (breakpoints) {
                    // Find applicable target resolution.
                    $.each(breakpoints.split(' '), function(key, breakpoint) {
                        if (getViewport().width < Number(breakpoint) && (selected_breakpoint === 'max' || Number(breakpoint) < Number(selected_breakpoint))) {
                            selected_breakpoint = breakpoint;
                        }
                    });
                }
                if (selected_breakpoint !== excluded_breakpoint) {
                    return $(element).attr('data-adaptive-image-' + selected_breakpoint + '-img');
                }
                else {
                    return false;
                }
            };

            var lazyLoad = function(wrapper) {
                var img = wrapper.next('img');

                if (img.length !== 0 && img.attr('data-original') !== 'undefined') {
                    if (isLazy) {
                        img.lazyload(
                            {
                                event : 'scroll sporty'
                            }
                        );
                    }
                    else {
                        img.attr('src', img.attr('data-original'));
                    }
                }
            };

            // Insert adapted images.
            $('noscript.adaptive-image', context).once('adaptive-image', function() {
                var img = getAdaptedImage(this);
                $(this).after(img);
                Drupal.attachBehaviors(img);
                jQuery(document).trigger('adaptiveImageInserted', [$(this).next('img')]);

                lazyLoad($(this));
            });

            // Replace adapted images on window resize.
            jQuery(window)
                .off('resizeend.onAdaptiveImageResizeend')
                .on('resizeend.onAdaptiveImageResizeend', function() {
                    $('noscript.adaptive-image-processed').each(function() {
                        // Replace image if it does not match the same breakpoint.
                        var excluded_breakpoint = $(this).next('img.adaptive-image').attr('data-adaptive-image-breakpoint');
                        var img = getAdaptedImage(this, excluded_breakpoint);

                        if (img) {
                            $(this).next('img.adaptive-image').replaceWith(img);
                            Drupal.attachBehaviors(img);
                            jQuery(document).trigger('adaptiveImageInserted', [$(this).next('img')]);

                            lazyLoad($(this));
                        }
                    });
                });
        }
    };
})(jQuery);;
/*! Lazy Load 1.9.7 - MIT license - Copyright 2010-2015 Mika Tuupola */
!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(f){function g(){var b=0;i.each(function(){var c=a(this);if(!j.skip_invisible||c.is(":visible"))if(a.abovethetop(this,j)||a.leftofbegin(this,j));else if(a.belowthefold(this,j)||a.rightoffold(this,j)){if(++b>j.failure_limit)return!1}else c.trigger("appear"),b=0})}var h,i=this,j={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!1,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return f&&(d!==f.failurelimit&&(f.failure_limit=f.failurelimit,delete f.failurelimit),d!==f.effectspeed&&(f.effect_speed=f.effectspeed,delete f.effectspeed),a.extend(j,f)),h=j.container===d||j.container===b?e:a(j.container),0===j.event.indexOf("scroll")&&h.bind(j.event,function(){return g()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,(c.attr("src")===d||c.attr("src")===!1)&&c.is("img")&&c.attr("src",j.placeholder),c.one("appear",function(){if(!this.loaded){if(j.appear){var d=i.length;j.appear.call(b,d,j)}a("<img />").bind("load",function(){var d=c.attr("data-"+j.data_attribute);c.hide(),c.is("img")?c.attr("src",d):c.css("background-image","url('"+d+"')"),c[j.effect](j.effect_speed),b.loaded=!0;var e=a.grep(i,function(a){return!a.loaded});if(i=a(e),j.load){var f=i.length;j.load.call(b,f,j)}}).attr("src",c.attr("data-"+j.data_attribute))}}),0!==j.event.indexOf("scroll")&&c.bind(j.event,function(){b.loaded||c.trigger("appear")})}),e.bind("resize",function(){g()}),/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent&&b.originalEvent.persisted&&i.each(function(){a(this).trigger("appear")})}),a(c).ready(function(){g()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?(b.innerHeight?b.innerHeight:e.height())+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e.scrollLeft():a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollLeft():a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}(jQuery,window,document);;
(function ($) {

Drupal.googleanalytics = {};

$(document).ready(function() {

  // Attach mousedown, keyup, touchstart events to document only and catch
  // clicks on all elements.
  $(document.body).bind("mousedown keyup touchstart", function(event) {

    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      // Is the clicked URL internal?
      if (Drupal.googleanalytics.isInternal(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox') && (Drupal.settings.googleanalytics.trackColorbox)) {
          // Do nothing here. The custom event will handle all tracking.
          //console.info("Click on .colorbox item has been detected.");
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (Drupal.settings.googleanalytics.trackDownload && Drupal.googleanalytics.isDownload(this.href)) {
          // Download link clicked.
          ga("send", {
            "hitType": "event",
            "eventCategory": "Downloads",
            "eventAction": Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(),
            "eventLabel": Drupal.googleanalytics.getPageUrl(this.href),
            "transport": "beacon"
          });
        }
        else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          ga("send", {
            "hitType": "pageview",
            "page": Drupal.googleanalytics.getPageUrl(this.href),
            "transport": "beacon"
          });
        }
      }
      else {
        if (Drupal.settings.googleanalytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          ga("send", {
            "hitType": "event",
            "eventCategory": "Mails",
            "eventAction": "Click",
            "eventLabel": this.href.substring(7),
            "transport": "beacon"
          });
        }
        else if (Drupal.settings.googleanalytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (Drupal.settings.googleanalytics.trackDomainMode !== 2 || (Drupal.settings.googleanalytics.trackDomainMode === 2 && !Drupal.googleanalytics.isCrossDomain(this.hostname, Drupal.settings.googleanalytics.trackCrossDomains))) {
            // External link clicked / No top-level cross domain clicked.
            ga("send", {
              "hitType": "event",
              "eventCategory": "Outbound links",
              "eventAction": "Click",
              "eventLabel": this.href,
              "transport": "beacon"
            });
          }
        }
      }
    });
  });

  // Track hash changes as unique pageviews, if this option has been enabled.
  if (Drupal.settings.googleanalytics.trackUrlFragments) {
    window.onhashchange = function() {
      ga("send", {
        "hitType": "pageview",
        "page": location.pathname + location.search + location.hash
      });
    };
  }

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  if (Drupal.settings.googleanalytics.trackColorbox) {
    $(document).bind("cbox_complete", function () {
      var href = $.colorbox.element().attr("href");
      if (href) {
        ga("send", {
          "hitType": "pageview",
          "page": Drupal.googleanalytics.getPageUrl(href)
        });
      }
    });
  }

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
Drupal.googleanalytics.isCrossDomain = function (hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
};

/**
 * Check whether this is a download URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isDownload = function (url) {
  var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  return isDownload.test(url);
};

/**
 * Check whether this is an absolute internal URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternal = function (url) {
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return isInternal.test(url);
};

/**
 * Check whether this is a special URL or not.
 *
 * URL types:
 *  - gotwo.module /go/* links.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternalSpecial = function (url) {
  var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
  return isInternalSpecial.test(url);
};

/**
 * Extract the relative internal URL from an absolute internal URL.
 *
 * Examples:
 * - http://mydomain.com/node/1 -> /node/1
 * - http://example.com/foo/bar -> http://example.com/foo/bar
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   Internal website URL
 */
Drupal.googleanalytics.getPageUrl = function (url) {
  var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return url.replace(extractInternalUrl, '');
};

/**
 * Extract the download file extension from the URL.
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   The file extension of the passed url. e.g. "zip", "txt"
 */
Drupal.googleanalytics.getDownloadExtension = function (url) {
  var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  var extension = extractDownloadextension.exec(url);
  return (extension === null) ? '' : extension[1];
};

})(jQuery);
;
'use strict';

(function ($) {
	Drupal.behaviors.partnerSlider = {
		attach: function (context, settings) {
			var partnerSliderController = function () {
				var _this = this;

				this.defaultConfig = {
					settings: {
						dataDelayAttr: 'data-delay'
					},
					selectors: {
						partnersGroupList: '.pane-fieldable-panels-pane-field-widget-partners .group-list',
						partnersGroupItem: '.pane-fieldable-panels-pane-field-widget-partners .group-list .group-item',
						partnerLink      : '.pane-fieldable-panels-pane-field-widget-partners .group-list .group-item a'
					}
				};

				this.elements = {};
				this.events = {};
				this.config = {};

				this.init = function () {
					this.config = this.defaultConfig;
					this.elements = selectorsToElements(this.config.selectors);
					this.settings = this.config.settings;
				};

				this.create = function () {
					this.init();

					this._setEvents();

					this.elements = selectorsToElements(this.config.selectors);

					this._setPartnerSlider();
				};

				this.destroy = function () {
					unbind(this.events);
				};

				this._setEvents = function () {
					this.events = [
						{
							el: this.elements.partnerLink,
							ev: 'click.onPartnerLinkClick',
							fn: function(e) { _this._onPartnerLinkClick(e); }
						}
					];

					unbind(this.events);
					bind(this.events);
				};

				this._onPartnerLinkClick = function(e) {
					var el = jQuery(e.currentTarget);

					el.blur();
				};

				this._setPartnerSlider = function() {
					if (this.elements.partnersGroupList.length != 0) {
						this.elements.partnersGroupList.each(function(key, value) {
							var groupList = jQuery(value);

							groupList.slick(
								{
									dots: false,
									infinite: true,
									speed: 300,
									fade: true,
									cssEase: 'linear',
									autoplay: true,
									autoplaySpeed: parseInt(groupList.attr(_this.settings.dataDelayAttr), 10),
									arrows: false
								}
							);
						});
					}
				};
			};

			if (window['partnerSliderControllerInstance'] != undefined) {
				//window['partnerSliderControllerInstance'].refresh();
			}
			else {
				window['partnerSliderControllerInstance'] = new partnerSliderController();
				window['partnerSliderControllerInstance'].create();
			}
		}
	};
})(jQuery);
;
