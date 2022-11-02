<!-- Page for user's recap -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Recap for @{{ $store.state.username }}</h2>
      </header>
      <body>
          <h3> Week of {{endDate}} - {{startDate}} </h3>
          <h4>Likes Sent</h4>
           <div
                v-if="likedFreets.length"
            >
                <FreetComponent
                v-for="freet in $store.state.freets.filter((freet) => likedFreets.includes(freet.id))"
                :key="freet.id"
                :freet="freet"
                />
      </div>
      </body>
      
    <!-- </section> -->
    <!-- <section> -->
        <!-- <h2>Likes Sent</h2> -->
     

    </section>
  </main>
</template>



<script>
import moment from 'moment';
import FreetComponent from '@/components/Freet/FreetComponent.vue';

// $store.state.freets.filter((freet) => likedFreets.includes(freet.id)).length
export default {
  name: 'RecapPage',
  components: {FreetComponent,},
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      likedFreets: [],
    //   freetsPosted: [],
      usersFollowed: [],
      followings: [],
      alerts: {}, // Displays success/error messages encountered during liking a freet
    };
  },
  mounted() {  
    this.getRecap();
    this.formatDate();
  },
  methods: {
      getRecap() {
       /**
       * Gets all recaps for the days in the date range
       */
      for (let i=0; i<7; i++) {
          const currDate = moment(this.startDate).subtract(i, "days").format('MMMM Do YYYY');
          const params = {
            method: 'POST',
            message: 'Succesfully generated recap!',
            body: JSON.stringify({username: this.username, date: currDate}),
            callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            }
        };
        this.request(params);
      }

       console.log('FREETS', this.$store.state.freets);
       console.log('liked freets', this.likedFreets);
       for (const id of this.likedFreets) {
        console.log('id', id)
        console.log(this.$store.state.freets.filter((freet) => likedFreets.includes(freet.id)))
       }
    },
    formatDate() {
        const startDate = moment(this.startDate).format('MMMM Do YYYY');
        const endDate = moment(this.startDate).subtract(6, "days").format('MMMM Do YYYY');
        this.startDate = startDate;
        this.endDate = endDate;
    },
    async request(params) {
      /**
       * Submits a request to the recap's endpoint
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
        const r = await fetch(`/api/recap`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        const dayRecap = res.recap; 
        if (dayRecap.likes.length) {
            const mapped = dayRecap.likes.map((like) => like.post);
            this.likedFreets.push(mapped);
        }
        if (dayRecap.followings.length) {
            this.usersFollowed.push(dayRecap.followings);
        }
        if (dayRecap.followers.length) {
            this.followings.push(dayRecap.followers);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}


</script>
