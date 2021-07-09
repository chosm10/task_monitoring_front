<template>
    <div class="text-left">
      <ul class="ulist">
        <li class="list">
          <br>
          <p>*memory 90% 이상 점유시 교체 필요</p>
          <table class="tb" :style="{'margin':'auto', 'margin-top':'1vw', 'margin-bottom':'1vw'}">
            <thead>
              <td :colspan="update_columns.length + 1">자원 로그 데이터</td>
            </thead>
            <tbody>
              <tr >
                <td>
                  <v-select :items="ips" filled label="아이피" dense v-model="search_ip"></v-select>
                </td>
                <td v-for="column in update_columns" v-bind:key="column">{{column}}</td>
              </tr>
              <tr v-for="resource in resources" v-bind:key="resource.id" :class="{'selected':resource.err}">
                <td> {{resource.ip}} </td>
                <td> {{resource.cpu}} </td>
                <td> {{resource.memory}} </td>
                <td> {{resource.disk}} </td>
                <td> {{resource.time}} </td>
                <td> {{resource.err}} </td>
              </tr>
            </tbody>
          </table>
          <div class="text-center">
            <v-text-field
              label="YYYY-MM-DD"
              color="#3366ff"
              v-model="search_date"
              @keypress.enter="get_rsc_page" :style="{'margin':'auto','width':'30%'}">
  
              <template v-slot:append >
                  <v-btn
                    depressed 
                    large
                    color="#3366ff"
                    :style="{'color':'white'}"
                    @click="get_rsc_page(), reset_page()">
                    검색하기
                    
                  </v-btn>
              </template>
            </v-text-field>

            <v-pagination
              v-model="page"
              :length="total_page"
              :total-visible="total_visible"
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
              @input="get_rsc_page"
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
        update_columns:['CPU', 'MEMORY', 'DISK', '시간', 'ERROR'],
        resources:{},
        total_visible:5,
        block_num:10,
        page:1,
        total_page:1,
        search_date:'',
        ips: ['ALL'],
        search_ip:'',
      }
    },
    async created() {
      let me = this;
      await axios.get('http://'+ server_ip +':8081/api/bots?page=0' + '&size=200')
            .then(function(response) {
              let bots = response.data.data.bots;
              for(let i = 0; i < bots.length; i++) {
                me.ips.push(bots[i].ip)
              }
            })
            .catch(function(error) {
              console.log('error:' + error);
            })
      this.get_rsc_page();
    },
    mounted () {
    },
    methods: {
      reset_page() {
        this.page = 1;
        this.get_rsc_page();
      },
      get_rsc_page() {
        const me = this;
        let pattern = /(\d{4})-(\d{2})-(\d{2})/
        let date = ''
        //모니터링 할 날짜를 입력한 경우
        if(me.search_date) {
          if(!pattern.test(me.search_date)) {
            alert('날짜 형식이 올바르지 않습니다. YYYY-MM-DD에 맞춰 다시 입력해주세요!')
            this.$router.go(0)
            return;
          }
          date = me.search_date;
        } else {
          // 날짜 없으면 오늘날짜로
          let today = new Date();
          date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        }
        let url = 'http://'+ server_ip +':8081/api/rsc-log' + '?page=' + (me.page - 1) + '&size=' + me.block_num;
        if(me.search_ip == "ALL" || me.search_ip == "") {
          me.search_ip = null;
        }
        axios.post(url, {'ip':me.search_ip, 'date':date})
            .then(function(response) {
              me.resources = response.data.data.history;
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