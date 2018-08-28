<template>
  <div class="experienceList">
         <!--有网络状态-->
       <div v-if="!noFetch" v-show="!isloading">
       
           <!--展示上拉加载的数据列表-->
        <ul class="listCenter"
               v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"  v-show="true">
                <li class="listItem" v-for="(item,i) of   listHome" :key="i" @click="toMap(item.store_id)">
                  <p class="topItem"><span class="leftName">{{item.member_name}}</span><span class="rightText">距离：{{item.distance}}</span></p>  
                  <div class="clearboth"></div>   
                  <div class="aboutShop">{{item.personal_desc==null?'未填写':item.personal_desc}}</div>
                </li>
                
              </ul>
                 <div class="noMore" v-if="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
           <!--暂无数据-->
                <div class="noNull" v-if="noData">
                  <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
                  <p>暂无数据</p>   
              </div> 

         
       </div>
        <ul class="noFetch" v-else @click="loadFetch()"  v-show="!isloading"> 
        <img src="../../assets/noFetch.png" />
        <p>网络不给力，点击刷新</p>
      </ul>  
        
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
axios.defaults.timeout = 3000
import { Toast,Indicator} from 'mint-ui';

export default {
  name: 'experienceList',
  props:{
     pageSize:Number,
     default:10
  }, 
    
  data () {
    return {
     noData:false, //数据为空 
     noFetch:false,
     listHome:[],
     defaultImg:'this.src="' + require('../../assets/noNull.png') + '"', 
      pageNum:0,
      noMore:false,
      showMore:false,
      isMore:false,
      haveMore:false, //是否还有更多内容
      isCount:0,
    }
  },
  computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
   
    
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
     var that=this;
     that.$store.commit("increatement");
      Indicator.open({
        text: '加载中..',
        spinnerType: 'fading-circle'
      }); 
      setTimeout(()=>{
        that.fetchHome();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    } 
  },
  methods:{
   
    fetchHome(){  //第一次加载
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
       axios({
          method: 'POST',
           url: domain+'/mobile/index.php?act=index&op=store_list',
           data:{
             lat:that.$route.query.lat,
             lng:that.$route.query.lng,
             curpage:++that.pageNum
           },
           transformRequest: [function (data) {
              let ret = ''
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret
            }],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }).then(function(response){
              that.$store.commit("decrement");
               Indicator.close();
              if(response!=undefined){
                if(response.data.code==200){
              var results=response.data.datas; 
              
                if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.listHome=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.listHome=that.listHome.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }else{ //加载第N页面
                   if(results.length==0){
                  that.haveMore = false;
                  that.isMore=true;
                  that.showMore=true;
                  that.pageNum--
                }else{
                   that.listHome=that.listHome.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                }
               } 
           }else{
             that.noData=true;               
               Toast(response.data.datas.error);
           }
              }else{
                $(".noMore").css('display','none');
                that.noFetch=true;
               that.showMore=true;
              }
          },(err)=>{
             that.noFetch=true;
          });
    },
    loadMore(){  //加载更多
        if(this.haveMore){
           this.loading = true;
           this.showMore=false;
           this.isCount=1;
           this.fetchHome();
        }
       
    },
     
   
    toMap(ids){
      console.log("导航到地图");
        var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
        window.location.href=domain+"#/experiencelDetail/"+ids+"?lat="+this.$route.query.lat+"&lng="+this.$route.query.lng;
    },
    
      loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
           this.fetchHome();
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
a {
  color: #42b983;
}
.experienceList {
  height: 100vh;
}
/*
*加载状态
*/
.loading{
  width:100%;
  height:100%;
  text-align:center;
}
.loading img{
  width:6.4rem;
  height:6.4rem;
  padding-top:100px;
  text-align:center;
}
.loading{
  font-size:1.4rem;
  color:#333;
}
/*
*加载中
*/
.textloading{
    width: 100%;
    text-align: center;
    color: #333;
    height: 36px;
    font-size: 1.5rem;
}
.textloading img{
  width:2.4rem;
  height:2.4rem;
}

/*
*暂无数据
*/
.noNull{
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
    justify-content:center;
    flex-direction: column;
    align-items:center;
    width:100%;
     height:100vh;
    background-color: #fff;
}
.noMessage{
    width: 8rem;
    height: 8rem;

}
.noNull p{
  font-size: 14px;
  color: #999999;
  line-height: 60px;
}
/*网络状态*/
.noFetch{
    padding-top:100px;
    color: #999999;
    font-size: 14px;
    display:block;
    width:100%;
    text-align:center;
    background-color: #f4f4f4;
}
.noFetch img{
    width: 94px;
    height: 94px;
}
.noFetch p{
    line-height: 36px;
}
.btnFetch{
    width: 82px;
    height: 36px;
    background-color: #00BCD4;
    color: #ffffff;
    font-size: 16px;
    letter-spacing: 4px;
    border-radius: 5px;
}



.listCenter{
       height: auto;
       background-color: #fff;
}

.listItem{
  display: block;
    text-align: left;
    border-bottom: 1px solid #d9d9d9;
    background-color: #ffffff;
    width: 100%;
    height: 6.4rem;
    font-size: 1.5rem;
    line-height: 26px;
    min-height: 6rem;
    color: #666;
}
.listItem:last-of-type{
  border-bottom:0px none;
}
.topItem{
  padding-top:10px;
}
.leftName{
  margin-left: 10px;
}
 .rightText{
       float: right;
    margin-right: 10px;
 }
.aboutShop{
      margin-left: 10px;
}

.clearboth{
  clear:both;
}
.centerCreated{
  color:#666;
}
.look_click{
  color:#666;
}
</style>

