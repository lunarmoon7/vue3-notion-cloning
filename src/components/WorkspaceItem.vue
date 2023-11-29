<template>
  <li>
    <div
      :style="{ paddingLeft: `${14 * depth}px` }"
      :class="{ active: $route.params.id === workspace.id.toString() }"
      class="title"
      @click="
        $router.push({
          name: 'Workspace',
          params: {
            id: workspace.id,
          },
        })
      "
    >
      <span
        :class="{ active: showChildren }"
        class="material-icons"
        @click.stop="showChildren = !showChildren"
        >play_arrow</span
      >
      <span class="text">{{ workspace.title || '제목 없음' }}</span>
      <div class="actions">
        <span class="material-icons" @click.stop="createWorkspace">add</span>
        <span class="material-icons" @click.stop="deleteWorkspace">delete</span>
      </div>
    </div>
    <div
      v-if="!hasChildren && showChildren"
      :style="{ paddingLeft: `${14 * depth + 22}px` }"
      class="no-children"
    >
      하위 페이지가 없습니다.
    </div>
    <ul v-if="hasChildren && showChildren">
      <!-- Component는 재귀호출이 가능하다. -->
      <WorkspaceItem
        v-for="ws in workspace.documents"
        :key="ws.id"
        :workspace="ws"
        :depth="depth + 1"
      />
    </ul>
  </li>
</template>

<script>
import { number } from 'prop-types';

export default {
  props: {
    workspace: {
      type: Object,
      default: () => ({}),
    },
    depth: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showChildren: false,
    };
  },
  computed: {
    hasChildren() {
      // 재귀 렌더링의 종료조건
      // documents가 존재하고 길이가 1이상 이라면, true를 반환한다.
      return this.workspace.documents && this.workspace.documents.length > 0;
    },
  },
  created() {
    this.showChildren = this.$store.state.workspace.currentWorkspacePath.some(
      (workspace) => {
        return workspace.id === this.workspace.id;
      }
    );
  },
  methods: {
    async createWorkspace() {
      await this.$store.dispatch('workspace/createWorkspace', {
        parentId: this.workspace.id,
      });
      this.showChildren = true;
    },
    deleteWorkspace() {
      this.$store.dispatch('workspace/deleteWorkspace', {
        id: this.workspace.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  .title {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 14px;
    color: rgba($color-font, 0.7);
    &:hover {
      background-color: $color-background--hover1;
      .actions {
        display: flex;
      }
    }
    &.active {
      font-weight: 700;
      color: rgba($color-font, 0.8);
    }
    .material-icons {
      font-size: 18px;
      color: $color-icon;
      margin-right: 4px;
      transition: 0.2s;
      cursor: pointer;
      &:hover {
        background-color: $color-background--hover2;
      }
      &.active {
        transform: rotate(90deg);
      }
    }
    .text {
      flex-grow: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .actions {
      display: none;
      align-items: center;
    }
  }
  .no-children {
    color: rgba($color-font, 0.35);
    height: 30px;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
