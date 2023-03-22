<template>
  <section>
    <div class="user-container">
      <div class="user-wrapper" v-if="user">
        <h2 class="username">
          {{user.username}}
        </h2>
        <div class="user-data">
          <h3>
            {{user.lastName}} {{user.firstName}}
          </h3>
          <h3>
            {{user.email}}
          </h3>
          <h3>
            {{user.phoneNumber}}
          </h3>
        </div>
      </div>
      <div v-else-if="isUserLoading">
        <h1>Loading...</h1>
      </div>
      <div v-else>
        <h1>Error</h1>
      </div>
    </div>
    <div>
      <button v-if="!isFormForEventsOpen" @click="isFormForEventsOpen = false" class="standard">
        Create event
      </button>
      <button v-else @click="isFormForEventsOpen = true" class="standard">
        Close form
      </button>
      <form>
        <div class="input-wrapper">
          <label>
            Title
          </label>
          <input>
        </div>
        <div class="input-wrapper">
          <label>
            Description
          </label>
          <input>
        </div>
        <div class="input-wrapper">
          <label>
            Start date
          </label>
          <input>
        </div>
        <div class="input-wrapper">
          <label>
            End date
          </label>
          <input>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "../api";

export default {
  name: 'UserByUsername',
  data() {
    return {
      user: null,
      isUserLoading: true,
      isUserLoadingError: false,
      isFormForEventsOpen: false
    }
  },
  methods: {
    async getUser() {
      const username = this.$route.params.username;
      const {data} = await axios.get(`users/${username}`);

      console.log(data)
      this.user = data.user;
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>

<style lang="scss" scoped>

section {
  padding: 20px;
}

.username {
  border-bottom: 2px solid green;
}

.user-data {
  padding: 20px;
}

</style>