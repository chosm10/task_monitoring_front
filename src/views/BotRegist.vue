<template>
    <div class="text-left">
      <ul class="ulist">
        <li class="list">
          <table  class="tb" :style="{'margin':'auto', 'margin-top':'1vw'}">
              <thead>
                <td :colspan="regist_columns.length">운영 봇 등록</td>
              </thead>
              <tbody>
                <tr>
                  <td v-for="column in regist_columns" v-bind:key="column">{{column}}</td>
                </tr>
                <tr>
                  <td> <input v-model="regist_form['ip']"></td>
                </tr>
              </tbody>
            </table>
            <v-btn depressed color="error" @click="regist" :style="{'margin':'1vw'}">등록하기</v-btn>
        </li>
      </ul>
      <ul class="ulist">
        <li class="list">
          <table class="tb" :style="{'margin':'auto', 'margin-top':'1vw', 'margin-bottom':'1vw'}">
            <thead>
              <td :colspan="update_columns.length">업무 스케쥴 현황</td>
            </thead>
            <tbody>
              <tr >
                <td v-for="column in update_columns" v-bind:key="column">{{column}}</td>
              </tr>
              <tr v-for="bot in bots" v-bind:key="bot.id">
                <td> {{bot.id}} </td>
                <td> {{bot.ip}} </td>
                <td> {{bot.time}}</td>
              </tr>
            </tbody>
          </table>
          <div class="text-center">
            
            <v-pagination
              v-model="page"
              :length="total_page"
              :total-visible="total_visible"
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
              @input="get_bots"
            ></v-pagination>
          </div>
        </li>
      </ul>
    <vue-confirm-dialog></vue-confirm-dialog>
  </div>
</template>
<script>
import axios from 'axios';
let server_ip="10.103.200.51"
export default {
    data () {
      return {
        regist_columns:['아이피'],
        update_columns:['봇 번호', '아이피', '등록일'],
        bots:{},
        regist_form:{
          'ip':'',
        },
        total_visible:5,
        block_num:10,
        page:1,
        total_page:1,
        search:'',
      }
    },
    created() {
      this.get_bots();
    },
    mounted () {
    },
    methods: {
      async regist() {
        const me = this;
        let msg = '';
        await axios.post('http://'+ server_ip +':8081/api/bot', {ip:this.regist_form.ip})
            .then(function(response) {
              msg = "등록 완료! response: " + JSON.stringify(response.data)
              me.regist_form.ip='';
            })
            .catch(function(error) {
              msg = 'error:' + error
            })
            this.pass_confirm(msg)
      },
      pass_confirm(msg){
        this.$confirm(
          {
            message: msg,
            button: {
              yes: 'Yes'
            },
            callback: confirm => {
              if (confirm) {
                this.$router.go(0)
              }
            }
          }
        )
      },
      get_bots() {
        const me = this;
        axios.get('http://'+ server_ip +':8081/api/bots?page=' + (me.page - 1) + '&size='+me.block_num)
            .then(function(response) {
              console.log(response)
              me.bots = response.data.data.bots;
              me.total_page = response.data.data.totalPage
            })
            .catch(function(error) {
              console.log('error:' + error);
            })
      },
    }
  }
</script>
<style scoped>
.ulist {
  text-align: center;
}
.list {
  margin: 1.5vw;
  border: 0.5vw solid #3366ff;
  width: 90%;
  display: inline-block;
  text-align: center;
}
.tb {
  border: 2px solid #3366ff;
  border-radius: 3px;
  background-color: #fff;
  text-align: center;
  margin: 1vw;
  width: 95%;
}
.selected {
  border: 5px solid red;
}
th {
  background-color: #3366ff;
  color: rgba(255,255,255,0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
  border: 3px solid #3366ff;
}

input{
  color: black;
  width: 100%;
  height: 100%;
}

th, td {
  min-width: 120px;
  padding: 10px 20px;
}
</style>