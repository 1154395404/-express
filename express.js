const http = require('http');
const querystring = require("querystring");


function getAbsoluteUrl(originUrl) {
    return originUrl.split('?')[0];
}

function Express(params) {
    this.server = null;
    this.getMapHandles = {};
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
    this.server.on('request', (req, res) => {
        const url = getAbsoluteUrl(req.url);
        const {method} = req
        this.middleWares.forEach((callback) => callback(req, res));
        try {
            this.apiMapRouter[method][url](req, res);
        } catch (e) {
            this.notFoundIntercept(req, res);
        }
    });
};
Express.prototype.init = function (params) {
    this.server = http.createServer();//创建 http服务
    //添加 res.send 方法
    this.use((req, res) => {
        res.send = function (data) {
            res.statusCode = 200;
            res.write(typeof data === 'string' ? data : JSON.stringify(data));
            res.end();//写完之后一定要结束 关闭连接
        };
    });
    //添加 拦截query参数
    this.use((req, res) => {
        // const query = {};
        // const queryString = req.url.split('?')[1] || '';
        // const queryArray = queryString.split('&');
        // queryArray.forEach((ownQueryString) => {
        //   const key = ownQueryString.split('=')[0] ;
        //   const value = ownQueryString.split('=')[1] ;
        //   query[key]=value
        // });
        req.query = querystring.parse(req.url.split('?')[1] || '')
    });
    //添加 拦截post请求体
    this.use((req, res) => {
        let body = ''
        let resolve = null;
        req.getBody = new Promise((r, e) => {
            resolve = r
        })
        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            resolve(body === '' ? {} : JSON.parse(body))
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
