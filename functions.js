const { exec } = require('child_process')
const crypto = require('crypto')

//decode vide url
function decodeUrl(url) {
    return url.split(',').map(x => String.fromCodePoint(parseInt(x))).reduce((pre, cur) => pre + cur)
}


//list all audio and video formats 
function getVideoInfo(url) {
    return new Promise((resolve, reject) => {
        exec(`youtube-dl --list-formats ${url}`, (error, stdout, stderr) => {
            if (error) reject(error)
            if (stderr) reject(error)
            resolve(convertFormats(stdout, url))
        })
    })
}

//convert formats infomation to array
function convertFormats(stdout, url) {
    let formatsArr = stdout.split('\n').slice(5)
    let audioN = formatsArr.filter((item) => item.indexOf('m4a') != -1).map((item) => parseInt(item.substring(0, 3)))[0]
    let bestVideoInfo = formatsArr.filter((item) => item.indexOf('mp4') != -1 && item.indexOf('video only') != -1).pop()
    let bestVideoP = bestVideoInfo.substr(35, 5).trim()
    let bestVideoM = bestVideoInfo.substring(bestVideoInfo.length - 9).replace(/,/, ' ').trim()
    let bestVideoN = parseInt(formatsArr.filter((item) => item.indexOf('mp4') != -1 && item.indexOf('video only') != -1).pop().substring(0, 3))
    let audioVideoInfo = formatsArr.filter(item => item.indexOf('best') != -1)
    let audioVideoN = formatsArr.filter(item => item.indexOf('best') != -1).map((item) => parseInt(item.substring(0, 3)))[0]
    return {
        audioN,
        bestVideoN,
        bestVideoP,
        bestVideoM,
        url
    }
}


function getVideoName(stdout) {
    let videoName = stdout.split('\n')[3].substring(23).trim()
    return videoName
}

function getVideoSize(stdout) {
    let size = stdout.substr(stdout.indexOf('100%')+7,11)
    return size
}

//download 720p
function download720(url) {
    let hashName = crypto.createHmac('sha256', url).update('i love nodejs').digest('hex')
    return new Promise((resolve, reject) => {
        exec(`cd /var/ftp && rm -rf ${hashName}.mp4 && youtube-dl --no-playlist -f best -o '${hashName}.%(ext)s' ${url}`, (error, stdout, stderr) => {
            if (error) reject(error)
            if (stderr) reject(stderr)
            // resolve(getVideoName(stdout))
            resolve(getVideoSize(stdout))
        })
    })
}



//download 1080p ## warning! it's very slow ##
function download1080({ bestVideoN, audioN, url }) {
    let hashName = crypto.createHmac('sha256', url).update('i love javascript').digest('hex')
    return new Promise((resolve, reject) => {
        exec(`cd /var/ftp && youtube-dl --no-playlist -f ${bestVideoN}+${audioN} -o '${hashName}.%(ext)s' ${url}`, (error, stdout, stderr) => {
            if (error) reject(error)
            if (stderr) reject(stderr)
            console.log(stdout)
            resolve(getVideoName(stdout))
        })
    })
}

function downloadList(url) {
    return new Promise((resolve, reject) => {
        exec(`cd /var/ftp && youtube-dl --yes-playlist -f best -o '%(playlist)s/%(playlist_index)s - %(title)s.%(ext)s' ${url}`, (error, stdout, stderr) => {
            if (error) reject(error)
            if (stderr) reject(stderr)
            resolve(stdout)
        })
    })
}

//dangerous function delete all videos on ftp server
function deleteAllVideos() {
    return new Promise((resolve, reject) => {
        exec(`cd /var/ftp && rm -rf *`, (error, stdout, stderr) => {
            if (error) reject(error)
            if (stderr) reject(stderr)
            resolve(`${stdout} ok all the videos are deleted now , it's much more clean , you can download more videos haha`)
        })
    })
}

function deleteOneVideo(videoName) {
    return new Promise((resolve, reject) => {
        exec(`cd /var/ftp && rm -rf ${videoName}`, (error, stdout, stderr) => {
            if (error) reject(error)
            if (stderr) reject(stderr)
            resolve(`${videoName} is deleted successfully`)
        })
    })
}


module.exports.getVideoInfo = getVideoInfo
module.exports.download1080 = download1080
module.exports.download720 = download720
module.exports.downloadList = downloadList
module.exports.deleteAllVideos = deleteAllVideos
module.exports.deleteOneVideo = deleteOneVideo
module.exports.decodeUrl = decodeUrl


// downloadSingleVideo('https://youtu.be/lCGrVHUsXPo').then(value => console.log(value)).catch(err => console.log(err))