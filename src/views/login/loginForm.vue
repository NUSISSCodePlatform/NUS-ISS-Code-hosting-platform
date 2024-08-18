<template>
  <div>
    <div class="cont">
      <div class="form sign-in">
        <h2>Welcome back,</h2>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="100px">
          <el-form-item label="Username" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="loginForm.password"></el-input>
          </el-form-item>
        </el-form>
        <button type="button" class="submit" @click="handleLogin">Sign In</button>
      </div>
      <div class="sub-cont">
        <div class="img">
          <div class="img__text m--up">
            <h2>New here?</h2>
            <p>Sign up and discover great amount of new opportunities!</p>
          </div>
          <div class="img__text m--in">
            <h2>One of us?</h2>
            <p>If you already has an account, just sign in. We've missed you!</p>
          </div>
          <div class="img__btn">
            <span class="m--up">Sign Up</span>
            <span class="m--in">Sign In</span>
          </div>
        </div>
        <div class="form sign-up">
          <h2>Sign up in NUS ISS Code Hosting platform</h2>
          <el-form ref="signupForm" :model="form" :rules="registerRule" label-width="100px">
            <el-form-item label="Email">
              <el-input id="verifiyEmailInput" v-model="form.schoolEmail" placeholder="Please enter your school Email"></el-input>
            </el-form-item>
            <el-form-item label="Username">
              <el-input v-model="form.username" placeholder="Please enter your username "></el-input>
            </el-form-item>
            <el-form-item label="Password" >
              <el-input type="password" v-model="form.password" placeholder="Please enter your password"></el-input>
            </el-form-item>
            <el-form-item label="Github">
              <el-input v-model="form.githubAccount" placeholder="Please enter your github account"></el-input>
            </el-form-item>
            <el-form-item label="Program" >
              <el-select v-model="form.major" placeholder="Select Program" style="width: 100%">
                <el-option label="Software Engineering" value="SE"></el-option>
                <el-option label="Intelligent System" value="AIS"></el-option>
                <el-option label="Enterprise Business Analytics" value="EBAC"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Verification" >
              <div class="verification-container">
                <el-input
                    v-model="form.code"
                    type="text"
                    placeholder="Enter Verification Code"
                    class="verification-input"
                />
                <el-button
                    :disabled="countdown > 0"
                    @click="sendCode"
                    style="color: gray; background-color: #cfcfcf; width: 545px; height: 30px; border-radius: 0;"
                >
                  <span v-if="countdown === 0" style="font-size: small">Send Code</span>
                  <span v-else>{{ countdown }}s</span>
                </el-button>

              </div>
            </el-form-item>
          </el-form>
          <button type="button" class="submit" @click="handleRegister">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as paper from "paper";
import { Group, view } from "paper";
import $ from 'jquery';
import { Form as ElForm, Input, Message} from 'element-ui';
import axios from 'axios';
import {apiClient,getGitlabClientTeams} from '../../utils/axios';
import qs from 'qs';

window.$ = $;

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      form: {
        major: '',
        username: '',
        password: '',
        schoolEmail: '',
        githubAccount: '',
        code: '',
      },
      countdown: 0,
      loginRules: {
        username: [{ validator: this.validateUsername, trigger: 'blur' }],
        password: [{validator: this.validatePassword, trigger: 'blur'}],
      },
      registerRule : {
        major: [
          { required: true, message: 'Major is required', trigger: 'blur' },
        ],
        username: [
          { required: true, message: 'Username is required', trigger: 'blur' },
          { max: 10, message: 'Username cannot exceed 10 characters', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
          { max: 10, message: 'Password cannot exceed 10 characters', trigger: 'blur' },
        ],
        schoolEmail: [
          { required: true, message: 'School Email is required', trigger: 'blur' },
          { max: 20, message: 'School Email cannot exceed 20 characters', trigger: 'blur' },
        ],
        githubAccount: [
          { required: true, message: 'GitHub Account is required', trigger: 'blur' },
          { max: 20, message: 'GitHub Account cannot exceed 20 characters', trigger: 'blur' },
        ],
        code: [
          { required: true, message: 'Verification Code is required', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: 'Verification Code must be a number', trigger: 'blur' },
        ],
      }
    };
  },
  mounted() {
    document.querySelector('.img__btn').addEventListener('click', function () {
      document.querySelector('.cont').classList.toggle('s--signup');
    });
  },
  methods: {
    validateForm(form, rules) {
      for (const field in rules) {
        const value = form[field];
        const fieldRules = rules[field];
        for (const rule of fieldRules) {
          if (rule.required && !value) {
            console.log(rule.message);
            return false;
          }
          if (rule.max && value.length > rule.max) {
            console.log(rule.message);
            return false;
          }
          if (rule.min && value.length < rule.min) {
            console.log(rule.message);
            return false;
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            console.log(rule.message);
            return false;
          }
        }
      }
      console.log('Form is valid');
      return true;
    },
    validateUsername: (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9@.]+$/;
      if (!value) {
        callback(new Error('Please enter your username'));
      } else if (!regex.test(value)) {
        callback(new Error('Not NUS Account'));
      } else if (!value.includes('@u.nus.edu')) {
        callback(new Error('Not NUS Account'));
      } else {
        callback();
      }
    },
    validatePassword: (rule, value, callback) => {
      if (!value || value.length < 4) {
        callback(new Error('Must be at least 4 characters'));
      } else if (value.length > 18) {
        callback(new Error('Must be no longer than 18 characters'));
      } else {
        callback();
      }
    },

    async sendCode() {
      if (this.countdown > 0) return;
      const params = {
        nusEmail: this.form.schoolEmail
      };
      this.countdown = 60;
      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(interval);
        }
      }, 1000);
      try {
        console.log(this.form.schoolEmail)
        const response = await apiClient.post('/users/code', null,{params}); // Use the custom Axios instance
        if (response.data.code === 200) {
          Message.success('Has send code');
        } else {
          Message.error('Send code fail');
        }
      } catch (error) {
        Message.error('Send code fail');
      }
    },
    async handleLogin() {
      try {
        const response = await apiClient.post('/users/login', this.loginForm); // Use the custom Axios instance
        console.log(response);
        if (response.data.code === 200) {
          localStorage.setItem('token', response.data.data.accessToken);
          localStorage.setItem('username', response.data.data.username);
          localStorage.setItem('userId', response.data.data.userId);
          localStorage.setItem('email',response.data.data.schoolEmail)
          Message.success('Login successful');
          this.$router.push('/courses');
        } else {
          Message.error('Login failed');
        }
      } catch (error) {
        Message.error('Login failed');
      }
    },

    async handleGitlabRegister(responCode) {
      if(responCode===200)
      {
        try {
          console.log("start gitlab")
          console.log("gitlab "+this.form.schoolEmail)
          const params = {
            email:this.form.schoolEmail,
            username:this.form.username,
            name:this.form.username
          };
          const responseGitlab = await getGitlabClientTeams.post('/signup',null,{params}); // Use the custom Axios instance
          console.log(responseGitlab);
          if (responseGitlab.data.code == 200) {
            localStorage.setItem('token', responseGitlab.data.data.accessToken);
            localStorage.setItem('username', responseGitlab.data.data.username);
            localStorage.setItem('userId', responseGitlab.data.data.userId);
            localStorage.setItem('email',responseGitlab.data.data.schoolEmail)
            Message.success('Gitlab Registration successful');
            this.$router.push('/courses');
          } else {
            Message.error(responseGitlab.data.msg);
          }
        } finally {
          this.loading = false;
        }
      }
    },

    async handleRegister() {
      try {
        console.log("click")
        const response = await apiClient.post('/users/register', this.form); // Use the custom Axios instance
        console.log(response);
        if (response.data.code === 200) {
          Message.success(`Code hosting platform register success and please wait for gitlab account registration`);
          this.$router.push('/courses');
        } else {
          Message.error(`Registration failed`);
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  background: #ededed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

input, button {
  border: none;
  outline: none;
  background: none;
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
}

$contW: 1000px;
$imgW: 300px;
$formW: $contW - $imgW;
$switchAT: 1.2s;

$inputW: 300px;
$btnH: 40px;

$diffRatio: ($contW - $imgW) / $contW;

@mixin signUpActive {
  .cont.s--signup & {
    @content;
  }
}

.tip {
  font-size: 20px;
  margin: 40px auto 50px;
  text-align: center;
}

.cont {
  overflow: hidden;
  position: relative;
  width: $contW;
  height: 600px;
  margin: 0 auto 100px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 150px;
}

.form {
  position: relative;
  width: $formW;
  height: 100%;
  transition: transform $switchAT ease-in-out;
  padding: 100px 30px 0; // Adjusted padding
}

.sub-cont {
  overflow: hidden;
  position: absolute;
  left: $formW;
  top: 0;
  width: $contW;
  height: 100%;
  padding-left: $imgW;
  background: #fff;
  transition: transform $switchAT ease-in-out;

  @include signUpActive {
    transform: translate3d($formW * -1, 0, 0);
  }
}

button {
  display: block;
  margin: 0 auto;
  width: $inputW;
  height: $btnH;
  border-radius: 30px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.img {
  overflow: hidden;
  z-index: 2;
  position: absolute;
  left: 0;
  top: 0;
  width: $imgW;
  height: 100%;
  padding-top: 360px;

  &:before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: $contW;
    height: 100%;
    background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/sections-3.jpg');
    background-size: cover;
    transition: transform $switchAT ease-in-out;
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  @include signUpActive {
    &:before {
      transform: translate3d($formW, 0, 0);
    }
  }

  &__text {
    z-index: 2;
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    padding: 0 20px;
    text-align: center;
    color: #fff;
    transition: transform $switchAT ease-in-out;

    h2 {
      margin-bottom: 10px;
      font-weight: normal;
    }

    p {
      font-size: 16px;
      line-height: 1.5;
    }

    &.m--up {

      @include signUpActive {
        transform: translateX($imgW * 2);
      }
    }

    &.m--in {
      transform: translateX($imgW * -2);

      @include signUpActive {
        transform: translateX(0);
      }
    }
  }

  &__btn {
    overflow: hidden;
    z-index: 2;
    position: relative;
    width: 120px;
    height: $btnH;
    margin: 0 auto;
    background: transparent;
    color: #fff;
    text-transform: uppercase;
    font-size: 16px;
    cursor: pointer;

    &:after {
      content: '';
      z-index: 2;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border: 2px solid #fff;
      border-radius: 30px;
    }

    span {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      transition: transform $switchAT;

      &.m--in {
        transform: translateY($btnH * -2);

        @include signUpActive {
          transform: translateY(0);
        }
      }

      &.m--up {
        @include signUpActive {
          transform: translateY($btnH * 2);
        }
      }
    }
  }
}

h2 {
  width: 100%;
  font-size: 28px;
  text-align: center;
}

label {
  display: block;
  width: $inputW;
  margin: 50px auto 0; // Adjusted margin
  text-align: center;

  span {
    font-size: 14px;
    color: #cfcfcf;
    text-transform: uppercase;
  }
}

input {
  display: block;
  width: 100%;
  margin-top: 5px;
  padding-bottom: 5px;
  font-size: 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  text-align: center;
}

.forgot-pass {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #cfcfcf;
}

.submit {
  margin-top: 40px;
  margin-bottom: 20px;
  background: #d4af7a;
  text-transform: uppercase;
}

.fb-btn {
  border: 2px solid #d3dae9;
  color: darken(#d3dae9, 20%);

  span {
    font-weight: bold;
    color: darken(#768cb6, 20%);
  }
}

.sign-in {
  transition-timing-function: ease-out;
  margin-top: 100px;


  @include signUpActive {
    transition-timing-function: ease-in-out;
    transition-duration: $switchAT;
    transform: translate3d($formW, 0, 0);
  }
}

.sign-up {
  transform: translate3d($contW * -1, 0, 0);

  @include signUpActive {
    transform: translate3d(0, 0, 0);
  }
}

.icon-link {
  position: absolute;
  left: 5px;
  bottom: 5px;
  width: 32px;

  img {
    width: 100%;
    vertical-align: top;
  }

  &--twitter {
    left: auto;
    right: 5px;
  }
}

.link-footer {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}

</style>
