
<template>
  <div
     v-if="$store.state.username !== username">
      <button
        v-if="editing"
        @click="stopEditing"
      >
        🚫 Discard changes
      </button>
      <button
        v-if="!editing & flags.length === 1"
        @click="startEditing"
      >
        ✏️ Edit Flag Type
      </button>

      <form v-if="editing"
        @submit="editFlag">
        <label for="newType">Choose new flag type:</label>
        <select name="newFlagType" id="newFlagType">
          <option value="bullying">Bullying</option>
          <option value="harassment">Harassment</option>
        </select>
        <br><br>
        <input type="submit" value="Submit">
      </form>

      <button 
        v-if="!editing & flags.length === 1"
        @click="removeFlag"
      >
        🗑️ Delete Flag
      </button>
      <button
        v-if="flags.length === 0"
        @click="flagFreet"  
      >
        Flag Freet 
      </button> 
      <form v-if="selecting"
        @submit="submitFlag">
        <label for="type">Choose flag type:</label>
        <select name="flagType" id="flagType">
          <option value="bullying">Bullying</option>
          <option value="harassment">Harassment</option>
        </select>
        <br><br>
        <input type="submit" value="Submit">
      </form>

  
  <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

 
<script>

export default {
  name: 'FlagButton',
  props: {
    // need the id from the current freet being liked
    username: {
      type: String,
      required: true
    },
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      type: null,
      editing: false, // whether or not the flag type is being updated
      selecting: false,
      alerts: {} // Displays success/error messages encountered during liking a freet
    };
  },
  computed: {
    flags() {
      if (this.$store.state.flags.length > 0) {
        return this.$store.state.flags.filter((flag) => (flag.freet === this.freet._id) && (flag.username === this.$store.state.username));
      }
      else return [];
    },
  },
  methods: {
   flagFreet() {
      /**
       * Starts process of flagging a freet
       */
      this.selecting = true;
    },
    stopEditing() {
      this.editing = false;
    },
    startEditing() {
      this.editing = true;
    },
    submitFlag() {
      if (this.flags.length === 1) {
        const error = 'Error: You have already flagged this freet.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const flagType = document.getElementById("flagType").value;
      const params = {
        route: `/api/flag?freetId=${this.freet._id}`,
        method: 'POST',
        body: JSON.stringify({username: this.$store.state.username, type: flagType}),
        message: 'Successfully flagged freet',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
    
      this.request(params);
      this.selecting = false;   
    },
    removeFlag() {
      /**
       * Removes like from a freet
       */
       if (this.flags.length === 0) {
        const error = 'Error: You have not flagged this freet yet.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        route: `/api/flag?freetId=${this.freet._id}&username=${this.$store.state.username}`,
        method: 'DELETE',
        message: 'Successfully removed flag from freet',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
    
      this.request(params);
    },
    editFlag() {
       /**
       * Edits an existing flag
       */
      if (this.flags.length === 0) {
        const error = 'Error: You have not flagged this freet yet.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const newFlagType = document.getElementById("newFlagType").value;
      const params = {
        route: `/api/flag?freetId=${this.freet._id}&username=${this.$store.state.username}`,
        method: 'PUT',
        body: JSON.stringify({type: newFlagType}),
        message: 'Successfully updated flag on freet',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
    
      this.request(params);
      this.editing = false; 
    },
    async request(params) {
      /**
       * Submits a request to the like endpoint
       * @param params - Options for the request
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'},
        body: params.body
      };

      try {
        const r = await fetch(params.route, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
      
        this.$store.commit('refreshFlags'); 

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>
