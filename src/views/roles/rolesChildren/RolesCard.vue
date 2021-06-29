<template>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-button type="primary" @click="addRole">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表 -->
    <el-table
      :data="roleList"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column type="expand">
        <template slot-scope="scope"> 
          <el-row 
            class="bdBottom vcenter"
            v-for="(item1, index1) in scope.row.children" :key="item1.id"
            :class="index1 === 0 ? 'bdTop' :''"
          >
            <!-- 一级权限名称 -->
            <el-col :span="5">
              <el-tag 
                type="success"
                closable
                @close="removeRightById(scope.row, item1.id)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row 
                v-for="(item2, index2) in item1.children" :key="item2.id"
                :class="index2 !== 0 ? 'bdTop' : ''"
                class="vcenter"  
              >
                <el-col 
                  :span="6"
                >
                  <el-tag
                    closable
                    @close="removeRightById(scope.row, item2.id)"  
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag 
                    type="warning" 
                    v-for="item3 in item2.children" :key="item3.id"
                    closable
                    @close="removeRightById(scope.row, item3.id)"
                  >
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
         <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editRoleInfo(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeRoleConfirm(scope.row)"
          >删除</el-button>
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="showSetRightsDilog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolevisible"
      width="50%">
      <el-form label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="newRoleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="newRoleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addRolevisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleVisible"
      width="50%"
    >
      <el-form :model="roleInfo" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRole">确 定</el-button>
      </span>  
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightsDilog"
      width="50%"
      @close="clearCheckKeys">
      <!-- 树形控件 -->
      <el-tree 
        :data="rightList" 
        :props="rightProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightsDilog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>


<script>
import { getRoles, postAddRole, removeRoleRight, putEditRole, removeRole } from 'network/roles'
import { getTreeRights, postRoleRights } from 'network/rights'

export default {
  name: '',
  data() {
    return {
      roleList: [],
      addRolevisible: false,
      newRoleName: '',
      newRoleDesc: '',
      editRoleVisible: false,
      roleInfo: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      SetRightsDilog: false,
      rightList: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      checkKeys: [],
      roleId: ''    
    }
  },
  created() {
    this._getRoles();
  },
  methods: {
     // 网络请求
    _getRoles() {
      getRoles().then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) {
          return this.$message.error('获取角色列表失败');
        }
        this.roleList = res.data.data;
        // console.log(this.roleList);
      })
    },

    // 事件监听

    // 点击显示添加角色对话框
    addRole() {
      this.addRolevisible = true;
    },
    // 提交添加角色
    submitAddRole() {
      if(!this.newRoleName) {
        return this.$message.warning('用户名不能为空！');
      }
      postAddRole(this.newRoleName, this.newRoleDesc).then(res => {
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加角色失败');
        }
        this._getRoles();
        this.addRolevisible = false;
        this.$message.success('添加角色成功');
      })
    },
    // 点击显示修改角色对话框
    editRoleInfo(role) {
      this.roleInfo.id = role.id;
      this.roleInfo.roleName = role.roleName;
      this.roleInfo.roleDesc = role.roleDesc;
      this.editRoleVisible = true;
    },
    // 提交修改角色
    submitEditRole() {
      putEditRole(this.roleInfo.id, this.roleInfo.roleName, this.roleInfo.roleDesc).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !== 200) {
          return this.$message.error('修改角色失败');
        }
        this._getRoles();
        this.editRoleVisible = false;
      })
    },
    // 删除角色
    removeRoleConfirm(role) {
       this.$confirm('确认删除角色?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRole(role.id).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除角色失败');
            }
            this._getRoles();
            this.$message({type: 'success', message: '删除成功!', center: true});
          })
          
        }).catch(() => {});
    },
    // 取消角色指定权限
    removeRightById(role, rightId){
       this.$confirm('确定取消角色此权限?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRoleRight(role.id, rightId).then(res => {
            const rdata = res.data;
            if (rdata.meta.status !== 200) {
              return this.$message({ type: 'error', message: '取消权限失败!'});
            }
            this.$message({type: 'success', message: '取消权限成功!', center: true});
            role.children = rdata.data;
            // 重新请求会刷新页面
            // this._getRoles();
          })
          
        }).catch(() => {});
    },

    // 显示分配权限对话框
    showSetRightsDilog(role) {
      this.roleId = role.id;
      getTreeRights().then(res => {
        const rdata = res.data;
        if (rdata.meta.status !== 200) {
          return this.$message({ type: 'error', message: '获取权限列表出错!'});
        }
        this.rightList = rdata.data;
        console.log(this.rightList);
      })
      // 获取三级权限的id
      this.getLeafKeys(role, this.checkKeys);
      this.SetRightsDilog = true;
    },
    // 利用递归函数获取所有三级权限id
    getLeafKeys(node,arr) {
      // 是叶节点直接获取id
      if (!node.children) {
        return arr.push(node.id);
      }
      // 不是叶节点递归获取id
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },
    // 关闭分配权限对话框时清除CheckKeys中数据
    clearCheckKeys() {
      this.checkKeys = [];
    },
    // 提交分配权限信息
    allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()];
      // 参数是字符串形式
      const idStr = keys.join(',');
      postRoleRights(this.roleId, idStr).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('分配权限出错');
        }
        this.SetRightsDilog = false;
        this._getRoles();
      })
    }
  }
}
</script>


<style scoped>
  .el-table {
    margin-top: 15px;
  }
  .el-tag {
    margin: 7px;
  }
  .bdTop {
    border-top: 1px solid #eee;
  }
  .bdBottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>