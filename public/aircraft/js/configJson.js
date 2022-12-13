function getLocal(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setLocal(key, item) {
    var str = JSON.stringify(item);
    localStorage.setItem(key, str);
}

const MyBullet = [
    {
        src: 'img/myBullet/1.png',
        width: 14,
    },
    {
        src: 'img/myBullet/2.png',
        width: 18,
    }, {
        src: 'img/myBullet/3.png',
        width: 24,
    }, {
        src: 'img/myBullet/4.png',
        width: 30,
    }
]

const eBulletBlue = [
    {
        src: 'img/enemy/bullet/blue/1.png',
        width: 14,
    },
    {
        src: 'img/enemy/bullet/blue/2.png',
        width: 18,
    }, {
        src: 'img/enemy/bullet/blue/3.png',
        width: 24,
    }, {
        src: 'img/enemy/bullet/blue/4.png',
        width: 30,
    }
]

const eBulletRed = [
    {
        src: 'img/enemy/bullet/red/1.png',
        width: 14,
    },
    {
        src: 'img/enemy/bullet/red/2.png',
        width: 18,
    }, {
        src: 'img/enemy/bullet/red/3.png',
        width: 24,
    }, {
        src: 'img/enemy/bullet/red/4.png',
        width: 30,
    }
]
const myAirRank = [
    {
        speed: 1.5,
        bullet: [MyBullet[0], MyBullet[0]]
    },
    {
        speed: 1.4,
        bullet: [MyBullet[0], MyBullet[0], MyBullet[0]]
    },
    {
        speed: 1.3,
        bullet: [MyBullet[0], MyBullet[0], MyBullet[0], MyBullet[0]]
    },
    {
        speed: 1.2,
        bullet: [MyBullet[1], MyBullet[0], MyBullet[0]]
    },
    {
        speed: 1.1,
        bullet: [MyBullet[0], MyBullet[1], MyBullet[1]]
    },
    {
        speed: 1.1,
        bullet: [MyBullet[1], MyBullet[1], MyBullet[1], MyBullet[1]]
    },
    {
        speed: 1.0,
        bullet: [MyBullet[2], MyBullet[1], MyBullet[1]]
    },

    {
        speed: 1.0,
        bullet: [MyBullet[1], MyBullet[2], MyBullet[2]]
    },
    {
        speed: 1.0,
        bullet: [MyBullet[2], MyBullet[2], MyBullet[2]]
    },
    {
        speed: 1.0,
        bullet: [MyBullet[2], MyBullet[2], MyBullet[2], MyBullet[2]]
    },
    {
        speed: 0.8,
        bullet: [MyBullet[3], MyBullet[2], MyBullet[2]]
    },

    {
        speed: 0.8,
        bullet: [MyBullet[3], MyBullet[3], MyBullet[3]]
    },
    {
        speed: 0.8,
        bullet: [MyBullet[3], MyBullet[3], MyBullet[3], MyBullet[3]]
    },
    {
        speed: 0.8,
        bullet: [MyBullet[3], MyBullet[3], MyBullet[3], MyBullet[3], MyBullet[3], MyBullet[3], MyBullet[3]]
    },
]


const adventureAirSrc = 'img/enemy/air/adventure';
const sweetAirSrc = 'img/enemy/air/sweet';
const j20AirSrc = 'img/enemy/air/jjj';
const skyAirSrc = 'img/enemy/air/sky';

const enemyAirSrc = [adventureAirSrc, sweetAirSrc, skyAirSrc];
const baseBleed = 1;
const enemyAirRank = [
    {
        speed: 2,
        bleed: 2 * baseBleed,
        bullet: [eBulletBlue[0], eBulletBlue[0]]
    },
    {
        speed: 1.8,
        bleed: 4 * baseBleed,
        bullet: [eBulletBlue[1], eBulletBlue[1]]
    }, {
        speed: 1.6,
        bleed: 6 * baseBleed,
        bullet: [eBulletBlue[2], eBulletBlue[2]]
    }, {
        speed: 1.4,
        bleed: 10 * baseBleed,
        bullet: [eBulletBlue[3], eBulletBlue[3]]
    }

]

// 如何做 道具识别
const dropPropConfig = [
    {
        className: 'heartProp',
        token: 0
    }
    ,

    {
        className: 'heartProp',
        token: 0
    }
    ,

    {
        className: 'heartProp',
        token: 0
    }
    ,

    {
        className: 'heartProp',
        token: 0
    }
    ,
    {
        className: 'maxProp',
        token: 2
    },
    {
        className: 'maxProp',
        token: 2
    },
    {
        className: 'maxProp',
        token: 2
    }
    ,
    {
        className: 'upgradeProp',
        token: 1
    },
    {
        className: 'upgradeProp',
        token: 1
    },
    {
        className: 'upgradeProp',
        token: 1
    },
    {
        className: 'upgradeProp',
        token: 1
    },
    {
        className: 'upgradeProp',
        token: 1
    },
    {
        className: 'upgradeProp',
        token: 1
    },
];
const constMyBulletFrequent = 1000;
const constcreateEnemyFrequent = 1000;
let myBulletFrequent = 1000;
let createEnemyFrequent = 1000;
let enemyFrequent = 100;
let rank = 0;//飞机等级
let enableDrop = true;//是否允许掉装备
var createEnemyTimeControl = true; //启动及关闭按钮
var myAirTimeControl = true; //启动及关闭按钮
let historyScore = getLocal('score') || [0, 0, 0];