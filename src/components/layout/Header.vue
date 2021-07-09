<template>
  <v-card>
    <v-toolbar
      color="indigo"
      dark
      flat
    >
      <router-link to="/resc" :style="{'color':'white'}">
        <v-toolbar-title>THE HYUNDAI - RPA ADMIN</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <template v-slot:extension>
        <v-tabs
          align-with-title
          ref="tab"
        >
          

          <v-tab
            v-for="item in items"
            :key="item"
          >
          <router-link :style="{'color':'white'}" :to="{path: links[item]}">{{ item }}</router-link>

            
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

  </v-card>
</template>
<script>
  export default {
    data () {
      return {
        tab: null,
        items: [
          '자원 및 업무 현황', '업무 스케쥴 관리', '자원 이력 관리', '운영봇 등록'
        ],
        links: {
          '자원 및 업무 현황':'/resc',
          '업무 스케쥴 관리':'/schedule-paging',
          '자원 이력 관리':'/resource-history',
          '운영봇 등록':'/bot-regist'
        }
      }
    }
  }
</script>
<style>
.v-tabs-slider {
  display: none;
}
</style>