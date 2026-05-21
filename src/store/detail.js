export const state = () => ({
  id: "",
  timeId: "",
  tagId: "",
  token: "",
});

export const mutations = {
  upDetail(state, id) {
    state.id = id;
  },
  timeDateil(state, timeId) {
    state.timeId = timeId;
  },
  tagDetail(state, tagId) {
    state.tagId = tagId;
  },
  settoken(state, token) {
    state.token = token;
  },
};
