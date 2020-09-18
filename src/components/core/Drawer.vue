<template>
  <v-navigation-drawer app clipped permanent width="340px">
    <div class="drawer__header">
      <div class="text-h5">
        Minecraft Client
        <strong class="text-h5">Management & Deployment</strong>
      </div>
      <v-img
        class="header__icon"
        contain
        height="135"
        width="135"
        src="../../assets/img/minecraft.png"
      />
    </div>
    <v-divider></v-divider>
    <v-list dense nav>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(item, index) in navigationItems"
          :key="index"
          :to="item.to"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Drawer",
  data: () => ({
    navigationItems: [
      {
        icon: "mdi-server",
        title: "服务器",
        to: "/host"
      },
      {
        icon: "mdi-cards-spade",
        title: "核心",
        to: "/core"
      },
      {
        icon: "mdi-minecraft",
        title: "模组",
        to: "/mod"
      },
      {
        icon: "mdi-code-tags",
        title: "脚本",
        to: "/script"
      },
      {
        icon: "mdi-application",
        title: "部署",
        to: "/deploy"
      }
    ]
  })
};
</script>

<style scoped lang="scss">
.drawer__header {
  display: grid;
  grid-template-columns: 70% 20%;
  justify-content: start;
  justify-items: center;
  align-items: center;

  & div {
    font-weight: 300;
    width: 70%;
  }

  & strong {
    font-weight: 600;
  }
}

.header__icon {
}
</style>
