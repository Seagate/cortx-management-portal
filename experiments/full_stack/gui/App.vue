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
