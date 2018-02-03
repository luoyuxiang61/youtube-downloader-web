const app = require('express')()
const bodyParser = require('body-parser').json()
app.use(bodyParser)

const {downloadSingleVideo, getVideoInfo, download720, download1080, downloadList} = require('./functions')

app.get('/', (req,res) => {
    res.send('hello, world');
})

app.post('/format', (req,res) => {
    getVideoInfo(req.body.url).then(value => res.send(value)).catch(err => {
        res.send(err.toString())
    })
})


app.post('/download720', (req,res) => {

    download720(req.body.url).then(result => res.send(result)).catch(err => res.send(err.toString()))

})

app.post('/download1080', (req,res) => {

    download1080(req.body).then(result => res.send(result)).catch(err => res.send(err.toString()))
})

app.post('/downloadList', (req,res) => {

    downloadList(req.body.url).then(result => res.send(result)).catch(err => res.send(err.toString()))
})

app.listen(3000)