const app = require('express')()

const {downloadSingleVideo, getVideoFormats} = require('./functions')

app.get('/', (req,res) => {
    res.send('hello, world');
})

app.get('/format', (req,res) => {
    getVideoFormats(req.query.url).then(value => res.send(value)).catch(err => {
        console.log(err);
        res.send(err.toString())
    })
})


app.listen(3000,'localhost',() => {
    console.log('now app is listening on port 3000')
})