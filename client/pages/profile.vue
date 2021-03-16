<template>
  <a-spin :spinning="pageLoading">
    <page-title title="Profile" />
    <div v-if="currentUser" class="container">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item :label="'Username'" v-bind="formItemLayout">
          {{ currentUser.username }}
          <a-tag v-if="userRole" :color="userRoleColor">{{ userRole }}</a-tag>
        </a-form-item>
        <a-form-item :label="'Full name'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'fullName',
              {
                initialValue: currentUser.fullName
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
        <a-form-item :label="'Email'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'email',
              {
                rules: [
                  {
                    pattern: /\S+@\S+\.\S+/,
                    message: 'Please input a valid email!'
                  }
                ],
                initialValue: currentUser.email
              }
            ]"
            placeholder="Email"
          >
            <a-icon
              slot="prefix"
              type="mail"
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
                    pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                    message: 'Please input a valid phone number!'
                  }
                ],
                initialValue: currentUser.phoneNumber
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
                initialValue: currentUser.birthday
                  ? $moment(currentUser.birthday)
                  : null
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="'Address'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'address',
              {
                initialValue: currentUser.address
              }
            ]"
            placeholder="Address"
          >
            <a-icon
              slot="prefix"
              type="home"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item :label="'Gender'" v-bind="formItemLayout">
          <a-radio-group
            name="gender"
            style="float: left; margin-top: 8px"
            v-decorator="['gender', { initialValue: currentUser.gender }]"
          >
            <a-radio :value="1">Male</a-radio>
            <a-radio :value="2">Female</a-radio>
            <a-radio :value="3">Other</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="'About me'" v-bind="formItemLayout">
          <a-textarea
            v-decorator="['about', { initialValue: currentUser.autobiography }]"
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
    this.allSubjects.length ? {} : this.getAllSubjects();
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects
    }),
    userRole() {
      let role = "";
      switch (this.currentUser?.role) {
        case 0:
          role = "Admin";
          break;
        case 1:
          role = "Subject Leader";
          break;
        case 2:
          role = "Subject Expert";
          break;
        case 4:
          role = "Preliminary Reviewer";
          break;
        default:
          break;
      }
      if (this.currentUser.subjectId)
        role += ` - ${
          this.allSubjects.find(
            subj => subj.subjectId == this.currentUser?.subjectId
          )?.subjectName
        }`;
      return role;
    },
    userRoleColor() {
      let color = "";
      switch (this.currentUser?.role) {
        case 0:
          color = "red";
          break;
        case 1:
          color = "#0000A0";
          break;
        case 2:
          color = "blue";
          break;
        case 4:
          color = "green";
          break;
        default:
          color = "#000000";
          break;
      }
      return color;
    }
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      updateProfile: "updateProfile",
      getAllSubjects: "subjects/getAllSubjects"
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
            gender: values.gender,
            address: values.address,
            email: values.email
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

.container .ant-form-item {
  margin-bottom: unset;
}
</style>
