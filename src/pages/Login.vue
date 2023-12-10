<template>
  <section>
    <div class="container">
      <div class="left-container">
        <h1 v-if="!isLoading">
          Увійти
        </h1>
        <h1 v-else>
          Завантаження...
        </h1>
        <form @submit.prevent="submitForm">
          <div class="input-wrapper">
            <label :class="{error: v$.userForm.username?.$errors[0]}" for="username">
              {{ v$.userForm.username?.$errors[0]?.$message || 'Нікнейм' }}
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
            <label :class="{error: v$.userForm.password?.$errors[0]}" for="password">
              {{ v$.userForm.password?.$errors[0]?.$message || 'Пошта' }}
            </label>
            <input
                v-model="userForm.password"
                @blur="v$.userForm.password.$touch"
                type="password"
                id="password"
                class="standard"
            >
          </div>
          <button type="submit" class="standard submit">
            Увійти
          </button>
        </form>
      </div>
      <div class="right-container">
        <img alt="Vue logo" class="logo-for-form" src="@/assets/logo.svg" />
      </div>

    </div>
  </section>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {email, helpers, maxLength, minLength, numeric, required} from "@vuelidate/validators";

export default {
  name: 'Login',
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  data() {
    return {
      userForm: {
        username: '',
        password: ''
      },
      isLoading: false,
    }
  },
  methods: {
    async submitForm() {
      const tryValidate = await this.v$.$validate()
      if (!tryValidate) return;

      this.isLoading = true;

      const formData = this.userForm;

      try {

        this.$store.commit('login', formData)
      } catch (e) {

        console.log(e)
      } finally {
        this.isLoading = false;
      }

    },
    resetForm() {
      this.userForm = {
        username: '',
        password: ''
      }
    },
  },
  validations() {
    return {
      userForm: {
        username: {
          required: helpers.withMessage('Username cannot be empty', required),
          minLength: helpers.withMessage(({$params}) => `Min length of username ${$params.min}`,  minLength(3)),
          maxLength: helpers.withMessage(({$params}) => `Max length of username ${$params.max}`,  maxLength(16)),
        },
        password: {
          required: helpers.withMessage('Password cannot be empty', required),
          minLength: helpers.withMessage(({$params}) => `Min length of username ${$params.min}`,  minLength(3)),
          maxLength: helpers.withMessage(({$params}) => `Max length of username ${$params.max}`,  maxLength(30)),
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

h1 {
  font-size: 30px;
}

.left-container,
.right-container {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-container {
  display: flex;
  flex-direction: column;
}

.container {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

form {
  padding: 8px;
  width: 60%;
}

.input-wrapper {
  margin-bottom: 16px;
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

body {
  background-color: blanchedalmond;
}



@media (max-width: 768px) {
  .right-container {
    display: none;

  }
  .left-container{
    width: 100%;
  }

}
@media (max-width: 400px) {
  form {
    width: 80%;
  }
}

</style>