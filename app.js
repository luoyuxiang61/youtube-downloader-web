const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())
const { getVideoInfo, download720, download1080, downloadList, deleteAllVideos, deleteOneVideo, decodeUrl } = require('./functions')

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

app.post('/download720Ftp', (req, res) => {
    download720(req.body.url).then(info => res.send(info)).catch(err => res.send(err.toString()))
})

app.get('/geekshine.io.mp4', (req, res) => {
    download720(decodeUrl(req.query.url)).then(info => {
        let videoStream = fs.createReadStream(path.join('/var/ftp', info.videoName))
        videoStream.pipe(res, { end: true })
        videoStream.on('end', () => {
            deleteOneVideo(info.videoName)
        })
    })
        .catch(err => res.send(err.toString()))
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