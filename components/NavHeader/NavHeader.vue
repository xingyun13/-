<template>
  <view>
    <view class="header">
      <text class="title">{{title}}</text>
      <view>
        <text>{{text}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"NavHeader",
    props:{
      title:{
        type:String,
        default:"我是title默认值",
      },
      text:{
        type:String,
        default:"我是text默认值"
      }
    },
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss">
 .header{
    padding-bottom:10px;
  }
   .header .title{
    font-size: 14px;
    line-height: 40px;
    color: #666;
  }
   .header .more{
    float:right;
    border:1px solid #333;
    padding:5px 10px;
    font-size:13px;
    border-radius: 15px;
  }
</style>