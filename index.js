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
            resolve(stdout)
        })
    })
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

downloadSingleVideo('https://youtu.be/lCGrVHUsXPo').then(value => console.log(value)).catch(err => console.log(err))





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


