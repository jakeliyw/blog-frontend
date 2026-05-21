<template>
  <div>
    <header-title :title="title" />
    <v-card class="mx-auto card" style="width: 99%">
      <v-card-title style="padding: 0px; font-size: 24px"
        >共计 {{ page.total }} 篇文章</v-card-title
      >
      <div v-for="(item, i) in articleList" :key="i">
        <v-card-title style="padding-left: 0px; font-size: 1.6rem;">{{
          item[0].createTime
        }}</v-card-title>
        <v-divider style="padding-left: 20px" />
        <v-card-text
          class="card-hover"
          v-for="(list, i) in item"
          :key="i"
          @click="datail(list.id)"
        >
          {{ list.creationTime }}
          {{ list.blogTitle }}
        </v-card-text>
      </div>
    </v-card>
    <v-pagination
      v-show="page.total > 1"
      v-model="page.current"
      :length="pageCount"
      class="pagination"
      color="teal"
      @input="onPageChange"
    />
  </div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import { getBlogArticle } from "@/api/blogArticle/blogArticle";

export default {
  name: "tags",
  components: {
    HeaderTitle,
  },
  data: () => ({
    title: "",
    articleList: [],
    page: {
      current: 1,
      pageSize: 6,
      total: 0,
    },
  }),
  computed: {
    // 计算总页数
    pageCount() {
      return Math.ceil(this.page.total / this.page.pageSize);
    },
  },
  mounted() {
    const title = this.$route.params.id;
    this.title = title;
    this.pagelist();
  },
  methods: {
    onPageChange(current) {
      this.page.current = current;
      this.pagelist(); // 调用获取数据的方法
    },
    async pagelist() {
      const { current, pageSize } = this.page;
      function groupByCreateTime(blogs) {
        const grouped = {};

        // 遍历所有博客，按创建时间分组
        blogs.forEach((blog) => {
          blog.creationTime = blog.createTime.substring(5);
          blog.createTime = blog.createTime.split("-")[0];
          if (!grouped[blog.createTime]) {
            grouped[blog.createTime] = [];
          }
          grouped[blog.createTime].push(blog);
        });
        const map = new Map(
          Object.entries(grouped).sort(
            (a, b) => parseInt(b[0]) - parseInt(a[0])
          )
        );
        let arr = [];
        map.forEach((blogs, year) => {
          arr.push(blogs);
        });
        // 将分组对象转换为二维数组
        return arr;
      }

      const { data: res } = await getBlogArticle({
        current,
        pageSize,
        tag: this.title,
      });
      this.articleList = groupByCreateTime(res.data);
      this.page.total = res.data.total;
    },
    datail(id) {
      this.$router.push({
        path: `/article/${id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  margin-top: 20px;
  padding: 20px;

  .card-hover {
    cursor: pointer;
    font-size: 1.4rem;
    &:hover {
      background-color: rgba(142, 241, 232, 0.1);
      color: rgb(0, 150, 136);
    }
  }
}

.pagination {
  margin-top: 2rem;
}
</style>
