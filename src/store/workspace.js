import router from '@/routes';
const API_END_POINT = 'https://kdt-frontend.programmers.co.kr/documents';

export default {
  namespaced: true,
  state() {
    return {
      workspaces: [],
      currentWorkspace: {},
      currentWorkspacePath: [],
    };
  },
  getters: {},
  mutations: {
    assignState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
  },
  actions: {
    async createWorkspace({ dispatch }, payload = {}) {
      // payload가 없다면, 구조 분해 할당 에러가 발생하기 때문에
      // 기본값으로 {}를 할당해준다.
      const { parentId } = payload;
      const workspace = await _request({
        method: 'POST',
        body: JSON.stringify({
          title: '',
          parent: parentId,
        }),
      });

      await dispatch('readWorkspaces');

      router.push({
        name: 'Workspace',
        params: {
          id: workspace.id,
        },
      });
    },
    async readWorkspaces({ commit, dispatch }) {
      const workspaces = await _request({
        method: 'GET',
      });

      commit('assignState', {
        workspaces: workspaces,
      });

      dispatch('findWorkspacePath');

      if (!workspaces.length) {
        await dispatch('createWorkspace');
      }
    },
    async readWorkspace({ commit }, payload) {
      const { id } = payload;
      try {
        const workspace = await _request({
          id,
          method: 'GET',
        });
        commit('assignState', {
          currentWorkspace: workspace,
        });
      } catch (e) {
        router.push('/error');
      }
    },
    async updateWorkspace({ dispatch }, payload) {
      const { id, title, content } = payload;
      await _request({
        id,
        method: 'PUT',
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      await dispatch('readWorkspaces');
    },
    async deleteWorkspace({ state, dispatch }, payload) {
      const { id } = payload;
      await _request({
        id,
        method: 'DELETE',
      });

      await dispatch('readWorkspaces');

      if (id === parseInt(router.currentRoute.value.params.id, 10)) {
        router.push({
          name: 'Workspace',
          params: {
            id: state.workspaces[0].id,
          },
        });
      }
    },
    findWorkspacePath({ state, commit }) {
      const currentWorkspaceId = parseInt(
        router.currentRoute.value.params.id,
        10
      );
      function _find(workspace, parents) {
        if (currentWorkspaceId === workspace.id) {
          commit('assignState', {
            currentWorkspacePath: [...parents, workspace],
          });
        }

        if (workspace.documents) {
          // 재귀 호출
          workspace.documents.forEach((ws) =>
            _find(ws, [...parents, workspace])
          );
        }
      }
      state.workspaces.forEach((workspace) => _find(workspace, []));
    },
  },
};

async function _request(options) {
  return await fetch('/.netlify/functions/workspace', {
    method: 'POST',
    body: JSON.stringify(options),
  }).then((res) => res.json());
}
