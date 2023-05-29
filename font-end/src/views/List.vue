<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-800 w-full px-6">
      <div class="flex justify-end py-5 items-center">
        <el-icon :size="25" color="gray" class="mx-4 hover:text-white cursor-pointer">
          <Bell></Bell>
        </el-icon>
        <span class="text-white mr-4">{{ userInfo.name }}</span>
        <el-dropdown>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleEditUserInfo">个人信息</el-dropdown-item>
              <el-dropdown-item @click="exitSystem">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="h-20 px-10 flex justify-start items-center bg-slate-300">
      <el-button type="primary" @click="handleAddSheet">新增表格</el-button>
    </div>
    <div class="flex-grow flex justify-center bg-slate-500">
      <el-table style="width: 80%; height: 100%" :data="tableData">
        <el-table-column prop="name" label="表格名称" align="center">
          <template #default="scope">
            <div
              class="flex justify-start items-center w-full cursor-pointer"
              @click="tableRowClick(scope)"
            >
              <el-icon color="blue" size="30"><Document /></el-icon>
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="owner" label="拥有者" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div class="flex justify-center cursor-pointer">
              <el-icon @click="deleteTable(scope)"><Delete /></el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" width="30%">
    <el-form :rules="rule" :model="addTableForm" ref="formEl">
      <el-form-item prop="tableName" label="表格名称">
        <el-input placeholder="新增表格名字" v-model="addTableForm.tableName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end">
        <el-button class="w-1/2" type="primary" @click="confirmAddSheet(formEl)">确定</el-button>
        <el-button class="w-1/2" @click="cancelAddSheet">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="userInfoDialogVisible" width="40%">
    <el-form :model="userInfoForm" :rules="userInfoRule" ref="userInfoFormEl">
      <el-form-item label="密码" prop="password">
        <el-input v-model="userInfoForm.password"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="userInfoForm.name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex">
        <el-button class="w-1/2" type="primary" @click="saveUserInfo(userInfoFormEl)"
          >Save</el-button
        >
        <el-button class="w-1/2" @click="userInfoDialogVisible = false">Cancel</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, unref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_URL } from '../config/server';
import { ElMessage } from 'element-plus';
const router = useRouter();
const token = localStorage.getItem('token');
const formEl = ref();
const userInfoFormEl = ref();
let userInfo = ref({
  name: '',
  password: '',
  phone: '',
});
const getUserInfo = async (token) => {
  const response = await fetch(`${BASE_URL}/users/getInfo`, { headers: { token } });
  const { success, data } = await response.json();
  if (!success) {
    return;
  }
  userInfo.value = data;
};
const addTableForm = reactive({
  tableName: '',
});
const userInfoForm = reactive({
  password: '',
  name: '',
});
const saveUserInfo = async (userInfoFormEl) => {
  if (!userInfoFormEl) return;
  await userInfoFormEl.validate(async (valid) => {
    if (!valid) return false;
    const url = new URL(`${BASE_URL}/users/edit`);
    const { name, password } = unref(userInfoForm);
    url.search = new URLSearchParams({ name, password }).toString();
    const response = await fetch(url, { headers: { token } });
    const { success, msg } = await response.json();
    if (!success) {
      ElMessage({
        message: `修改信息失败，请重试\n${msg}`,
        type: 'error',
      });
      return;
    }
    ElMessage({
      message: '修改信息成功',
      type: 'success',
    });
    userInfo.value.name = name;
    userInfo.value.password = password;
    userInfoDialogVisible.value = false;
  });
};
const addTableFormClear = () => {
  addTableForm.tableName = '';
};
const handleEditUserInfo = () => {
  userInfoDialogVisible.value = true;
  userInfoForm.password = userInfo.value.password;
  userInfoForm.name = userInfo.value.name;
};
const NameRegularExpression = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,8}$/;
const PasswordRegularExpression = /^[a-zA-Z0-9]{2,16}$/;
const nameValidation = (rule, value, callback) => {
  if (!value || !NameRegularExpression.test(value)) {
    callback(new Error('只支持2-8长度的中英文数字，请重新输入'));
  } else {
    callback();
  }
};

const passwordValidation = (rule, value, callback) => {
  if (!value || !PasswordRegularExpression.test(value)) {
    callback(new Error('只支持2-16长度的英文数字，请重新输入'));
  } else {
    callback();
  }
};

const userInfoRule = reactive({
  name: [{ validator: nameValidation, trriger: 'blur' }],
  password: [{ validator: passwordValidation, trriger: 'blur' }],
});
const deleteTable = async (scope) => {
  console.log(scope);
  const { $index: index } = scope;
  const { gridKey } = tableData.value[index];
  const url = new URL(`${BASE_URL}/table/delete`);
  url.search = new URLSearchParams({ gridKey });
  const response = await fetch(url, {
    headers: { token },
  });
  const { success, msg } = await response.json();
  if (!success) {
    ElMessage({
      message: `删除表格失败，请重试\n${msg}`,
      type: 'error',
    });
    return;
  }
  tableData.value.splice(index, 1);
  ElMessage({
    message: '表格删除成功',
    type: 'success',
  });
};
const dialogVisible = ref(false);
const userInfoDialogVisible = ref(false);
const rule = reactive({
  tableName: [
    { required: true, message: '请输入表格名字', trigger: 'blur' },
    { min: 1, max: 16, message: 'Length should be 3 to 16', trigger: 'blur' },
  ],
});
let tableData = ref([
  {
    name: 'talbeName',
    createTime: '2023-05-05 16:57:42',
    owner: 'admin',
  },
]);
const getTableData = async (token) => {
  const response = await fetch(`${BASE_URL}/table/getList`, {
    headers: {
      token,
    },
  });
  const { success, data, msg } = await response.json();
  if (msg === 'invalid token' && !success) {
    ElMessage({
      message: '登录失效，请重新登录',
      type: 'error',
    });
    setTimeout(() => {
      router.push('/login');
    }, 2000);
    return;
  }
  if (!success) {
    ElMessage({
      message: `获取表格列表失败，请重试\n${msg}`,
      type: 'error',
    });
    return;
  }
  console.log(data);
  tableData.value = data.map(({ userId, name, gridKey, createdAt }) => ({
    name,
    owner: userId,
    createTime: createdAt,
    gridKey,
  }));
  ElMessage({
    message: `表格数据加载成功，当前有${data.length}条数据`,
    type: 'success',
  });
  console.log(tableData);
};
const handleAddSheet = () => {
  dialogVisible.value = true;
};
const confirmAddSheet = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fileds) => {
    if (!valid) return false;
    const url = new URL(`${BASE_URL}/table/create`);
    url.search = new URLSearchParams({ name: addTableForm.tableName }).toString();
    const response = await fetch(url, {
      headers: {
        token,
      },
    });
    dialogVisible.value = false;
    const { success, msg, data } = await response.json();
    if (!success) {
      ElMessage({
        message: `新增表格失败，请重试\n${msg}`,
        type: 'eror',
      });
      return;
    }
    addTableFormClear();
    const { name, userId, createdAt, gridKey } = data;
    tableData.value.push({ name, owner: userId, createTime: createdAt, gridKey });
  });
};
const cancelAddSheet = () => {
  addTableFormClear();
  dialogVisible.value = false;
};
const exitSystem = () => {
  localStorage.clear();
  router.push('/login');
}
const tableRowClick = (scope) => {
  const { $index: index } = scope;
  const { gridKey } = tableData.value[index];
  router.push({
    path: '/table',
    query: {
      gridKey,
    }
  })
};
if (!token) {
  router.push('/login');
}
getTableData(token);
getUserInfo(token);
</script>

<style lang="scss" scoped></style>
