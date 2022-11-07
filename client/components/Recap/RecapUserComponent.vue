<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="user"
  >
    <header>
      <h3 class="author">
        @{{ followedUser }}
      </h3>
      
    </header>
    <p class="info">
      Followed on {{ dateFollowed }}
    </p>

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
export default {
  name: 'RecapUserComponent',
  props: {
    // Data from the stored freet
    followedUser: {
      type: String,
      required: true
    },
    dateFollowed: {
        type: String,
        required: true
    }
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
  }
};
</script>

<style scoped>
.user {
    font-family: 'Courier New', Courier, monospace;
    border-radius: 25px;
    border: 1px solid #111;
    margin-bottom: 20px;
    padding: 20px;
    position: relative;
}
.info {
  font-size: 12;
}
</style>
