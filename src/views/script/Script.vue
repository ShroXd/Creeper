<template>
  <div>
    <Header title="脚本" subtitle="您可以在这里管理部署脚本"></Header>
    <v-divider></v-divider>
    <v-row>
      <v-col md="6">
        <v-container>
          <v-card-title>
            脚本
            <v-spacer></v-spacer>
            <v-btn class="mr-3" color="primary" outlined>创建脚本</v-btn>
            <v-btn color="primary" outlined>导入脚本</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card>
            <v-card-title>部署脚本</v-card-title>
            <v-card-text>备注：测试脚本</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="teal darken-1">
                脚本编辑
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-container>
          <v-card-title
            >编写脚本 <v-spacer></v-spacer>
            <v-btn color="primary" outlined>保存</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <codemirror v-model="code" :options="cmOptions"></codemirror>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "codemirror/mode/shell/shell.js";
import Header from "../../components/core/Header";
export default {
  name: "Script",
  components: {
    Header
  },
  data() {
    return {
      code: "const a = 10",
      // codemirror options
      cmOptions: {
        tabSize: 4,
        mode: "text/x-sh",
        lineNumbers: true,
        line: true
      }
    };
  }
};
</script>

<style scoped></style>
