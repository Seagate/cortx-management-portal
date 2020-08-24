/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
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

