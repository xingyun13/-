<template>
	<view>
    <!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="banners" indicator-color="ivory" indicator-active-color="#d43c33">
		  <swiper-item v-for="(item,i) in List" :key="i"> 
		    <view class="swiper-item">
          <image :src="item.pic"></image>
        </view>
		  </swiper-item>
		</swiper>
    <!-- 五个图标导航栏区域 -->
    <view class="navContainer">
      <view class="navItem" @click="toRecommend()">
        <text class="iconfont icon-meirituijian"></text>
        <text>每日推荐</text>
      </view>
      <view class="navItem">
        <text class="iconfont icon-gedan1"></text>
        <text>歌单</text>
      </view>
      <view class="navItem">
        <text class="iconfont icon-icon-ranking"></text>
        <text>排行榜</text>
      </view>
      <view class="navItem">
        <text class="iconfont icon-diantai"></text>
        <text>电台</text>
      </view>
      <view class="navItem">
        <text class="iconfont icon-zhibobofangshexiangjitianxianxianxing"></text>
        <text>直播</text>
      </view>
    </view>
    
    <view class="recommendContainer">
      <NavHeader title="推荐歌曲" text="为你精心推荐"></NavHeader>
    </view> 
    <!-- 内容区 -->
    <scroll-view scroll-x="true" class="recommender" enable-flex>
      <view class="scrollItem" v-for="(item,i) in musicList" :key="i">
        <image :src="item.picUrl" :id="item.id" @click="toPlayList"></image>
        <text @click="toPlayList">{{item.name}}</text>
      </view>
    </scroll-view>
    <!-- 排行榜区域 -->
    <view class="popContainer">
      <!-- 头部区域 -->
      <NavHeader title="排行榜" text="热歌风向标"></NavHeader>
      <!-- 内容区域 -->
      <swiper class="toListSwiper" circular  next-margin="25px" >
        <swiper-item v-for="(item,i) in topList" :key="i">
          <view class="swiper-item1">
            <view class="title">{{item.name}}</view>
            <view class="musicItem" v-for="(item1,i) in item.tracks" :key="item1.id" >
              <image :src="item1.al.picUrl"></image>
              <text class="count">{{i+1}}</text>
              <text class="musicName" @click="toSongList" :id="item1.id">{{item1.name}}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
	</view>
</template>

<script>
import request from '../../utils/request.js'
	export default {
		data() {
			return {
				List:[],
        musicList:[],
        topList:[]
			}
		},
		onLoad() {
        this.getList()
        this.getMusic()
        this.getTopList()
		},
		methods: {
      async getList(){
       
        const result=await request('/banner',{type:2})
        this.List=result.banners
        // console.log(this.List);
      },
      async getMusic(){
        const res=await request('/personalized',{limit:10})
        // console.log(res);
        this.musicList=res.result
        // console.log(this.musicList);
      },
      async getTopList(){
        let allTopListData = await request('/toplist');
        let topList = allTopListData.list.slice(0, 4);
        // console.log(topList);
        let topListDetail = [];
        for (let item of topList) {
          let detailList = await request(`/playlist/detail?id=${item.id}`, { limit: 10 });
          // console.log(detailList);
          topListDetail.push({name: detailList.playlist.name, tracks: detailList.playlist.tracks.slice(0, 3)});
          // console.log(topListDetail);
          this.topList=topListDetail;
          // console.log(this.topList);
        }
        },
      // 更新topList的状态值，放在此处更新会导致发送请求的过程中页面长时间白屏，用户体验差
      // this.topList=resultArr
      // console.log(this.topList);
        toRecommend(){
          uni.navigateTo({
            url:'/pages/recommend/recommend',
            
          })
        },
        toSongList(event){
          uni.navigateTo({
            url:'/pages/songDetail/songDetail?songId=' + event.currentTarget.id
          })
        },
         //跳转到歌单歌曲列表页面
          toPlayList(event){
            console.log(event.currentTarget.id)
            uni.navigateTo({
              url: '/pages/playlist/playlist?id=' + event.currentTarget.id
            })
          },
      }
		}
	
</script>

<style lang="scss">
  banners{
    width: 100%;
    height:300rpx;
    }
  .swiper-item ,image{
    width: 100%;
    height: 100%;
  }
  
  .navContainer{
    display: flex;
  }
  .navItem{
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 20%;
  }
  .navItem .iconfont{
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    text-align: center;
    line-height: 100rpx;
    background: rgb(240, 19, 19);
    font-size: 50rpx;
    color: #fff;
    margin:20rpx 0;
  }
  
  .recommendContainer{
    padding:10px;
  }
  
  .recommender{
    display: flex;
    height: 150px;
    margin-left: 2px;
  }
  .popContainer {
    // display: flex;
    padding:5px 10px;
  }
  .scrollItem{
    width:100px;
    margin-right: 10px;
  }
  .scrollItem image {
      width: 100px;
      height: 100px;
      
  }
  .scrollItem text{
    font-size: 13px;
    // 单行文本溢出隐藏 省略号代替
    // display: block;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    
    // 多行文本溢出隐藏 省略号代替
    overflow:hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;//设置对其模式
    -webkit-line-clamp: 2;//设置多行的行数
  }
  .toListSwiper{
    height: 220px;
  }
  .musicItem{
    display: flex;
    margin-bottom: 10px;
  }
  .swiper-item1{
    width: 96%;
    background-color: #fbfbfb;
  }
  .swiper-item1 .title{
    font-size: 15px;
    line-height: 40px;
  }
  .musicItem image{
    height:50px;
    width: 50px;
    border-radius: 3px;
  }
  .musicItem .count{
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
  }
  .musicItem .musicName{
    // width: 80px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    max-width:200px;
    overflow: hidden;
    //强制不换行
    white-space: nowrap;
    //文本超出部分化为...
    text-overflow: ellipsis;
  }
</style>
