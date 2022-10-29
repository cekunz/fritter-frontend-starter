
<template>
  <div
    v-if="$store.state.username !== username"
    >
    <button
      v-if="(($store.state.following.filter((x) => x.username === username)).length === 0)" 
      @click="followUser"  
    >
     Follow
    </button> 

    <button
       v-if="(($store.state.following.filter((x) => x.username === username)).length === 1)" 
      @click="unfollowUser"  
    >
      Unfollow
    </button> 
  </div>
</template>


<script>

export default {
  name: 'FollowButton',
  props: {
    // the user to follow
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {

      alerts: {} // Displays success/error messages encountered during liking a freet
    };
  },
  methods: {
   followUser() {
      /**
       * Follow a user
       */
      if (((this.$store.state.following.filter((x) => x === this.username)).length === 1)) {
        const error = 'Error: You have already followed this user.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        route: `/api/follow?username=${this.username}`,
        method: 'POST',
        message: 'Successfully followed user!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    unfollowUser() {
      /**
       * Unfollow a user
       */
      if (((this.$store.state.following.filter((x) => x === this.username)).length === 0)) {
        const error = 'Error: You have not yet followed this user.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        route: `/api/follow?username=${this.username}`,
        method: 'DELETE',
        message: 'Successfully unfollowed user.',
        callback: () => {
          console.log('unfollowed callback')
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the like endpoint
       * @param params - Options for the request
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };

      try {
        const r = await fetch(params.route, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
      
        this.$store.commit('refreshFollowing'); 

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>
