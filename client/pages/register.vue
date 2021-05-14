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
        <a-form-item>
          <a-input
            v-decorator="[
              'rePassword',
              {
                rules: [
                  { required: true, message: 'Please re-enter your Password!' }
                ]
              }
            ]"
            type="password"
            placeholder="Re-enter Password"
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
          <a-button
            :loading="loading"
            type="primary"
            html-type="submit"
            class="login-form-button"
            >Sign up</a-button
          >Or
          <nuxt-link :to="'/login'">
            <a>login now!</a>
          </nuxt-link>
        </a-form-item>
      </a-form>
    </div>
  </a-layout-content>
</template>

<script>
export default {
  layout: "login",
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_register" });
  },
  data() {
    return {
      errMessage: "",
      loading: false
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true;
          try {
            if (values.password !== values.rePassword)
              this.handleError("Passwords do not match!");
            else {
              let payload = {
                username: values.userName,
                password: values.password
              };
              let res = await this.$axios.post("/accounts/register", payload);
              if (res.status == 200) {
                this.$router.push("/login");
              }
            }
          } catch (error) {
            this.errMessage = error.response.data.detail;
            console.log("here", error.response);
          } finally {
            this.loading = false;
          }
        }
      });
    },
    handleError(e) {
      this.errMessage = e;
      setTimeout(() => (this.errMessage = ""), 3000);
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