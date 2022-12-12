const http = require('http');
const querystring = require("querystring");


function getAbsoluteUrl(originUrl) {
    return originUrl.split('?')[0];
}

function Express() {
    this.server = null;
    this.apiMapRouter = {
        'GET': {},
        'POST': {},
        'OPTIONS': {}
    }
    this.middleWares = [];
    this.init();
    this.on();
}

Express.prototype.on = function () {
    // http on
    this.server.on('request', async (req, res) => {
        const url = getAbsoluteUrl(req.url);
        const {method} = req
        // 当所有中间件 都通过时时  响应 api 路由回调函数
        await Promise.all(this.middleWares.map((callback) => new Promise((resolve) => {
            callback(req, res, resolve)
        })))
        try {
            // 当 路由能被找到时
            this.apiMapRouter[method][url](req, res);
        } catch (e) {
            // 404
            this.notFoundIntercept(req, res);
        }
    });
};
Express.prototype.init = function () {
    this.server = http.createServer();//创建 http服务
    //添加 res.send 方法
    this.use((req, res, next) => {
        res.send = function (data) {
            res.statusCode = 200;
            res.write(typeof data === 'string' ? data : JSON.stringify(data));
            res.end();//写完之后一定要结束 关闭连接
        };
        next();
    });
    //添加 拦截query参数
    this.use((req, res, next) => {
        // const query = {};
        // const queryString = req.url.split('?')[1] || '';
        // const queryArray = queryString.split('&');
        // queryArray.forEach((ownQueryString) => {
        //   const key = ownQueryString.split('=')[0] ;
        //   const value = ownQueryString.split('=')[1] ;
        //   query[key]=value
        // });
        req.query = querystring.parse(req.url.split('?')[1] || '')
        next();
    });
    //添加 拦截post请求体
    this.use((req, res, next) => {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            req.body = body === '' ? {} : JSON.parse(body)
            next();
        })

    })
};

Express.prototype.notFoundIntercept = function (req, res) {
    res.setHeader('Content-type', 'application/json;charset=utf-8');//设置响应头
    (req.method !== 'OPTIONS') && (res.statusCode = 404);
    res.write(JSON.stringify({
        status: 404,
        msg: '资源未找到'
    }));
    res.end()
};
Express.prototype.get = function (route, callback) {
    this.apiMapRouter['GET'][route] = callback;
};
Express.prototype.post = function (route, callback) {
    this.apiMapRouter['POST'][route] = callback;
    this.apiMapRouter['OPTIONS'][route] = (req, res) => {
        res.send({code: 200, msg: '预检请求成功'})
    };
};
Express.prototype.use = function (callback) {

    this.middleWares.push(callback);
};
Express.prototype.listen = function (port, callback) {
    // http listen
    this.server.listen(port, callback);
};

module.exports = Express;
