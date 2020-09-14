<template>
  <v-app id="inspire">
    <drawer></drawer>
    <v-main> <router-view /> </v-main>
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
