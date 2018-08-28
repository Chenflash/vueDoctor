<template>
  <div class="registType">
      
       
       <div  class="typeContainer" >
          <div class="btnType" v-if="type === '1'">
             <p class="btnUser" @click="useRegist(type)">普通用户</p>
          </div>
           <div class="btnType"  v-else-if="type === '2'">
             <p class="btnUser" @click="useRegist">普通用户</p>
             <p class="btnDoctor" @click="doctorRegist">终端商</p>
              <p class="btnAdvaser" @click="advaserRegist">我是服务商</p>
          </div>   
          <div class="btnType"  v-else-if="type === '3'">
              <p class="btnDoctor" @click="doctorRegist">终端商</p>
              <p class="btnAdvaser" @click="advaserRegist">服务商</p>
          </div> 
          <div class="btnType"  v-else-if="type === '4'">
              <p class="btnDoctor" @click="doctorRegist">终端商</p>
              <p class="btnAdvaser" @click="advaserRegist">服务商</p>
          </div>           
         
          <p class="showInviter">推荐码：{{inviter_id}}</p>
       </div>
       

  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
axios.defaults.timeout = 3000
import { Toast,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'registType',
  
  data () {
    return {
        type:this.$route.query.type,
        inviter_id:this.$route.query.inviter_id  //推荐码
      
    }
  },
  computed:{
    params(){
      return this.pageSize
    },
    isloading(){
      return this.$store.state.isloading;
    },
    isCount(){  //统计加载次数
      return this.$store.state.isCount;
    }
  },
  mounted(){
    
  },
  methods:{
    useRegist(){  //用户注册
         var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
         location.href=domain+"#/registHome"+"?type="+this.$route.query.type+"&isType=1&inviter_id="+this.$route.query.inviter_id;
    },
    doctorRegist(){  //医生注册
          var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
         location.href=domain+"#/registHome"+"?type="+this.$route.query.type+"&isType=2&inviter_id="+this.$route.query.inviter_id;
    },
    advaserRegist(){  //服务商
          var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
         location.href=domain+"#/registHome"+"?type="+this.$route.query.type+"&isType=3&inviter_id="+this.$route.query.inviter_id;
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
.typeContainer{
    background-color: #ffffff;
    padding-top: 100px;
}
.btnType{
   height: auto;   
}
.btnUser,.btnDoctor,.btnAdvaser{
    width: 80%;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 30px;
    line-height: 36px;
    height: 36px;
    color: #fff;
    font-size: 1.4rem;
    letter-spacing: 2px;
}
.btnUser{
    background-color: #26a2ff;
}
.btnDoctor{
  background-color: #f01;
}
.btnAdvaser{
   background-color: #2ed872;
}
.showInviter{
  font-size: 1.6rem;
  color:#999;
}
</style>
