
<template>
  <div>
    <button
      v-if="!liked"
      @click="submitLike"  
    >
      Like ❤️ 
    </button> 

    <button
      v-if="liked"
      @click="removeLike"  
    >
      Freet Liked
    </button> 
  </div>
</template>

 
<script>
// import {mapState} from 'vuex';

export default {

  name: 'LikeButton',
  props: {
    // need the id from the current freet being liked
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      liked: false,
      alerts: {} // Displays success/error messages encountered during liking a freet
    };
  },
  mounted() { // can try created() // created runs as page loads
    this.getLiked();
  },
  // computed: {
  //   ...mapState(['liked'])
  // },
  methods: {
  getLiked() {
    const allLikes = this.$store.state.likes.filter((x) => x.post === this.freet._id)
    const liked = (allLikes.length === 1)
    this.liked = liked;
    return liked
  },
   submitLike() {
      /**
       * Sends like to a freet
       */
      if (this.liked) {
        const error = 'Error: You have already liked this freet.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'POST',
        message: 'Successfully liked freet!',
        callback: () => {
        }
      };
      this.request(params);
    },
    removeLike() {
      /**
       * Removes like from a freet
       */
      if (!this.liked) {
        const error = 'Error: You have not yet liked this freet.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'DELETE',
        message: 'Successfully removed like from freet!',
        callback: () => {
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
        const r = await fetch(`/api/likes/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
      
        this.$store.commit('refreshLikes'); 
        this.getLiked();
        params.callback();

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>
