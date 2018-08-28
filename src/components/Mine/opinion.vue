<template>
  <div class="opinion">
  
        <div class="opinionContainer">
           <textarea cols="40" rows="10" class="inputTextarea" placeholder="请详细描述您遇到的问题..."  v-model="content"/>   
           <input type="submit" value="提交" class="btnSubmit" :disabled="isDisable"  @click="submitOpinion"/>

        </div>  
          
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast } from 'mint-ui';
export default {
  name: 'opinion',
  data () {
    return {
     content:"",
     isDisable:false,
    }
  },
  methods:{
    submitOpinion(){   //提交
       if(this.content!=""){
          this.isDisable = true
          setTimeout(() => {
          }, 1000)
         var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_feedback&op=feedback_add',
                    data:{
                       key:that.$route.query.key,
                       content:that.content 
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
                Toast("感谢您的反馈，我们将持续改进");
                setTimeout(()=>{app.back()},2000); //跳转页面
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
.opinion{
  height:auto;
   background-color: #f4f4f4;
}
.opinionContainer{
     padding-top: 20px;
}
.inputTextarea{
    width:95%; 
    display: block;
    margin: 0 auto;
    position: relative;
    font-size: 1.4rem;
    border: 1px solid #d9d9d9;
    background-color: #ffffff;
}
.btnSubmit{
       display: block;
    width: 95%;
    height: 36px;
    line-height: 36px;
    margin: 0 auto;
    margin-top: 60px;
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
