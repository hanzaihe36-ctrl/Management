<template>
  <div class="layout-container">
    <el-container style="height: 100vh">
      <!-- 左侧边栏导航 -->
      <el-aside width="220px" style="background-color: #304156">
        <div
          style="
            height: 60px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border-bottom: 1px solid #1f2d3d;
          "
        >
          社团后台控制系统
        </div>
        <el-menu
          active-text-color="#409EFF"
          background-color="#304156"
          class="el-menu-vertical"
          :default-active="$route.path"
          text-color="#bfcbd9"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><Menu /></el-icon>
            <span>分析首页看板</span>
          </el-menu-item>
          <el-menu-item index="/user-manage">
            <el-icon><User /></el-icon>
            <span>社员档案管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧主展示区 -->
      <el-container>
        <el-header class="app-header">
          <div>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>数字化系统</el-breadcrumb-item>
              <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="font-size: 14px; color: #666">学校社团管理员登录</div>
        </el-header>

        <el-main style="background-color: #f5f7fa; padding: 20px">
          <!-- 路由主页面占位符 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.el-menu-vertical {
  border-right: none;
}
</style>
