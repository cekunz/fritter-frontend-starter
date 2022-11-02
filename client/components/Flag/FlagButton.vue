
<template>
  <div>
    <button
      @click="flagFreet"  
    >
      Flag Freet 
    </button> 

    <button
     
      @click="removeFlag"  
    >
      Remove Flag
    </button> 
  </div>
</template>

 
<script>
//   <!-- v-if="!(($store.state.likes.filter((x) => x.post === freet._id)).length === 1)" -->
//  v-if="(($store.state.likes.filter((x) => x.post === freet._id)).length === 1)"
export default {
  name: 'FlagButton',
  props: {
    // need the id from the current freet being liked
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during liking a freet
    };
  },
  methods: {
   submitLike() {
      /**
       * Sends like to a freet
       */
      if (((this.$store.state.likes.filter((x) => x.post === this.freet._id)).length === 1)) {
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
      if (((this.$store.state.likes.filter((x) => x.post === this.freet._id)).length === 0)) {
        const error = 'Error: You have not yet liked this freet.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'DELETE',
        message: 'Successfully removed like from freet!',
        callback: () => { }
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
        params.callback();

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>
