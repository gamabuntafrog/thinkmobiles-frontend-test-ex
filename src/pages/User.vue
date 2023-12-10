<template>
  <section>
    <div class="container" v-if="user && events">
      <div class="user-wrapper">
        <h2 class="username">
          {{ user.username }}
        </h2>
        <div class="user-data">
          <h3>{{ user.lastName }} {{ user.firstName }}</h3>
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
          Створити подію
        </button>
        <button v-else @click="isFormForEventsOpen = false" class="standard">Закрити форму</button>
        <form v-if="isFormForEventsOpen" @submit.prevent="addEvent">
          <div class="input-wrapper">
            <label :class="{ error: v$.eventForm.title?.$errors[0] }" for="title">
              {{ v$.eventForm.title?.$errors[0]?.$message || 'Заголовок' }}
            </label>
            <input
              @blur="v$.eventForm.title.$touch"
              id="title"
              v-model="eventForm.title"
              type="text"
              class="standard"
            />
          </div>
          <div class="input-wrapper">
            <label :class="{ error: v$.eventForm.description?.$errors[0] }" for="description">
              {{ v$.eventForm.description?.$errors[0]?.$message || 'Опис' }}
            </label>
            <input
              @blur="v$.eventForm.description.$touch"
              id="description"
              v-model="eventForm.description"
              type="text"
              class="standard"
            />
          </div>
          <div class="input-wrapper">
            <label :class="{ error: v$.eventForm.startDate?.$errors[0] }" for="startDate">
              {{ v$.eventForm.startDate?.$errors[0]?.$message || 'Початкова дата' }}
            </label>
            <input
              @blur="v$.eventForm.startDate.$touch"
              id="startDate"
              v-model="eventForm.startDate"
              type="date"
              class="standard"
            />
          </div>
          <div class="input-wrapper">
            <label :class="{ error: v$.eventForm.endDate?.$errors[0] }" for="endDate">
              {{ v$.eventForm.endDate?.$errors[0]?.$message || 'Кінцева дата' }}
            </label>
            <input
              @blur="v$.eventForm.endDate.$touch"
              id="endDate"
              v-model="eventForm.endDate"
              type="date"
              class="standard"
            />
          </div>
          <button type="submit" class="standard submit">Додати подію</button>
        </form>
      </div>
      <div v-if="events.length > 0 && !isEventsLoading" class="events-wrapper">
        <div class="table-wrapper">
          <table>
            <tr>
              <th
                v-for="item in lablesList"
                :key="item.label"
                @click="changeSortingField(item.fieldName)"
              >
                <div class="label-wrapper">
                  <p class="label-name" :class="{ active: sortBy === item.fieldName }">
                    {{ item.label }}
                  </p>
                  <button v-if="sortBy === item.fieldName" class="arrow-wrapper">
                    <img
                      v-if="variant === 'desc'"
                      src="../assets/arrow-down.svg"
                      alt="arrow down"
                    />
                    <img v-else src="../assets/arrow-top.svg" alt="arrow down" />
                  </button>
                </div>
              </th>
            </tr>
            <tr v-for="event in events" :key="event._id">
              <td>
                {{ event.title }}
              </td>
              <td>
                {{ event.description }}
              </td>
              <td>
                {{ getDate(event.startDate) }}
              </td>
              <td>
                {{ getDate(event.endDate) }}
              </td>
              <td style="border-top: none">
                <button @click="deleteEvent(event._id)" style="width: 100%" class="standard">Видалити</button>
              </td>
            </tr>
          </table>
        </div>
        <ul v-if="pages > 1" class="pages-list">
          <li
            class="pages-list"
            :class="{ active: index === currentPage }"
            v-for="(page, index) in pagesList"
            :key="index"
          >
            <button @click="changePage(index)" class="standard">
              {{ page }}
            </button>
          </li>
        </ul>
      </div>
      <div v-else-if="isEventsLoading">
        <h1 style="padding: 20px">Завантаження подій користувача...</h1>
      </div>
      <div v-else>
        <h2 style="margin: 50px">Таблиця чиста, ви можете додати нові події в таблиці вище</h2>
      </div>
    </div>
    <div v-else-if="isUserLoading || isEventsLoading">
      <h1>Завантаження...</h1>
    </div>
    <div v-else>
      <h1>Користувач не знайдений</h1>
    </div>
  </section>
</template>

<script>
import axios from '../api'
import {
  email,
  helpers,
  maxLength,
  maxValue,
  minLength,
  minValue,
  numeric,
  required
} from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import router from '@/router'

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
      isEventsLoading: true,
      isEventsLoadingError: false,
      pages: 0,
      currentPage: Number(this.$route.query.page) || 0,
      sortBy: null,
      variant: 'desc',
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
      return Array.from({ length: this.pages }, (v, index) => index + 1)
    },
    lablesList() {
      return [
        {
          label: 'Заголовок',
          fieldName: 'title'
        },
        {
          label: 'Опис',
          fieldName: 'description'
        },
        {
          label: 'Початкова дата',
          fieldName: 'startDate'
        },
        {
          label: 'Кінцева дата',
          fieldName: 'endDate'
        }
      ]
    }
  },
  methods: {
    async getUser() {
      try {
        const id = this.$route.params.id
        const { data } = await axios.get(`users/${id}`)

        console.log(data)
        this.user = data.user
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
        this.isEventsLoading = true
        const id = this.$route.params.id

        const { data } = await axios.get(`events/users/${id}`, {
          params: {
            page: this.currentPage,
            sortBy: this.sortBy,
            variant: this.variant
          }
        })

        if (data.pages && this.currentPage > data.pages - 1) {
          return await router.push({
            to: `/user/${this.$route.params.id}`,
            query: { page: data.pages - 1 }
          })
        }

        this.events = data.events
        this.pages = data.pages
        this.isEventsLoadingError = false
      } catch (e) {
        console.log(e)

        this.isEventsLoadingError = true
      } finally {
        this.isEventsLoading = false
      }
    },
    async addEvent() {
      const tryValidate = await this.v$.$validate()
      if (!tryValidate) return

      const formData = this.eventForm

      formData.startDate = new Date(formData.startDate)
      formData.endDate = new Date(formData.endDate)

      try {
        await axios.post(`events/users/${this.user._id}/validateDate`, formData)

        this.isFormForEventsOpen = false
        this.resetForm()

        await axios.post(`events/users/${this.user._id}`, formData)

        await this.getUser()
        await this.getEvents()
      } catch (e) {
        console.log(e)
      }
    },
    async deleteEvent(eventId) {
      try {
        await axios.delete(`events/${eventId}/users/${this.user._id}`)

        await this.getUser()
        await this.getEvents()
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
        dateStyle: 'short'
      }).format(new Date(date))
    },
    changePage(page) {
      this.$router.push({ path: `/user/${this.$route.params.id}`, query: { page: page } })
    },
    changeSortingField(fieldName) {
      this.variant = this.variant === 'asc' && this.sortBy === fieldName ? 'desc' : 'asc'
      this.sortBy = fieldName
    }
  },
  watch: {
    $route(to) {
      if (to.query.page) {
        this.currentPage = Number(to.query.page)
      } else {
        this.currentPage = 0
      }
    },
    currentPage() {
      this.getEvents()
    },
    variant() {
      this.getEvents()
    },
    sortBy() {
      this.getEvents()
    }
  },
  validations() {
    return {
      eventForm: {
        title: {
          required: helpers.withMessage('Title cannot be empty', required),
          minLength: helpers.withMessage(
            ({ $params }) => `Min length of title ${$params.min}`,
            minLength(3)
          ),
          maxLength: helpers.withMessage(
            ({ $params }) => `Max length of title ${$params.max}`,
            maxLength(30)
          )
        },
        description: {
          maxLength: helpers.withMessage(
            ({ $params }) => `Max length of description ${$params.max}`,
            maxLength(60)
          )
        },
        startDate: {
          required: helpers.withMessage('Start date cannot be empty', required),
          maxValue(value) {
            return new Date(this.eventForm.endDate) > new Date(value)
          }
        },
        endDate: {
          required: helpers.withMessage('End date cannot be empty', required),
          minValue(value) {
            return new Date(this.eventForm.startDate) < new Date(value)
          }
        }
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
th {
  padding: 12px;
}

td {
  padding: 7px;
}

section {
  padding: 20px;
  padding-bottom: 0;
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

.label-name {
  &:hover {
    color: green;
  }
}

.label-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

p.active {
  color: green;
}

.arrow-wrapper {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
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
  td,
  th {
    padding: 3px;
  }
}
</style>
