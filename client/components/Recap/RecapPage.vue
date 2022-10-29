<!-- Page for user's recap -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Recap for @{{ $store.state.username }}</h2>
      </header>
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>

    </section>
  </main>
</template>

<script>
export default {
  name: 'RecapPage',
  data() {
    return {
      likedFreets: [],
      freetsPosted: [],
      alerts: {}, // Displays success/error messages encountered during liking a freet
      day: new Date(),
    };
  },
  mounted() { 
    this.getLikedFreets();
    this.getFreetsPosted();
  },
}
</script>
