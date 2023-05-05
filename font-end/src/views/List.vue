<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-800 w-full px-6">
      <div class="flex justify-end py-5 items-center">
        <el-icon :size="25" color="gray" class="mx-4 hover:text-white cursor-pointer">
          <Bell></Bell>
        </el-icon>
        <el-dropdown>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="flex-grow flex justify-center">
      <el-table style="width: 80%; height: 100%" :data="tableData">
        <el-table-column prop="name" label="表格名称">
          <template #default="scope">
            <div class="flex justify-start items-center">
              <el-icon color="blue" size="30"><Document /></el-icon>
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="owner" label="拥有者"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const tableData = reactive([
  {
    name: 'talbeName',
    createTime: '2023-05-05 16:57:42',
    owner: 'admin',
  },
]);

const getTableData = async () => {
  fetch(`${BASE_URL}/getList`, {
    headers: {
      'token': ''
    }
  })
}
</script>

<style lang="scss" scoped></style>
