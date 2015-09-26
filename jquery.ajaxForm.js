(function ($) {
    'use strict';
    var getFormData = function (element) {
        var $form = $(element),
            tag = element.tagName,
            namespace = '.ajaxForm',
            event;

        if (tag === 'FORM') {
            event = 'submit';
        } else {
            event = (tag === 'SELECT') ? 'change' : 'click';
            $form = $form.closest('form');
        }

        event += namespace;

        return {
            event: event,
            namespace: namespace,
            getOptions: function () {
                var enctype = $form.prop('enctype') || 'application/x-www-form-urlencoded',
                    charset = $form.prop('accept-charset') || 'UTF-8';
                return {
                    contentType: enctype + '; charset=' + charset,
                    method: $form.prop('method') || 'GET',
                    url: $form.prop('action') || '',
                    data: $form.serialize() || ''
                };
            }
        };
    };

    $.fn.ajaxForm = function (options) {
        return this.each(function () {
            var form = getFormData(this);
            $(this).off(form.namespace).on(form.event, function (e) {
                e.preventDefault();
                var settings = $.extend(form.getOptions(), options);
                $.ajax(settings);
            });
        });
    };

}(jQuery));