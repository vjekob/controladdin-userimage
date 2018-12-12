(function ($) {
    var doc = window.top.document;
    var hasPic = false;

    function applyPicture(data, skipSend) {
        hasPic = true;
        $("body", doc).append("<style>.d365shell-c-user-account-avatar { background-image: url(" + data + ") !important; }</style>")
        skipSend || Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("SavePicture", [data]);
    }

    window.SendPicture = function (picture) {
        applyPicture(picture, true);
    }

    function showUI() {
        var elements = [];

        vjeko.com.loadHtml("ProfilePicture/Html/camera.html", function (content) {
            var e = doc.createElement("div");
            e.innerHTML = content;
            var first = doc.body.firstChild;
            for (var i = 0; i < e.childNodes.length; i++) {
                elements.push(e.childNodes[i]);
                doc.body.insertBefore(e.childNodes[i], first);
            };

            var video = doc.getElementById("vjeko-com-video");
            var overlay = doc.getElementById("vjeko-com-overlay");
            var canvas = doc.getElementById('vjeko-com-canvas');

            if (hasPic)
                video.classList.add("d365shell-c-user-account-avatar");

            function stopStream() {
                var stream = video.srcObject;
                var tracks = stream.getTracks();

                tracks.forEach(function (track) {
                    track.stop();
                });

                video.srcObject = null;
            }

            function removeUI() {
                stopStream();
                elements.forEach(function (element) {
                    element.parentNode.removeChild(element);
                });
            }

            overlay.addEventListener(
                "click",
                function () {
                    removeUI();
                });
            video.addEventListener(
                "click",
                function () {
                    var context = canvas.getContext('2d');
                    canvas.width = 400;
                    canvas.height = 400;
                    context.drawImage(video, 0, 0, 400, 400);
                    var data = canvas.toDataURL('image/png');
                    applyPicture(data);
                    removeUI();
                });

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: { width: { exact: 400 }, height: { exact: 400 } } })
                    .then(function (stream) {
                        video.srcObject = stream;
                        video.play();
                    });
            }
        });
    };

    $(document).ready(function () {
        setTimeout(function () {
            var menu = doc.querySelector("div.d365shell-c-user-account-menu-items");
            menu.style.width = "300px";

            var button = menu.querySelector("button");
            var details = menu.querySelector(".user-details");

            details.style.display = "flex";
            details.style.flexFlow = "column";
            details.style.justifyContent = "center";

            var newDiv = doc.createElement("div");
            newDiv.style.display = "flex";
            newDiv.style.padding = "4px";
            newDiv.innerHTML = "<div style=\"width: 56px !important; height: 56px !important\; margin: 8px;\" class=\"d365shell-c-user-account-avatar\"></div>";
            newDiv.addEventListener("click", showUI);
            newDiv.appendChild(details);
            menu.insertBefore(newDiv, button);
        }, 1000);
    });
})(jQuery);