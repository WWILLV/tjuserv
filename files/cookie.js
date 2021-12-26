(function () {
    if ($.cookie('gate')) {
        document.getElementById("greeting").innerText = $.cookie('gate');
        document.getElementById("tjunum").value = $.cookie('num');
        document.getElementById("tjuname").value = $.cookie('name');
        document.getElementById("tjuid").value = $.cookie('id');
    }
})()
function cw() {
    if (document.getElementById("tjuid").value == "0") {
        $.removeCookie('gate', { path: '/' });
        $.removeCookie('num', { path: '/' });
        $.removeCookie('name', { path: '/' });
        $.removeCookie('id', { path: '/' });
        alert("已清空cookie！");
    }
    else {
        function addcookie(a, b) {
            $.cookie(a, b, { expires: 30, path: '/' });
        }
        addcookie('gate', document.getElementById("greeting").innerText);
        addcookie('num', document.getElementById("tjunum").value);
        addcookie('name', document.getElementById("tjuname").value);
        addcookie('id', document.getElementById("tjuid").value);
        alert("已保存！");
    }
}
