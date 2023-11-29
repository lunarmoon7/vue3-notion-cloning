<template>
  <nav ref="nav" :style="{ width: `${navWidth}px` }">
    <div class="header">
      <div class="user-profile"></div>
      Coggie's Notion
    </div>
    <ul>
      <WorkspaceItem
        v-for="workspace in workspaces"
        :key="workspace.id"
        :workspace="workspace"
      />
    </ul>
    <div class="actions">
      <div class="action" @click="$store.dispatch('workspace/createWorkspace')">
        <span class="material-icons">add</span>
        <span>새로운 페이지</span>
      </div>
    </div>
    <div
      ref="resizeHandle"
      class="resize-handle"
      @dbclick="navWidth = 240"
    ></div>
  </nav>
</template>

<script>
import interact from 'interactjs';
import WorkspaceItem from '@/components/WorkspaceItem';

export default {
  components: {
    WorkspaceItem,
  },
  data() {
    return {
      navWidth: 240,
    };
  },
  computed: {
    workspaces() {
      return this.$store.state.workspace.workspaces;
    },
  },
  created() {
    this.workspacesInit();
  },
  mounted() {
    this.navInit();
  },
  methods: {
    navInit() {
      interact(this.$refs.nav)
        .resizable({
          edges: {
            right: this.$refs.resizeHandle,
          },
        })
        .on('resizemove', (e) => {
          const { width } = e.rect;
          this.navWidth = width;
        });
    },
    async workspacesInit() {
      await this.$store.dispatch('workspace/readWorkspaces');
      if (this.$route.fullPath === '/') {
        this.$router.push({
          name: 'Workspace',
          params: { id: this.state.workspace.workspaces[0].id },
        })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  height: 100%;
  background-color: $color-background;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  min-width: 180px;
  max-width: 500px;
  .header {
    padding: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    .user-profile {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      margin-right: 10px;
      background-image: url('https://avatars.githubusercontent.com/u/101445377?v=4');
      background-size: cover;
    }
  }
  ul {
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .actions {
    .action {
      height: 45px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      color: $color-icon;
      cursor: pointer;
      &:hover {
        background-color: $color-background--hover1;
      }
      .material-icons {
        margin-right: 4px;
        color: $color-icon;
      }
    }
  }
  .resize-handle {
    width: 4px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    cursor: col-resize;
    transition: 0.4s;
    &:hover {
      background-color: $color-border;
    }
  }
}
</style>
