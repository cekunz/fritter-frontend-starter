<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <div 
      v-if="isContentBlocked"
    >
      <p>
          This Freet has been flagged for containing sensitive content that some users may find offensive.
      </p>
        
        <button
            @click="viewFreet"
        >
            View Freet
        </button>

    </div>
    <div
        v-if="!isContentBlocked"
    >
      <header class='freetHeader'>
        <h3 class="author">
          @{{ freet.author }}
        </h3>
        <div 
          v-if="$store.state.username !== null">
          <FollowButton 
          :username="freet.author"
          />
        </div>
        
        <div
          v-if="$store.state.username === freet.author"
          class="actions"
        >
          <button
            v-if="editing"
            @click="submitEdit"
          >
            ✅ Save changes
          </button>
          <button
            v-if="editing"
            @click="stopEditing"
          >
            🚫 Discard changes
          </button>
          <button
            v-if="!editing"
            @click="startEditing"
          >
            ✏️ Edit
          </button>
          <button @click="deleteFreet">
            🗑️ Delete
          </button>
        </div>
      </header>
      <textarea
        v-if="editing"
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <p
        v-else
        class="content"
      >
        {{ freet.content }}
      </p>
      <p class="info">
        Posted on {{ freet.dateModified }}
        <i v-if="freet.edited">(edited)</i>
      </p>

      <footer  class="buttons" 
        v-if="$store.state.username !== null" >
        <LikeButton
          class="likebutton"
          v-if="!editing"
          :freet="freet"
        />
        <FlagButton
         class="flagbutton"
          v-if="!editing"
          :username="freet.author"
          :freet="freet"
        />
      </footer>
     </div>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import LikeButton from '../Likes/LikeButton.vue';
import FollowButton from '../Follow/FollowButton.vue'
import FlagButton from '../Flag/FlagButton.vue'

export default {
  components: { LikeButton,  FollowButton, FlagButton },
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      contentBlocked: null,
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  computed: {
     isContentBlocked() {
      if (this.contentBlocked === false) return false;
      if (this.$store.state.flags.length > 0) {
        const allFlagsForFreet = this.$store.state.flags.filter((flag) => flag.freet === this.freet._id);
        if (allFlagsForFreet.length > 3) return true;
        else return false;
      }
      else return false;
    }
  },
  methods: {
    viewFreet() {
      this.contentBlocked = false;
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.info {
  /* font-family: 'Courier New', Courier, monospace; */
  font-size: 18px;
}

.content {
  font-size: 22px;
}

.buttons {
  display: flex;
  flex-direction: row;
}

.freet {
    font-family: 'Courier New', Courier, monospace;
    border-radius: 25px;
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    margin-bottom: 20px;
}
</style>
