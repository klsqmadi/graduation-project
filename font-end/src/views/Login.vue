<template>
  <article class="box">
    <div class="container" :class="{ 'sign-up-active': signUp }">
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-left">
            <h2>Welcome Back!</h2>
            <p>Please login with your personal info</p>
            <div class="invert button" id="signIn" @click="signUp = !signUp">Sign In</div>
          </div>
          <div class="overlay-right">
            <h2>Hello, Friend!</h2>
            <p>Please enter your personal details</p>
            <div class="invert button" id="signUp" @click="signUp = !signUp">Sign Up</div>
          </div>
        </div>
      </div>
      <form class="sign-up form" action="#">
        <h2>Create login</h2>
        <div>Use your email for registration</div>
        <el-form :model="signUpForm" :rules="rule" ref="signUpRuleFormRef" status-icon>
          <el-form-item prop="name">
            <el-input v-model="signUpForm.name" placeholder="Name"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="signUpForm.phone" placeholder="Phone"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="signUpForm.password" placeholder="Password"></el-input>
          </el-form-item>
        </el-form>
        <div class="button" @click="onSignUp(signUpRuleFormRef)">Sign Up</div>
      </form>
      <form class="sign-in form" action="#">
        <h2>Sign In</h2>
        <div>Use your account</div>
        <el-form :model="signInForm" :rules="rule" ref="signInRuleFormRef">
          <el-form-item prop="phone">
            <el-input v-model="signInForm.phone" placeholder="Phone"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="signInForm.password" placeholder="Password"></el-input>
          </el-form-item>
        </el-form>
        <a href="#">Forgot your password?</a>
        <div class="button" @click="onSignIn(signInRuleFormRef)">Sign In</div>
      </form>
    </div>
  </article>
</template>

<script setup>
import { reactive, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_URL } from '../config/server';
import { ElMessage } from 'element-plus';

const signUp = ref(false);
const signInForm = reactive({ phone: '', password: '' });
const signUpForm = reactive({ phone: '', password: '', name: '' });
const router = useRouter();
const NameRegularExpression = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,8}$/;
const PasswordRegularExpression = /^[a-zA-Z0-9]{2,16}$/;
const PhoneRegularExpression = /^1[3456789]\d{9}$/;

const nameValidation = (rule, value, callback) => {
  if (!NameRegularExpression.test(value)) {
    callback(new Error('只支持2-8长度的中英文数字，请重新输入'));
  } else {
    callback();
  }
};

const passwordValidation = (rule, value, callback) => {
  if (!PasswordRegularExpression.test(value)) {
    callback(new Error('只支持2-16长度的英文数字，请重新输入'));
  } else {
    callback();
  }
};

const phoneValidation = (rule, value, callback) => {
  if (!PhoneRegularExpression.test(value)) {
    callback(new Error('非法手机号，请重新输入'));
  } else {
    callback();
  }
};

const rule = reactive({
  name: [{ validator: nameValidation, trriger: 'blur' }],
  phone: [{ validator: phoneValidation, trriger: 'blur' }],
  password: [{ validator: passwordValidation, trriger: 'blur' }],
});
const signInRuleFormRef = ref();
const signUpRuleFormRef = ref();

const onSignUp = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return false;
    const { phone, password, name } = unref(signUpForm);
    const url = new URL(`${BASE_URL}/users/register`);
    url.search = new URLSearchParams({ phone, password, name }).toString();
    const response = await fetch(url);
    const { success, msg } = await response.json();
    if (!success) {
      ElMessage({
        message: `注册失败，请重试\n${msg}`,
        type: 'error',
      });
    } else {
      signUp.value = !signUp.value;
      ElMessage({
        message: '注册成功，请进行登录',
        type: 'success',
      });
    }
  });
};

const onSignIn = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return false;
    const { phone, password } = unref(signInForm);
    const url = new URL(`${BASE_URL}/users/login`);
    url.search = new URLSearchParams({ phone, password }).toString();
    const response = await fetch(url);
    const { success, token, msg } = await response.json();
    if (!success) {
      ElMessage({
        message: `登录失败，请重试\n${msg}`,
        type: 'error',
      });
    } else {
      ElMessage({
        message: '登录成功，即将进行跳转',
        type: 'success',
      });
      localStorage.setItem('token', token);
      setTimeout(() => {
        router.push({ path: '/list' });
      }, 2000);
    }
  });
};
</script>

<style scoped lang="scss">
.box {
  font-family: Tahoma;
  font-size: 1rem;
  color: #222;
  background-color: #b2beb5;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  position: relative;
  width: 768px;
  height: 480px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #efefef, #ccc);

  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.5s ease-in-out;
    z-index: 100;
  }

  .overlay {
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    background: linear-gradient(to bottom right, #09636b, #09636b);
    color: #fff;
    transform: translateX(0);
    transition: transform 0.5s ease-in-out;
  }

  @mixin overlays($property) {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    padding: 70px 40px;
    width: 50%;
    height: 100%;
    text-align: center;
    transform: translateX($property);
    transition: transform 0.5s ease-in-out;
  }

  .overlay-left {
    @include overlays(-20%);
  }

  .overlay-right {
    @include overlays(0);
    right: 0;
  }
}

h2 {
  margin: 0;
}

p {
  margin: 20px 0 30px;
}

a {
  color: #222;
  text-decoration: none;
  margin: 15px 0;
  font-size: 1rem;
}

.button {
  border-radius: 20px;
  border: 1px solid transparent;
  background-color: #09636b;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 40px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.1s ease-in;

  &:active {
    transform: scale(0.9);
  }

  &:focus {
    outline: none;
  }
}

.invert {
  background-color: transparent;
  border-color: #fff;
}

.form {
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  padding: 90px 60px;
  width: 50%;
  height: 100%;
  text-align: center;
  background: linear-gradient(to bottom, #efefef, #ccc);
  transition: all 0.5s ease-in-out;

  div {
    font-size: 1rem;
  }

  input {
    background-color: #eee;
    border: none;
    padding: 8px 15px;
    margin: 6px 0;
    width: calc(100% - 30px);
    border-radius: 15px;
    border-bottom: 1px solid #ddd;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 -1px 1px #fff, 0 1px 0 #fff;
    overflow: hidden;

    &:focus {
      outline: none;
      background-color: #fff;
    }
  }
}

.sign-in {
  left: 0;
  z-index: 2;
}

.sign-up {
  left: 0;
  z-index: 1;
  opacity: 0;
}

.sign-up-active {
  .sign-in {
    transform: translateX(100%);
  }

  .sign-up {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.5s;
  }

  .overlay-container {
    transform: translateX(-100%);
  }

  .overlay {
    transform: translateX(50%);
  }

  .overlay-left {
    transform: translateX(0);
  }

  .overlay-right {
    transform: translateX(20%);
  }
}

@keyframes show {
  0% {
    opacity: 0;
    z-index: 1;
  }

  49% {
    opacity: 0;
    z-index: 1;
  }

  50% {
    opacity: 1;
    z-index: 10;
  }
}

/* Youtube Link */
#yt_link {
  position: absolute;
  right: 0;
  left: 0;
  bottom: -200px;
  display: block;
  width: 160px;
  text-align: center;
  color: red;
  font-size: 15px;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  padding: 10px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 2px;
  animation: showYtLink 1.5s ease 3s forwards;
}

@keyframes showYtLink {
  0% {
    bottom: -200px;
  }

  100% {
    bottom: 20px;
  }
}
</style>
