<template>
  <v-container>
    <div v-for="(title, index) in stepTitles" :key="index">
      <v-col class="d-flex step" cols="12">
        <div class="text-h5 step__title">Step {{ index + 1 }}</div>
      </v-col>
      <v-divider></v-divider>
      <v-row>
        <v-col class="d-flex" cols="12">
          <v-expand-transition>
            <slot :name="title"></slot>
          </v-expand-transition>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Steps",

  props: {
    stepTitles: Array
  }
};
</script>

<style scoped>
.step {
  display: flex;
  align-items: flex-end;
}

.step__title {
  margin-right: 15px;
  color: #2196f3;
}
</style>
