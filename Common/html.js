(function ($) {
    window.vjeko = {
        com: {
            loadHtml: function (url, callback) {
                var url = Microsoft.Dynamics.NAV.GetImageResource(url);
                $.get(url, function (data) {
                    callback(data);
                });
            },
            loadControlHtml: function (url, callback) {
                this.loadHtml(url, function (data) {
                    document.getElementById("controlAddIn").innerHTML = data;
                    callback();
                });
            }
        }
    };
})(jQuery);
