<template>
  <a-layout-content
    style="
      background: #fff;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding-bottom: 69px;
    "
  >
    <h1 style="text-align: center; font-size: 30px">Skill Assessment System</h1>
    <div id="components-form-demo-normal-login">
      <a-form :form="form" class="login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            v-decorator="[
              'userName',
              {
                rules: [{ required: true, message: 'Please input your email!' }]
              }
            ]"
            placeholder="Username"
          >
            <a-icon
              slot="prefix"
              type="user"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: 'Please input your Password!' }
                ]
              }
            ]"
            type="password"
            placeholder="Password"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <div v-if="errMessage">{{ errMessage }}</div>
        <a-form-item>
          <!-- <nuxt-link :to="'/reset-password'">
            <a class="login-form-forgot">Forgot password</a>
          </nuxt-link> -->
          <a-button
            :loading="loading"
            type="primary"
            html-type="submit"
            class="login-form-button"
            >Log in</a-button
          >
          <a-tooltip placement="bottom" :overlayClassName="'custom-tooltip'">
            <template slot="title">
              No data will be permanently stored in guest mode
            </template>
            <a-button
              :loading="loading"
              type="primary"
              ghost
              class="login-form-button"
              @click="e => handleLogin(true)"
              >Continue as guest</a-button
            >
          </a-tooltip>

          Or
          <nuxt-link :to="'/register'">
            <a>register now!</a>
          </nuxt-link>
        </a-form-item>
      </a-form>
    </div>
  </a-layout-content>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import jwt_decode from "jwt-decode";
const guestToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikd1ZXN0IiwidXNlcklkIjo2NiwiZnVsbE5hbWUiOm51bGwsImFkZHJlc3MiOm51bGwsInBob25lTnVtYmVyIjpudWxsLCJhdXRvYmlvZ3JhcGh5IjpudWxsLCJlbWFpbCI6bnVsbCwicm9sZSI6NSwic3ViamVjdElkIjpudWxsLCJiaXJ0aGRheSI6bnVsbCwiZ2VuZGVyIjpudWxsLCJhdmF0YXJJbWFnZVBhdGgiOm51bGwsImlhdCI6MTYyMzgyODU2OSwiZXhwIjoxNjg0MzA4NTY5fQ.iMRHW_qhTjvKtv143kEFV-ekRufO-RmRgXi5KRs5h_8";
export default {
  layout: "login",
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  data() {
    return {
      errMessage: "",
      loading: false,
      rootScreen: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.rootScreen = from.name;
    });
  },
  created() {
    let token = localStorage.getItem("token");
    if (!token) this.handleGuestAutoLogin();
    try {
      const data = jwt_decode(token);
    } catch (error) {
      localStorage.clear();
      this.handleGuestAutoLogin();
    }
  },
  methods: {
    ...mapMutations({
      setCurrentUser: "profile/setCurrentUser"
    }),
    ...mapActions({
      resetGuestData: "resetGuestData"
    }),
    handleSubmit(e) {
      console.log("env", process.env.baseURL, "node_env", process.env.NODE_ENV);

      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) this.handleLogin(false, values);
      });
    },
    async handleLogin(isGuest, values) {
      this.loading = true;
      let payload = {
        username: isGuest ? "Guest" : values.userName,
        password: isGuest ? "123456" : values.password
      };
      try {
        let res = await this.$axios.post("/accounts/login", payload);
        if (res.status == 200) {
          if (
            this.rootScreen == "index" ||
            !this.rootScreen ||
            this.rootScreen == "register"
          )
            this.$router.push("/");
          else this.$router.back();

          localStorage.setItem("token", res.data);
          if (isGuest) this.resetGuestData();
        }
      } catch (error) {
        this.errMessage = error.response.data;
      } finally {
        this.loading = false;
      }
    },
    handleGuestAutoLogin() {
      localStorage.setItem("token", guestToken);
      this.$router.push("/");
      this.resetGuestData();
    }
  }
};
</script>

<style scoped>
#components-form-demo-normal-login {
  align-items: center;
}

#components-form-demo-normal-login .login-form {
  max-width: 300px;
  margin: auto;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
  margin: auto;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
  margin: auto;
}
</style>