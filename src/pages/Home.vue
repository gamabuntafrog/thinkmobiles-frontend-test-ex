<template>
  <section>
    <div v-if="$store.state.isLoggedIn">
      <h1>Home</h1>
      <button v-if="!isFormOpen" class="standard" @click="isFormOpen = true">
        Create user
      </button>
      <button v-else class="standard" @click="isFormOpen = false">
        Close
      </button>
      <div class="form-wrapper" v-if="isFormOpen">
        <h2>Creating User</h2>
        <form @submit.prevent="submitForm">
          <div class="input-wrapper">
            <label :class="{error: v$.userForm.username?.$errors[0]}" for="username">
              {{ v$.userForm.username?.$errors[0]?.$message || 'Username' }}
            </label>
            <input
                v-model="userForm.username"
                @blur="v$.userForm.username.$touch"
                type="text"
                id="username"
                class="standard"
            >
          </div>
          <div class="input-wrapper">
            <label :class="{error: v$.userForm.firstName?.$errors[0]}" for="firstName">
              {{ v$.userForm.firstName?.$errors[0]?.$message || 'First name' }}
            </label>
            <input
                v-model="userForm.firstName"
                @blur="v$.userForm.firstName.$touch"
                type="text"
                id="firstName"
                class="standard"
            >
          </div>
          <div class="input-wrapper">
            <label :class="{error: v$.userForm.lastName?.$errors[0]}" for="lastName">
              {{ v$.userForm.lastName?.$errors[0]?.$message || 'Last name' }}
            </label>
            <input
                v-model="userForm.lastName"
                @blur="v$.userForm.lastName.$touch"
                type="text"
                id="lastName"
                class="standard"
            >
          </div>
          <div class="input-wrapper">
            <label :class="{error: v$.userForm.email?.$errors[0]}" for="email">
              {{ v$.userForm.email?.$errors[0]?.$message || 'Email' }}
            </label>
            <input
                v-model="userForm.email"
                @blur="v$.userForm.email.$touch"
                type="email"
                id="email"
                class="standard"
            >
          </div>
          <div class="input-wrapper">
            <label :class="{error: v$.userForm.phoneNumber?.$errors[0]}" for="phoneNumber">
              {{ v$.userForm.phoneNumber?.$errors[0]?.$message || 'Phone number' }}
            </label>
            <input
                v-model="userForm.phoneNumber"
                @blur="v$.userForm.phoneNumber.$touch"
                type="tel"
                id="phoneNumber"
                class="standard"
            >
          </div>
          <button type="submit" class="standard submit">
            Create
          </button>
        </form>
      </div>
      <div v-if="users.length && !isUsersLoading" class="users-wrapper">
        <div class="table-wrapper">
          <table>
            <tr>
              <th
                  v-for="item in lablesList"
                  @click="
                  variant = variant === 'asc' && sortBy === item.fieldName ? 'desc' : 'asc';
                  sortBy = item.fieldName"
              >
               <div style="display: flex; justify-content: center; align-items: center; cursor: pointer">
                 <p class="label-name" :class="{active: sortBy === item.fieldName}">
                   {{ item.label }}
                 </p>
                 <button v-if="sortBy === item.fieldName" style="all: unset">
                   <img
                       v-if="variant === 'desc'"
                       src="../assets/arrow-down.svg"
                       alt="arrow down"
                   />
                   <img v-else src="../assets/arrow-top.svg" alt="arrow down"/>
                 </button>
               </div>
              </th>
            </tr>
            <tr v-for="user in users">
              <td class="username">
                <router-link :to="{name: 'UserById', params: {id: user._id}}">
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
            </tr>
          </table>
          <p class="reminder">
            *Click on the field name in table head for sorting;
          </p>
        </div>
        <ul v-if="pages > 1" class="pages-list">
          <li class="pages-list" :class="{active: index === currentPage}" v-for="(_, index) in pagesList">
            <button @click="this.currentPage = index" class="standard">
              {{ index + 1 }}
            </button>
          </li>
        </ul>
      </div>
      <div v-else-if="isUsersLoading">
        <h2 style="margin: 50px">
          Loading users...
        </h2>
      </div>
      <div v-else-if="isUsersError">
        <h2 style="margin: 50px">
          Error
        </h2>
      </div>
      <div v-else>
        <h2 style="margin: 50px">
          Table is clear, you can add users in form above
        </h2>
      </div>
    </div>
    <h1 v-else style="font-size: 50px">
      Hello, please login
    </h1>
  </section>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {required, email, minLength, maxLength, numeric} from '@vuelidate/validators'
import axios from "../api";
import arrowDown from '../assets/arrow-down.svg';

export default {
  name: 'Home',
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  computed: {
    pagesList() {
      return Array.from({length: this.pages})
    },
    lablesList() {
      return [
        {
          fieldName: 'username',
          label: 'Username'
        },
        {
          fieldName: 'firstName',
          label: 'First name'
        },
        {
          fieldName: 'lastName',
          label: 'lastName'
        },
        {
          fieldName: 'email',
          label: 'Email'
        },
        {
          fieldName: 'phoneNumber',
          label: 'Phone number'
        },
        {
          fieldName: 'nextEventDate',
          label: 'Next event date'
        },
        {
          fieldName: 'eventsCount',
          label: 'Events count'
        },
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
      currentPage: 0,
      isUsersLoading: true,
      isUsersError: false,
      sortBy: null,
      variant: 'desc'
    }
  },
  methods: {
    async submitForm() {
      const tryValidate = await this.v$.$validate()
      if (!tryValidate) return;

      const formData = this.userForm;

      this.isFormOpen = false;
      this.resetForm();

      try {
        await axios.post('users', formData)

        await this.getUsers();
      } catch (e) {
        alert(`Error: ${e?.response?.data?.message || 'Error'}`)

        console.log(e)
      }

    },
    async getUsers() {
      if (!this.$store.state.isLoggedIn) return;

      try {
        this.isUsersLoading = true;

        const {data} = await axios.get('users', {
          params: {
            page: this.currentPage,
            sortBy: this.sortBy,
            variant: this.variant
          }
        });

        console.log(data)

        this.users = data.users;
        this.pages = data.pages;
        this.isUsersError = false;

        console.log(this.pagesList)
      } catch (e) {
        console.log(e)

        this.isUsersError = true;
      } finally {
        this.isUsersLoading = false;
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
      if (!date) return 'Unknown';

      return new Intl.DateTimeFormat('en-us', {
        dateStyle: 'short',
      }).format(new Date(date))
    }
  },
  mounted() {
    this.getUsers()
  },
  watch: {
    currentPage() {
      this.getUsers()
    },
    variant() {
      console.log(this.variant)
      this.getUsers()
    },
    sortBy() {
      console.log(this.sortBy)
      this.getUsers()
    }
  },
  validations() {
    return {
      userForm: {
        firstName: {
          required,
          minLengthValue: minLength(3),
          maxLengthValue: maxLength(14)
        },
        lastName: {
          required,
          minLengthValue: minLength(3),
          maxLengthValue: maxLength(14)
        },
        username: {
          required,
          minLengthValue: minLength(3),
          maxLengthValue: maxLength(16)
        },
        email: {
          required,
          email
        },
        phoneNumber: {
          required,
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
}

section > div {
  margin-top: 10vh;
}

.label-name {
  &:hover {
    color: green;
  }
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

  &:hover a, &:hover {
    color: green;
  }
}


@media (max-width: 600px) {

  td, th {
    padding: 3px;
  }
}

</style>