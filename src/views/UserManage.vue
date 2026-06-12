<template>
  <div class="user-management">
    <SearchBar
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <el-card shadow="never" style="border: 1px solid #e4e7ed">
      <div style="margin-bottom: 16px; display: flex; gap: 10px">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>&nbsp;新增用户
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>&nbsp;批量删除 ({{ selectedIds.length }})
        </el-button>
      </div>

      <TablePage
        :columns="tableColumns"
        :data="pagedData"
        :pagination="pagination"
        :show-selection="true"
        :loading="loading"
        @selection-change="handleSelectionChange"
        @page-change="onPageChange"
        @size-change="onSizeChange"
      >
        <template #role="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
            {{ row.role === "admin" ? "管理员" : "普通成员" }}
          </el-tag>
        </template>

        <template #status="{ row }">
          <el-tag
            :type="row.status === 'active' ? 'success' : 'warning'"
            effect="dark"
          >
            {{ row.status === "active" ? "活跃" : "停用" }}
          </el-tag>
        </template>

        <template #createTime="{ row }">
          {{ new Date(row.createTime).toLocaleDateString() }}
        </template>

        <template #actions="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            link
            size="small"
            @click="handleSingleDelete(row)"
            >删除</el-button
          >
        </template>
      </TablePage>
    </el-card>

    <FormDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :form-data="currentForm"
      :rules="formRules"
      @submit="onFormSubmit"
    >
      <template #default="{ formData }">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="3-20位字符，字母/数字/_"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="符合标准邮箱格式" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="11位数字" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通成员" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-value="active"
            inactive-value="inactive"
            active-text="活跃"
            inactive-text="停用"
          />
        </el-form-item>
      </template>
    </FormDialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import SearchBar from "../components/SearchBar.vue";
import TablePage from "../components/TablePage.vue";
import FormDialog from "../components/FormDialog.vue";
import { validateUsername, validatePhone } from "../utils/validate.js";

const userList = ref([]);
const loading = ref(false);
const selectedIds = ref([]);

// 从本地缓存同步或初始化高仿真Mock数据
const initData = () => {
  const localData = localStorage.getItem("CLUB_USERS");
  if (localData) {
    userList.value = JSON.parse(localData);
  } else {
    const arr = [];
    const now = Date.now();
    for (let i = 1; i <= 25; i++) {
      arr.push({
        id: 1000 + i,
        username: `member_0${i}`,
        email: `member${i}@ccnu.edu.cn`,
        phone: `135123456${String(i).padStart(2, "0")}`,
        role: i % i === 0 || i % 5 === 0 ? "admin" : "user",
        status: i % i === 0 || i % 6 === 0 ? "inactive" : "active",
        createTime: now - i * 3600000 * 24, // 递减模拟创建时间
        lastLogin: now,
      });
    }
    userList.value = arr;
    updateLocalStorage();
  }
};

const updateLocalStorage = () => {
  localStorage.setItem("CLUB_USERS", JSON.stringify(userList.value));
};

onMounted(() => {
  initData();
});

const searchFields = [{ key: "keyword", label: "模糊查找", type: "input" }];
const currentKeyword = ref("");

const tableColumns = [
  { prop: "username", label: "用户名", width: "130", sortable: true },
  { prop: "email", label: "电子邮箱" },
  { prop: "phone", label: "手机号", width: "140" },
  { prop: "role", label: "角色", width: "120" },
  { prop: "status", label: "状态", width: "100" },
  { prop: "createTime", label: "入团时间", width: "150" },
];

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 });

const filteredData = computed(() => {
  if (!currentKeyword.value) return userList.value;
  const kw = currentKeyword.value.toLowerCase().trim();
  return userList.value.filter(
    (u) =>
      u.username.toLowerCase().includes(kw) ||
      u.email.toLowerCase().includes(kw),
  );
});

const pagedData = computed(() => {
  pagination.total = filteredData.value.length;
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  return filteredData.value.slice(start, start + pagination.pageSize);
});

const handleSearch = (model) => {
  currentKeyword.value = model.keyword;
  pagination.currentPage = 1;
};
const handleReset = () => {
  currentKeyword.value = "";
  pagination.currentPage = 1;
};

const dialogVisible = ref(false);
const dialogTitle = ref("新增用户");
const isEdit = ref(false);
const currentForm = ref({
  id: null,
  username: "",
  email: "",
  phone: "",
  role: "user",
  status: "active",
});

const formRules = {
  username: [{ required: true, validator: validateUsername, trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱格式",
      trigger: ["blur", "change"],
    },
  ],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};

const handleCreate = () => {
  isEdit.value = false;
  dialogTitle.value = "新增社团成员";
  currentForm.value = {
    id: null,
    username: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  isEdit.value = true;
  dialogTitle.value = "编辑成员信息";
  currentForm.value = { ...row };
  dialogVisible.value = true;
};

const onFormSubmit = (data) => {
  if (isEdit.value) {
    const idx = userList.value.findIndex((u) => u.id === data.id);
    if (idx !== -1) userList.value[idx] = { ...data };
    ElMessage.success("成员档案更新成功！");
  } else {
    const newMember = {
      ...data,
      id: Date.now(),
      createTime: Date.now(),
      lastLogin: Date.now(),
      isNewToday: true, // 打上今日新增标记
    };
    userList.value.unshift(newMember);
    ElMessage.success("招新加入成功！");
  }
  updateLocalStorage();
  dialogVisible.value = false;
};

const handleSingleDelete = (row) => {
  ElMessageBox.confirm(`确定要移除该社员（${row.username}）吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userList.value = userList.value.filter((u) => u.id !== row.id);
      updateLocalStorage();
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

const handleSelectionChange = (val) => {
  selectedIds.value = val.map((item) => item.id);
};

const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确认要一键清理选中的 ${selectedIds.value.length} 个成员吗？`,
    "警告",
    {
      confirmButtonText: "强行彻底删除",
      cancelButtonText: "手误取消",
      type: "danger",
    },
  )
    .then(() => {
      userList.value = userList.value.filter(
        (u) => !selectedIds.value.includes(u.id),
      );
      selectedIds.value = [];
      updateLocalStorage();
      ElMessage.success("批量删除完成");
    })
    .catch(() => {});
};

const onPageChange = (p) => {
  pagination.currentPage = p;
};
const onSizeChange = (s) => {
  pagination.pageSize = s;
  pagination.currentPage = 1;
};
</script>
