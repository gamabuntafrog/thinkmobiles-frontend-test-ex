<template>
  <section>
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
      <table>
        <tr>
          <th>
            Username
          </th>
          <th>
            First name
          </th>
          <th>
            Last name
          </th>
          <th>
            Email
          </th>
          <th>
            Phone number
          </th>
          <th>
            Next event date
          </th>
          <th>
            Events count
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
  </section>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {required, email, minLength, maxLength, numeric} from '@vuelidate/validators'
import axios from "../api";

export default {
  name: 'Home',
  setup() {
    return {
      v$: useVuelidate()
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
      isUsersLoading: true,
      isUsersError: false
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
      try {
        this.isUsersLoading = true;

        const {data} = await axios.get('users');

        console.log(data.users)

        this.users = data.users
        this.isUsersError = false;
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
  padding-top: 20px;
}


.users-wrapper {
  margin-top: 20px;
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