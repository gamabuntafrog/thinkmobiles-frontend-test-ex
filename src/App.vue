<script>
import Header from "./components/Header.vue";

export default {
  components: {Header},
  data() {
    return {}
  },
  beforeCreate() {
    this.$store.commit('initStore')
  }
}
</script>

<template>
  <div class="loader" v-if="$store.state.isUserLoading">
    <h1>
      Loading...
    </h1>
  </div>
  <div class="app-wrapper" v-else>
    <Header/>
    <RouterView/>
  </div>
</template>

<style lang="scss">
button.standard {
  all: unset;
  padding: 4px 8px;
  min-width: 50px;
  border-radius: 6px;
  //border: 1px solid green;
  transition: 0.2s;
  display: block;
  cursor: pointer;
  background-color: var(--vt-c-divider-dark-1);
  color: green;

  &:hover {
    background-color: var(--vt-c-divider-dark-2);
  }
}

input.standard {
  all: unset;
  display: block;
  padding: 6px;
  border: 2px solid var(--vt-c-divider-dark-2);
  border-radius: 12px;
  width: 100%;
  text-align: left;
}

input:focus.standard {
  border: 2px solid var(--vt-c-divider-dark-1);

}

table {
  width: 100%;
}

th {
  padding: 8px;
  color: green;

}

td {
  padding: 12px;
}

td {
  text-align: center;
  border-top: 2px solid green;
}

.loader {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pages-list {
  display: flex;
  list-style-type: none;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 0;

  li {
    margin-left: 8px;
    button {
      color: var(--main-text);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  li.active button {
    color: green;
  }
}

.logo-for-form {
  width: 300px;
  height: 300px;
}


@media (max-width: 768px) {

 .logo-for-form {
   width: 150px;
   height: 150px;
 }
}

@media (min-width: 1024px) {

}
</style>
