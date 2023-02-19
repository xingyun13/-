<template>
  <!-- 播放轮盘 -->
    <view class="songDetailContainer">
      <view class="author">{{song.ar[0].name}}</view>
      <view class="circle"></view>
      <!-- "'needle' isPlay? 'needleRotate' " -->
      <image :class="['needle',isPlay?'needleRotate':'']"  src="/static/images/song/needle.png"></image>
      
      <view :class="['discContainer', isPlay?'discAnimation':'']" >
        <image class="disc" src="/static/images/song//disc.png"></image>
        <image class="musicImg" :src="song.al.picUrl" mode=""></image>
      </view>
      
      <!-- 进度条控制区域 -->
      <view class="progressControl">
        <text>{{currentTime}}</text>
        <!-- 总进度条 -->
        <view class="barControl">
          <!-- 实时进度条 -->
          <view class="audio-currentTime-Bar" :style="{width:currentTimeWidth + 'rpx'}">
            <view class="audio-circle">
              
            </view>
          </view>
        </view>
        <text>{{durationTime}}</text>
      </view>
      <!-- 底部控制播放区域 -->
      <view class="musicControl">
        <text class="iconfont icon-iconsMusicyemianbofangmoshiShuffle"></text>
        <text class="iconfont icon-shangyishou" id="pre" @click="handleSwitch"></text>
        <text :class="['iconfont',isPlay?'icon-zanting':'icon-bofang','big']" @click="handleMusicPlay"></text>
        <text class="iconfont icon-next" id="next" @click="handleSwitch"></text>
        <text class="iconfont icon-iconsMusicyemianbofangmoshiPlayList"></text>
      </view>
    </view>
</template>

<script>
import request from '../../utils/request';
import PubSub from 'pubsub-js'
import moment from 'moment'
const app=getApp();
  export default {
    data() {
      return {
        isPlay:true,
        song:{},
        musicLink:'',
        id:0,
        currentTime:'00:00',//实时时间
        durationTime:'00:00',//总时长
        currentTimeWidth:0,//实时进度条的宽度
        // lyric: [],//歌词
        // lyricTime: 0,//歌词对应的时间
        // currentLyric: "",//当前歌词对象
      };
    },
    onLoad(options){
      let musicId=options.songId
      this.getMusicInfo(musicId)
      if(app.globalData.isMusicPlay && app.globalData.musicId ===musicId){
        this.isPlay=true
      }else{
        this.isPlay=false
        this.currentTime='00:00'
        this.currentTimeWidth=0
      }
      //创建控制音乐播放的实例
      
      this.backgroundAudioManager=uni.getBackgroundAudioManager()
      this.backgroundAudioManager.onPlay(() =>{
        this.changePlay(true)
        app.globalData.musicId=musicId
      })
      this.backgroundAudioManager.onPause(()=>{
        this.changePlay(false) 
      })
      this.backgroundAudioManager.onStop(()=>{
        this.changePlay(false) 
      })
      // 音乐播放完自动播放下一首
      this.backgroundAudioManager.onEnded(()=>{
        PubSub.publish('switchType','next')
        PubSub.subscribe('musicId',(msg,musicId)=>{
          // console.log(musicId);
          this.getMusicInfo(musicId)
          this.musicControl(true,musicId)
          PubSub.unsubscribe('musicId',musicId)
        })
        this.currentTime='00:00'
        this.currentTimeWidth=0
      })
      //监听音乐实时播放的进度
      this.backgroundAudioManager.onTimeUpdate(()=>{
        // console.log('总时长',this.backgroundAudioManager.currentTime);
        let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
        let currentTimeWidth=this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
        // console.log(currentTimeWidth);
        this.currentTimeWidth=currentTimeWidth
        this.currentTime=currentTime
      })
    },
    methods:{
      changePlay(isPlay){
        this.isPlay=isPlay
        app.globalData.isMusicPlay=isPlay
      },
      handleMusicPlay(){
         this.isPlay = !this.$data.isPlay
        this.musicControl(this.isPlay,this.$data.id,this.$data.musicLink)
      },
      async musicControl(isPlay,id,musicLink){
        if(isPlay){
          if(!musicLink){
            let musicdata=await request('/song/url',{id:id})
            // console.log(musicdata);
            let musicLink=musicdata.data[0].url
            this.musicLink=musicLink
          }   
          // console.log(musicLink);
          this.backgroundAudioManager.src=this.musicLink
          this.backgroundAudioManager.title=this.$data.song.name
        }else{
          this.backgroundAudioManager.pause();
        }
      },
      async getMusicInfo(musicId){
        let songData =await request('/song/detail',{ids:musicId})
        // console.log(songData);
        this.song=songData.songs[0]
        let time=songData.songs[0].dt
        // console.log(time);
        this.durationTime=moment(time).format('mm:ss')
        this.id=songData.songs[0].id
        uni.setNavigationBarTitle({
          title:this.$data.song.name,
        })
      },
      handleSwitch(event){
         let type=event.currentTarget.id;
         // console.log(type);
         this.backgroundAudioManager.pause()
         PubSub.subscribe('musicId',(msg,musicId)=>{
           // console.log(musicId);
           this.getMusicInfo(musicId)
           this.musicControl(true,musicId)
           PubSub.unsubscribe('musicId',musicId)
         })
         PubSub.publish('switchType',type)
      }
    }
  }
</script>

<style lang="scss">
//整体背景
.songDetailContainer{
  height: 100vh;
  // background: linear-gradient(to bottom,  #a8a8a8 80%,#808080);
  background: linear-gradient(to bottom,  #a8a8a8 40%,#eeeded);
  filter: blur(0.2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}
.songDetailContainer:after{
  width: 100%;
  height: 100%;
  background: inherit;
  position: absolute;
  left: 0;
  top: 0;
  
  z-index: 2;
}
//底座
.author{
  font-size: 14px;
}
.circle{
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #fff;
  margin: 5px 0;
  z-index: 100;
}
//摇杆
.needle{
  width:192rpx;
  height:274rpx;
  position: relative;
  top: -40rpx;
  left: 60rpx;
  z-index: 20;
  transform: rotate(-20deg);
  transform-origin: 40rpx 0;
  transition: 1s;
  }
//磁盘
.discContainer{
  position: relative;
  top: -170rpx;
  // left: -25rpx;
  // z-index: 100;
  width: 598rpx;
  height: 598rpx;
  // border: 1rpx solid red;
}
.disc{
  width: 598rpx;
  height: 598rpx;
}
.musicImg{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 370rpx;
  height: 370rpx;
  border-radius: 50%;
}
.needleRotate{
  transform: rotate(0deg);
}
.discAnimation{
  animation:disc 4s 1s linear infinite;
}
@keyframes disc{
  from{
    transform: rotate(0deg);
  }to{
    transform: rotate(360deg);
  }
}
.musicControl{
  display: flex;
  // margin-bottom: 10px;
  position: absolute;
  bottom: 30px;
  border-top:1px solid #fff;
  width: 100%;
}
.musicControl text{
  height: 60px;
  width: 20%;
  text-align: center;
  line-height: 60px;
  margin-top: 10px;
  // justify-content: center;
  // justify-items: center;
  font-size: 25px;
  color: #fff;
}
.musicControl text.big{
  font-size: 50px;
}
// 进度条
.progressControl{
  position:absolute;
  bottom: 230rpx;
  width:640rpx;
  height: 80rpx;
  line-height: 80rpx;
  display: flex;
  // border: 1px solid red;
}
//总进度条
.barControl{
  position: relative;
  width: 450rpx;
  height: 4rpx;
  background: rgba(0, 0, 0, 0.4);
  margin: auto;
}
//实时进度条
.audio-currentTime-Bar{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 4rpx;
  background: red;
}
// 小圆点
.audio-circle{
  position:absolute;
  top: -4rpx;
  right: -10rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #fff;
}
</style>
