import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        notes: [],
    },
    getters: {
        getNotesList: state => {
            return state.notes;
        }
    },
    mutations: {
        updateNotes(state, note) {
            state.notes = note;
        },
        addNote(state, note) {
            state.notes.push(note);
        }
    },
    actions: {
        getNotes({ commit }) {
            axios.get('http://localhost:8081/api/notes', { "Access-Control-Allow-Origin": "*" })
                .then(result => commit('updateNotes', result.data))
                .catch();
        },
        addNote({ commit }, title) {
            const newName = {
                id: 1,
                title: title,
                description: "sample notes edit",
                created_at: "2017-08-23 00:00",
                created_by: "apcelent",
                priority: 4
            };
            return axios.post('http://localhost:8081/api/cart', newName)
                .then(function () {
                    commit('addNote', newName);
                    this.getNotes();
                });
        },

    }


});

