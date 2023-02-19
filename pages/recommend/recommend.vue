<template>
  <view>
    <!-- 头部区域 -->
    <view class="recommendContainer">
      <view class="header">
        <image src="/static/images/recommendSong/recommendSong.jpg" mode=""></image>
        <view class="date">
          <text class="month">{{month}}.</text>
          <text class="day">{{day}}</text>
        </view>
      </view>      
    </view>
    <!-- 列表区域 -->
    <view class="ListContainer">
      <view class="ListHeader">
        <text>播放全部</text>
        <text>全选</text>
      </view>
    </view>
    <!-- 内容区 -->
    <scroll-view scroll-y="true" class="listScroll">
      <view class="scrollItem" v-for="(item,i) in recommendList" :key="i" @click="toSongDetail(item,i)">
        <image :src="item.al.picUrl" mode=""></image>
      <view class="musicInfo">
        <text class="musicName">{{item.name}}</text>
        <text class="author">{{item.ar[0].name}}</text>
      </view>
      <view class="nav-item">
        <text class="iconfont icon-gengduo"></text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import request from '../../utils/request.js'
  import PubSub from 'pubsub-js'
  export default {
    
    data() {
      return {
        day:'',
        month:'',
        recommendList:[],
        song:{},
        index:0,//点击音乐id
      };
    },
    onLoad(){
      this.day=new Date().getDate()
      this.month=new Date().getMonth() + 1
      // this.isLogin();
      this.getRecommendList();
      PubSub.subscribe('switchType',(msg,type)=>{
        // console.log(msg,data);
        let recommendList=this.$data.recommendList
        let index=this.$data.index
        if(type === 'pre'){
          (index ===0) && (index = recommendList.length)
          index -=1;
        }else{
          (index=== recommendList.length-1) && (index=-1)
          index +=1;
        }
        this.index=index
        let musicId=recommendList[index].id
        PubSub.publish('musicId',musicId)
      })
    },
    methods:{
      isLogin(){
        let userInfo=uni.getStorageSync('userInfo');
          if(!userInfo){
            uni.showToast({
              title:"请先登录",
              icon:'none',
              success: () =>{
                //跳转至登录界面
                uni.reLaunch({
                  url:'/pages/login/login'
                })
              }
            })
          }
      },
      async getRecommendList(){
        const res=await request('/recommend/songs')
        // console.log(res);
        this.recommendList=res.data.dailySongs
        // console.log(this.recommendList);
      },
      toSongDetail(item,i){
        this.song=item
        this.index=i
        // console.log(item);
        let songList=this.song
        
        uni.navigateTo({
          //不能直接将songList对象作为参数传递，长度过长，会被自动截取
          // url:'/pages/songDetail/songDetail?songList=' + JSON.stringify(songList)
          url:'/pages/songDetail/songDetail?songId=' + songList.id
          })
        }      
    }
  }
</script>

<style lang="scss">
.recommendContainer .header{
  position: relative;
  width: 100%;
  height: 150px;
}
.recommendContainer .header image{
  width:100%;
  height: 100%;
}
.recommendContainer .header .date{
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  width:150px;
  height:50px;
  // border: 1px solid red;
  text-align: center;
  line-height: 50px;
  color:#fff;
}
.date{
  font-size: 20px;
  // font-weight: 700;
}
.listScroll{
  height: calc(100vh - 190px);
}
.ListContainer{
  position: relative;
  top:-10px;
  border-radius: 15px;
  background-color: #fff;
  padding: 0 10px;
}
.ListContainer .ListHeader{
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
}
.scrollItem{
  display: flex;
  position: relative;
  margin-bottom: 10px;
}
.scrollItem image{
  height: 40px;
  width: 40px;
  border-radius: 5px;
  margin-left: 10px;
}
.musicInfo{
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.musicInfo text{
  font-size: 13px;
  height: 25px;
  justify-content: center;
  // margin-left: 10px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.scrollItem .nav-item .iconfont{
  position: absolute;
  right: 0;
  top:50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  line-height: 40px;
  // text-align: right;
  // margin-left: 10px;
}
</style>
