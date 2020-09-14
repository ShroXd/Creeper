<template>
  <v-dialog v-model="isShow" max-width="350">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        请再次确认您的行为，不理智的确认可能会导致严重的后果
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="agree">
          是的
        </v-btn>
        <v-btn text @click="disagree">
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Confirm",
  props: {
    isShow: Boolean,
    title: String
  },
  methods: {
    agree() {
      this.$emit("update:isShow", false);
      this.$emit("agree");
    },
    disagree() {
      this.$emit("update:isShow", false);
      this.$emit("disagree");
    }
  }
};
</script>

<style scoped></style>
