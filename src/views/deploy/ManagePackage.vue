<template>
  <v-dialog v-model="isShow" width="700" persistent>
    <v-card>
      <v-card-title class="headline lighten-2">
        {{ isModify ? "修改应用" : "导入整合包" }}
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form ref="form" :disabled="isLocked">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="applicationName"
                  :rules="applicationNameRules"
                  label="请输入整合包名称"
                  required
                  clearable
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="minMemory"
                  label="请分配运行最小内存，例如 1G"
                  required
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="maxMemory"
                  label="请分配运行最大内存，例如 1G"
                  required
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="请输入整合包路径" required clearable>
                  <template v-slot:append-outer>
                    <v-btn color="primary" icon>
                      <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="serverJarName"
                  label="请输入服务器运行文件名称"
                  required
                  clearable
                >
                  <template v-slot:append-outer>
                    <v-btn color="primary" icon>
                      <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="controlLock">
          <v-img
            v-show="isLocked"
            src="../../assets/img/lock.png"
            contain
            height="40"
          ></v-img>
          <v-img
            v-show="!isLocked"
            src="../../assets/img/unlock.png"
            contain
            height="40"
          ></v-img>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="cancel">
          取消
        </v-btn>
        <v-btn color="primary" text @click="confirm">
          确认
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ImportPackage",

  props: {
    isShow: Boolean,
    isModify: Boolean
  },

  data: () => ({
    isLocked: false,
    applicationName: "",
    applicationNameRules: [
      v => !!v || "给东西取名字然后去爱它，是成为变态的第一步",
      v => (v && v.length <= 24) || "名字需要少于 24 个字符"
    ],
    minMemory: "",
    maxMemory: "",
    packagePath: "",
    serverJarName: ""
  }),

  methods: {
    hideDialog() {
      this.$emit("update:isShow", false);
      this.$emit("refresh");
    },
    controlLock() {
      this.isLocked = !this.isLocked;
    },
    cancel() {
      this.hideDialog();
    },
    confirm() {
      this.hideDialog();
    }
  }
};
</script>

<style scoped></style>
