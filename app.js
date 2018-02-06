const app = require('express')()
const bodyParser = require('body-parser').json()
const cors = require('cors')
const path = require('path')
const fs = require('fs')
app.use(bodyParser)
app.use(cors())
const { getVideoInfo, download720, download1080, downloadList, deleteAllVideos, deleteOneVideo } = require('./functions')

app.get('/', (req, res) => {
    res.send('hello, world');
})

app.post('/info', (req, res) => {
    getVideoInfo(req.body.url).then(value => res.send(value)).catch(err => {
        res.send(err.toString())
    })
})

app.post('/download720', (req, res) => {
    download720(req.body.url).then(videoName => res.send(videoName)).catch(err => res.send(err.toString()))
})

app.get('/download720Http', (req, res) => {
    download720(req.query.url).then(result => {
        let videoStream = fs.createReadStream(path.join('/var/ftp', result))
        videoStream.pipe(res, { end: true })
        videoStream.on('end', () => {
            deleteOneVideo(result)
        })
    })
        .catch(err => res.send(err.toString()))
})

app.post('/download1080', (req, res) => {
    getVideoInfo(req.body.url).then(info => download1080(info).then(result => res.send(result)).catch(err => res.send(err.toString()))).catch(err => res.send(err.toString()))
})

app.post('/downloadList', (req, res) => {
    downloadList(req.body.url).then(result => res.send(result)).catch(err => res.send(err.toString()))
})

//dangerous
app.delete('/', (req, res) => {
    deleteAllVideos().then(value => res.send(value)).catch(err => res.send(err.toString()))
})

app.listen(3000)