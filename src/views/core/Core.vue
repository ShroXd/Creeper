<template>
  <div>
    <v-card class="mx-auto" outlined>
      <div class="card__header">
        <div class="header__title">
          <v-card-title>核心管理</v-card-title>
          <v-card-subtitle class="pb-0"
            >您可以在这里管理 Minecraft 服务端核心
          </v-card-subtitle>
        </div>
        <v-btn color="primary" outlined>
          添加核心
          <v-icon right>mdi-plus</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div class="hosts">
        <v-card v-for="(host, index) in hosts" :key="index" outlined hover>
          <div class="host">
            <div class="host__icon">
              <v-icon size="128">mdi-code-tags</v-icon>
            </div>
            <div class="host__information">
              <div class="information__item">
                <div class="text--secondary information__title">名称：</div>
                <div class="font-weight-medium">
                  {{ host.name ? host.name : "暂无" }}
                </div>
              </div>
              <div class="information__item">
                <div class="text--secondary information__title">类型：</div>
                <div class="font-weight-medium">
                  {{ host.type ? host.type : "暂无" }}
                </div>
              </div>
            </div>
            <div class="host__operation">
              <v-btn text color="error">
                <v-icon left>mdi-delete</v-icon>
                删除核心
              </v-btn>
              <v-btn text>
                <v-icon left>mdi-login</v-icon>
                测试连接
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Host",
  data: () => ({
    hosts: [
      {
        name: "腾讯服务器",
        type: "CraftBukkit"
      }
    ]
  })
};
</script>

<style scoped lang="scss">
.card__header {
  display: grid;
  grid-template-columns: 87% 10%;
  place-items: end start;
  margin-bottom: 20px;
}

.header__title {
  display: inline-block;
  width: 85%;
}

.hosts {
  margin-top: 20px;
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 23%);
  grid-gap: 15px;
  place-content: center center;
}

.host {
}

.host__icon {
  text-align: center;
  padding: 15px 0;
}

.host__information {
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
  padding-bottom: 5px;
  font-size: 0.8rem;

  .information__item div {
    display: inline-block;
  }
}

.information__title {
  margin-right: 5px;
}

.host__operation {
  display: flex;
  margin: 5px 0;
  justify-content: space-around;
}
</style>
