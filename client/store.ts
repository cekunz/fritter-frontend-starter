import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import moment from 'moment';
// import { Like } from 'server/likes/model';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    likes: [], // all likes by user currently logged in
    flags: [],
    following: [],
    recap: null, 
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshLikes(state) {
      /**
       * Update if a freet has been liked
       */
      if (state.username !== null) {
        const url = `/api/likes/${state.username}`;
        const res = await fetch(url).then(async r => r.json());
        state.likes = res.likes; 
      } else state.likes = [];
    },
    async refreshFollowing(state) {
      /**
       * Update the list of people followed by the user logged in
       */
      if (state.username !== null) {
        const url = `/api/follow/following?username=${state.username}`;
        const res = await fetch(url).then(async r => r.json());
        state.following = res.following; 

      } else state.following = [];
    },
    async refreshRecap(state) {
      const currDate = moment(new Date()).format('MMMM Do YYYY');
      const options = {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({date: currDate})
      };
      
      const r = await fetch(`/api/recap/${state.username}`, options);
      if (!r.ok) {
        console.log('error!')
      }
      const res = await r.json();
      state.recap = res.recap;
    },
    // async refreshFlags(state) {
    //   /**
    //    * Update the list of people followed by the user logged in
    //    */
     
    //   if (state.username !== null) {
    //     const url = `/api/flag?freetId=${state.username}`;
    //     const res = await fetch(url).then(async r => r.json());
    //     state.following = res.following; 

    //   } else state.following = [];
    // },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
