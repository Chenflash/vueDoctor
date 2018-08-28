<template>
  <div class="intelligenManList">
  
         <div v-if="!noFetch" >
          <div class="intelligenManListContainer">
            <div class="intelligenTitle">
              温馨提示：真实姓名和资质证书的姓名必须一致，一经认证无法修改。请您认证核对！
            </div>
             <ul class="integralCenter"  v-if="intellList.length>0">
              
                <li class="listItem" v-for="(item,i) of intellList" :key="i" @click="toLogList(item.pl_id)">
                    <h3 class="certificateMum">证书编号：{{item.certificate_num}}</h3>
                    <div class="leftInfo">
                      <p>证件类型：{{item.license_type}}</p>
                      <p>真实姓名：{{item.truename}}</p>
                      <p>发证日期：{{item.issue_date}}</p>
                      <p>审核状态：<span style="color:#ff8800">{{item.status}}</span></p>
                    </div>
                    <div class="rightPic">
                      <img :src="item.pic"/>
                    </div>
                    <div style="clear:both"></div>
                  </li>
                
              </ul>
              
         </div>  
          <!--暂无数据-->
          <div class="noNull" v-if="intellList.length==0"   >
			      <p>还没有相关信息!</p>   
			   </div> 
           <div class="addIntelligen" @click="addIntelligen">添加资质证书</div> 
          

        </div>
          <div class="noFetch" v-else @click="loadFetch()" > 
        <img src="../../assets/noFetch.png" />
        <p>网络不给力，点击刷新</p>    

        </div>   
      
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast } from 'mint-ui';
export default {
  name: 'intelligenManList',
  data () {
    return {  
      noFetch:false, 
     intellList:[],
     
    }
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.fetchintelligen();
       if(this.$store.state.isCount==0){     //第一次加载
        this.$store.commit('increatement');
       
       }else if(this.$store.state.isCount==1){  //已经加载过
         this.$store.commit('decrement');
         return ; 
       }
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchintelligen(){  //请求资质证书列表
          var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=intelligence&op=list',
                    data:{
                       key:that.$route.query.key,
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
              console.log(response);
              if(response.data.code==200){
                 that.intellList=response.data.datas;
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });
    },
    addIntelligen(){  //添加资质证书
        var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
        window.location.href=domain+"#/addIntelligen"+"?key="+this.$route.query.key;
    },
     loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
           this.fetchintelligen();
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
input::-webkit-input-placeholder{

  background-color:#ffffff;
}
textarea::-webkit-input-placeholder{
  
  font-size:16px;
  background-color:#ffffff;
  text-align: left !important;
}
.intelligenManList{
  height:auto;
  margin-bottom:60px;
 
}
.intelligenManListContainer{
  background-color:#fff;
  height:auto;
}
.intelligenTitle{
  height:48px;
  line-height:22px;
  background-color:#333;
  color:#ff8800;
  text-align:left;
  padding-left:10px;
  font-size:14px;
}
/*
*证书列表
*/
.integralCenter{
    margin: 10px;
    text-align: left;
    height: auto;
     margin-bottom:50px;
}
.listItem{
   text-align: left;
    display: block;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom:10px;
}
.certificateMum{
       height: 36px;
    background-color: #00bcd4;
    line-height: 36px;
    padding-left: 10px;
    font-size: 1.4rem;
    color: #fff;
}

/*网络状态*/

/*网络状态*/
.noFetch{
    padding: 100px auto;
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
    padding-top:100px;
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
.noNull{
  margin-top:100px;
}
.noNull p{
  font-size:1.4rem;
  color:#666;
}
.leftInfo{
   padding-left: 10px;
    display: inline-block;
}
.leftInfo p{
   line-height: 32px;
    color: #666;
    font-size: 1.4rem;
}
.rightPic{
   float: right;
   margin:5px;
    width: 10rem;
    height: 10rem;
    overflow: hidden;
}
.rightPic img{
      width: 100%;
    height: 100%;
}
.addIntelligen{
     position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 46px;
    line-height: 46px;
    background-color: #ff8800;
    color: #fff;
    font-size: 1.6rem;
    letter-spacing: 2px;
    z-index: 1000;
}
</style>

