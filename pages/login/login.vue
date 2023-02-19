<template>
  <view>
    
    <view class="container">
      <view class="wrapper">
        <view class="left-top-sign">LOGIN</view>
        <view class="welcome">
          欢迎回来！
        </view>
        <view class="input-content">
          <view class="input-item">
            <text class="tit">手机号码</text>
            <input  type="text" placeholder="请输入手机号码"  v-model="phone" />
          </view>
          <view class="input-item" v-if="isLoginpw">
            <text class="tit">密码</text>
            <input type="password"  placeholder="请输入密码" v-model="password"/>
          </view>
          <view class="input-items" v-else>
            <view class="Captcha">
              <input type="text"  placeholder="请输入验证码" v-model="captcha"/>
            </view> 
            <view class="Captchaes">
              <text @click="getCaptcha()">获取验证码</text>
              </view>
          </view>
        </view>
        <button class="confirm-btn" @click="login()" v-if="isLoginpw">登录</button>
        <button class="confirm-btn" @click="CaptchaLogin()" v-else>登录</button>
        <button class="confirm-btn" @click="wxLogin()">微信登录</button>
        <button class="confirm-btn" @click="freeLogin()">游客登录</button>
        
        <view class="forget-section">
          忘记密码?
        </view>
      </view>
      <view class="register-section">
        还没有账号?
        <text >马上注册</text>
      </view>
    </view>

  </view>
</template>

<script>
  import request from '../../utils/request.js'
  export default {
    data() {
      return {
        phone:'',
        password:'',
        isLoginpw:false,
        captcha:'',
        freeaccount:{},
        // 获取验证码按钮是否禁用
              attcode: true,
              // 获取验证码按钮是否展示
              showBtn: true,
              codeMsg: '获取验证码',
              // 倒计时
              codeSec: 60,
      };
    },
    onload(){
      
    },
    methods:{
      async login(){
        let {phone,password}=this.$data
        if(!phone){
          //提示用户
        uni.showToast({
          title:'手机号不能为空',
          icon:'none'
        })
        return;
        }
        //手机号正则表达式
        let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}$/;
        if(!phoneReg.test(phone)){
          uni.showToast({
            title:'手机号不正确',
            icon:'none'
          })
          return;
        }
        if(!password){
          uni.showToast({
            title:'密码不能为空',
            icon:'none'
          })
          return;
        } 
        let result=await request('/login/cellphone',{phone,password})
        console.log(result);
        if(result.code===200){
          uni.showToast({
            title:"登录成功"
          })
          //将用户的数据存储到本地
          uni.setStorageSync('userInfo',JSON.stringify(result.profile))
          uni.setStorage({
            key:'cookies',
            data:result.cookie
          })
          
          // let a=result.cookie
          // let b=a.findindex(item => item.indexOf('MUSIC_U')!==-1)
          // console.log(b);
      
          
          uni.reLaunch({
            url:'/pages/personal/personal'
          })
        }else if(result.code===400){
          uni.showToast({
            title:"手机号错误",
            icon:'none'
          })
        }else if(result.code===462){
          
            
        } else if(result.code===502){
          uni.showToast({
            title:"密码错误",
            icon:'none'
          })
        }else{
          uni.showToast({
            title:"登录失败，请重新登录",
            icon:'none'
          })
        }
        
      },
      successSendMsg(){
        uni.showToast({
          title:"获取失败",
          icon:'none',
        })
      },
      async getCaptcha(){
        let {phone}=this.$data
        if(!phone){
          //提示用户
        uni.showToast({
          title:'手机号不能为空',
          icon:'none'
        })
        return;
        }
        //手机号正则表达式
        let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}$/;
        if(!phoneReg.test(phone)){
          uni.showToast({
            title:'手机号不正确',
            icon:'none'
          })
          return;
        }
        const res=await request('/captcha/sent',{phone:phone})
        if (res.code !== 200) this.successSendMsg()
        console.log(res);
              // 修改页面样式
              // const timer = setInterval(() => {
              //   this.codeSec = this.codeSec - 1
              //   this.codeMsg = this.codeSec + 's后重试'
              //   this.showBtn = false
              //   if (this.codeSec === 0) {
              //     clearInterval(timer)
              //     this.codeSec = 60
              //     this.showBtn = true
              //   }
              // }, 1000)
      },
      async CaptchaLogin(){
        let {phone}=this.$data
        let captcha=3932
        if(!phone){
          //提示用户
        uni.showToast({
          title:'手机号不能为空',
          icon:'none'
        })
        return;
        }
        //手机号正则表达式
        let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}$/;
        if(!phoneReg.test(phone)){
          uni.showToast({
            title:'手机号不正确',
            icon:'none'
          })
          return;
        }
        if(!captcha){
          uni.showToast({
            title:'验证码不能为空',
            icon:'none'
          })
          return;
        }
         
         const res=await request('/captcha/verify',{phone:phone,captcha:captcha})
         // if(res.data.code !==200) return uni.showToast({
         //     title:"验证码错误",
         //     icon:'none', 
         // })
         let result=await request('/login/cellphone',{phone:phone,captcha:captcha})
        console.log(result);
      //   if(result.code===200){
      //     uni.showToast({
      //       title:"登录成功"
      //     })
      //     //将用户的数据存储到本地
      //     uni.setStorageSync('userInfo',JSON.stringify(result.profile))
      //     uni.setStorage({
      //       key:'cookies',
      //       data:result.cookie
      //     })
         
      // }
    },
    wxLogin(){
        uni.getUserProfile({
          desc:'求',
          success:(res)=>{
            console.log(res.userInfo);
            this.getToken(res)
          },
          fail:(res)=>{
            return uni.$showMsg('你取消了登录授权')
          }
        })
      },
      async getToken(info){
        const [err,res] = await uni.login().catch(err => err)
        if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败')
         
        // console.log(res.code);
        // console.log(info);        
        // 准备参数对象
            const query = {
              code: res.code,
              encryptedData: info.encryptedData,
              iv: info.iv,
              rawData: info.rawData,
              signature: info.signature
            }
            console.log(query);
            // const { data: loginResult } = await request('/users/wxlogin', query)
            // if (loginResult.meta.status === 200) return uni.$showMsg('登录失败！')
            // uni.$showMsg('登录成功')
      },
      async freeLogin(){
        const res=await request('/register/anonimous')
        uni.setStorage({
          key:'cookies',
          data:res.cookie
        })
        uni.reLaunch({
          url:'/pages/personal/personal'
        })
      }
    }
  }
</script>

<style lang="scss">
/* pages/login/login.wxss */
.wrapper{
  position:relative;
  z-index: 90;
  padding-bottom: 40rpx;
}

.left-top-sign{
  font-size: 120rpx;
  color: #f8f8f8;
  position:relative;
  left: -16rpx;
}

.welcome{
  position:relative;
  left: 50rpx;
  top: -90rpx;
  font-size: 46rpx;
  color: #555;
}


.input-content{
  padding: 0 60rpx;
}
.input-item{
  display:flex;
  flex-direction: column;
  align-items:flex-start;
  justify-content: center;
  padding: 0 30rpx;
  background:#f8f6fc;
  height: 120rpx;
  border-radius: 4px;
  margin-bottom: 50rpx;
}

.input-item:last-child{
  margin-bottom: 0;
}
.input-item .tit{
  height: 50rpx;
  line-height: 56rpx;
  font-size: 30rpx;
  color: #606266;
}
.input-item input{
  height: 60rpx;
  font-size: 30rpx;
  color: #303133;
  width: 100%;
}
.confirm-btn{
  width: 630rpx!important;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 50rpx;
  margin-top: 70rpx;
  background: #d43c33;
  color: #fff;
  font-size: 32rpx;
  padding: 0;
}
.confirm-btn2:after{
  border-radius: 100px;
}

.forget-section{
  font-size: 28rpx;
  color: #4399fc;
  text-align: center;
  margin-top: 40rpx;
}

.register-section{
  position:absolute;
  left: 0;
  bottom: 50rpx;
  width: 100%;
  font-size: 28rpx;
  color: #606266;
  text-align: center;

}
.register-section text{
  color: #4399fc;
  margin-left: 10rpx;
}
.input-items{
  display:flex;
  justify-content: space-around;
  align-items:center;
  // padding: 0 30rpx;
  background:#f8f6fc;
  height: 120rpx;
  border-radius: 4px;
  margin-bottom: 50rpx;
}

.Captcha input{
  height: 60rpx;
  font-size: 30rpx;
  color: #303133;
  width: 100%;
}
.Captchaes{
  height: 60rpx;
  font-size: 13px;
  line-height: 60rpx;
  color: #4399fc;
  border: 1px solid #4399fc;
  border-radius: 20px;
}
.Captchaes text{
  margin: 4px;
}
</style>
