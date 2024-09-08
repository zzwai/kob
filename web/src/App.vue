<template>
  <NavBar />
  <router-view />
</template>

<script>
import NavBar from "./components/NavBar.vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"
// import $ from "jquery"

export default {
  components: {
    NavBar,
  },

  setup() {
    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/account/token/",
    //   type: "post",
    //   data: {
    //     username: "zzw",
    //     password: "pzzw",
    //   },
    //   success(resp) {
    //     console.log(resp)
    //   },
    //   error(resp) {
    //     console.log(resp)
    //   }
    // });

    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/account/info/",
    //   type: "get",
    //   headers: {
    //     Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjMGM2ZjY1NTdiNmI0YzhiOTFkNDI0MTVmYmUxN2ZhYyIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTcyNTc5NTcyMCwiZXhwIjoxNzI3MDA1MzIwfQ.x3FFHWXXmE3vyab06Kc6AbmefDtorz_N5ruDyuxcXR4",
    //   },
    //   success(resp) {
    //     console.log(resp)
    //   },
    //   error(resp) {
    //     console.log(resp)
    //   }
    // });

    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/account/register/",
    //   type: "post",
    //   data: {
    //     username: "f ",
    //     password: "bf",
    //     confirmedPassword: "bf",
    //   },
    //   success(resp) {
    //     console.log(resp)
    //   },
    //   error(resp) {
    //     console.log(resp)
    //   }
    // })
  }
}
</script>

<style>
body {
  background-image: url(@/assets/images/background.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}
</style>