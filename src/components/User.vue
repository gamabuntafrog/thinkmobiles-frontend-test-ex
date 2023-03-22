<template>
  <section>
    <div class="user-container">
      <div class="user-wrapper" v-if="user">
        <h2 class="username">
          {{ user.username }}
        </h2>
        <div class="user-data">
          <h3>
            {{ user.lastName }} {{ user.firstName }}
          </h3>
          <h3>
            {{ user.email }}
          </h3>
          <h3>
            {{ user.phoneNumber }}
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
      <button v-if="!isFormForEventsOpen" @click="isFormForEventsOpen = true" class="standard">
        Create event
      </button>
      <button v-else @click="isFormForEventsOpen = false" class="standard">
        Close form
      </button>
      <form v-if="isFormForEventsOpen" @submit.prevent="addEvent">
        <div class="input-wrapper">
          <label >
            Title
          </label>
          <input
              id="title"
              v-model="eventForm.title"
              type="text"
              class="standard"
          >
        </div>
        <div class="input-wrapper">
          <label for="description">
            Description
          </label>
          <input
              id="description"
              v-model="eventForm.description"
              type="text"
              class="standard"
          >
        </div>
        <div class="input-wrapper">
          <label for="startDate">
            Start date
          </label>
          <input
              id="startDate"
              v-model="eventForm.startDate"
              type="date"
              class="standard"
          >
        </div>
        <div class="input-wrapper">
          <label for="endDate">
            End date
          </label>
          <input
              id="endDate"
              v-model="eventForm.endDate"
              type="date"
              class="standard"
          >
        </div>
        <button type="submit" class="standard submit">
          Submit event
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "../api";
import {email, maxLength, minLength, numeric, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  name: 'UserByUsername',
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  data() {
    return {
      user: null,
      isUserLoading: true,
      isUserLoadingError: false,
      isFormForEventsOpen: true,
      eventForm: {
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  methods: {
    async getUser() {
      try {
        const username = this.$route.params.username;
        const {data} = await axios.get(`users/${username}`);

        console.log(data)
        this.user = data.user;
        this.isUserLoading = false
        this.isUserLoadingError = false
      } catch (e) {
        console.log(e)

        this.isUserLoadingError = true
      }
    },
    async addEvent() {
      const tryValidate = await this.v$.$validate()
      console.log(this.eventForm)
      if (!tryValidate) return;

      const formData = this.eventForm;

      this.isFormOpen = false;
      this.resetForm();

      try {
        // await axios.post('users', formData)
        console.log('submit')
        await this.getUser();
      } catch (e) {
        alert(`Error: ${e?.response?.data?.message || 'Error'}`)

        console.log(e)
      }
    },
    resetForm() {
      this.eventForm = {
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  validations() {
    return {
      eventForm: {
        title: {
          required,
          minLengthValue: minLength(3),
        },
        description: {
          required,
          minLengthValue: minLength(3),
          maxLengthValue: maxLength(14)
        },
        startDate: {
          required,
        },
        endDate: {
          required,

        },
      }
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

input::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  width: 16px;
  height: 100%;

  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-50%);
}

form {
  padding: 8px;
}

.input-wrapper {
  margin-bottom: 8px;
  margin-top: 4px;

}

.submit {
  margin-top: 16px;
}

label {
  display: block;
}

label.error {
  color: firebrick;
}

</style>