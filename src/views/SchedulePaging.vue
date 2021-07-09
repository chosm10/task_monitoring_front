<template>
    <div class="text-left">
      <ul class="ulist">
        <li class="list">
          <table  class="tb" :style="{'margin':'auto', 'margin-top':'1vw'}">
              <thead>
                <td :colspan="regist_columns.length">스케쥴 등록</td>
              </thead>
              <tbody>
                <tr >
                  <td v-for="column in regist_columns" v-bind:key="column">{{column}}</td>
                </tr>
                <tr>
                  <td> <input v-model="regist_form['name']"></td>
                  <td> <input v-model="regist_form['month']"></td>
                  <td> <input v-model="regist_form['week']"></td>
                  <td> <input v-model="regist_form['day']"></td>
                  <td> <input v-model="regist_form['time']"></td>
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
              <tr v-for="(task, index) in tasks" v-bind:key="task.id" :class="{'selected':task.flag}">
                <td> {{task.id}} </td>
                <td> {{task.name}} </td>
                <td> <input v-model="task.schedule.month"  :readonly="!task.flag"></td>
                <td> <input v-model="task.schedule.week"  :readonly="!task.flag"></td>
                <td> <input v-model="task.schedule.day"  :readonly="!task.flag"></td>
                <td> <input v-model="task.scheduleTime"  :readonly="!task.flag"></td>
                <td><button @click="update(index, task)">수정하기</button></td>
                <td><button @click="runtask(task.name)">실행하기</button></td>
              </tr>
            </tbody>
          </table>
          <div class="text-center">
            <v-text-field
              label="Keyword"
              color="#3366ff"
              v-model="search"
              @keypress.enter="keyword_search" :style="{'margin':'auto','width':'30%'}">
  
              <template v-slot:append >
                  <v-btn
                    depressed 
                    large
                    color="#3366ff"
                    :style="{'color':'white'}"
                    @click="keyword_search">
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
              @input="get_task_page"
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
let task_ip = {
  "일매출정리":"10.103.200.50",
  "구매확정":"10.103.200.51",
  "정산":"10.103.200.52",
  "외상매출금":"10.103.200.52",
  "고객부담배송비":"10.103.200.52"
}
export default {
    data () {
      return {
        regist_columns:['업무명', '월', '요일', '날짜', '예약 시간'],
        update_columns:['업무 번호', '업무명', '월', '요일', '날짜', '예약 시간', '수정', '실행'],
        tasks:{},
        waits:[],
        modify:false,
        regist_form:{
          'name':'',
          'month':'',
          'week':'',
          'day':'',
          'time':''
        },
        total_visible:5,
        block_num:10,
        page:1,
        total_page:1,
        search:'',
      }
    },
    created() {
      this.get_task_page();
    },
    mounted () {
    },
    methods: {
      update(index, task) {
        if(task.flag) {
          axios.put('http://'+ server_ip +':8081/api/task/'+task.id, {month:task.schedule.month, week:task.schedule.week, day:task.schedule.day, time:task.scheduleTime})
            .then(function(response) {
              alert("수정 완료! response: " + JSON.stringify(response.data))
            })
            .catch(function(error) {
              alert('error:' + error)
            })
        }
        this.tasks[index]["flag"] = !this.tasks[index]["flag"]
        this.$forceUpdate()
        console.log(this.tasks)
      },
      async regist() {
        const me = this;
        let msg = '';
        await axios.post('http://'+ server_ip +':8081/api/task', {name:this.regist_form.name, month:this.regist_form.month,
         week:this.regist_form.week, day:this.regist_form.day, time:this.regist_form.time})
            .then(function(response) {
              msg = "등록 완료! response: " + JSON.stringify(response.data)
              me.regist_form.name='';
              me.regist_form.month='';
              me.regist_form.week='';
              me.regist_form.day='';
              me.regist_form.time='';
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
      get_task_page() {
        const me = this;
        axios.get('http://'+ server_ip +':8081/api/task-page?page=' + (me.page - 1) + '&size='+me.block_num)
            .then(function(response) {
              me.tasks = response.data.data.tasks;
              me.total_page = response.data.data.totalPage
              for(let i = 0; i < me.tasks.length; i++) {
                me.tasks[i]["flag"] = false;
              }
            })
            .catch(function(error) {
              console.log('error:' + error);
            })
      },
      keyword_search() {
        const me = this;
        axios.get('http://'+ server_ip +':8081/api/tasks/' + me.search)
            .then(function(response) {
              me.tasks = response.data.data.tasks;
              for(let i = 0; i < me.tasks.length; i++) {
                me.tasks[i]["flag"] = false;
              }
            })
            .catch(function(error) {
              console.log('error:' + error);
            })
      },
      runtask(taskname) {
        alert(taskname + "실행 완료! 모니터링 현황에서 확인 바랍니다.");
        let task_arr = taskname.split('_');
        axios.get('http://' + task_ip[task_arr[1]] + ':9000/runtask/' + taskname)
            .catch(function(error) {
              console.log('error:' + error);
            })
      }
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