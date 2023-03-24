import {createStore} from "vuex";
import axios from "../api";
import router from "../router";

const getInitialState = () => {
    return {
        userId: null,
        username: null,
        token: null,
        isLoggedIn: false,
        isUserLoading: true,
    }
}

const storeKey = 'test-ex-thinkmobiles';

const setTokenInHeaders = (token) => axios.defaults.headers.common['authorization'] = `Bearer ${token}`;

const store = createStore({
    state: getInitialState(),
    getters: {},
    mutations: {
        async initStore(state) {
            try {
                const persistedStore = localStorage.getItem(storeKey);

                if (persistedStore) {
                    const store = JSON.parse(persistedStore);

                    this.replaceState(
                        Object.assign(state, store)
                    )

                    setTokenInHeaders(state.token);
                }

                await store.commit('getUser')
            } catch (e) {
                console.log(e)
            }
        },
        async getUser(state, isNeedRedirect) {
            try {
                if (state.token) {
                    const {data} = await axios.get('auth/current');

                    state.userId = data.user._id
                    state.username = data.user.username;
                    state.isLoggedIn = true;
                }
            } catch (e) {
                console.log(e)
                store.commit('resetStore')
            } finally {
                state.isUserLoading = false;
                if (isNeedRedirect) {
                    await router.push('/')
                }
            }
        },
        async register(state, formData) {
            try {
                const {data} = await axios.post('auth/register', formData);

                state.token = data.token;
                setTokenInHeaders(state.token);

                console.log(data)

                await store.commit('getUser', true)
            } catch (e) {
                console.log(e)
            }
        },
        async login(state, formData) {
            try {
                const {data} = await axios.post('auth/login', formData);

                state.token = data.token;
                setTokenInHeaders(state.token);

                await store.commit('getUser', true)
            } catch (e) {

                console.log(e)
            }
        },
        async logout() {
            try {
                await axios.post('auth/logout');

            } catch (e) {

                console.log(e)
            } finally {
                store.commit('resetStore');
                await router.push('/')
            }
        },
        resetStore(state) {
            Object.assign(state, {...getInitialState(), isUserLoading: false})
        }
    }
})

store.subscribe((mutation, state) => {
    const {token} = state;

    const stateNeedToPersist = {
        token
    }

    localStorage.setItem(storeKey, JSON.stringify(stateNeedToPersist))
})

export default store;