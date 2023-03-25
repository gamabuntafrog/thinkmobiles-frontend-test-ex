<template>
  <section>
    <div class="container" v-if="user && events">
      <div class="user-wrapper">
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
      <div>
        <button v-if="!isFormForEventsOpen" @click="isFormForEventsOpen = true" class="standard">
          Create event
        </button>
        <button v-else @click="isFormForEventsOpen = false" class="standard">
          Close form
        </button>
        <form v-if="isFormForEventsOpen" @submit.prevent="addEvent">
          <div class="input-wrapper">
            <label :class="{error: v$.eventForm.title?.$errors[0]}" for="title">
              {{ v$.eventForm.title?.$errors[0]?.$message || 'Title' }}
            </label>
            <input
                id="title"
                v-model="eventForm.title"
                type="text"
                class="standard"
            >
          </div>
          <div class="input-wrapper">
            <label :class="{error: v$.eventForm.description?.$errors[0]}" for="description">
              {{ v$.eventForm.description?.$errors[0]?.$message || 'Description' }}
            </label>
            <input
                id="description"
                v-model="eventForm.description"
                type="text"
                class="standard"
            >
          </div>
          <div class="input-wrapper">
            <label :class="{error: v$.eventForm.startDate?.$errors[0]}" for="startDate">
              {{ v$.eventForm.startDate?.$errors[0]?.$message || 'Start date' }}
            </label>
            <input
                id="startDate"
                v-model="eventForm.startDate"
                type="date"
                class="standard"
            >
          </div>
          <div class="input-wrapper">
            <label :class="{error: v$.eventForm.endDate?.$errors[0]}" for="endDate">
              {{ v$.eventForm.endDate?.$errors[0]?.$message || 'End date' }}
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
      <div  v-if="events.length > 0" class="events-wrapper">
        <div class="table-wrapper">
          <table>
            <tr>
              <th>
                Title
              </th>
              <th>
                Description
              </th>
              <th>
                Start date
              </th>
              <th>
                End date
              </th>
            </tr>
            <tr v-for="event in events">
              <td>
                {{ event.title }}
              </td>
              <td>
                {{ event.description }}
              </td>
              <td>
                {{
                  getDate(event.startDate)
                }}
              </td>
              <td>
                {{
                  getDate(event.endDate)
                }}
              </td>
            </tr>
          </table>
        </div>
        <ul v-if="pages > 1" class="pages-list">
          <li class="pages-list" :class="{active: index === currentPage}" v-for="(_, index) in pagesList">
            <button @click="this.currentPage = index" class="standard">
              {{index + 1}}
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <h2 style="margin: 50px">
          Table is clear, you can add events in form above
        </h2>
      </div>
    </div>
    <div v-else-if="isUserLoading || isEventsLoading">
      <h1>Loading...</h1>
    </div>
    <div v-else>
      <h1>Not found user</h1>
    </div>
  </section>
</template>

<script>
import axios from "../api";
import {email, maxLength, maxValue, minLength, minValue, numeric, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  name: 'UserById',
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
      isFormForEventsOpen: false,
      events: null,
      pages: 0,
      currentPage: 0,
      isEventsLoading: true,
      isEventsLoadingError: false,
      eventForm: {
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  computed: {
    pagesList() {
      return Array.from({length: this.pages})
    }
  },
  methods: {
    async getUser() {
      try {
        const id = this.$route.params.id;
        const {data} = await axios.get(`users/${id}`);

        console.log(data)
        this.user = data.user;
        this.isUserLoadingError = false
      } catch (e) {
        console.log(e)

        this.isUserLoadingError = true
      } finally {
        this.isUserLoading = false
      }
    },
    async getEvents() {
      try {
        const id = this.$route.params.id;
        const {data} = await axios.get(`events/users/${id}`, {
          params: {
            page: this.currentPage
          }
        });

        this.events = data.events;
        this.pages = data.pages;
        this.isEventsLoadingError = false;

      } catch (e) {
        console.log(e)

        this.isEventsLoadingError = true
      } finally {
        this.isEventsLoading = false
      }
    },
    async addEvent() {
      const tryValidate = await this.v$.$validate()
      if (!tryValidate) return;

      const formData = this.eventForm;

      formData.startDate = new Date(formData.startDate)
      formData.endDate = new Date(formData.endDate)

      try {
        await axios.post(`events/users/${this.user._id}/validateDate`, formData)

        this.isFormForEventsOpen = false;
        this.resetForm();

        await axios.post(`events/users/${this.user._id}`, formData)

        await this.getUser();
        await this.getEvents();
      } catch (e) {

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
    },
    getDate(date) {
      return new Intl.DateTimeFormat('en-us', {
        dateStyle: 'short',
      }).format(new Date(date))
    }
  },
  watch: {
    currentPage() {
      this.getEvents()
    }
  },
  validations() {
    return {
      eventForm: {
        title: {
          required,
          minLengthValue: minLength(3),
          maxLengthValue: maxLength(30),
        },
        description: {
          required,
          maxLengthValue: maxLength(60),
        },
        startDate: {
          required,
          maxValue(value) {
            return new Date(this.eventForm.endDate) > new Date(value);
          }
        },
        endDate: {
          required,
          minValue(value) {
            return new Date(this.eventForm.startDate) < new Date(value);
          }
        },
      }
    }
  },
  mounted() {
    this.getUser()
    this.getEvents()
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

table {
  margin-top: 20px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

@media (max-width: 600px) {

  td, th {
    padding: 3px;
  }
}

</style>