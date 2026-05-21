<template>
  <div class="article">
    <div>
      <div class="article-container container--fluid">
            <v-hover v-slot:default="{ hover }" open-delay="200" v-for="item of articleList" :key="item.id">
              <v-card subtitle :elevation="hover ? 16 : 2" class="mx-auto card">
                <div class="article-img">
                  <v-img src="https://raw.githubusercontent.com/CloverTuan/Markdown_Images/master/yanxi/yanxi-cover.jpg"
                  style="border-radius: 0.5rem; width: 100%; height: 100%;"
                  />
                </div>
                <div style="width: 100%; text-align: left;">
                  <span class="headline" @click="datail(item.id)">
                    {{ item.blogTitle }}
                  </span>

                  <div class="desc">
                    {{ item.blogPost }}
                  </div>
                  <p class="date">
                    <v-icon
                      small
                      class="con-yanjing"
                      style="margin-right: 5px;"
                    >
                    mdi-calendar-month-outline
                    </v-icon>
                  {{ item.createTime }}
                  </p>
                </div>

              </v-card>
            </v-hover>
        <!--      分页-->
        <div class="text-center">
          <v-pagination
            v-model="page.current"
            :length="pageCount"
            class="pagination"
            color="teal"
            @input="onPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import { getBlogArticle } from "@/api/blogArticle/blogArticle";
// import removeMarkdown from '@/utils/makedownSwitch.js'
import { removeMarkdown } from "@/utils/makedownSwitch.js";

export default {
  name: "article",
  components: {
    HeaderTitle,
  },
  data() {
    return {
      title: "首页",
      articleList: [],
      page: {
        current: 1,
        pageSize: 6,
        total: 0,
      },
    };
  },
  computed: {
    // 计算总页数
    pageCount() {
      return Math.ceil(this.page.total / this.page.pageSize);
    },
  },
  mounted() {
    this.pagelist();
  },
  methods: {
    onPageChange(current) {
      this.page.current = current;
      this.pagelist(); // 调用获取数据的方法
    },
    async pagelist() {
      const { current, pageSize } = this.page;
      const { data: res } = await getBlogArticle({
        current,
        pageSize,
      });

      const rawList = Array.isArray(res?.data?.list)
        ? res.data.list
        : Array.isArray(res?.data)
          ? res.data
          : [];

      this.articleList = rawList.map((item) => {
        const next = { ...item };
        next.tag = (next.tag || "").split(",");
        next.blogPost = removeMarkdown(next.blogPost || "");
        return next;
      });
      this.page.total = res?.data?.total || rawList.length || 0;
    },
    datail(id) {
      this.$router.push({
        path: `/article/${id}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">


.article-img {
  width: 32rem;
  height: 24rem;
  margin-right: 4rem;
  background-color: #f8f8f8;
}

.article {
  max-width: 980px;
  margin: 0 auto;
  @include Article;
}

.underline {
  color: #607d8b;
  text-decoration: underline;
  font-size: 1.4rem;
}

@media screen and (max-width: 600px) {
    .card {
        flex-direction: column !important;
        padding: 20px !important;
        margin: 10px 0;
    }
}

@media screen and (max-width: 600px) {
    .article-img {
        margin-left: 0;
        margin-right: 0;
        margin-bottom: 2rem;
        width: 100%;
    }
}

.card {
  margin-bottom: 2rem;
  padding: 8rem 10rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover .headline {
    color: #009688;
  }

  .date {
    font-size: 16px;
    line-height: 30px;
    opacity: .5;
    display: flex;
    align-items: center;
  }

  .headline {
    cursor: pointer;
    font-weight: 600;
    font-size: 2.8rem !important;
    line-height: 4rem;
  }

  .desc {
    font-size: 16px;
    line-height: 30px;
    margin-top: 20px;
    margin-bottom: 15px;
    // max-width: 480px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 显示两行 */
    overflow: hidden;
  }
}


</style>
