const https = require('https');

// var options = {
//     hostname: 'www.example.com',
//     port: 80,
//     path: '/submit',
//     method: 'POST'
// };



// write data to request body
// req.write('data\n');
// req.write('data\n');
// req.end();

const requestPost = (options,data) => {
    return new Promise((resolve, reject)=>{
        let chunk=''
        const req = https.request(options, function(res) {
            res.on('data', function (body) {
                chunk+=body;
                // console.log('Body: ' + body);
            });
            res.on('end', function (body) {
                resolve(chunk)
                // console.log('Body: ' + body);
            });
        });
        req.write(JSON.stringify(data));
        req.end();

        req.on('error', function(e) {
            reject(e.message)
            console.log('problem with request: ' + e.message);
        });
    })
}
module.exports = requestPost