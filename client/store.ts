import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import moment from 'moment';
import { Like } from 'server/likes/model';

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
    recap: {
      likes: [],
      following: [],
      followers: [],
    },
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
      const startDate = new Date();
      for (let i=0; i<7; i++) {
        const currDate = moment(startDate).subtract(i, "days").format('MMMM Do YYYY');

      const options = {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: this.username, date: currDate})
      };

      try {
        const r = await fetch(`/api/recap`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        const dayRecap = res.recap; 
        if (dayRecap.likes.length) {
            const mapped = dayRecap.likes.map((like: Like) => like.post); // string for the post ID
            state.recap.likes.push(mapped);
        }
        if (dayRecap.followings.length) {
            state.recap.following.push(dayRecap.followings);
        }
        if (dayRecap.followers.length) {
            state.recap.followers.push(dayRecap.followers);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

    }

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
