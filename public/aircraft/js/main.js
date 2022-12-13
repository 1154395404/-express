const $gameArea = $('.gameArea');
const $playGame = $('.playGame');
const $pauseGame = $('.pauseGame');
const $airplane = $('.airplane');
const $stopTimeWrap = $('.stopTimeWrap');
const $score = $('.score');
const $replacedAudio = $('.replacedAudio');
const $bgAudio = $('.bgAudio');
const $bulletAudio = $('.bulletAudio');
const $explosionAudio = $('.explosionAudio');
const $chongciAudio = $('.chongci');
const $bg = $('.bg');
const areaWidth = $gameArea.clientWidth;
const areaHeight = $gameArea.clientHeight;
let isRan = false;
let score = 0;


$('.start .touchStrat').onclick = function () {
    fadeOut($('.start'), 1);
    $bgAudio.play();
    audioTip();
}

function audioTip() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // if (isAndroid) {
    //     alert("安卓机！")
    // }
    if (isIOS) {
        alert("检测到 您为 iPhone 用户 游戏音频可能无法正常播放！")
    }


}


function DrawScore(scoreArr) {
    const NumClassName = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    let index = 0;
    const scale = [0.8, 0.6, 0.4];
    const $rankShow = $('.rankShow');
    let $rankShowChild = $All('.rankShow .row');

    console.log($rankShowChild);
    $rankShowChild.forEach(e => {
        e.remove();
    })
    // console.log(children)
    // const len=$rankShow.childElementCount;
    // for (let i = 0; i < len; i++) {
    //     children[i].remove();
    // }


    scoreArr.forEach((e, i) => {
        if (e === 0) return;
        let div = createElement($('.rankShow'), 'row', 'div', {
            margin: '5px 0'
        });

        e += '';
        e.split('').forEach(num => {
            let s = createElement(div, 'number', 'div');
            s.classList.add(NumClassName[num]);
            addStyle(s, {
                // transform: `scale(${scale[index]})`
                zoom: scale[index]
            })
        })
        index++;

    })


}

DrawScore(historyScore);

function backGroundTransform() {
    //img_bg_level_2
    const random = getRandomInteger(1, 5);
    $bg.children[0].src = 'img/bg/img_bg_level_' + random + '.jpg';
    $bg.children[1].src = 'img/bg/img_bg_level_' + random + '.jpg';

}

function backGroundMove(time = '6s') {

    $bg.style.animationDuration = time;
    $bg.classList.add('bgMove');
}

function backGroundStop() {
    $bg.style.animationPlayState = 'paused';
}

//重玩
function play() {
    //TODO 把血量 等级置位 0

    rank=0;
    $('.myAirBleed .progress').setAttribute('data-bleed', 100 + '');
    $('.myAirBleed .progress').removeAttribute('style')
    $('.myGrand  .grandProgress ').removeAttribute('style')
    $('.myAirBleed .progressDirect').innerText='100%';
    // addStyle($('.progressTip .innerProgress'), {
    //     width: '0%'
    // })
    // isRan = true;//代表已经运行过游戏了
    eShow($airplane);


    $airplane.classList.add('slide-in-bottom');
    eHide($playGame);
    backGroundMove();

    $bgAudio.src = 'audio/attackBg.mp3';
    $bgAudio.play();
    newPlayAudio('audio/readyGo.ogg', 0.5);
    fadeOut($('.rankShow'), 1);
    fadeOut($('.bgLogo'), 1);
    fadeOut($('.logo'), 1);
    backGroundTransform();
    setTimeout(() => {
        // eShow($('.myAirBleed'));
        // eShow($('.myGrand'));
        // eShow($('.scoreWrap'));
        checkColisionInterval();
        fadeIn($('.myAirBleed'), 0.5);
        fadeIn($('.myGrand'), 0.5);
        fadeIn($('.scoreWrap'), 0.5);
        Drag($airplane);
        createEnemyTimeControl = false; //启动及关闭按钮
        myAirTimeControl = false; //启动及关闭按钮
        createEnemyTimeInfinite();
        myAirTimeInfinite();
        $airplane.classList.remove('slide-in-bottom');
    }, 2000);

}

//继续玩
function continueGame() {
    $bg.style.animationPlayState = 'running';
    $bgAudio.play();

}

function lose() {
    createEnemyTimeControl = true; //启动及关闭按钮
    myAirTimeControl = true; //启动及关闭按钮
    newPlayAudio('audio/jieshule.mp3', 0.8);
    setTimeout(() => {
        $bgAudio.src = 'audio/startBg.ogg';
        $bgAudio.play();
        $bg.classList.remove('bgMove');
        // eHide($playGame);
        fadeIn($('.playGame'), 1);
        fadeIn($('.rankShow'), 1);
        fadeIn($('.bgLogo'), 1);
        fadeIn($('.logo'), 1);
        fadeOut($('.myAirBleed'), 0.5);
        fadeOut($('.myGrand'), 0.5);
        fadeOut($('.scoreWrap'), 0.5);
    }, 2200);
    clearInterval(checkColisionTimer);

    $All('.enemyAir').forEach((e) => {
        eliminateEnemyAir(e);
    })
    $All('.prop').forEach((e) => {
        e.remove();
    })
    for (let i = 0; i < historyScore.length; i++) {
        if (score > historyScore[i]) {
            historyScore[i] = score;
            setLocal('score', historyScore);
            break;
        }
    }
    DrawScore(historyScore);


    let index = 1;
    const t = getTop($airplane);
    const l = getLeft($airplane);
    eHide($airplane);
    for (let i = 0; i < 10; i++) {
        setTimeout(function () {
            enemyExplosion(t + getRandomInteger(-40, 40), l + getRandomInteger(-40, 40));
        }, 150 * i);
    }


}

//暂停
function pause() {
    // eHide($pauseGame);
    eShow($playGame);
    backGroundStop();
    $playGame.querySelector('p').innerText = '继续游戏';
    $bgAudio.pause();
}

function playAndContinue() {

    // eHide($playGame);
    // // eShow($pauseGame);
    // if (isRan)
    //     continueGame();
    // else
    //     play();

    //TODO 制作完后把函数体传入回调函数里面
    stopTime(function () {
        play()
    });
}

function stopTime(callBack) {
    let img = $stopTimeWrap.children[0];
    let time = 3;
    img.src = 'img/stopTime/' + time + '.png';
    $replacedAudio.src = 'audio/stopTime.mp3';
    $replacedAudio.play();
    let timer = setInterval(function () {
        img.src = 'img/stopTime/' + --time + '.png';
        $replacedAudio.play();
        // console.log('sss');
        if (!time) {
            clearInterval(timer);
            callBack();
        }
    }, 1000);
}


$playGame.addEventListener('click', play);
$pauseGame.addEventListener('click', pause);


function bulletEmit(parent, offset, direction, config) {
    //TODO 子 弹 发 射

    const parentDisplay = getComputedStyle(parent, null).getPropertyValue('display');
    if (parentDisplay === 'none') return;
    direction = direction === 'up' ? 1 : -1;//方向
    const className = direction === 1 ? 'myBullet' : 'enemyBullet';
    const halfParentWidth = parent.offsetLeft + parent.clientWidth / 2;//飞机距离右边的px
    const halfParentHeight = parent.offsetTop + parent.clientHeight / 2;//飞机距离上边的px
    const parentOffsetBottom = areaHeight - halfParentHeight + 200;//飞机距离下边的距离 +200
    const topMove = direction === 1 ? -parentOffsetBottom : areaHeight + halfParentHeight + 200;
    //这里是奇偶转换
    let num = config.bullet.length;
    let index = 0;
    let i = num % 2 ? 1 : 2;
    num = num % 2 ? num : num + 1;
    // num++;
    for (i; i <= num; i++) {
        let $bullet = createElement($gameArea, 'bullet', 'img', {
            width: config.bullet[index].width + 'px',
            transform: `translateX(${-config.bullet[index].width / 2}px) rotate(${direction === 1 ? 0 : 180}deg)`,
            transition: `${config.speed}s  ease-in top`
        });
        $bullet.src = config.bullet[index++].src;
        $bullet.classList.add(className);
        setTimeout(function () {
            $bullet.remove();
        }, 2000);
        if (i % 2) {
            //         子弹top= 飞机top   -             子弹高度的一半   +       高度偏移
            $bullet.style.top = halfParentHeight - ($bullet.clientHeight / 2) + Math.floor(i / 2) * direction * offset / 2 + 'px';
            // console.log('j', Math.floor(i / 2));
            $bullet.style.left = halfParentWidth + offset * Math.floor(i / 2) + 'px';
        } else {
            $bullet.style.top = halfParentHeight - ($bullet.clientHeight / 2) + Math.floor(i / 2) * direction * offset / 2 + 'px';
            // console.log('ou',i / 2);
            $bullet.style.left = halfParentWidth + -offset * (i / 2) + 'px';
        }

        asyncFun(() => {
            addStyle($bullet, {top: topMove - offset * (i / 2) + 'px'})
        });
    }
}


function createEnemyAirPlane(rank, myAirRank) {
    // rank 1~4
    const AirSrc = enemyAirSrc[getRandomInteger(0, 2)] + '/' + rank + '.png';
    let width = 0;
    const baseWidth = 80;
    // const frequent = 800 - rank * 100;
    const frequent = 1800 - myAirRank * 100;

    switch (rank) {
        case 1:
            width = baseWidth;
            break;
        case 2:
            width = baseWidth + 10;
            break;
        case 3:
            width = baseWidth + 20;
            break;
        case 4:
            width = baseWidth + 30;
            break;
    }

    let air = createElement($gameArea, 'enemyAir', 'img', {
        left: getRandomInteger(0, areaWidth - width) + 'px',
        animationDuration: -rank + 8 + 's',
        width: width + 'px',
    })
    air.src = AirSrc;
    air.rank = rank;
    air.setAttribute('bleed', enemyAirRank[rank - 1].bleed);
    let timer = setInterval(function () {
        bulletEmit(air, 10, 'down', enemyAirRank[rank - 1])
    }, frequent);
    air.timer = timer;
    setTimeout(function () {
        air.remove();
        clearInterval(timer);
    }, 10000);

}


function randomCreatePlane(airRank) {
    let num = getRandomInteger(1, parseInt(airRank / 4));
    return num > 4 ? 4 : num;
}

function playAudio(element, src, vol = 1) {
    element.src = src
    //'audio/dang.mp3';
    element.volume = vol
    //0.05;
    element.play();
}

/**
 * *********** t e s t *************
 * */

//控制 创建敌机 频率

function createEnemyTimeInfinite() {
    if (createEnemyTimeControl) return;
    createEnemyAirPlane(randomCreatePlane(rank), rank);
    setTimeout(createEnemyTimeInfinite, createEnemyFrequent); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
}


function myAirTimeInfinite() {
    if (myAirTimeControl) return;
    newPlayAudio('audio/dang.mp3', 0.1)
    bulletEmit($airplane, 20, 'up', myAirRank[rank])

    // playAudio($bulletAudio, 'audio/dang.mp3', 0.08);
    // bulletEmit($airplane, 20, 'down', myAirRank[rank])
    setTimeout(myAirTimeInfinite, myBulletFrequent); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
}


/**
 * ************** t e s t   e n d*****************
 * */
function asyncFun(callback) {
    setTimeout(() => {
        callback();
    }, 10);
}


/**这里 检测 碰撞 循环*/

let $enemyBullet = null;
let $myBullet = null;
let $enemyAir = null;
let $prop = null;
let checkColisionTimer = null

function checkColisionInterval() {
    checkColisionTimer = setInterval(() => {
        $myBullet = $All('.myBullet');
        $enemyBullet = $All('.enemyBullet');
        $enemyAir = $All('.enemyAir');
        $prop = $All('.prop');
        //我方子弹 与 敌机
        $myBullet.forEach((myBullet) => {
            $enemyAir.forEach(enemyAir => {
                collideCheck(myBullet, enemyAir, myBulletAndEnemy);
            })
        })
        //敌方方子弹 与 我方
        $enemyBullet.forEach(($enemyBullet) => {
            collideCheck($enemyBullet, $airplane, enemyBulletAndMy);
        })
        //敌方飞机 与 我方
        $enemyAir.forEach(($enemyAir) => {
            collideCheck($enemyAir, $airplane, enemyAndMy);
        })
        //道具与我方
        $prop.forEach((prop) => {
            collideCheck(prop, $airplane, propAndMy);
        })
    }, 10);
}


//我方子弹 与 敌机
function myBulletAndEnemy(myBullet, enemyAir) {
    // console.log(1);
    // air.setAttribute('bleed', enemyAirRank[rank - 1].bleed);
    let enemyBleed = enemyAir.getAttribute('bleed') - 0;
    eHide(myBullet);//隐藏击中的子弹


    if (enemyBleed <= 0) {
        eliminateEnemyAir(enemyAir)
        // console.log('ddd');
    } else {
        enemyAir.setAttribute('bleed', --enemyBleed);
    }

}

//敌方方子弹 与 我方
function enemyBulletAndMy(enemyBullet, myAir) {

    let rank = enemyBullet.src.slice(-5).slice(0, 1) - 0;
    enemyBullet.remove();
    if (!enableDrop) return;
    bleedChange(-rank);
    // throttleBleedChange([-20]);
}

//敌方飞机 与 我方
let throttleBleedChange = throttle(bleedChange, 50);
let throttleNewPlayAudio = throttle(newPlayAudio, 50);

let enemyAndMyTime = new Date().getTime();

function enemyAndMy(enemyAir, myAir) {
    let time = new Date().getTime();
    if (time - enemyAndMyTime < 50)
        return;
    else
        enemyAndMyTime = time
    // console.log(enemyAir,myAir,params)
    eliminateEnemyAir(enemyAir);
    if (!enableDrop) return;
    throttleBleedChange([-20]);
    // throttleNewPlayAudio(['audio/xujinhuan.mp3', 0.8]);
    newPlayAudio('audio/xujinhuan.mp3', 0.8)


    // asyncFun(()=>{bleedChange(-20);});
    // throttle
    // bleedChange(-20)
}

function newPlayAudio(src, vol) {
    //永远新建 audio 标签;
    let audio = createElement($gameArea, 'audio', 'audio', {})
    playAudio(audio, src, vol);
    audio.onended = function () {
        this.remove();
    };

}

//propAndMy 道具与我方
function propAndMy(prop, $airplane) {
    let token = prop.token;
    prop.remove();
    // console.log(token);
    switch (token) {
        case 0:
            propHeart();
            break;
        case 1:
            propUpgrade();
            break;
        case 2:
            propMax();
            break;
    }
}

function eliminateEnemyAir(enemyAir) {
    score += enemyAir.rank;
    $score.innerText = score;
    enemyExplosion(getTop(enemyAir), getLeft(enemyAir));
    //道具下落
    if (getRandomInteger(enemyAir.rank,8)>3){
        dropProp(getTop(enemyAir), getLeft(enemyAir));
    }

    clearInterval(enemyAir.timer);
    asyncFun(() => {
        enemyAir.remove();
    });

}

function propHeart() {
    bleedChange(20);
    dropTip($airplane, '恢复了');
    playAudio($replacedAudio, 'audio/heart.mp3', 0.5);
}

function propUpgrade() {
    if (!enableDrop)//如果是无敌模式 就不能升级
        return;
    dropTip($airplane, '升级了');
    playAudio($replacedAudio, 'audio/upgrade.mp3', 0.5);
    rank = rank >= myAirRank.length - 2 ? myAirRank.length - 2 : ++rank;
    myBulletFrequent = constMyBulletFrequent - rank * 40;
    createEnemyFrequent = constcreateEnemyFrequent - rank * 20;

    addStyle($('.grandProgress'), {
        width: rank / (myAirRank.length - 2) * 100 + '%'
    })


    // console.log(rank);

}


let MaxPropTime = new Date().getTime();
let propMaxTimer = null;
let isFirstMaxProp = true;

function propMax() {
    //节流

    const wudiSecond = 10;
    let time = new Date().getTime();
    if (time - MaxPropTime < wudiSecond * 1000 && !isFirstMaxProp)
        return;
    else
        MaxPropTime = time
    isFirstMaxProp = false;
    playAudio($replacedAudio, 'audio/wudi.mp3', 0.8);
    dropTip($airplane, '无敌模式');
    const tempRank = rank;
    const tempMyBulletFrequent = myBulletFrequent;
    const tempCreateEnemyFrequent = createEnemyFrequent;
    const $outer = $('.progressTip');
    let $inner = $('.innerProgress');
    eShow($outer);
    clearInterval(propMaxTimer);
    playAudio($chongciAudio, 'audio/bgm_cunshiqujinbi.ogg', 1)
    $bgAudio.pause();
    $outer.removeChild($inner);
    backGroundTransform();
    // $inner.style.transitionDuration = wudiSecond + 's';
    $inner = createElement($outer, 'innerProgress', 'div', {
        width: '100%',
        transitionDuration: wudiSecond + 's'
    })

    asyncFun(() => {
        $inner.style.width = '0%'
    })
    // console.log(rank, myBulletFrequent, createEnemyFrequent)
    enableDrop = false;
    rank = myAirRank.length - 1;
    myBulletFrequent = 100;
    createEnemyFrequent = 100;

    backGroundMove('2s');
    propMaxTimer = setTimeout(() => {
        $All('.enemyAir').forEach((e) => {
            eliminateEnemyAir(e);
        })
        rank = tempRank;
        myBulletFrequent = tempMyBulletFrequent;
        createEnemyFrequent = tempCreateEnemyFrequent;
        eHide($outer);

        backGroundMove('6s');
        $bgAudio.play();
        setTimeout(() => {
            enableDrop = true;
        }, 2000);


    }, wudiSecond * 1000)

    // <div className="progressTip f-r">
    //     <div className="innerProgress ">
    //     </div>
    //     <span className="progressDirect">无敌时间</span>
    // </div>

}


function bleedChange(num) {
    const baseBleed = 100;
    const $progress = $('.progress');
    const $progressDirect = $('.progressDirect');
    let bleed = $progress.getAttribute('data-bleed') - 0;
    bleed += num;
    // console.log(bleed);
    $progress.setAttribute('data-bleed', bleed + '');
    addStyle($progress, {
        width: (bleed / baseBleed) * 100 + '%'
    })

    $progressDirect.innerText = parseInt((bleed / baseBleed) * 100) + '%';
    if (bleed > baseBleed) {
        addStyle($progress, {
            width: 100 + '%'
        })
        $progressDirect.innerText = 100 + '%';
        $progress.setAttribute('data-bleed', 100 + '');
        return;
    } else if (bleed <= 0) {
        //游戏失败
        addStyle($progress, {
            width: 0 + '%'
        })
        $progressDirect.innerText = 0 + '%';
        $progress.setAttribute('data-bleed', 0 + '');
        lose();
    }
    // console.log($progress.getAttribute('data-bleed'));
}


function enemyExplosion(top, left) {
    if (top === 0 && left === 0) return;
    let explosionDom = createElement($gameArea, 'explosion', 'div', {
        left: left + 'px',
        top: top + 'px'
    });
    fairyImgAnimation(explosionDom, 128, 128, 4, 5, 50);
    throttleNewPlayAudio(['audio/baozha.ogg', 0.8]);
    // newPlayAudio('audio/baozha.ogg', 0.8)
    // playAudio($explosionAudio, 'audio/baozha.ogg', 0.8);
    // $explosionAudio.src= 'audio/baozha.ogg';
    // $explosionAudio.play();
    setTimeout(() => {
        explosionDom.remove()
    }, 1200);
}


//道具下落
let dropPropTimer = new Date().getTime();

function dropProp(top, left) {
    let time = new Date().getTime();
    if (time - dropPropTimer < 40 || !enableDrop)
        return;
    else
        dropPropTimer = time


    const random = getRandomInteger(0, dropPropConfig.length - 1);
    const ClassName = dropPropConfig[random].className;
    let prop = createElement($gameArea, ClassName, 'div', {
        left: left + 'px',
        top: top + 'px'
    });
    prop.classList.add('prop');
    prop.classList.add('blinkClass');
    prop.token = dropPropConfig[random].token;
    asyncFun(() => {
        addStyle(prop, {
            top: areaHeight + top + 'px'
        })
    })
    setTimeout(function () {
        prop.remove();
    }, 4000);


}

//下落提示
function dropTip(parent, text) {
    // let top=getTop(parent)+getHeight(parent)/2;
    // let left=getLeft(parent)+getWidth(parent)/2;
    let top = getTop(parent);
    let left = getLeft(parent);

    let p = createElement($gameArea, 'dropTip', 'p', {
        top: top + 'px',
        left: left + 'px'
    })
    p.innerText = text;
    asyncFun(() => {
        addStyle(p, {
            top: top - 100 + 'px',
            opacity: 0
        })
    })
    setTimeout(() => {
        p.remove();
    }, 1000)
}


function fairyImgAnimation(dom, wOffset, hOffset, wCount, hCount, delay, callBack) {
    var count = 0;
    callBack && callBack();
    for (let i = 0; i < hCount; i++) {
        for (let j = 0; j < wCount; j++) {
            setTimeout(function () {
                console.log()
                dom.style.backgroundPositionX = -j * wOffset + 'px'
                dom.style.backgroundPositionY = -i * hOffset + 'px';
            }, delay * count);
            count++;
        }
    }
}

function collideCheck(oDiv, oDiv2, callBack) {
    var t1 = oDiv.offsetTop;
    var l1 = oDiv.offsetLeft;
    var r1 = oDiv.offsetLeft + oDiv.offsetWidth;
    var b1 = oDiv.offsetTop + oDiv.offsetHeight;

    var t2 = oDiv2.offsetTop;
    var l2 = oDiv2.offsetLeft;
    var r2 = oDiv2.offsetLeft + oDiv2.offsetWidth;
    var b2 = oDiv2.offsetTop + oDiv2.offsetHeight;

    if (b1 < t2 || l1 > r2 || t1 > b2 || r1 < l2) {// 表示没碰上

    } else {
        // var obj={t1, l1, r1, b1, t2, l2, r2, b2};
        callBack && callBack(oDiv, oDiv2);
    }

}


function createElement(parent, className, tagName, styleObj) {
    var tag = document.createElement(tagName);
    tag.classList.add(className);
    parent.appendChild(tag);
    addStyle(tag, styleObj);
    return tag;
}

function eHide(element) {
    addStyle(element, {display: 'none'});
}

function eShow(element) {
    addStyle(element, {display: 'flex'});
}

function getTop(element) {
    return element.offsetTop;
}

function getLeft(element) {
    return element.offsetLeft;
}

function getWidth(element) {
    return element.clientWidth;
}

function getHeight(element) {
    return element.clientHeight;
}

function addStyle(element, styleObj) {
    for (const styleKey in styleObj)
        element.style[styleKey] = styleObj[styleKey];
}

function $(selector) {
    return document.querySelector(selector);
}

function $All(selector) {
    return document.querySelectorAll(selector);
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Drag(ball, downCallBack, moveCallBack, upCallBack) {
    var isMove = false;
    var parent = ball.parentNode;
    var offsetX = 0;
    var offsetY = 0;
    var ballWidth = ball.clientWidth;
    var maxViewWidth = areaWidth;
    var maxMoveWidth = areaWidth - ballWidth;
    ball.addEventListener('mousedown', function (e) {
        isMove = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        downCallBack && downCallBack();
    })
    document.addEventListener('mousemove', function (e) {
        if (isMove) {
            ball.style.left = e.clientX - parent.offsetLeft - offsetX + 'px';
            ball.style.top = e.clientY - parent.offsetTop - offsetY + 'px';
            // 边界检测
            if (ball.offsetLeft < 0)
                ball.style.left = '0px';
            else if (ball.offsetLeft + ballWidth > maxViewWidth)
                ball.style.left = maxMoveWidth + 'px';
            moveCallBack && moveCallBack(ball.offsetLeft, e.offsetTop);
        }
    })
    ball.addEventListener('mouseup', function () {
        isMove = false;
        upCallBack && upCallBack(ball);
    })
    ball.addEventListener('touchstart', function (e) {
        isMove = true;
        offsetX = e.touches[0].clientX - ball.offsetLeft;
        offsetY = e.touches[0].clientY - ball.offsetTop;
        downCallBack && downCallBack();
    })
    document.addEventListener('touchmove', function (e) {
        if (isMove) {
            ball.style.left = e.touches[0].clientX - parent.offsetLeft - offsetX + 'px';
            ball.style.top = e.touches[0].clientY - parent.offsetTop - offsetY + 'px';
            // 边界检测
            if (ball.offsetLeft < 0)
                ball.style.left = '0px';
            else if (ball.offsetLeft + ballWidth > maxViewWidth)
                ball.style.left = maxMoveWidth + 'px';
            moveCallBack && moveCallBack(ball.offsetLeft, e.offsetTop);
        }
    })
    ball.addEventListener('touchend', function () {
        isMove = false;
        upCallBack && upCallBack(ball);
    })
}

function throttle(fn, wait) {
    var timer = null;
    // console.log(arguments)
    return function (arg) {
        if (!timer) {
            fn(...arg);
            timer = setTimeout(function () {
                timer = null;
            }, wait)
        }
    }
}


function fadeOut(element, speed, effect = 'ease-in-out') {
    element.style.opacity = 1;
    element.style.transition = speed + 's' + ' ' + effect;
    asyncFun(() => {
        element.style.opacity = 0;
    });
    setTimeout(() => {
        eHide(element);
    }, speed * 1000);
}

function fadeIn(element, speed, effect = 'ease-in-out') {
    eShow(element);
    element.style.transition = 0 + 's' + ' ' + effect;
    element.style.opacity = 0;
    element.style.transition = speed + 's' + ' ' + effect;
    asyncFun(() => {
        element.style.opacity = 1;
    });
}

setInterval(function () {
    if ($playGame.className.includes('shake-lr')) {
        $playGame.classList.remove('shake-lr')
    } else {
        $playGame.classList.add('shake-lr')
    }
}, 2000);
// document.ontouchmove = function(e){ e.preventDefault(); }; //文档禁止 touchmove事件