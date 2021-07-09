<template>
    <div class="text-left">
      <ul class="ulist">
        <li class="status">
          <h2 style="margin-top:1vw">봇 실행 현황</h2>
          <table class="tb" :style="{'fontSize':'1vw'}">
            <tbody>
            <tr>
              <td>IP</td>
              <td>현황</td>
            </tr>
            <tr v-for="(status, ip) in bot_status" v-bind:key="ip">
              <td> {{ip}} </td>
              <td v-if="status == '실행중'" :style="{'color':'red', 'fontWeight':'bold'}"> {{status}} </td>
              <td v-else :style="{'color':'blue'}"> {{status}} </td>
            </tr>
            
            </tbody>
          </table>
        </li>

        <li class="status" :style="{'textAlign':'center'}">
          <h2 style="margin-top:1vw">당일업무 대기 목록</h2>
          <table class="tb">
            <thead>
              <td :colspan="columns.length">업무 수행 현황</td>
            </thead>
            <tbody>
            <tr>
              <td v-for="col in columns" v-bind:key="col">{{col}}</td>
            </tr>
            <tr v-for="wait in waits" v-bind:key="wait.name">
              <td> {{wait.name}} </td>
              <td> {{wait.reserved_time}} </td>
              <td> 미실행 </td>
              <td v-if="wait.status == 'COMP'" :style="{'color':'blue'}"> {{wait.status}} </td>
              <td v-if="wait.status == 'RUN'" :style="{'color':'green'}"> {{wait.status}} </td>
              <td v-if="wait.status == 'FAIL'" :style="{'color':'red'}"> {{wait.status}} </td>
              <td v-else :style="{'color':'black'}"> {{wait.status}} </td>
            </tr>
            
            </tbody>
          </table>
        </li>

        <li class="list" v-for="(ip, index) in ips" v-bind:key="ip">
          <h2 style="margin-top:1vw">RPA Bot {{index + 1}}({{ip}})</h2>
          <v-progress-circular
            :rotate="90"
            :size="200"
            :width="30"
            :value="rsc[ip]['cpu']"
            color="teal"
          >
            CPU
            {{rsc[ip]['cpu']}}%
          </v-progress-circular>

          <v-progress-circular
            :rotate="90"
            :size="200"
            :width="30"
            :value="rsc[ip]['memory']"
            color="primary"
          >
            MEMORY
            {{rsc[ip]['memory']}}%
          </v-progress-circular>

          <v-progress-circular
            :rotate="90"
            :size="200"
            :width="30"
            :value="rsc[ip]['disk']"
            color="red"
          >
            HDD
            {{rsc[ip]['disk']}}%
          </v-progress-circular>
          <table class="tb">
            <thead>
              <td :colspan="columns.length">업무 수행 현황</td>
            </thead>
            <tbody v-if="ip in task_logs">
              <tr>
                <td v-for="col in columns" v-bind:key="col">{{col}}</td>
              </tr>
              <tr v-for="task in task_logs[ip]" v-bind:key="task.name" >
                <td> {{task.name}} </td>
                <td> {{task.reserved_time}} </td>
                <td> {{task.run_time}} </td>
                <td v-if="task.status == 'COMP'" :style="{'color':'blue'}"> {{task.status}} </td>
                <td v-else-if="task.status == 'RUN'" :style="{'color':'green'}"> {{task.status}} </td>
                <td v-else-if="task.status == 'FAIL'" :style="{'color':'red'}"> {{task.status}} </td>
                <td v-else :style="{'color':'black'}"> {{task.status}} </td>
              </tr>
            </tbody>
          </table>
          
        </li>

      </ul>
  </div>
</template>
<script>
import axios from 'axios';
let server_ip = '10.103.200.51';
export default {
    data () {
      return {
        interval: {},
        rsc:{},
        cnt:0,
        ips:[],
        columns:['업무명', '예약 시간', '실행 시간', '상태'],
        task_logs_response:[],
        task_logs:{},
        waits:[],
        bot_status:{}
      }
    },
    beforeDestroy () {
      clearInterval(this.interval)
    },
    async created() {
      const me = this
      await axios.get('http://'+ server_ip +':8081/api/bots?page=0' + '&size=200')
            .then(function(response) {
              console.log(response)
              let bots = response.data.data.bots;
              for(let i = 0; i < bots.length; i++) {
                me.ips.push(bots[i].ip)
              }
            })
            .catch(function(error) {
              console.log('error:' + error);
            })
      console.log(me.ips)
      for(let i = 0; i < me.ips.length; i++) {
        me.rsc[me.ips[i]] = {}
        me.rsc[me.ips[i]]["cpu"] = 0
        me.rsc[me.ips[i]]["memory"] = 0
        me.rsc[me.ips[i]]["disk"] = 0
      }
      this.get_tasklogs();
    },
    mounted () {
        const me = this
        me.cnt = 0
        this.interval = setInterval(() => {
          for(let i = 0; i < me.ips.length; i++) {
            axios.get('http://' + me.ips[i] +':8081/api/rsc')
            .then(function(response) {
              setInterval(() => {
                if(me.cnt % 2 == 1) {
                  me.rsc[me.ips[i]]["cpu"] = 0
                  me.rsc[me.ips[i]]["memory"] = 0
                  me.rsc[me.ips[i]]["disk"] = 0
                  me.$forceUpdate()
                } 
              }, 3000)
              me.rsc[me.ips[i]]["cpu"] = response.data['cpu'];
              me.rsc[me.ips[i]]["memory"] = response.data['memory'];
              me.rsc[me.ips[i]]["disk"] = response.data['disk'];
              me.$forceUpdate()
            })
            .catch(function(error) {
              me.rsc[me.ips[i]]["err"] = 'error';
              console.log('error:' + error);
            })
          }
          me.cnt += 1
        }, 6000)
    },
    methods: {
      get_tasklogs() {
        const me = this;
        const ip = "10.103.200.51";
        axios.get('http://'+ ip +':8081/api/task-logs')
            .then(function(response) {
              me.task_logs = response.data.data.taskLogs;
              for(let key in me.task_logs) {
                
                // 실행 시간에 따라 오름차순 소팅
                me.task_logs[key] = me.task_logs[key].sort(function(a, b) {
                  return a.run_time < b.run_time ? -1 : a.run_time > b.run_time ? 1 : 0;
                })
              }
              me.waits = me.task_logs["WAIT"]

              //봇 사용 현황 정리
              for(let i=0; i<me.ips.length; i++) {
                let status = '실행 가능'
                if(me.task_logs[me.ips[i]] != null) {
                  for(let j = 0; j < me.task_logs[me.ips[i]].length; j++) {
                    if(me.task_logs[me.ips[i]][j].status == 'RUN') {
                      status = '실행중'
                      break;
                    }
                  }
                }
                me.bot_status[me.ips[i]] = status
              }
            })
            .catch(function(error) {
              console.log('error:' + error);
            })
      },
      
    }
  }
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.ulist {
  margin: 2vw;
  list-style: none;
  border: 0.5vw solid #3366ff;
}
.list {
  margin: 1.5vw;
  border: 0.5vw solid #3366ff;
  width: 45%;
  display: inline-block;
  text-align: center;
}
.status {
  margin: 1.5vw;
  border: 0.5vw solid #3366ff;
  width: 93%;
  text-align: center;
}
.tb {
  border: 2px solid #3366ff;
  border-radius: 3px;
  background-color: #fff;
  margin: 1vw;
  width: 90%;
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

th, td {
  min-width: 120px;
  padding: 10px 20px;
}
</style>