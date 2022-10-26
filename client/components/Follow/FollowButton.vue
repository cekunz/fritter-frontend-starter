
<template>
  <div
    v-if="$store.state.username !== username"
    >
    <button
      v-if="!followed"
      @click="followUser"  
    >
     Follow
    </button> 

    <button
      v-if="followed"
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
    // need the id from the current freet being liked
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      followed: checkIfFollowed(), // Whether or not this user has been followed
      alerts: {} // Displays success/error messages encountered during liking a freet
    };
  },
  methods: {
   checkIfFollowed() {
      /**
       * Follow a user
       */
    //   if (this.followed) {
    //     const error = 'Error: You have already followed this user.';
    //     this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
    //     setTimeout(() => this.$delete(this.alerts, error), 3000);
    //     return;
    //   }

      const params = {
        route: `/api/follow/following?username=${username}`,
        method: 'GET',
        message: 'Successfully followed user!',
        callback: () => {
          console.log('new follow');
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
      this.followed = true;
   },
   followUser() {
      /**
       * Follow a user
       */
      if (this.followed) {
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
          console.log('new follow');
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
      this.followed = true;
    },
    unfollowUser() {
      /**
       * Unfollow a user
       */
      if (!this.followed) {
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
      this.followed = false;
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
      
        // this.$store.commit('refreshFreets'); // check if this is needed

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>
