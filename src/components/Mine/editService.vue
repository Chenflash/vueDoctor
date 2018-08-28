<template>
  <div class="editService">
  
        <div class="editServiceContainer">
           <textarea cols="40" rows="10" class="inputTextarea"  v-model="msg"/>   
           <input type="submit" value="保存" class="btnSubmit" :disabled="isDisable"  @click="submiteditService"/>

        </div>  
          
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast } from 'mint-ui';
export default {
  name: 'editService',
  data () {
    return {
     msg:"",
     isDisable:false,
    }
  },
  created() {
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_account&op=store_service',
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
                that.msg=response.data.datas.msg;
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });
  },
  methods:{
    submiteditService(){   //提交
       if(this.msg!=""){
          this.isDisable = true
          setTimeout(() => {
          }, 1000)
         var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_account&op=store_service_edit',
                    data:{
                       key:that.$route.query.key,
                       msg:that.msg,
                       save_type:3, 
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
                setTimeout(()=>{app.back(); this.isDisable=false;},2000); //跳转页面
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });
      }else{
        return false;
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
.editService{
  height:auto;
  background-color: #ffffff
}
.editServiceContainer{
     padding-top: 20px;
}
.inputTextarea{
    width:90%; 
    display: block;
    margin: 0 auto;
    position: relative;
    font-size: 1.4rem;
    border: 1px solid #d9d9d9;
    background-color: #ffffff;
}
.btnSubmit{
       display: block;
    width: 90%;
    height: 36px;
    line-height: 36px;
    margin: 0 auto;
    margin-top: 30px;
    background-color: #00BCD4;
    border: 0px none;
    color: #fff;
    font-size: 1.5rem;
    border-radius: 5px;
}
textarea::-webkit-input-placeholder {
  padding-top:10px;
  padding-left:10px;
}
</style>
