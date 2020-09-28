<template>
  <div>
    <Header title="设置" subtitle="您可以在这里配置全局属性"></Header>
    <v-divider></v-divider>
    <v-container>
      <v-row>
        <v-switch
          class="ml-7"
          v-model="$vuetify.theme.dark"
          hide-details
          color="success"
          label="黑暗模式"
          persistent-hint
        ></v-switch>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "../../components/core/Header";
export default {
  name: "Setting",

  components: {
    Header
  }
};
</script>

<style scoped></style>
