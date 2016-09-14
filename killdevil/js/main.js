var _gameBBList = [], _gameBBListIndex = 0, _gameOver = false, _gameStart = false, _gameTime, _gameTimeNum, _gameScore;
function obj_id(id){
    return document.getElementById(id);
}
if (!window.XMLHttpRequest) {
    window.XMLHttpRequest=function (){
        var xmlHttp = false;
        return new XMLHttpRequest();
        //return new ActiveXObject("Microsoft.XMLHTTP");
    }
}
//调用AJAX需要处理的页面(传输方式，执行页面及参数，提交方式,提交数据)
function ajax_call(transmission,linkurl,presented,val){
    var reFun = arguments[4] ? arguments[4] : "strings";  //回调函数
    var showID = arguments[5] ? arguments[5] : "";  //状态修改区域对像ID
    var xmlHttp=new XMLHttpRequest;
    //alert(reFun);
    //alert(typeof(reFun));
    if (typeof(reFun)=="function"){
        //transmission = true;
        xmlHttp.onreadystatechange = function(){
            /* 	0: Uninitialized
             1: Loading
             2: Loaded
             3: Interactive
             4: Finished */
            if(xmlHttp.readyState == 4)
            {
                try
                {
                    var ret = xmlHttp.responseText; //返回值
                    //alert(ret);
                    //alert(typeof(reFun));
                    reFun(ret, showID); //回访回调函数
                }
                catch(e)
                {
                    //alert(e.description);
                }
            }
        };
    }
    xmlHttp.open(presented, linkurl, transmission);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if(presented=="POST"){  //提交方式
        xmlHttp.send(val);
    }
    else{
        xmlHttp.send(val);
    }
    if(typeof(reFun)=="string"){
        if(xmlHttp.readyState == 4){
            //alert(xmlHttp.responseText);
            return xmlHttp.responseText;
        }
    }
}

var gamesScore = 0;

// 分享模块
(function ajax(){
    var imageUrl = "../images/sharelog.jpg",
        url = 'm.zdongpin.com?m=PublicTemplate&c=ApiPublic&a=hitDevilGame';
    // show loading
    var signRes = ajax_call(false,"index.php?m=games&c=visit&a=statis",'POST','kill_num=' + _gameScore);
    var signData = (new Function("return " + signRes))();

    var signInfo = signData.signPackage,
        wx_config = {
            debug: false,
            appId: signInfo.appId,
            timestamp: signInfo.timestamp,
            nonceStr: signInfo.nonceStr,
            signature: signInfo.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        };
    wx.config(wx_config);
    wx.ready(function(){
        // share to the circle of friends
        wx.onMenuShareTimeline({
            title: '我已经消灭了'+gamesScore+'敌人，come，一起来捍卫国土吧', // 分享标题
            link: url, // 分享链接
            imgUrl: imageUrl,
            success: function () {
                ajax_call(false,"index.php?m=games&c=visit&a=share",'POST','');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        // share to a specific friend
        wx.onMenuShareAppMessage({
            title: '保卫南海',
            desc: '我已经消灭了'+gamesScore+'敌人，come，一起来捍卫国土吧',
            link: url,
            imgUrl: imageUrl,
            success: function () {
                ajax_call(false,"index.php?m=games&c=visit&a=share",'POST','');
            },
            cancel: function () {

            }
        });
    });
})();

var shareurl = "http://le.wlxww.com/game.php?a=kaisuo";
var CNZZID = "";
var CNZZWebID = "";
var _czc = _czc || [];
//绑定siteid，请用您的siteid替换下方"XXXXXXXX"部分
_czc.push(["_setAccount", CNZZWebID]);
_czc.push(['_trackEvent', '游戏访问量', GameName, '浏览次数', '1', '7']);


var shareimgUrl = "../images/suotou.gif";

////初始化分享文案和配置
//dz({
//    debug: false,
//    appid: 'wxf97051ace549aa61',  ////公众号Appid
//    oauthurl: escape(window.location.href), ////当前页面完整URL
//    timestamp: '1414587457', ////生成签名的时间戳
//    nonceStr: 'Wm3WZYTPz0wzccnW', ////生成签名的随机串
//    title: '挑战最强大脑，尝试一下', // 分享标题
//    desc: '大家开锁，30秒能打开几个小锁', // 分享描述window.location='../index.html?ti='+Q.ti+'&fens='+Q.fens+'&gailv='+gailv;
//    link: shareurl, // 分享链接
//    imgUrl: shareimgUrl, // 分享图标
//    success: function () {////分享成功后执行的方法
//        _czc.push(['_trackEvent', '游戏', '分享', '分享游戏', '0', '6']);
//    }
//});

var isDesktop = navigator['userAgent'].match(/(ipad|iphone|ipod|android|windows phone)/i) ? false : true;
var fontunit = isDesktop ? 20 : ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) / 320) * 10;
document.write('<style type="text/css">' +
    'html,body {font-size:' + (fontunit < 30 ? fontunit : '30') + 'px;}' +
    (isDesktop ? '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position: absolute;}' :
        '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position:fixed;}@@media screen and (orientation:landscape) {#landscape {display: box; display: -webkit-box; display: -moz-box; display: -ms-flexbox;}}') +
    '</style>');




if (isDesktop)
    document.write('<div id="gameBody">');

var body, blockSize, GameLayer = [], GameLayerBG, touchArea = [], GameTimeLayer;
var transform, transitionDuration;

function init(argument) {

    showWelcomeLayer();
    body = document.getElementById('gameBody') || document.body;
    body.style.height = window.innerHeight + 'px';
    transform = typeof (body.style.webkitTransform) != 'undefined' ? 'webkitTransform' : (typeof (body.style.msTransform) != 'undefined' ? 'msTransform' : 'transform');
    transitionDuration = transform.replace(/ransform/g, 'ransitionDuration');

    GameTimeLayer = document.getElementById('GameTimeLayer');
    GameLayer.push(document.getElementById('GameLayer1'));
    GameLayer[0].children = GameLayer[0].querySelectorAll('div');
    GameLayer.push(document.getElementById('GameLayer2'));
    GameLayer[1].children = GameLayer[1].querySelectorAll('div');
    GameLayerBG = document.getElementById('GameLayerBG');
    if (GameLayerBG.ontouchstart === null) {
        GameLayerBG.ontouchstart = gameTapEvent;
    } else {
        GameLayerBG.onmousedown = gameTapEvent;
        document.getElementById('landscape-text').innerHTML = '点我开始玩耍';
        document.getElementById('landscape').onclick = winOpen;
    }
    gameInit();
    window.addEventListener('resize', refreshSize, false);

    var rtnMsg = "true";
    var btn = document.getElementById('ready-btn');
    btn.className = 'btn';
    //btn.innerHTML = ' 预备，开锁！'
    //btn.style.backgroundColor = '#F00';
    btn.onclick = function () {
        closeWelcomeLayer();
    };


    var bastshow = cookie('bast-show');
    if (bastshow == 1 || bastshow == 2) {
        cookie('bast-show', 3, 1);

        if (bastshow == 1) {
            var bast = cookie('bast-score');
            //document.getElementById('syspay').innerHTML = '打赏惊喜<br>赠送+10个锁头<br><br>你开启了' + bast + '个小锁头<br><br>分享炫耀吧';
            //document.title = '我开了' + bast + '个小锁头，不服来挑战！！！'
        } else if (bastshow == 2) {

            //document.getElementById('syspay').innerHTML = '打赏不成功<br><br>您没有得到奖励的锁头';

        }


        var btn = document.getElementById('ready-btn');
        //btn.className = 'btn';
        //btn.innerHTML = ' 继续开锁！'
        //btn.style.backgroundColor = '#F00';

        document.getElementById('divStart').innerHTML = '';
        document.getElementById('divStartTxt').innerHTML = '';

    }


}
function winOpen() {
    window.open(location.href + '?r=' + Math.random(), 'nWin', 'height=500,width=320,toolbar=no,menubar=no,scrollbars=no');
    var opened = window.open('about:blank', '_self'); opened.opener = null; opened.close();
}
var refreshSizeTime;
function refreshSize() {
    clearTimeout(refreshSizeTime);
    refreshSizeTime = setTimeout(_refreshSize, 200);
}
function _refreshSize() {
    countBlockSize();
    for (var i = 0; i < GameLayer.length; i++) {
        var box = GameLayer[i];
        for (var j = 0; j < box.children.length; j++) {
            var r = box.children[j],
                rstyle = r.style;
            rstyle.left = (j % 4) * blockSize + 'px';
            rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
            rstyle.width = blockSize + 'px';
            rstyle.height = blockSize + 'px';
        }
    }
    var f, a;
    if (GameLayer[0].y > GameLayer[1].y) {
        f = GameLayer[0];
        a = GameLayer[1];
    } else {
        f = GameLayer[1];
        a = GameLayer[0];
    }
    var y = ((_gameBBListIndex) % 10) * blockSize;
    f.y = y;
    f.style[transform] = 'translate3D(0,' + f.y + 'px,0)';

    a.y = -blockSize * Math.floor(f.children.length / 4) + y;
    a.style[transform] = 'translate3D(0,' + a.y + 'px,0)';

}
function countBlockSize() {
    blockSize = body.offsetWidth / 4;
    body.style.height = window.innerHeight + 'px';
    GameLayerBG.style.height = window.innerHeight + 'px';
    touchArea[0] = window.innerHeight - blockSize * 0;
    touchArea[1] = window.innerHeight - blockSize * 3;
}
function gameInit() {
    //createjs.Sound.registerSound( {src:"/static/game/kaisuo/err.mp3", id:"err"} );
    //createjs.Sound.registerSound( {src:"/static/game/kaisuo/end.mp3", id:"end"} );
    //createjs.Sound.registerSound( {src:"/static/game/kaisuo/tap.mp3", id:"tap"} );
    gameRestart();
}
function gameRestart() {
    _czc.push(['_trackEvent', '游戏', 'Restart', '游戏次数', '5', '3']);
    console.log('gameRestart');
    _gameBBList = [];
    _gameBBListIndex = 0;
    _gameScore = 0;
    _gameOver = false;
    _gameStart = false;
    _gameTimeNum = 3000;
    GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
    countBlockSize();
    refreshGameLayer(GameLayer[0]);
    refreshGameLayer(GameLayer[1], 1);
}
function gameStart() {
    _czc.push(['_trackEvent', '游戏', 'Start', '游戏次数', '5', '4']);
    _gameStart = true;
    _gameTime = setInterval(gameTime, 10);
}
function gameOver() {
    _gameOver = true;
    clearInterval(_gameTime);
    setTimeout(function () {
        GameLayerBG.className = '';
        showGameScoreLayer();
    }, 1500);
}
function gameTime() {
    _gameTimeNum--;
    if (_gameTimeNum <= 0) {
        GameTimeLayer.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;时间到！';
        gameOver();
        GameLayerBG.className += ' flash';
        createjs.Sound.play("end");
    } else {
        GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
    }
}
function creatTimeText(n) {
    var text = (100000 + n + '').substr(-4, 4);
    text = '&nbsp;&nbsp;' + text.substr(0, 2) + "'" + text.substr(2) + "''"
    return text;
}
var _ttreg = / t{1,2}(\d+)/, _clearttClsReg = / t{1,2}\d+| bad/;
function refreshGameLayer(box, loop, offset) {
    var i = Math.floor(Math.random() * 1000) % 4 + (loop ? 0 : 4);
    for (var j = 0; j < box.children.length; j++) {
        var r = box.children[j],
            rstyle = r.style;
        rstyle.left = (j % 4) * blockSize + 'px';
        rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
        rstyle.width = blockSize + 'px';
        rstyle.height = blockSize + 'px';
        r.className = r.className.replace(_clearttClsReg, '');
        if (i == j) {
            _gameBBList.push({ cell: i % 4, id: r.id });
            r.className += ' t' + (Math.floor(Math.random() * 1000) % 5 + 1);
            r.notEmpty = true;
            i = (Math.floor(j / 4) + 1) * 4 + Math.floor(Math.random() * 1000) % 4;
        } else {
            r.notEmpty = false;
        }
    }
    if (loop) {
        box.style.webkitTransitionDuration = '0ms';
        box.style.display = 'none';
        box.y = -blockSize * (Math.floor(box.children.length / 4) + (offset || 0)) * loop;
        setTimeout(function () {
            box.style[transform] = 'translate3D(0,' + box.y + 'px,0)';
            setTimeout(function () {
                box.style.display = 'block';
            }, 100);
        }, 200);
    } else {
        box.y = 0;
        box.style[transform] = 'translate3D(0,' + box.y + 'px,0)';
    }
    box.style[transitionDuration] = '150ms';
}
function gameLayerMoveNextRow() {
    for (var i = 0; i < GameLayer.length; i++) {
        var g = GameLayer[i];
        g.y += blockSize;
        if (g.y > blockSize * (Math.floor(g.children.length / 4))) {
            refreshGameLayer(g, 1, -1);
        } else {
            g.style[transform] = 'translate3D(0,' + g.y + 'px,0)';
        }
    }
}
function gameTapEvent(e) {
    if (_gameOver) {
        return false;
    }
    var tar = e.target;
    var y = e.clientY || e.targetTouches[0].clientY,
        x = (e.clientX || e.targetTouches[0].clientX) - body.offsetLeft,
        p = _gameBBList[_gameBBListIndex];
    if (y > touchArea[0] || y < touchArea[1]) {
        return false;
    }
    if ((p.id == tar.id && tar.notEmpty) || (p.cell == 0 && x < blockSize) || (p.cell == 1 && x > blockSize && x < 2 * blockSize) || (p.cell == 2 && x > 2 * blockSize && x < 3 * blockSize) || (p.cell == 3 && x > 3 * blockSize)) {
        if (!_gameStart) {
            gameStart();
        }
        createjs.Sound.play("tap");
        tar = document.getElementById(p.id);
        tar.className = tar.className.replace(_ttreg, ' tt$1');
        _gameBBListIndex++;
        _gameScore++;
        gameLayerMoveNextRow();
    } else if (_gameStart && !tar.notEmpty) {
        createjs.Sound.play("err");
        gameOver();
        tar.className += ' bad';
    }
    return false;
}
function createGameLayer() {
    var html = '<div id="GameLayerBG">';
    for (var i = 1; i <= 2; i++) {
        var id = 'GameLayer' + i;
        html += '<div id="' + id + '" class="GameLayer">';
        for (var j = 0; j < 10; j++) {
            for (var k = 0; k < 4; k++) {
                html += '<div id="' + id + '-' + (k + j * 4) + '" num="' + (k + j * 4) + '" class="block' + (k ? ' bl' : '') + '"></div>';
            }
        }
        html += '</div>';
    }
    html += '</div>';

    html += '<div id="GameTimeLayer"></div>';

    return html;
}
function closeWelcomeLayer() {
    var l = document.getElementById('welcome');
    l.style.display = 'none';
}
function showWelcomeLayer() {



    var l = document.getElementById('welcome');
    l.style.display = 'block';
}
function showGameScoreLayer() {
    //alert(_gameScore);
    //增加用户微币
    //var addCoins = Math.ceil(_gameScore / 5);
    //$.get("" + addCoins + "&user=",
    //	function (data, status) {

    //		alert(data);
    //		if(data >= 3){
    //			document.getElementById('GameScoreLayer-btn').style.display = 'none';
    //			document.getElementById('GameScoreLayer-msg').style.display = 'block';
    //		}
    //});
    var l = document.getElementById('GameScoreLayer');

    var c = document.getElementById(_gameBBList[_gameBBListIndex - 1].id).className.match(_ttreg)[1];
    //l.className = l.className.replace(/bgc\d/, 'bgc' + c);

    document.getElementById('GameScoreLayer-text').innerHTML = shareText(_gameScore);
    //document.getElementById('GameScoreLayer-score').innerHTML = '得分&nbsp;&nbsp;'+_gameScore;
    var bast = cookie('bast-score');
    if (!bast || _gameScore > bast) {
        bast = _gameScore;
        cookie('bast-score', bast, 100);
    }

    document.getElementById('GameScoreLayer-bast').innerHTML = '<p>天啦！你击杀了'+_gameScore+'个鬼子！</p><p><span>找冻品网</span>为你点个赞！</p>';
    l.style.display = 'block';
    //window.shareData.tTitle = '我开了'+_gameScore+'个小锁头，不服来挑战！！！'
    //document.title = '我开了' + _gameScore + '个小锁头，不服来挑战！！！'

    ajax_call(false,"index.php?m=games&c=visit&a=statis",'POST','kill_num=' + _gameScore);

    //dzt({
    //    title: '我开了' + _gameScore + '个小锁头，不服来挑战！！！', // 分享标题
    //    desc: '我开了' + _gameScore + '个小锁头，不服来挑战！！！', // 分享描述window.location='../index.html?ti='+Q.ti+'&fens='+Q.fens+'&gailv='+gailv;
    //    link: shareurl, // 分享链接
    //    imgUrl: shareimgUrl, // 分享图标
    //    success: function () {////分享成功后执行的方法
    //        _czc.push(['_trackEvent', '游戏', '分享', '分享战绩', _gameScore, '5']);
    //    }
    //});



}
function hideGameScoreLayer() {
    var l = document.getElementById('GameScoreLayer');
    l.style.display = 'none';
}
function replayBtn() {
    gameRestart();
    hideGameScoreLayer();
    //hideTOP();
}
function PayMoney() {
    //_czc.push(['_trackEvent', '游戏', '打赏', '打赏按钮', '5', '1']);
    //            var name = prompt("打赏后，系统将额外赠送和打赏金额相同的分数追加到您的最佳战绩中\r\n请输入打赏金额：", "10"); //将输入的内容赋给变量 name ，
    //            //这里需要注意的是，prompt有两个参数，前面是提示的话，后面是当对话框出来后，在对话框里的默认值
    //            if (name)//如果返回的有内容
    //            {

    window.location.href ="http://testpay.shougan.com.cn/example/payauth.aspx?total_fee=20&type=6&ref=" + escape("http://" + window.location.host + "/6_ks/top.htm");
    //" + name;
    //            }
}
function viewTOP() {
    _czc.push(['_trackEvent', '游戏', '战绩', '查看战绩', '5', '2']);
    //alert('近期开放，提前玩游戏储存战绩，可先得万元红包，请持续关注。');
    hideGameScoreLayer();
    document.getElementById('txtScore').innerHTML = "系统计算中...";
    //$.ajax({
    //    cache: false,
    //    url: "/games/kaisuo/GetGameInfo",
    //    type: 'POST',
    //    dataType: 'json',
    //    data: {
    //        openid: '@Model.Openid'
    //    },
    //    success: function (result) {
    //	document.getElementById('txtScore').innerHTML = "";
    //          result.forEach(function(e){
    //                document.getElementById('txtScore').innerHTML += (e+"<br>");
    //             })
    //    },
    //    error: function (xhr, status) {
    //        alert(xhr);
    //    }
    //});

    showTOP();
}
function showTOP() {

    var l = document.getElementById('showtopLayer');
    l.style.display = 'block';


}
function hideTOP() {

    //var l = document.getElementById('showtopLayer');
    //l.style.display = 'none';

}

function backBtn() {
    gameRestart();
    hideGameScoreLayer();
    showWelcomeLayer();
}
var mebtnopenurl = '';
function shareText(score) {
    var coins = Math.ceil(score / 5);

    return '<span>X</span>' + score ;

}

function toStr(obj) {
    if (typeof obj == 'object') {
        return JSON.stringify(obj);
    } else {
        return obj;
    }
    return '';
}
function cookie(name, value, time) {
    if (name) {
        if (value) {
            if (time) {
                var date = new Date();
                date.setTime(date.getTime() + 864e5 * time), time = date.toGMTString();
            }
            return document.cookie = name + "=" + escape(toStr(value)) + (time ? "; expires=" + time + (arguments[3] ? "; domain=" + arguments[3] + (arguments[4] ? "; path=" + arguments[4] + (arguments[5] ? "; secure" : "") : "") : "") : ""), !0;
        }
        return value = document.cookie.match("(?:^|;)\\s*" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^;]*)"), value = value && "string" == typeof value[1] ? unescape(value[1]) : !1, (/^(\{|\[).+\}|\]$/.test(value) || /^[0-9]+$/g.test(value)) && eval("value=" + value), value;
    }
    var data = {};
    value = document.cookie.replace(/\s/g, "").split(";");
    for (var i = 0; value.length > i; i++) name = value[i].split("="), name[1] && (data[name[0]] = unescape(name[1]));
    return data;
}
document.write(createGameLayer());

function share() {
    document.getElementById('share-wx').style.display = 'block';
    document.getElementById('share-wx').onclick = function () {
        this.style.display = 'none';
    };
}