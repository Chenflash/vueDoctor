<template>
    <div id="app">	
     <keep-alive>
    <!--缓存-->
     <transition :name="transitionName"> 
    <router-view v-if="$route.meta.keepAlive" class="clearTop"></router-view>
    </transition>
   </keep-alive>
 
   <!--不缓存-->
   <router-view v-if="!$route.meta.keepAlive"  class="clearTop"></router-view>
  </div>
</template>

<script>
import store from './VueX/store'
import {mapState,mapGetters,mapActions,mapMutations}from'vuex' 
import axios from 'axios'
export default {
  name: 'App',
  created(){
  	var u = navigator.userAgent;
  	
  },
  computed:{
 
  },
  data(){
   return{
     　transitionName: 'slide-right'  // 默认动态路由变化为slide-right
   }
  },
  watch: {
　　　'$route' (to, from) {
　　　　let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
　　　　　　if(isBack) {
　　　　　　　　this.transitionName = 'slide-right'
　　　　　　} else {
　　　　　　       this.transitionName = 'slide-left'
　　　　　}
　　this.$router.isBack = false
　　}
  },
   methonds:{
    
   },
  
}
</script>

<style>
* {
				margin: 0;
				padding: 0;
}

/*vue*/
			[v-cloak] {
			  display: none;
			}
html,body{
  font-size:10px;
  background-color: #f2f2f2;
}
input,button,select,textarea{ outline:none;}
textarea{resize:none}
ol,ul,li{
	list-style: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*增加该属性可以增加弹性*/
  -webkit-overflow-scrolling: touch;
}
iframe{
  opacity:0  !important;
  display:none !important;
  z-index:-999;
}
input{ 
-webkit-appearance: none;   /*兼容ios的内影效果*/
-webkit-tap-highlight-color:rgba(0,0,0,0);


}
::-webkit-scrollbar {/*隐藏滚轮*/
　　display: none;
}

textarea{ 
-webkit-appearance: none;   /*兼容ios的内影效果*/
-webkit-tap-highlight-color:rgba(0,0,0,0);
}
button{
  -webkit-appearance: none;   /*兼容ios的内影效果*/
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}
img{
  background-size:cover;
  vertical-align:middle;
}
.mint-navbar .mint-tab-item.is-selected{
 border-bottom:0px none !important;
}
.mint-header{
    background-color: #00BCD4 !important;
    font-size:1.8rem !important;;
    height: 56px !important;
    width: 100%;
    padding-top: 10px !important;
    position:fixed !important;
    z-index: 1200
   
}
.mintui{
  font-size:1.8rem !important;; 
}
.mint-header-title{
  font-size:1.8rem;
  padding-top:5px;
  z-index:999;
}
.mint-cell-title{
  position:absolute !important;
  left:20px !important;
  
}
.mint-button-icon{
  color:#ffffff !important;
}
.mint-tab-item-label{
  font-size:1.4rem !important; 
}

/*
*滚动刷新
*/
.loading-background, .mint-loadmore-top span {
    -webkit-transition: .2s linear;
    transition: .2s linear
}
.mint-loadmore-top span {
    display: inline-block;
    vertical-align: middle
}

.mint-loadmore-top span.is-rotate {
}

.page-loadmore .mint-spinner {
    display: inline-block;
    vertical-align: middle
}

.page-loadmore-desc {
    text-align: center;
    color: #666;
    padding-bottom: 5px
}

.page-loadmore-desc:last-of-type,
.page-loadmore-listitem {
    border-bottom: 1px solid #eee
}

.page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    text-align: center
}

.page-loadmore-listitem:first-child {
    border-top: 1px solid #eee
}

.page-loadmore-wrapper {
    overflow: scroll;
    background-color:rgba(255,255,255,0.8) !important;
}

.mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
}

.mint-loadmore-bottom span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
}
.more_loading{
  width:100%;
  margin-top: 30px !important;
  margin-bottom: 30px !important;
  text-align: center;
  font-size:1.4rem;
}
.loadings{
  background-color: #ffffff;
  padding-top: 150px !important;
}
.mint-msgbox-header{
     font-size: 1.4rem;
    border-bottom: 1px solid #ddd;
}

.mint-msgbox-confirm{
 color:#00BCD4 !important;
}
/*时间组件重置*/
.wh_content_item .wh_isToday{
 background: #ff8900 !important;
}
.wh_content_item .wh_chose_day{
  background-color: #e07e0bfc;
}
.mint-datetime-action{
  color:#ff8900 !important;
}
/*
*动画切换
*/
.slide-left-enter,
 .slide-right-leave-active {
     opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
     opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100% 0);
}

/*
*没有更多
*/
.noMore{
  margin-top:50px !important;
  margin-bottom:10px !important;
}
.TwoNomore{
   margin-top:50px !important;
  margin-bottom:10px !important;
}
.picker-items{
  background-color:#fff !important;
}
.mint-msgbox-content{
 padding: 20px 22px 22px !important;
}
</style>

