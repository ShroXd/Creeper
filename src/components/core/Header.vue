<template>
  <v-container>
    <v-row dense>
      <v-col cols="8" sm="4" md="4">
        <div class="text-h6">{{ title }}</div>
        <div class="text-body-2">{{ subtitle }}</div>
      </v-col>
      <v-spacer></v-spacer>
      <div class="header-button">
        <slot name="function-btn"></slot>
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Header",

  props: {
    title: String,
    subtitle: String
  }
};
</script>

<style scoped>
.header-button {
  display: flex;
  align-items: flex-end;
}
</style>
