<template>
  <v-app id="inspire">
    <drawer></drawer>
    <v-main>
      <keep-alive :include="['Deploy', 'Core']">
        <router-view></router-view>
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
import Drawer from "../components/core/Drawer";

export default {
  name: "Index",
  components: { Drawer },
  comments: {
    Drawer
  }
};
</script>
