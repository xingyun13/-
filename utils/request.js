//发送Ajax请求
import config from './config.js'
export default (url, data={},method='GET') => {
  return new Promise((resolve,reject) =>{
    let cookiesList=uni.getStorageSync('cookies')
      let headerCookie=''
             if(cookiesList){
               let cookieList=cookiesList.split(';;')
               headerCookie=cookieList?cookieList.find(item => item.indexOf('MUSIC_U') !== -1):''
               // headerCookie=cookieList?cookieList.find(item => item.indexOf('MUSIC_A') !== -1):''
             }
     // console.log(headerCookie);
    wx.request({
      url:config.mobileHost + url,
      data,
      method,
      header:{    
        cookie:'MUSIC_U=0082AC2B8EF8E215BC72A304C6A0B0F06ED2AE3BE688EF9EBFF950B1F0420087D2AB63D3DA8C682562474B71006E831C7B84A044085377D5309BFA3BF617C600CE322865DF65E64FB5F01DA605CB14D131BA68F09D88BD57B571AABF249534D08EEBC960126B50C512E080E03D1E29AF65DC649E28E63E89B6E333786EBC49D8B4ED0CEF5A8E62F43DC52BC4BEF948F276E34F3342F18A031A43874FF36E3664C9D879FF4CA1E89989D95F41F424C38C561EA00198A54E5F4C150D12C1B4D60BF659C510F7C655EE1B830E57428847A3CD1E9E3C8254F70A0A05C210130443CAAD38859AA78F158227BEFA81FCF8F18361B064A2B57D13EB591588014949F93E802C890566E3B737F7E6BD63A75217CBD4853D4D54C5A76B9DE376F641014CA986918968A1E947EC093984BD029FEB756999A5975BA0A1B35774CE876DE01451C4F737870D0360377772CB2E272C36AEE0'
            },
              // uni.setStorageSync('cookies').find(item => item.indexOf('MUSIC_U')!==-1)
            // success:(res)=>{
            //   if(data.isLogin){
            // //此处注意 使用indexOf方法筛选关键字时如果第一项没有检测到关键字会返回-1，-1也是布尔值，所以会一直拿到第一个，设置它！==-1即可解决
            //     uni.setStorageSync('cookies',res.cookies.find(item => item.indexOf('MUSIC_U')!==-1))
            //   }
      success:(res)=>{
        // console.log(res);
        resolve(res.data)
      },
      fail:(err) =>{
        reject(err)
      }
    })
  })
  
}