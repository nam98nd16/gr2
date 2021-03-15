<template>
  <a-spin :spinning="pageLoading">
    <page-title title="Profile" />
    <div class="container">
      <a-form style="margin-top: 50px" :form="form" @submit="handleSubmit">
        <a-form-item :label="'Username'" v-bind="formItemLayout">
          <a-input
            disabled
            :value="currentUser ? currentUser.username : ''"
            placeholder="Username"
          >
            <a-icon
              slot="prefix"
              type="user"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item :label="'Full name'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'fullName',
              {
                rules: [
                  { required: true, message: 'Please input your full name!' }
                ],
                initialValue: currentUser ? currentUser.fullName : ''
              }
            ]"
            placeholder="Full name"
          >
            <a-icon
              slot="prefix"
              type="font-colors"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item :label="'Phone number'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'phoneNumber',
              {
                rules: [
                  {
                    pattern: /^(0|[1-9][0-9]*)$/,
                    message: 'Please input a valid phone number!'
                  }
                ],
                initialValue: currentUser ? currentUser.phoneNumber : ''
              }
            ]"
            placeholder="Phone number"
          >
            <a-icon
              slot="prefix"
              type="mobile"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item :label="'Birthday'" v-bind="formItemLayout">
          <a-date-picker
            style="float: left"
            format="YYYY/MM/DD"
            v-decorator="[
              'birthday',
              {
                initialValue:
                  currentUser && currentUser.birthday
                    ? $moment(currentUser.birthday)
                    : null
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="'Gender'" v-bind="formItemLayout">
          <a-radio-group
            name="gender"
            style="float: left; margin-top: 8px"
            v-decorator="[
              'gender',
              { initialValue: currentUser ? currentUser.gender : 1 }
            ]"
          >
            <a-radio :value="1">Male</a-radio>
            <a-radio :value="2">Female</a-radio>
            <a-radio :value="3">Other</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="'About me'" v-bind="formItemLayout">
          <a-textarea
            v-decorator="[
              'about',
              { initialValue: currentUser ? currentUser.autobiography : '' }
            ]"
            placeholder="Describe something about me ..."
            :autoSize="{ minRows: 2, maxRows: 10 }"
          ></a-textarea>
        </a-form-item>
        <a-form-item :label="'  '" v-bind="formItemLayout" :colon="false">
          <a-button
            :loading="loading"
            type="primary"
            html-type="submit"
            class="login-form-button"
            >Update</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import jwt_decode from "jwt-decode";
import PageTitle from "../components/page-title.vue";
export default {
  components: { PageTitle },
  data() {
    return {
      formItemLayout: {
        labelCol: {
          md: 10,
          sm: 24
        },
        wrapperCol: {
          md: 6,
          sm: 24
        }
      },
      user: null,
      currentUser: null,
      loading: false,
      pageLoading: false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "profile" });
  },
  mounted() {
    this.currentUser = jwt_decode(localStorage.getItem("token"));
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      updateProfile: "updateProfile"
    }),
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true;
          let payload = {
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            autobiography: values.about,
            birthday: values.birthday
              ? this.$moment(values.birthday)
                  .add(7, "hours")
                  .format("YYYY/MM/DD")
              : null,
            gender: values.gender
          };
          try {
            let res = await this.updateProfile(payload);
            if (res.status == 200) {
              localStorage.setItem("token", res.data);
              this.$notification.success({
                message: "Updated successfully!"
              });
            }
          } catch (error) {
            this.errMessage = error.response.data;
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  display: initial;
}
</style>
