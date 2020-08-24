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
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/seagate-green-stacked.jpg" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <input v-model="firstName" type="text" />
    <button type="button" v-on:click="addProductName">submit</button>
    <div class="list">
      <ul style="list-style-type:none;">
        <li v-for="(note) in notes" v-bind:key="note.id">{{ note.title }}</li>
      </ul>
    </div>
  
  </div>
</template>

<script>

import HelloWorld from "./components/HelloWorld.vue";
import appService from "./app.service.js";

export default {
  name: "app",
  // props: ["firstName"],
  components: {
    HelloWorld
  },
  data: function() {
    return {
      firstName: "",
      notes: [],
      messages:[]
    };
  },
  created: function() {
   this.getNoteData();
  

  },
  methods: {
    addProductName: function() {
      let note = {
        title:this.firstName ,
        created_at: "2019-07-22 00:00",
        created_by: "apcelent",
        description: "sample notes by pawan",
        priority: 4
      };
       appService.addNote(note).then(() => {
      this.getNoteData();
      this.firstName="";
    });

    },
    getNoteData:function(){
       appService.getAllNotes().then(data => {
      this.notes = data.notes;
    });

    }

  },
  computed:{
     messages: function() {
      return JSON.stringify( this.$store.state.socket.message);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img {
  height: 200px;
  width: 200px;
}
button {
  margin-left: 10px;
}
.list {
  width: 100%;
  text-align: center;
}
</style>
