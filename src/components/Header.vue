<template>
  <header>
    <router-link style="margin: 0; padding: 0" to="/">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50"/>
    </router-link>
    <nav v-if="$store.state.isLoggedIn">
      <router-link class="home" to="/">Дім</router-link>
      <router-link class="router-link-exact-active" to="/">
        {{ this.$store.state.username }}
      </router-link>
      <router-link to="/" @click="logout">
        <button class="standard">
          Вийти
        </button>
      </router-link>
    </nav>
    <nav v-else>
      <router-link class="home" to="/">Дім</router-link>
      <router-link to="/login">Увійти</router-link>
      <router-link to="/register">Реєстрація</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  methods: {
    async logout() {
      this.$store.commit('logout')
    }
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  align-items: center;


}

.logo {
}

nav {
  width: 100%;
  font-size: 18px;
  text-align: center;
  padding-left: 8px;
  padding-right: 8px;

  display: flex;
  align-items: center;
}

nav a.router-link-exact-active {
  color: green;
}

nav a.router-link-exact-active:hover {
  color: green;
}

nav a:hover {
  color: green;
}


nav a:first-of-type {
  border: 0;
}

.home {
  margin-right: auto;
}

@media (max-width: 600px) {

  header {
    padding: 0 0.8rem;
  }

  nav {
    font-size: 12px;

  }
}

</style>