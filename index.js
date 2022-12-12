const Express = require("./express");
const postRequest = require('./postRequest')
const app = new Express();


app.use((req, res) => {
    //res.headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
})
app.get('/api/getList', (req, res) => {
    // res.setHeader('Content-type','text/html')
    res.send(req.query)
    // res.send(`<h1>hello world</h1>`)
    console.log('hello');
})
app.get('/api/sendQueryGet', (req, res) => {

    res.send(req.query)
    // console.log('hello getUser');
})
app.post('/api/xixi', (req, res) => {
    req.getBody.then((data) => {
        res.send({
            status: 200,
            data
        })
    })
    // console.log(req.body)
})
app.get('/api/xiaomi', async (req, res) => {
    const data = await postRequest({
        hostname: 'm.xiaomiyoupin.com',
        port: 443,
        path: '/mtop/market/search/placeHolder',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }, [
        {},
        {
            "baseParam": {
                "ypClient": 1
            }
        }
    ])
    res.send(data)
    console.log('hello xiaomi');
})

app.listen(3001, () => {
    console.log('running 3001');
})

function useQuery() {

}
