<script>
import Header from "./components/Header.vue";

export default {
  components: {Header},
  data() {
    return {}
  }
}
</script>

<template>
  <Header/>

  <RouterView/>
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
}

td {
  padding: 3px;
}

td {
  text-align: center;
}


@media (min-width: 1024px) {

}
</style>
