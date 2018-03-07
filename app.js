const app = require('express')()
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const request = require('request');
const http = require('http')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
const { getVideoInfo, download720, download1080, downloadList, deleteAllVideos, deleteOneVideo, decodeUrl, getRealUrl, getVideoInfo2 } = require('./functions')

app.use((req, res, next) => {
    //     res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})


app.get('/', (req, res) => {
    res.send('hello, world');
})

app.post('/test', (req, res) => {
    res.send(req.body)
})

app.post('/info', (req, res) => {
    getVideoInfo(req.body.url).then(value => res.send(value)).catch(err => {
        res.send(err.toString())
    })
})

app.post('/info2', (req, res) => {
    getVideoInfo2(req.body.url).then((x) => {
        res.send(x)
    })
})

app.get('/imgCdn', (req, res) => {
    res.sendFile(path.join('/root/imgs', `${req.query.imgHashName}`))
})

app.post('/download720Ftp', (req, res) => {
    download720(req.body.url).then(info => res.send(info)).catch(err => res.send(err.toString()))
})

app.get('/geekshine', (req, res) => {
    async function download720Http(url) {
        let realUrl = await getRealUrl(decodeUrl(url))
        request(realUrl).pipe(res)
    }

    download720Http(req.query.url)
})

app.get('/geekshine2', (req, res) => {
    getRealUrl(decodeUrl(req.query.url)).then(realUrl => {
        http.get(realUrl, (videoStream) => {
            let contentLength = videoStream.get('Content-Length')
            let contentDisposition = videoStream.get('Content-Disposition')
            // res.set({
            //     "Content-Length": contentLength,
            //     "Content-Disposition": contentDisposition
            // })
            res.send(JSON.stringify({
                contentDisposition,
                contentLength
            }))
        })
    })
})

app.get('/downloadByHashName', (req, res) => {
    let videoPath = path.join('/var/ftp', req.query.hashName)
    let videoStream = fs.createReadStream(videoPath)
    videoStream.pipe(res)
    videoStream.on('end', () => {
        deleteOneVideo(req.query.hashName)
    })
})

app.post('/download1080Ftp', (req, res) => {
    getVideoInfo(req.body.url).then(info => download1080(info).then(videoName => res.send(videoName)).catch(err => res.send(err.toString()))).catch(err => res.send(err.toString()))
})

app.post('/downloadList', (req, res) => {
    downloadList(req.body.url).then(result => res.send(result)).catch(err => res.send(err.toString()))
})

//dangerous
app.delete('/', (req, res) => {
    deleteAllVideos().then(value => res.send(value)).catch(err => res.send(err.toString()))
})

app.listen(3000)
