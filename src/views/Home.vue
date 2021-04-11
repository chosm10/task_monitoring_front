<template>
    <div>
        <h1>Welcome to {{title2}}!!!</h1>
        <input type="text" v-model="input1" />
        <button type="button" @click="getData">Get</button>
        <button type="button" @click="setData">Set</button>
        <!-- select의 디폴트 값을 줄때 v-model로 value값을 설정함, select가 변경될때 changeRegion을 호출함 -->
        <select class="form-control" v-model="region" @change="changeReigon">
            <!-- key는 보통 index로 하고, 변수에서 html로 가져올때는 :value로, html에서 변수에 넣을때는 {{}}로 접근 -->
            <option :key="i" :value="d.v" v-for="(d, i) in options">{{d.t}}</option>
        </select>
        <!-- v-if는 조건값에 따라서 렌더링이 결정되고, v-show는 상관없이 렌더링은 되는데 값에 따라 보여지는 hidden만 달라짐 -->
        <!-- 화면에 계속 보였다 안보였다 하는 경우면 한번만 렌더링하도록 v-show를 쓰는게 좋음 -->
        <table class="table table-bordered" v-if="tableShow">
            <tr :key="i" v-for="(d, i) in options">
                <td>{{d.v}}</td>
                <td>{{d.t}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            title: "개발자의 품격",
            title2: "Seoul",
            input1: "abc!!",
            options: [
                {v: "s", t: "Seoul"},
                {v: "j", t: "Jeju"},
                {v: "b", t: "Busan"}
            ],
            region: "b",
            tableShow: true
        };
    },
    watch: {
        // data에 있는 이름이 동일한 데이터에 발생하는 이벤트를 감지
        input1() {
            console.log(this.input1)
        }
    },
    methods: {
        getData() {
            alert(this.input1)
        },
        setData() {
            this.input1 = "12345"
        },
        changeReigon() {
            alert(this.region)
        }
    },
    beforeCreate() {
        console.log('beforeCreate')
    },
    created() {
        // 데이터 로딩 전, 즉 화면에 뿌려지기 전에 미리 데이터를 가져오는 경우에 주로 사용
        console.log('created')
    },
    beforeMount() {
        console.log('beforeMounted')
    },
    mounted() {
        // 화면에 데이터가 로딩 될 때
        console.log('mounted')
    },
    beforeUpdate() {
        console.log('beforeUpdate')
    },
    update() {
        console.log('update')
    },
    beforeDestroy() {
        console.log('beforeDestroy')
    },
    destroyed() {
        console.log('destroyed')
    },
}
</script>