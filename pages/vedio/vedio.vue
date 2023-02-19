<template>
  <view>
    <view class="" v-if="">
      
    </view>
    <!-- 头部区域 -->
    <view class="videoContainer">
      <view class="header">
        <image src="../../static/images/logo.png"></image>
        <view class="search" @click="toSearch()">
          <text>搜索音乐</text>
        </view>
        
      </view>
    </view>
    <!-- 导航区域 -->
    <scroll-view scroll-x enable-flex class="navScroll" :scroll-into-view="'scroll'+navId" scroll-with-animation>
      <view class="navItem" v-for="(item,i) in videoList" :key="item.id" :id="'scroll'+item.id">
        <view :class="[navId===item.id?'active':'']" @click="changeNav(item.id)">
          {{item.name}}
        </view>
      </view>
    </scroll-view>
    <!-- 视频列表区域 -->
    <scroll-view 
    scroll-y  
    class="videoScroll" 
    @refresherrefresh="handlefresh()" 
    refresher-enabled="true"
    :refresher-triggered="isRefresher"
    @scrolltolower="handleToLower()"
    >
      <view class="videoItem" v-for="(item,i) in videoLists" :key="i">
        <video :src="item.url" controls   @click="handlevideo(item.id)" :id="item.id" objectFit="fill"></video>
        <view class="content">{{item.data.title}}</view>
              <view class="footer">
                <image class="avatar" :src="item.data.creator.avatarUrl"></image>
                <text class="nickName">{{item.data.creator.nickname}}</text>
                <view class="comments_praised">
                  <text class="item">
                    <text class="iconfont icon-buoumaotubiao15"></text>
                    <text class="count">{{item.data.praisedCount}}</text>
                  </text>
                  <text class="item">
                    <text class="iconfont icon-pinglun1"></text>
                    <text class="count">{{item.data.commentCount}}</text>
                  </text>
                  <button open-type="share" class="item btn">
                    <text class="iconfont icon-gengduo"></text>
                  </button>
                </view>
              </view>
      </view>
      
    </scroll-view>
  </view>
</template>

<script>
import { title } from 'process';
import request from '../../utils/request';
  export default {
    data() {
      return {
        videoList:[],
        navId: '',
        videoLists:[],
        isRefresher:false,
        arr:[]
      };
    },
    onLoad(){
      this.getvedioList()
    },
    methods:{
      async getvedioList(){
        const res=await request('/video/group/list');
        this.videoList=res.data.slice(0,14)
        this.navId=res.data[0].id
        // console.log(this.navId);
        // console.log(this.videoList);
        this.getvedioListData(this.$data.navId)
      },
      changeNav(id){
        this.navId=id
        // console.log(this.navId);
        uni.showLoading({
          title:"正在加载"
        })
        this.getvedioListData(this.$data.navId)
      },
      async getvedioListData(navId){
         if (!navId) return;
            let result = await request('/video/group', {id:navId})
            uni.hideLoading();
            let videoListData=await Promise.all(result.datas.map(async item=>{
              item.id=item.data.vid
              let result=await request('/video/url',{id:item.id})
              item.url=result.urls[0].url
              return item
            }))
            this.videoLists=videoListData
            this.isRefresher=false
        // console.log(this.videoLists);
      },
      handlevideo(id){
        let vid=id;
        //&&如果第一个表达式为真才会执行第二个表达式
        this.vid !== vid && this.videoContent && this.videoContent.stop();
        this.vid=vid;
        this.videoContent=uni.createVideoContext(vid);        
      },
      handlefresh(){
        // console.log("123");
        this.isRefresher=true;
        this.getvedioList(this.$data.navId)
      },
      async handleToLower(){  //上拉加载
       let arr = this.$data.arr
       let trigger = console.log('抛出的记录点');
       arr.push(trigger)
       let start = 0;
      for (let i = 0; i < arr.length; i++) {
        start++
      }
        let navId = this.$data.navId
        let getVideoMoreListData = await request('/video/group',{id:navId,offset:start})
         // console.log(getVideoMoreListData);
        let videoListData=await Promise.all(getVideoMoreListData.datas.map(async item=>{
          item.id=item.data.vid
          let result=await request('/video/url',{id:item.id})
          item.url=result.urls[0].url
          return item
        }))
        let videoList = this.$data.videoLists
        videoList.push(...videoListData)
        // console.log(vide);
        this.videoLists=videoList
        console.log(this.videoLists);
        },
        onShareAppMessage: function( {from} ){
          
          if(from==='button'){
            return{
            title:'确定要转发吗?(button)',
            page:'/pages/vedio/vedio',
            }
          }else{
            return{
              title:'确定要转发吗?(menu)',
              page:'/pages/vedio/vedio',
            }
            
          }
          },
          toSearch(){
            uni.navigateTo({
              url:'/pages/search/search'
            })
          }
      }
    }
</script>

<style lang="scss">
.videoContainer .header{
  display: flex;
  justify-content: space-between;
}
.videoContainer .header image{
  width: 30px;
  height: 30px;
  padding-left: 5px;
}
.videoContainer .header .search{
  width: 100%;
  border: 1px solid #eee;
  border-radius: 15px;
  margin-left: 5px;
}
.videoContainer .header .search text{
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: center;
    color: #d43c33;
}
.navScroll{
  display: flex;
  height: 35px;
  white-space: nowrap;
}
.navScroll .navItem{
  padding:0 15px;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}
.navScroll .navItem .active{
  border-bottom: 1px solid #d43c33;
}
.videoScroll{
  margin-top: 5px;
  height: calc(100vh - 72px);
}
.videoItem{
  padding: 0 3%;
}
.videoItem video{
  width: 100%;
  height: 180px;
  border-radius: 5px;
}
.videoItem .content {
  font-size: 26rpx;
  height:80rpx;
  line-height: 80rpx;
  max-width: 500rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* footer */
.footer {
  border-top: 1rpx solid #eee;
  padding: 20rpx 0;
}
.footer .avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  vertical-align: middle;
}

.footer  .nickName {
  font-size: 26rpx;
  vertical-align: middle;
  margin-left: 20rpx;
}

.footer .comments_praised {
  float: right;
}

.comments_praised .btn {
  display: inline;
  padding: 0;
  background-color: transparent;
  border-color: transparent;
}

.comments_praised .btn:after {
  border: none;
}

.comments_praised .item {
  margin-left: 50rpx;
  position: relative;
}

.comments_praised .item .count {
  position: absolute;
  top: -20rpx;
  font-size: 20rpx;
}
</style>
