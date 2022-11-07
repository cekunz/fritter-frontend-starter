<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3> 
    </header>
    <p
      class="content"
    >
      {{ freet.content }}
    </p>
    <p class="info">
      Posted on {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
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
  name: 'BareFreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
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
.freet {
    font-family: 'Courier New', Courier, monospace;
    border-radius: 25px;
    border: 1px solid #111;
    margin-bottom: 20px;
    padding: 20px;
    position: relative;
}
</style>
