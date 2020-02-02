
$(document).ready(function () {
    //スクロール禁止
    $(window).on('touchmove.noScroll', function (e) {
        e.preventDefault();
    });

    // var w = window.innerWidth;
    // var h = window.innerHeight;
    // var size = 0;
    // if (w > h) {
    //     size = h;
    // } else {
    //     size = w;
    // }
    // $("#frame").width(size);
    // $("#frame").height(size);

    closeAd();
});

$(window).resize(function () {
    // console.log("resize");
    // var width = $("#ad-top").width();
    // var height = $("#ad-top").height();
    // console.log(width - height);
    // $("#ad-top").css("left", ($(window).width() - width) / 2 + "px");
});


function closeAd() {
    $("#ad-top").hide();
    $("#ad-bottom").css("margin-top", 0 + "px");
};
function showAd() {
    console.log("showad");
    $("#ad-top").show();
    var margin = $("#frame").height();
    $("#ad-top").css("margin-top", -margin + "px");
    $("#ad-bottom").css("margin-top", margin - $("#ad-top").height() + "px");
};

function showAdGameOver() {
    console.log("showad");
    $("#ad-top", parent.document).show();
    var margin = $("#frame", parent.document).height();
    $("#ad-top", parent.document).css("margin-top", -margin + "px");
    $("#ad-bottom", parent.document).css("margin-top", margin - $("#ad-top", parent.document).height() + "px");


};