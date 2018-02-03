const { exec } = require('child_process');


//list all audio and video formats 
function getVideoFormats(url) {
    return new Promise((resolve,reject) => {
        exec('youtube-dl --list-formats  '+ url, (error,stdout,stderr) => {
            if(error) {
                reject(error)
            }
            if(stderr) {
                reject(error)
            }
            resolve(convertFormats(stdout))
        })
    })
}

//convert formats infomation to array
function convertFormats(text) {
    let formatsArr = text.split('\n').slice(5)
    
    let audioN = formatsArr.filter((item) => item.indexOf('m4a') != -1 ).map((item) => parseInt(item.substring(0,3)))[0]

   
    let bestVideoInfo = formatsArr.filter((item) => item.indexOf('mp4') != -1 && item.indexOf('video only') != -1).pop()
    let bestVideoP = bestVideoInfo.substr(35,5).trim()
    let bestVideoM = bestVideoInfo.substring(bestVideoInfo.length - 9).replace(/,/,' ').trim()
    let bestVideoN = parseInt(formatsArr.filter((item) => item.indexOf('mp4') != -1 && item.indexOf('video only') != -1).pop().substring(0,3))

    let audioVideoInfo = formatsArr.filter(item => item.indexOf('best') != -1)
    let audioVideoN = formatsArr.filter(item => item.indexOf('best') != -1).map((item) => parseInt(item.substring(0,3)))[0]


    let best = {
        audioN,
        bestVideoN,
        bestVideoP,
        bestVideoM,
        audioVideoN
    }

    
    
    return best
}


//download a video 
function downloadSingleVideo(url) {
    return new Promise((resolve,reject) => {
        exec('cd /home/yuxiang/mp4 && pwd && youtube-dl '+ url, (error,stdout,stderr) => {
            if(error) {
                reject(error)
            }
            if(stderr) {
                reject(error)
            }
            resolve(stdout)
        })
    })
}

module.exports.getVideoFormats = getVideoFormats
module.exports.downloadSingleVideo = downloadSingleVideo



// downloadSingleVideo('https://youtu.be/lCGrVHUsXPo').then(value => console.log(value)).catch(err => console.log(err))





// getVideoFormats('https://youtu.be/lCGrVHUsXPo').then(value => console.log(value.split('MiB'))).catch(err => console.log(err))



// function changeDir(dir = '/home/yuxiang/mp4') {
//     return new Promise((resolve,reject) => {
//         exec('cd ' + dir + ' && ls && pwd && youtube-dl ', (error,stdout,stderr) => {
//             if(error) {
//                 reject(error)
//             }
//             if(stderr) {
//                 reject(stderr)
//             }
//             resolve(stdout)
//         })
//     })
// }

// changeDir().then(value => console.log(value)).catch(err => console.log('********error********',err))




// exec('rm -rf /home/yuxiang/mp4/* && ls -l', (error,stdout,stderr) => {
//     if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//       }
//       console.log(`stdout: ${stdout}`);
//       console.log(`stderr: ${stderr}`);
// })


// exec('ls -l', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });


