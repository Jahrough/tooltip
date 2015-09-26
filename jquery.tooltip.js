(function ($, window, document) {
    'use strict';
    var $tooltip,
        $window = $(window),
        module = {
            defaults: {
                contentAttr: 'title',
                contentSelector: null,
                disable: false,
                rightBoundary: 70,
                position: 'top',
                theme: null,
                timeout: 3000,
                xOffset: 13,
                yOffset: 35
            },

            init: function init(element, options) {
                try {
                    var self = this,
                        $element = $(element),
                        settings = $.extend({}, self.defaults, options);

                    if ($element.length) {

                        // HIDE HTML CONTENT CONTAINER
                        if (settings.contentSelector !== null) {
                            // DETACH AND STORE HTML CONTENT
                            settings.html = $(settings.contentSelector).eq(0).detach();
                        }

                        // ENABLE/DISABLE TOOLTIP
                        if (settings.disable) {
                            $element.off('.tooltip');
                            if ((typeof $tooltip !== 'undefined') && ($tooltip.length > 0)) {
                                $tooltip[0].style.display = 'none';
                            }
                        } else {
                            self.addTooltip(self);
                            self.addEventListeners(self, element, settings);
                        }
                    }

                } catch (e) {
                    console.log('init()', e.name, e.message);
                }
            },

            addTooltip: function addTooltip() {
                try {
                    var html = '<div id="ui-tooltip"><div class="tip"></div><div class="content"></div></div>';

                    // ADD THE TOOLTIP IF IT ISN'T ALREADY ADDED
                    if (!$(document.getElementById('ui-tooltip')).length) {
                        // CREATE TOOLTIP HTML
                        $('body').prepend(html);
                        // DEFINE TOOLTIP VARIABLE
                        $tooltip = $(document.getElementById('ui-tooltip'));
                    }

                } catch (e) {
                    console.log('addTooltip()', e.name, e.message);
                }
            },

            themeTooltip: function themeTooltip(theme) {
                try {
                    // ADD CUSTOM THEME CLASS
                    if ((typeof theme === 'string') && (theme[0] === '.')) {
                        $tooltip.addClass(theme.substring(1));
                    }

                } catch (e) {
                    console.log('themeTooltip()', e.name, e.message);
                }

            },

            htmlContent: function htmlContent(html, $deferred) {
                // ADD HTML CONTENT
                $tooltip.find('.content').html(html).children()[0].style.display = 'block';
                $deferred.resolve();
            },

            textContent: function textContent(self, currentTarget, contentAttr, contentSelector, $deferred) {
                try {

                    // DEFINE TEXT WITH ATTRIBUTE CONTENT
                    var $currentTarget = $(currentTarget),
                        text = $currentTarget.attr(contentAttr);

                    // SET TOOLTIP CONTENT WITH CONTENT RETRIEVED FROM ATTRIBUTE
                    if (text !== undefined) {

                        // IF TITLE ATTRIBUTE IS DEFINED REMOVE TITLE ATTRIBUTE 
                        // AND STORE CONTENT TITLE CONTENT IN DATA OBJECT 
                        if ($currentTarget.attr('title')) {
                            $currentTarget.data('title', $currentTarget.attr('title')).removeAttr('title');
                        }

                        // ADD ATTRIBUTE CONTENT
                        $tooltip.find('.content').text(text);
                        $deferred.resolve();

                    } else {
                        // TEXT IS FALSE AND HTML CONTENT IS FALSE
                        self.hideTooltip(self, currentTarget, contentSelector);
                    }

                } catch (e) {
                    console.log('textContent()', e.name, e.message);
                }
            },


            hideContent: function hideContent(currentTarget, contentSelector) {
                try {
                    var $currentTarget = $(currentTarget);

                    // RESTORE TITLE ATTRIBUTE WITH THE 
                    // CONTENTS OF DATA OBJECT TITLE PROPERTY
                    if ((contentSelector === null) && ($currentTarget.data('title'))) {
                        $currentTarget.attr('title', $currentTarget.data('title')).removeData('title');
                    }

                } catch (e) {
                    console.log('hideContent()', e.name, e.message);
                }

            },


            addContent: function contentTooltip(self, currentTarget, settings, $deferred) {
                try {

                    // POPULATE CONTENT TOOLTIP ELSE HIDE TOOLTIP
                    if ((typeof settings.contentSelector === 'string') && (settings.contentSelector[0] === '.' || '#')) {

                        // POPULATE TOOLTIP WITH HTML CONTENT
                        self.htmlContent(settings.html, $deferred);

                    } else {

                        // POPULATE TOOLTIP WITH CONTENT FROM ELEMENT ATTRIBUTE OR HIDE
                        self.textContent(self, currentTarget, settings.contentAttr, settings.contentSelector, $deferred);
                    }

                    return $deferred.promise();

                } catch (e) {
                    console.log('addContent()', e.name, e.message);
                }
            },


            hideTooltip: function hideTooltip(self, currentTarget, contentSelector) {
                //HIDE CONTENT
                self.hideContent(currentTarget, contentSelector);

                // HIDE TOOLTIP
                $tooltip.stop().fadeOut('fast');
            },


            showTooltip: function showTooltip(self, currentTarget, settings) {
                var $deferred = $.Deferred();

                // ADD OPTIONAL THEME CLASS
                self.themeTooltip(settings.theme);

                // ADD TOOLTIP CONTENT 
                self.addContent(self, currentTarget, settings, $deferred).done($tooltip.finish().fadeIn('fast'));
            },

            verticalPosition: function verticalPosition(pageY, yOffset, position) {
                try {
                    var y,
                        windowYoffset = (pageY - $window.scrollTop()),
                        toolTipHeight = (yOffset + $tooltip.outerHeight());

                    if ((typeof position === 'string') && (position === 'top')) {
                        // SHOW AT THE TOP
                        if (windowYoffset <= toolTipHeight) {
                            y = (pageY + yOffset);
                            $tooltip.removeClass('bottom')[0].style.top = y + 'px';
                        } else {
                            y = pageY - $tooltip.outerHeight() - yOffset / 2;
                            $tooltip.addClass('bottom')[0].style.top = y + 'px';
                        }
                    } else {
                        // SHOW AT THE BOTTOM
                        if (toolTipHeight + windowYoffset <= $window.height()) {
                            y = (pageY + yOffset);
                            $tooltip.removeClass('bottom')[0].style.top = y + 'px';
                        } else {
                            y = pageY - $tooltip.outerHeight() - yOffset / 2;
                            $tooltip.addClass('bottom')[0].style.top = y + 'px';
                        }
                    }

                } catch (e) {
                    console.log('verticalPosition()', e.name, e.message);
                }

            },

            horizontalPosition: function horizontalPosition(pageX, xOffset, rightBoundary) {
                try {
                    var x, tipOffset,
                        $tip = $tooltip.find('.tip'),
                        windowXoffset = pageX + $tooltip.outerWidth(),
                        windowPercent = function windowPercent(x) {
                            return $window.outerWidth() * x / 100;
                        };

                    // FLIP THE TOOLTIP HORIZONTALLY BASED ON VIEWPORT
                    if ((typeof rightBoundary === 'number') && (windowXoffset <= windowPercent(rightBoundary))) {
                        tipOffset = parseInt($tip.css('left').split('px')[0], 10);
                        x = (pageX - xOffset);
                        x = ((!isNaN(tipOffset)) ? (x - tipOffset) : x);
                        $tooltip.removeClass('right')[0].style.left = x + 'px';
                    } else {
                        tipOffset = parseInt($tip.css('right').split('px')[0], 10);
                        x = (pageX - $tooltip.outerWidth() + xOffset);
                        x = ((!isNaN(tipOffset)) ? (x + tipOffset) : x);
                        $tooltip.addClass('right')[0].style.left = x + 'px';
                    }

                } catch (e) {
                    console.log('horizontalPosition()', e.name, e.message);
                }
            },

            positionTooltip: function positionTooltip(self, settings) {
                // ADJUST TOOLTIP VERTICAL POSITION
                self.verticalPosition(settings.pageY, settings.yOffset, settings.position);

                // ADJUST TOOLTIP HORIZONTAL POSITION
                self.horizontalPosition(settings.pageX, settings.xOffset, settings.rightBoundary);
            },

            addEventListeners: function addEventListeners(self, element, settings) {
                try {
                    var eventTypes = 'mouseenter.tooltip mousemove.tooltip mouseleave.tooltip touchleave.tooltip';

                    // BIND TOOLTIP FUNCTIONALITY TO ELEMENT
                    $(element).off('.tooltip').on(eventTypes, function eventHandler(event) {
                        var positionOptions = {
                            pageX: event.pageX,
                            pageY: event.pageY,
                            xOffset: settings.xOffset,
                            yOffset: settings.yOffset,
                            rightBoundary: settings.rightBoundary,
                            position: settings.position
                        };

                        switch (event.type) {
                        case 'mouseenter':
                            // IF EVENT TYPE IS MOUSEENTER SHOW TOOLTIP
                            self.showTooltip(self, event.currentTarget, {
                                contentAttr: settings.contentAttr,
                                contentSelector: settings.contentSelector,
                                html: settings.html,
                                position: settings.position,
                                theme: settings.theme
                            });
                            // SET TOOLTIP POSITION ON MOUSEENTER
                            self.positionTooltip(self, positionOptions);
                            break;
                        case 'mousemove':
                            // IF EVENT TYPE IS MOUSEMOVE ADJUST TOOLTIP POSITION
                            self.positionTooltip(self, positionOptions);
                            break;
                        case 'touchleave':
                            // IF EVENT TYPE IS TOUCHLEAVE HIDE TOOLTIP AFTER DELAY
                            window.setTimeout(self.hideTooltip(self, event.currentTarget, settings.contentSelector), settings.timeout);
                            break;
                        default:
                            // IF EVENT TYPE IS MOUSELEAVE HIDE TOOLTIP
                            self.hideTooltip(self, event.currentTarget, settings.contentSelector);
                        }

                    });

                } catch (e) {
                    console.log('addEventListeners()', e.name, e.message);
                }
            }
        };

    $.fn.tooltip = function (options) {
        module.init(this, options);
        return this;
    };

}(jQuery, window, document));