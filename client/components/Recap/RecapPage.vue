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
                <BareFreetComponent
                v-for="freet in likedFreets"
                :key="freet.id"
                :freet="freet"
                />
       </div>
       <div
             v-if="!likedFreets.length"
            >
            <p> You have not liked any Freets this week. </p>    
       </div>
       <h4>New Followers</h4>
       <div
             v-if="followings.length"
            >
            <RecapUserComponent
                v-for="follow in followings"
                :key="follow.id"
                :followedUser="follow.following"
                :dateFollowed="follow.date"
            />
       </div>
       <div
             v-if="!followings.length"
            >
            <p> You have not followed anyone new this week. </p>    
       </div>
       <h4>User's Followed</h4>
       <div
             v-if="usersFollowed.length"
            >
            <RecapUserComponent
                v-for="follow in usersFollowed"
                :key="follow.id"
                :followedUser="follow.following"
                :dateFollowed="follow.date"
            />
      </div>
      <div
             v-if="!usersFollowed.length"
            >
            <p> You have no new followers this week. </p>    
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
import BareFreetComponent from '@/components/Freet/BareFreetComponent.vue';
import RecapUserComponent from './RecapUserComponent.vue'

export default {
  name: 'RecapPage',
  components: {BareFreetComponent, RecapUserComponent},
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      alerts: {}, // Displays success/error messages encountered during liking a freet
    };
  },
  mounted() {  
    this.getRecap();
    this.formatDate();
  },
  computed: {
    likedFreets() {
        console.log(this.$store.state.recap.likes)
        return this.$store.state.recap.likes;
    },
    usersFollowed() {
        console.log(this.$store.state.recap.followings)
        return this.$store.state.recap.followings;
    },
    followings() {
        return this.$store.state.recap.followers;
    }
  },
  methods: {
      getRecap() {
       /**
       * Gets the most up to date recap
       */
       this.$store.commit('refreshRecap'); 
       console.log('RECAP AFRTER REFRESH', this.$store.state.recap)
    },
    formatDate() {
        const startDate = moment(this.startDate).format('MMMM Do YYYY');
        const endDate = moment(this.startDate).subtract(6, "days").format('MMMM Do YYYY');
        this.startDate = startDate;
        this.endDate = endDate;
    },
//     async request(params) {
//       /**
//        * Submits a request to the recap's endpoint
//        * @param params - Options for the request
//        * @param params.body - Body for the request, if it exists
//        * @param params.callback - Function to run if the the request succeeds
//        */
//       const options = {
//         method: params.method, headers: {'Content-Type': 'application/json'}
//       };
//       if (params.body) {
//         options.body = params.body;
//       }

//       try {
//         const r = await fetch(`/api/recap`, options);
//         const res = await r.json();
//         if (!r.ok) {
//           throw new Error(res.error);
//         }

//         params.callback();
//       } catch (e) {
//         this.$set(this.alerts, e, 'error');
//         setTimeout(() => this.$delete(this.alerts, e), 3000);
//       }
//     }
  }
}


</script>
