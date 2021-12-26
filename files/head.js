window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    // console.log('错误信息：', errorMessage)
    // console.log('出错文件：', scriptURI)
    // console.log('出错行号：', lineNumber)
    // console.log('出错列号：', columnNumber)
    // console.log('错误详情：', errorObj.toString())
    $.ajax({
        url: window.openUrl('index/reportJsError'),
        type: 'post',
        data: {
            'message': errorMessage,
            'file': scriptURI,
            'line': lineNumber,
            'column': columnNumber,
            'detal': errorObj.toString()
        }
    })
}
/**/
Array.prototype.getIndex = function(e) {
    for (var i = 0; i < this.length; i++) {
        if (e == this[i]) return i
    }
    return -1
}
window.SERV_TJU = (function() {
    var maxTry = 3
    var interval = 2000
    var tryCount = 0
    var checkToken = function(callback) {
        if (!$.cookie('td_token')) callback({ status: false })
        tryCount++
        $.ajax({
            url: openUrl('login/token'),
            dataType: 'jsonp',
            data: { time: new Date() },
            success: function(e) {
                callback(e)
            },
            error: function() {
                // 请求失败，再次请求
                if (maxTry < tryCount) callback({ status: false })
                window.setTimeout(function() {
                    checkToken(callback)
                }, interval)
            }
        })
    }

    var readyFuncs = []

    return {
        ready: function(readyFunc) {
            if (typeof readyFunc == 'function') readyFuncs.push(readyFunc)
            return this
        },
        lanuch: function() {
            checkToken(function(e) {
                if (e.status) {
                    if (readyFuncs.length > 0) {
                        for (var i = 0; i < readyFuncs.length; i++) {
                            readyFuncs[i](e.content)
                        }
                    }
                } else {
                    window.location.href = openUrl('login')
                }
            })
        }
    }
}())
function openUrl(path, params, root_path) {
    if (typeof root_path != 'undefined') var _url = root_path + '/' + path
    else var _url = _APP_URL_ROOT + '/' + path

    var _p = ''
    var _i = 0
    $.each(params, function(i, e) {
        if (_i == 0) {
            if (_HTTP_REWRITE == '1') {
                _p += '?'
            } else {
                _p += '&'
            }
        } else {
            _p += '&'
        }
        _p += i + '=' + e
        _i++
    })
    _url = _url + _p
    return _url
}
function getUrlParam(name, need_unescape, strict) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg) // 匹配目标参数
    if (r != null) return need_unescape ? unescape(r[2]) : r[2]
    else if (strict) return null // 返回参数值
    else return ''
}
function fnRemoveAndSync(removedText, idOfFieldA, idOfFieldB) {
    // 从一个A字段中删除某个内容，并根据其index删除B字段中对应index的值
    var $a = $('#' + idOfFieldA); $b = $('#' + idOfFieldB)
    if ($a.val() == '' || $b.val() == '') return false
    var _a = $a.val().split(',')
    var _b = $b.val().split(',')
    var i = _a.getIndex(removedText)
    if (i == -1) return false
    _a.splice(i, 1)
    _b.splice(i, 1)
    $a.val(_a.join(','))
    $b.val(_b.join(','))
    return true
}
(function() {
    // 为了解决non-passive错误
    if (typeof EventTarget !== 'undefined') {
        const func = EventTarget.prototype.addEventListener
        EventTarget.prototype.addEventListener = function(type, fn, capture) {
            this.func = func
            if (typeof capture !== 'boolean') {
                capture = capture || {}
                capture.passive = false
            }
            this.func(type, fn, capture)
        }
    }
}());
(function() {
    if (!_IS_MOBILE) {
        var lastTime = _SESSION_EXPIRE_TIME
        function clear() {
            lastTime = _SESSION_EXPIRE_TIME
        }
        var timeId = setInterval(() => {
            lastTime--
            if (lastTime <= 0) {
                clearInterval(timeId)
                location.href = openUrl('login')
            }
        }, 1000)
        window.addEventListener('keypress', function() {
            clear()
        })
        window.addEventListener('mousemove', function() {
            clear()
        })
        window.addEventListener('click', function() {
            clear()
        })
    }
})()
$(function() {
    if (((!!window.ActiveXObject || 'ActiveXObject' in window) || navigator.userAgent.indexOf('UCBrowser') > -1) && !$.cookie('broser_error')) {
        $.cookie('broser_error', true)
        alert('提示: 您在使用的浏览器内核版本可能导致浏览异常。\n' + '请安装Chrome(谷歌浏览器）、Firefox（火狐）浏览器')
    }
})
