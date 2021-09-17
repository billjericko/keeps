import { createStore } from 'vuex'

export default createStore({
  state: {
    keeps: []
  },
  mutations: {
    initializeKeep(state){
      let keeps = localStorage.getItem('keeps');
      if(keeps != null){
        state.keeps = JSON.parse(keeps);
      }
    },
    updateColor(state,data){
      let active = state.keeps.find(e => e.ID == data.ID);
      active.color = data.color;

    },
    updateStatus(state,data){
      let active = state.keeps.find(e => e.ID == data.ID);
      active.done = data.status;
    },
    addNew(state,data){
      state.keeps.push(data);
    },
    deleteKeep(state,data){
      let activeID = state.keeps.findIndex(e => e.ID == data.ID);
      state.keeps.splice(activeID,1);
    },
    updateKeep(state){
      let keeps = JSON.stringify(state.keeps);
      localStorage.setItem('keeps',keeps);
    }
  },
  actions: {
    updateColor({commit},data){
      commit("updateColor",data);
      commit("updateKeep");
    },
    updateStatus({commit},data){
      commit("updateStatus",data);
      commit("updateKeep");
    },
    addNew({commit},data){
      commit("addNew",data);
      commit("updateKeep");
    },
    deleteKeep({commit},data){
      commit("deleteKeep",data);
      commit("updateKeep");
    }
  },
  modules: {
  }
})
