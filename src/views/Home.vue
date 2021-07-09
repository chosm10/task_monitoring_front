<template>
  <v-card>
    
  </v-card>
</template>
<script>
  export default {
    data () {
      return {
        tab: null,
        items: [
          '자원 및 업무현황', '업무 스케쥴 현황'
        ],
        links: {
          '자원 및 업무현황':'/resc',
          '업무 스케쥴 현황':'/schedule-paging',
        }
      }
    },
    mounted() {
      this.$refs.tab.callSlider();
    }
  }
</script>