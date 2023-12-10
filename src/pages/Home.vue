<template>
  <section>
    <div v-if="$store.state.isLoggedIn">
      <h1>Дім</h1>
      <button v-if="!isFormOpen" class="standard" @click="isFormOpen = true">Додати користувачів</button>
      <button v-else class="standard" @click="isFormOpen = false">Закрити</button>
      <div class="form-wrapper" v-if="isFormOpen">
        <h2>Додавання користувачів</h2>
        <form @submit.prevent="submitForm">
          <div class="input-wrapper">
            <label :class="{ error: v$.userForm.username?.$errors[0] }" for="username">
              {{ v$.userForm.username?.$errors[0]?.$message || 'Нікнейм' }}
            </label>
            <input
              v-model="userForm.username"
              @blur="v$.userForm.username.$touch"
              type="text"
              id="username"
              class="standard"
            />
          </div>
          <div class="input-wrapper">
            <label :class="{ error: v$.userForm.firstName?.$errors[0] }" for="firstName">
              {{ v$.userForm.firstName?.$errors[0]?.$message || 'Ім`я' }}
            </label>
            <input
              v-model="userForm.firstName"
              @blur="v$.userForm.firstName.$touch"
              type="text"
              id="firstName"
              class="standard"
            />
          </div>
          <div class="input-wrapper">
            <label :class="{ error: v$.userForm.lastName?.$errors[0] }" for="lastName">
              {{ v$.userForm.lastName?.$errors[0]?.$message || 'Призвіще' }}
            </label>
            <input
              v-model="userForm.lastName"
              @blur="v$.userForm.lastName.$touch"
              type="text"
              id="lastName"
              class="standard"
            />
          </div>
          <div class="input-wrapper">
            <label :class="{ error: v$.userForm.email?.$errors[0] }" for="email">
              {{ v$.userForm.email?.$errors[0]?.$message || 'Пошта' }}
            </label>
            <input
              v-model="userForm.email"
              @blur="v$.userForm.email.$touch"
              type="email"
              id="email"
              class="standard"
            />
          </div>
          <div class="input-wrapper">
            <label :class="{ error: v$.userForm.phoneNumber?.$errors[0] }" for="phoneNumber">
              {{ v$.userForm.phoneNumber?.$errors[0]?.$message || 'Номер телефону' }}
            </label>
            <input
              v-model="userForm.phoneNumber"
              @blur="v$.userForm.phoneNumber.$touch"
              type="tel"
              id="phoneNumber"
              class="standard"
            />
          </div>
          <button type="submit" class="standard submit">Додати</button>
        </form>
      </div>
      <div v-if="users.length && !isUsersLoading" class="users-wrapper">
        <div class="table-wrapper">
          <table>
            <tr>
              <th
                :key="item.label"
                v-for="item in lablesList"
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
            <tr v-for="user in users" :key="user._id">
              <td class="username">
                <router-link :to="{ name: 'UserById', params: { id: user._id } }">
                  {{ user.username }}
                </router-link>
              </td>
              <td>
                {{ user.firstName }}
              </td>
              <td>
                {{ user.lastName }}
              </td>
              <td>
                {{ user.email }}
              </td>
              <td>
                {{ user.phoneNumber }}
              </td>
              <td>
                {{ getDate(user.nextEventDate) }}
              </td>
              <td>
                {{ user.eventsCount }}
              </td>
              <td style="border-top: none">
                <button @click="deleteUser(user._id)" style="width: 100%" class="standard">
                  Видалити
                </button>
              </td>
            </tr>
          </table>
          <p class="reminder">*Нажимайте по назві поля для сортування;</p>
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
      <div v-else-if="isUsersLoading">
        <h2 style="margin: 50px">Завантаження користувачів...</h2>
      </div>
      <div v-else-if="isUsersError">
        <h2 style="margin: 50px">Помилка</h2>
      </div>
      <div v-else>
        <h2 style="margin: 50px">Таблиця чиста, ви можете додати користувачів</h2>
      </div>
    </div>
    <h1 v-else style="font-size: 50px">Доброго дня, увійдіть у аккаунт</h1>
  </section>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, maxLength, numeric, helpers } from '@vuelidate/validators'
import axios from '../api'
import router from '@/router'

export default {
  name: 'Home',
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  computed: {
    pagesList() {
      return Array.from({ length: this.pages }, (v, index) => index + 1)
    },
    lablesList() {
      return [
        {
          fieldName: 'username',
          label: 'Нікнейм'
        },
        {
          fieldName: 'firstName',
          label: 'Ім`я'
        },
        {
          fieldName: 'lastName',
          label: 'Призвіще'
        },
        {
          fieldName: 'email',
          label: 'Пошта'
        },
        {
          fieldName: 'phoneNumber',
          label: 'Номер телефону'
        },
        {
          fieldName: 'nextEventDate',
          label: 'Дата наступної події'
        },
        {
          fieldName: 'eventsCount',
          label: 'Кількість подій'
        }
      ]
    }
  },
  data() {
    return {
      isFormOpen: false,
      userForm: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: ''
      },
      users: [],
      pages: 0,
      currentPage: Number(this.$route.query.page) || 0,
      isUsersLoading: true,
      isUsersError: false,
      sortBy: null,
      variant: 'desc'
    }
  },
  methods: {
    async submitForm() {
      const tryValidate = await this.v$.$validate()
      if (!tryValidate) return

      const formData = this.userForm

      this.isFormOpen = false
      this.resetForm()

      try {
        await axios.post('users', formData)

        await this.getUsers()
      } catch (e) {
        alert(`Error: ${e?.response?.data?.message || 'Error'}`)

        console.log(e)
      }
    },
    async getUsers() {
      if (!this.$store.state.isLoggedIn) return

      try {
        this.isUsersLoading = true

        const { data } = await axios.get('users', {
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

        this.users = data.users
        this.pages = data.pages
        this.isUsersError = false

        console.log(this.pagesList)
      } catch (e) {
        console.log(e)

        this.isUsersError = true
      } finally {
        this.isUsersLoading = false
      }
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`users/${userId}`)

        await this.getUsers()
      } catch (e) {
        console.log(e)
      }
    },
    resetForm() {
      this.userForm = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: ''
      }
    },
    getDate(date) {
      if (!date) return 'Невідомо'

      return new Intl.DateTimeFormat('en-us', {
        dateStyle: 'short'
      }).format(new Date(date))
    },
    changePage(page) {
      this.$router.push({ path: '/', query: { page: page } })
    },
    changeSortingField(fieldName) {
      this.variant = this.variant === 'asc' && this.sortBy === fieldName ? 'desc' : 'asc'
      this.sortBy = fieldName
    }
  },
  mounted() {
    this.getUsers()
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
      this.getUsers()
    },
    variant() {
      this.getUsers()
    },
    sortBy() {
      this.getUsers()
    }
  },
  validations() {
    return {
      userForm: {
        firstName: {
          required: helpers.withMessage('First name cannot be empty', required),
          minLength: helpers.withMessage(
            ({ $params }) => `Min length of first name ${$params.min}`,
            minLength(3)
          ),
          maxLength: helpers.withMessage(
            ({ $params }) => `Max length of first name ${$params.max}`,
            maxLength(14)
          )
        },
        lastName: {
          required: helpers.withMessage('Last name cannot be empty', required),
          minLength: helpers.withMessage(
            ({ $params }) => `Min length of last name ${$params.min}`,
            minLength(3)
          ),
          maxLength: helpers.withMessage(
            ({ $params }) => `Max length of last name ${$params.max}`,
            maxLength(14)
          )
        },
        username: {
          required: helpers.withMessage('Username cannot be empty', required),
          minLength: helpers.withMessage(
            ({ $params }) => `Min length of username ${$params.min}`,
            minLength(3)
          ),
          maxLength: helpers.withMessage(
            ({ $params }) => `Max length of username ${$params.max}`,
            maxLength(16)
          )
        },
        email: {
          required: helpers.withMessage('Email cannot be empty', required),
          email
        },
        phoneNumber: {
          required: helpers.withMessage('Phone number cannot be empty', required),
          numeric
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  padding: 8px;
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

section {
  padding: 1rem;
  padding-bottom: 0;
}

section > div {
  margin-top: 7vh;
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

th {
  color: var(--main-text);
}

.users-wrapper {
}

.table-wrapper {
  margin-top: 20px;
  width: 100%;
  overflow-x: auto;
}

.username {
  text-decoration: underline;

  a {
    font-weight: bolder;
  }

  &:hover a,
  &:hover {
    color: green;
  }
}

.arrow-wrapper {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 600px) {
  td,
  th {
    padding: 3px;
  }
}
</style>
