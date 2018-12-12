(function ($) {
    var currentPic = null;
    var doc = window.top.document;
    var userIcon = doc.querySelector("div.userimage-clip > img.userimage");

    function applyPicture(data, skipSend) {
        userIcon.src = data;
        userIcon.width = 32;
        userIcon.height = 32;
        currentPic = data;
        skipSend || Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("SavePicture", [data]);
    }

    window.SendPicture = function(picture) {
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

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "childList") {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.tagName === "DIV" && node.classList.contains("current-user-ctxmenu-container")) {
                        node.querySelector("div.userimage-clip")
                            .addEventListener("click", showUI);
                        if (currentPic) {
                            var pic = node.querySelector("img.user-info-image");
                            pic.src = currentPic;
                            pic.width = 56;
                            pic.height = 56;
                        }
                    }
                }
            }
        });
    });
    observer.observe(
        doc.body,
        {
            childList: true
        });
})(jQuery);