<template>
  <div>
    <h1>{{ $t("provisioning.users.welcome") }}</h1>
    <div class="eos-p-2 body-2">
    <div class="title mt-2 font-weight-bold" style="font-size:24px;display:flex;" id="lblLocalSetting">
      {{ $t("provisioning.users.user-setting") }}
    </div>
    <div class="mt-1 eos-user-description" id="lblLocalMsgConfig">
      {{ $t("provisioning.users.description") }}
    </div>
    <div class="mt-1 eos-user-description">
      {{ $t("provisioning.users.user-setting-description") }}
    </div>
    <div class="mt-1 eos-user-description">
      {{ $t("provisioning.users.user-setting-note") }}
    </div>
    <div style="float:left;padding-top:30px;">
      User Name
      <input
          class="eos-form__input_text"
          type="text"
          name="txtCreateUsername"
        />
      Password          
        <input
          class="eos-form__input_text"
          type="password"
          name="txtCreatePassword"
        />
      <button
        v-if="!isUserCreate"
        type="button"
        class="ma-5 eos-btn-primary"
        @click="addUser()"
        id="btnLocalAddNewUser"
        style="display:block;margin-top:30px;"
      >
        {{ $t("provisioning.users.add-new-user") }}
      </button> 
    </div>  
    </div> 
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.eos-btn-primary {
  background: #6ebe49;
  box-sizing: border-box;
  border-radius: 4px;
  height: 40px;
  min-width: 64px;
  padding-left: 16px;
  padding-right: 16px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
}
.eos-btn-primary:hover {
  background: #8acb6b;
}
.eos-btn-primary:active {
  background: #4b813d;
}
.eos-btn-primary:focus {
  outline: 0;
}
.eos-btn-primary:disabled {
  background: #b7b7b7;
}
.eos-btn-tertiary {
  background-color: transparent;
  height: 40px;
  min-width: 64px;
  padding-left: 16px;
  padding-right: 16px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #6ebe49;
}
.eos-btn-tertiary:hover {
  color: #8acb6b;
}
.eos-btn-tertiary:active {
  color: #4b813d;
}
.eos-btn-tertiary:focus {
  outline: 0;
}
.eos-btn-tertiary:disabled {
  color: #b7b7b7;
}
.eos-user-description {
  float:left; 
  padding-top:10px;
}
</style>
