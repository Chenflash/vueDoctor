<template>
  <div class="callPhone">
          

         <!--有网络状态-->
       <div v-if="!noFetch"  v-show="!isloading">
            
        <div class="callPhoneContainer">
           <h3>旭日康联系方式</h3>
           <p>售后服务电话电话：{{service_hotline==''?'未填写':service_hotline}}</p>
           <p>微信客服号：{{wechat_num==''?'未填写':wechat_num}}</p>
           <p>联系方式：{{contact_address==''?'未填写':contact_address}}</p>
        </div> 
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
  name: 'callPhone',
  data () {
    return {
       noFetch:false,
        "service_hotline": "",//电话热线
        "wechat_num": "",//微信
        "contact_address": ""//联系地址
    }
  },
   computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
    isCount(){  //统计加载次数
      return this.$store.state.isCount;
    }
    
  },

  mounted(){
     if (navigator.onLine) {
      //有网络状态
      this.fetchPhone();
    } else {
      //无网络状态
      this.noFetch = true;
      Toast({
        message: "当前网络不可用，请检查网络",
        position: "bottom",
        duration: 1500
      });
    } 
  },
  methods:{
    fetchPhone(){
        var that=this;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=index&op=customer_service',
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
             if(response.data.code==200){
              that.service_hotline=response.data.datas.service_hotline;
              that.wechat_num=response.data.datas.wechat_num;
              that.contact_address=response.data.datas.contact_address;
           }else{
               Toast(response.data.datas.error);
           }
          });
    },
     loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
            //有网络状态
            this.fetchPhone();
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
          }
      },
     goback(){

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
.callPhone{
     height: 100%;
}
.callPhoneContainer{
   padding-top: 30px;
   text-align: left;
   padding-left: 30px;
 
}
.callPhoneContainer h3{
  font-size: 1.5rem;
    padding-bottom: 20px;
}
.callPhoneContainer p{
   line-height: 32px;
    font-size: 1.4rem;
    color:#999

}
</style>
