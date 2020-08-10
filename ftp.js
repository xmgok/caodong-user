const scp2 = require('scp2')
const host = '134.175.220.145'
const user = 'cddev'
const password = 'cddev@123'

// dev
console.log('dev环境文件上传中...')
scp2.scp('./dist/', {
  host,
  username: user,
  password,
  path: '/opt/web/caodong/'
}, (err) => {
  console.log(err ? 'dev环境文件上传错误！' : 'dev环境文件上传完成。')
})

// uat
// console.log('uat环境文件上传中...')
// scp2.scp('./dist/', {
//   host,
//   username: user,
//   password,
//   path: '/opt/web-uat/dist/'
// }, (err) => {
//   console.log(err ? 'uat环境文件上传错误！' : 'uat环境文件上传完成。')
// })
