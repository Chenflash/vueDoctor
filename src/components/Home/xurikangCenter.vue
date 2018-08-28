<template>
  <div class="xurikangCenter">
    
    
      <!--有网络状态-->
       <div v-if="!noFetch">
        <ul class="listCenter">
          <li class="listItem" v-for="(list,i) of listCenter" :key="i" @click="toListTitle(list.ac_id,list.ac_name)">
             <p class="centersImg"><img :src="list.ac_background" :onerror="logo"/></p>
             <div class="rightItem">
               <p class="rightTitle">{{list.ac_name}}</p>
               <p class="centerText">{{list.ac_desc}}</p>
             </div>   
          </li>


        </ul>  

       </div>
        <ul class="noFetch" v-else>
        <img src="../../assets/noFetch.png" />
        <p>网络无法连接</p>
        <p  @click="loadFetch()"  class="btnFetch">刷新</p>
      </ul>  
       
           

  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
axios.defaults.timeout = 3000
import { Toast } from 'mint-ui';
export default {
  name: 'xurikangCenter',
  data () {
    return {
     noFetch:false, //网络状态
     listCenter:[],
     centerId:null,
     logo:'this.src="' + require('../../assets/noNull.png') + '"' 
    }
  },
   mounted(){
     if(navigator.onLine){   //有网络状态
       this.fetchList();
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    } 
  },
  methods:{
     fetchList(){
      var that=this;
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       axios({
          method: 'POST',
           url: domain+'/mobile/index.php?act=article_class&op=index',
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
           ;
           if(response.data.code==200){
             that.listCenter=response.data.datas.article_class;
             
           }else{
             Toast("网络请求加载出错");
           }
          });
     },
     toListTitle(ids,titles){
         var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
         const {href} = this.$router.resolve({ name: "xurikangCenterTitle",params:{ac_id:ids},query:{key:this.$route.query.key,ac_name:titles}});
          window.open(href, '_blank');
     },
     loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
           this.fetchList();
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
          }
      }
  },
 

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



/*网络状态*/
.noFetch{
    margin: 100px auto;
    color: #999999;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
/*
*中心
*/
.listCenter{
  height:100%;
  ;
  margin-bottom: 50px;
}
.listItem{
   display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
  text-align: left;
  border-bottom: 1px solid #d9d9d9;
  background-color: #ffffff;
  width:100%;
  font-size:1.4rem;
}
.centersImg{
  width:8rem;
  height:8rem;
  padding: 10px;
  background-size: contain;
  display:inline-block;
  overflow:hidden;
}
.rightTitle{
  font-size:1.6rem;
}
.centersImg img{
  width:100%;
  height:100%;
}
.rightItem{
  margin-top:5px;
  line-height: 22px;
  float:left;
}
.centerText{
  color:#999999;
  padding-top:20px;
}
</style>

