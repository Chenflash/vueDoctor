<template>
  <div class="experiencelDetail">
     
         <!--有网络状态-->
       <div v-if="!noFetch" v-show="!isloading">
       
           <!--展示上拉加载的数据列表-->
           <div class="listContainer">
                <p class="topItem"><span class="leftName">{{exName}}</span><span class="rightText" style="color:#00BCD4" @click="toMap">导航到店</span></p>  
               <div class="clearboth"></div> 
               <div class="aboutShop">{{exAbout}}</div>
               <div class="tehotel">经营特色：{{manageNumber==null?'未填写':manageNumber}}</div> 
               <div class="tehotel">健康服务：{{serverice==null?'未填写':serverice}}</div> 
               <p class="className">店铺名称:{{exName==null?'未填写':exName}}</p>
               <p class="className">店铺地址：{{Adress==null?'未填写':Adress}}</p>
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
  name: 'experiencelDetail',
  props:{
     pageSize:Number,
     default:10
  }, 
    
  data () {
    return {
     noData:false, //数据为空 
     noFetch:false,
     defaultImg:'this.src="' + require('../../assets/noNull.png') + '"', 
      pageNum:0,
      noMore:false,
      showMore:false,
      isMore:false,
      haveMore:false, //是否还有更多内容
      isCount:0,
        exName:"",
        distance:"0.11km",
        exAbout:"",
        manageNumber:"",
        serverice:"",
        Adress:"",  
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
           url: domain+'/mobile/index.php?act=index&op=store',
           data:{
             store_id:that.$route.params.storeId
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
               var results=response.data.datas;
               that.exName=results.member_name;
               that.exAbout=results.personal_desc;
               that.manageNumber=results.speciality;
               that.serverice=results.service;
               that.Adress=results.member_address;
              
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
  
    toMap(){
      console.log("导航到地图");
      var lat=this.$route.query.lat;
      var lng=this.$route.query.lng;
      var address=this.Adress;
      console.log(lat,lng, address);
      app.toNavigation(lat,lng, address);
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
.experiencelDetail {
  height: 100vh;
  background-color: #fff;
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
.listContainer{
       text-align: left;
    font-size: 1.4rem;
    height: auto;
    min-height: 20px;
    line-height: 24px;
    color: #666;
}


.listCenter{
       height: auto;
    margin-bottom: 50px;
    margin-top: 20px;
}

.listItem{
  display: block;
    text-align: left;
    border-bottom: 1px solid #d9d9d9;
    background-color: #ffffff;
    width: 100%;
    height: auto;
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

.tehotel{
      margin-left: 10px;
}

.serverice{

}
.className{
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


