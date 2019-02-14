; (function ($, window, document) {

    $.fn.extend({
        counter: function (step, dataTo) {
            var initValue = $(this).html();
            var num = isNaN(Number(initValue)) ? 0 : Number(initValue);
            step = (typeof step !== 'number' && isNaN(Number(step))) ? 1 : step;
            var timer = setInterval(function () {
                num += step;
                $(this).html(num);
                if (num >= dataTo) {
                    $(this).html(dataTo);
                    clearInterval(timer);
                }
            }.bind(this), 1000 / 60);
        }
    });

})(jQuery, window, document);