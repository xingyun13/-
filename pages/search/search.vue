<template>
  <view>
    <view class="searchContainer">
      <view class="header">
        <text class="iconfont icon-search1 searchIcon"></text>
        <view class="searchInput">
          <input type="text" :value="searchContent" :placeholder="placeholderContent" placeholder-class="placeholder" @input="handleInputChange" />
          <text class="clear" @click="handleSearchContent" v-show="searchContent">X</text>
        </view>
          <text class="search">搜索</text>
      </view>
      

        <block v-if="searchList.length">
              <!-- 搜索内容展示 -->
              <view class="showSearchContent">
                <view class="searchContent">搜索内容：{{searchContent}}</view>
                <view class="searchList">
                  <view class="searchItem" v-for="(item,i) in searchList" :key="i">
                    <text class="iconfont icon-search1"></text>
                    <text @click="toSongDetail" :id="item.id" class="content">{{item.name}}</text>
                    <text class="artists">{{item.artists[0].name}}</text>
                  </view>
                </view>
              </view>
            </block>
      
      <block v-else>
        <view class="history" v-if="historyList.length">
          <view class="headerSearch">
            <view class="title">搜索历史</view>
            <text class="iconfont icon-shanchu delete" @click="clearHistoryList"></text>
          </view>
          <view class="bottomHistory">
            <view class="historyItem" v-for="(item,i) in historyList" :key="i" @click="searchHistory">{{item}}</view>
          </view>
        </view>
        
      <view class="hotContainer">
        <view class="title">热搜榜</view>
        <!-- 热搜列表 -->
        <view class="hotList">
          <view class="hotItem" v-for="(item,i) in hotList" :key="i">
            <text class="order">{{i +1}}</text>
            <text class="order" @click="searchHotSong">{{item.searchWord}}</text>
            <image :src="item.iconUrl" class="iconImg"></image>
          </view>
          </view>
      </view>
      </block>
      </view>
  </view>
</template>

<script>
  import request from '../../utils/request.js'
  let isSend = null;//函数节流使用
  export default {
    data() {
      return {
        placeholderContent:'',//搜索框内容的默认值
        hotList:[],
        searchContent:'',
        searchList: [],//匹配到的数据
        historyList: [],//历史搜索记录
      };
    },
    onLoad(){
      this.getInitData()
      this.getHotData()
      //获取本地历史记录
      this.getSearchHistory();
    },
    methods:{
      async getInitData(){
        const res=await request('/search/default')
        this.placeholderContent=res.data.showKeyword
      },
      async getHotData(){
        const res=await request('/search/hot/detail')
        this.hotList=res.data
        console.log(res.data);
      },
      //获取本地历史记录
        getSearchHistory(){
          let historyList =  uni.getStorageSync('searchHistory');
          if(historyList){
          this.historyList=historyList
          }
        },
        clearHistoryList(){
          uni.showModal({
            content:'确定删除所有记录吗?',
            success: (res) => {
              if(res.confirm){
                this.historyList=[]
                uni.removeStorageSync('searchHistory')
              }
            }
          })
        },
        handleSearchContent(){
          this.searchContent=''
          this.searchList=[]
        },
        // 表单项内容发送改变的回调（设置防抖）
        handleInputChange (event) {
          if(isSend){
            clearTimeout(isSend) 
        }
          isSend = setTimeout(() => {
          // 更新数据
          this.searchContent=event.detail.value.trim()
          // 获取搜索数据
          this.getSearchListData();
        },300); 
        },   
        async getSearchListData(){
          //当搜索内容为空时就不发送请求并清空内容
              if(!this.$data.searchContent){
                this.searchList=[]
                return;
              }
          
              let {searchContent, historyList} = this.$data;
              let searchListData = await request('/search', {keywords: searchContent, limit: 10});
              this.searchList=searchListData.result.songs    
              console.log(this.searchList);
              //将搜索关键字添加到历史记录
              if(historyList.indexOf(searchContent) !== -1){
                historyList.splice(historyList.indexOf(searchContent), 1)
              }
              historyList.unshift(searchContent)
              this.historyList=historyList
              //存储到本地
              uni.setStorageSync('searchHistory', historyList)
        },
        //点击热搜榜进行搜索
          searchHotSong(event){
            this.searchContent=event.currentTarget.dataset.hotwords
            //发请求获取搜索匹配到的数据
            this.getSearchListData();
          },
          //点击历史记录进行搜索
          searchHistory(event){
            console.log(event);
              this.searchContent=event.currentTarget.dataset.historyword
              this.getSearchListData();
            },
            //跳转到歌曲详情页面
           toSongDetail(event){
                uni.navigateTo({
                  url: '/pages/songDetail/songDetail?songId=' + event.currentTarget.id
                })
              },
    }
  }
</script>

<style lang="scss">
.searchContainer{
  padding: 0 10px;
}
.header{
  display: flex;
  height: 60rpx;
  line-height: 60rpx;
  padding: 5px 0;
}
.searchInput{
  position: relative;
  flex: 1;
  background: rgba(237, 237, 237, 0.3);
  border-radius: 15px;
}
.search{
  width: 100rpx;
  text-align: center;
  font-size: 15px;
  
}
.searchInput input{
  margin-left: 25px;
  height: 30px;
}
.searchIcon{
  position: absolute;
  left: 15px;
}
.placeholder{
  font-size: 14px;
  color: #dbdbdd;
  margin-left: 5px;
}

// 热搜榜
.hotContainer .title{
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1rpx solid #eee;
}
.hotList{
  display: flex;
  flex-wrap: wrap;
}
.hotItem{
  width: 50%;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
}
.hotItem .order{
  margin: 0 5px;
}
.iconImg{
  height: 10px;
  width: 20px;
  margin-left: 5px;
}
/* 搜索结果区域 */
.searchContent {
  color: rgb(147, 166, 229);
  height: 80rpx;
  line-height: 80rpx;
  font-size: 24rpx;
  border-bottom: 1rpx solid #d43c33;
}
.searchItem {
  height: 80rpx;
  line-height: 80rpx;
  display: flex;
}
.searchItem .content {
  // flex: 1;//使一行铺满
  margin-left: 20rpx;
  border-bottom: 1rpx solid #eee;
}
/* 历史记录 */
.history {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 20rpx 0;
}
.history .title {
  font-size: 28rpx;
  height: 50rpx;
  line-height: 50rpx;
}
.bottomHistory{
  position: relative;
  display: flex;
  flex-flow: wrap;
  margin: 20rpx 0;
}
.history .historyItem {
  // display: flex;
  font-size: 26rpx;
  height: 50rpx;
  // width: 60rpx;
  line-height: 50rpx;
  // align-items: center;
  background: #ededed;
  margin-left: 10rpx;
  padding: 0 30rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}
.headerSearch{
  display: flex;
  justify-content: space-between;
}
.history .delete {
  // position: absolute;
  // bottom: 26rpx;
  // right: 10rpx;
  
  font-size: 36rpx;
}
.clear{
  position: absolute;
  font-size: 15px;
  top: 0;
  right: 15px;
  z-index: 10;
}
.artists{
  display: flex;
  margin-left: 15px;
}
</style>
