<template>
  <div>
    <header-title :title="title" />
    <div class="container">
      <v-data-table
          :headers="headers"
          :items="cardsData"
          sort-by="calories"
          class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <!--            搜索-->
            <v-text-field
                v-model="keyword"
                append-icon="search"
                label="Search"
                single-line
                hide-details
                @keyup.enter.native="pagelist"
            ></v-text-field>

            <v-spacer></v-spacer>
            <!--            新建博客-->
            <v-btn
                color="teal"
                dark
                class="mb-2"
                @click="newBlog"
            >新建博客
            </v-btn>
          </v-toolbar>
        </template>
        <!--        修改按钮-->
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
              color="primary"
          >
            mdi-pencil
          </v-icon>
          <!--          删除按钮-->
          <v-icon
              small
              color="red"
              @click="deleteItem(item)"

          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <!--        分页器-->
      <v-pagination
          v-model="pagination.pagenum"
          color="teal"
          class="pagination"
          :length="total"
      ></v-pagination>

    </div>
  </div>
</template>

<script>
import HeaderTitle from '@/components/HeaderTitle'
import { getAdmin, delAdmin } from '../../../api/blogAdmin/blogAdmin'

export default {
  name: 'admin',
  components: {
    HeaderTitle,
  },
  data: () => ({
    title: '文章管理',
    multiLine: true,
    headers: [
      {
        text: '博客标题',
        align: 'start',
        sortable: true,
        value: 'title',
      },
      {
        text: '操作',
        value: 'actions',
        sortable: false,
      },
    ],
    cardsData: [],
    keyword: '',
    pagination: {
      pagenum: 1,
      length: 0,
    },
    page: {
      start: 0,
    },
  }),

  watch: {
    // 监听这个当前页面
    'pagination.pagenum' () {
      this.page.start = (this.pagination.pagenum - 1) * 5
      this.pagelist()
    },
  },
  computed: {
    total () {
      return Math.ceil(this.pagination.length / 5)
    },
  },
  mounted () {
    this.pagelist()
  },

  methods: {
    async pagelist () {
      const { data: res } = await getAdmin({
        start: this.page.start,
        keyword: this.keyword,
      })
      // 把数组的长度设置为后台计算的总长度
      this.$set(
        this.pagination,
        'length',
        res.listLen,
      )
      this.cardsData = res.listData

    },

    editItem (item) {
      this.$store.commit('detail/upDetail', item)
      this.$router.push({ name: 'update' })
    },
    newBlog () {
      this.$router.push({ name: 'new' })
    },
    async deleteItem (item) {
      confirm(`你确定要删除${item.title}吗?`) && await delAdmin({
        id: item.id,
      })
      this.pagelist()
    },
  },
}
</script>
<style scoped lang="scss">
.v-data-table ::v-deep .v-data-footer {
  display: none;
}

.pagination {
  margin-top: 20px;
}

.container {
  border: 1px solid #eee;
  background: #fff;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  margin: 20px auto;
  overflow: hidden;
}
</style>
