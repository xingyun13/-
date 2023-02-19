<template>
  <view>
    <view class="listSongContainer">
      <image :src="listImg"></image>
    </view>
      <!-- 头部 -->
      <view class="header">
        <view class="left">
          <image :src="listImg"></image>
        </view>
        <view class="right">
          <view class="toptext">
            <text class="discribe">{{discribe}}</text>
          </view>
          <view class="bottomtext">
            <view class="">
              <text class="creator">作者:{{creatorName}}</text>
            </view>
            <view class="description">
              <text class="descriptions">{{description}}</text>
            </view>  
          </view>
        </view>
      </view>
      
      <!-- 列表区域 -->
        <view class="ListContainer">
          <view class="listHeader">
            <text>播放全部</text>
            <text class="changeMore">多选</text>
          </view>
          <!-- 歌曲 -->
              <scroll-view scroll-y="true" class="listScroll">
              <view class="scrollItem" v-for="(item,i) in playList" :key="i" @click="toSongDetail(item,i)">
                  <text class="scrollitemtext">{{i + 1}}</text>
                  <image :src="item.al.picUrl"></image>
                  <view class="musicInfo">
                    <text class="musicName">{{item.name}}</text>
                    <text class="musicAuthor">{{item.ar[0].name}}</text>
                  </view>
                  <text class="iconfont icon-gengduo"></text>
                </view>
              </scroll-view>
        </view>
  </view>
</template>

<script>
  import request from '../../utils/request.js'
  import PubSub from 'pubsub-js'
  export default {
    data() {
      return {
        listid:'',//歌单id
        playList:[],//歌曲对象
        listImg:'',//歌单图片
        discribe:'',//歌单描述
        index:0,//下标
        creatorName:'',
        description:'',
      }
      },
      onLoad(options){
        let listid = options.id
        console.log(options);
        this.listid=listid
        this.getPlayList(listid)          
        PubSub.subscribe('switchType',(msg,type)=>{
          // console.log(msg,data);
          let {playList,index}=this.$data
          if(type === 'pre'){
            (index ===0) && (index = playList.length)
            index -=1;
          }else{
            (index=== playList.length-1) && (index=-1)
            index +=1;
          }
          this.index=index
          let musicId=playList[index].id
          PubSub.publish('musicId',musicId)
          })
      },
      methods:{
        //获取歌单所对应的歌曲
          async getPlayList(listid){
            // console.log('123');
              let playListData = await request("/playlist/detail",{id: listid})
              console.log(playListData)
              this.playList=playListData.playlist.tracks
              this.listImg=playListData.playlist.coverImgUrl
              this.discribe=playListData.playlist.name
              this.creatorName=playListData.playlist.creator.nickname
              let res=playListData.playlist.description
              let data=res.toString()
              console.log(data);
             
              this.description=playListData.playlist.description
              // console.log(this.description);
          },
          toSongDetail(item,i){
            let song=item
            this.index=i
            uni.navigateTo({
              url:'/pages/songDetail/songDetail?songId=' +song.id
            })
          }
      }
    }
  
</script>

<style lang="scss">
  .listSongContainer{
    width: 100%;
    height: 300rpx;
    background-color: #eee;
    filter: blur(50px);
    // z-index: 1;
  }
  .listSongContainer image{
    width: 100%;
    height: 200rpx;
  }
  .header{
    display: flex;
    justify-content: space-between;
  }
.header image {
  position: absolute;
  top: 3px;
  left: 3px;
  // margin: auto;
  padding: 10px;
  width: 250rpx;
  height: 250rpx;
  // z-index: 10;
}
.header .toptext .discribe {
  position: absolute;
  top: 15px;
  right: 70px;
  width: 300rpx;
  height: 100rpx;
  color: white;
  font-size: 30rpx;
}
.header .right{
  display: flex;
  flex-direction: column;
}
.right .bottomtext{
  display: flex;
  flex-direction: column;
}
.right .bottomtext .creator{
  position: absolute;
  top: 85px;
  right: 70px;
  color: white;
  font-size: 13px;
  display: block;
  width: 150px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right .bottomtext .description{
   display: flex;
   width: 100px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right .bottomtext .description .descriptions{
  display: block;
  position: absolute;
  height: 30px;
  width:200px;
  line-height: 30px;
  overflow: hidden;
  top: 95px;
  right: 20px;
  // width: 150px;
  color: white;
  font-size: 13px;
}
/* 列表 */
.ListContainer {
  position: relative;
  top: -5rpx;
  padding: 0 20rpx;
  border-radius: 30rpx;
  background: #fff;
}
.listHeader {
  height: 80rpx;
  line-height: 80rpx;
}
.listHeader .changeMore {
  float: right;
}
/* 歌曲 */
.listScroll {
  height: calc(100vh - 380rpx);/*整体高度减去除了scroll-view的元素的高度，即可得到只使得scroll-view元素滑动效果*/
}
.scrollItem {
  display: flex;
  position: relative;
  margin-bottom: 20rpx;
}
.scrollItem image {
  height: 80rpx;
  width: 80rpx;
  border-radius: 8rpx;
  margin-left: 25px;
}
.musicInfo {
  display: flex;
  flex-direction: column;
  margin-left: 20rpx;
}
.musicInfo text {
  height: 40rpx;
  line-height: 40rpx;
  font-size: 13px;
  max-width: 400rpx;/*最长文本长度*/
  white-space: nowrap;/*不允许换行*/
  overflow: hidden;/*超过部分隐藏*/
  text-overflow: ellipsis;/*超过部分换为省略号*/
}
.scrollItem .iconfont{
  position: absolute;
  right: 10rpx;
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: right;
}
.scrollitemtext{
  position: absolute;
  top: 10px;
  left: 0;
  height: 40rpx;
  width: 40rpx;
  line-height: 40rpx;
  text-align: center;
  color: black;
}
</style>
