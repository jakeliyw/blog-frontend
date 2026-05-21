<template>
  <div class="article-container">
    <transition name="slide-fade" >
      <div
        class="toc-sidebar"
        v-if="toc.length > 0"
        ref="myElement"
      >
        <div class="toc-container">
          <div class="toc-title">目录</div>
          <div
            v-for="(item, index) in toc"
            :key="index"
            class="toc-item"
            :style="{ paddingLeft: (item.level - 1) * 16 + 'px' }"
            :class="'toc-level-' + item.level"
          >
            <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)">
              {{ item.text }}
            </a>
          </div>
        </div>
      </div>
    </transition>

    <div class="article-main">
      <div class="article">
        <div class="article-title">{{ detailInfo.blogTitle }}</div>
        <div class="article-meta">
          <span class="date">
            <v-icon small class="con-yanjing"
              >mdi-calendar-month-outline
              </v-icon>
            <span class="information">发表于 {{ detailInfo.createTime }}</span>
          </span>

          <div class="meta-divider">|</div>

          <v-card-actions
            v-for="item in detailInfo.tag"
            :key="item"
            style="padding: 0"
          >
            <v-btn
              class="pr-0"
              text
              icon
              color="blue-grey lighten-2"
              style="padding-left: 0;">
              <v-icon small> mdi-tag-multiple </v-icon>
            </v-btn>
            <div>
              {{ item }}
            </div>
          </v-card-actions>
          </div>
        </div>
        <div class="meta-split"></div>
        <div class="mavonEditor">
          <mavon-editor
            :value="detailInfo.blogPost"
            :subfield="false"
            class="v-note-panel"
            :boxShadow="false"
            defaultOpen="preview"
            :editable="false"
            :toolbarsFlag="false"
            previewBackground="#fff"
            codeStyle="atom-one-dark"
            :ishljs="true"
          />
        </div>
        <div class="meta-split"></div>
        <div class="footer-info">
          <div class="footer-left" v-if="detailInfo.firstGreater" @click="handleDetail(detailInfo.firstGreater)">上一篇</div>
          <div class="footer-right">
            <div class="title-href" v-if="detailInfo.next" @click="handleDetail(detailInfo.next)">
              <span>下一篇</span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import "mavon-editor/dist/css/index.css";
import { getBlogDetail } from "@/api/blogDetail/blogDetail";
import { removeMarkdown } from "@/utils/makedownSwitch.js";
export default {
  name: "detail",

  data() {
    return {
      wordNumber: 0,
      detailInfo: {},
      toalnum: 22,
      toc: [], // 新增目录数据
    };
  },
  mounted() {
    this.getDetail();
    document.documentElement.scrollTop = 0
  },

  methods: {
    async getDetail() {
      const detailId = this.$route.params.id;
      let { data } = await getBlogDetail(detailId);
      data.tag = data.tag.split(',')
      this.detailInfo = data;

      this.wordNumber = removeMarkdown(data.blogPost).length;
      // 在数据加载后生成目录
      this.$nextTick(() => {
        this.generateTOC();
      });
    },

    // 生成目录
    generateTOC() {
      // 获取markdown渲染后的DOM元素
      const markdownContent = document.querySelector(".v-show-content");
      if (!markdownContent) return;

      // 选择所有标题元素 (h1-h4)
      const headings = markdownContent.querySelectorAll("h1, h2, h3, h4");

      this.toc = Array.from(headings).map((heading) => {
        // 如果没有ID，创建一个
        if (!heading.id) {
          heading.id = "heading-" + Math.random().toString(36).substr(2, 9);
        }

        return {
          id: heading.id,
          text: heading.textContent,
          level: parseInt(heading.tagName.substring(1)),
        };
      });
    },

    // 平滑滚动到指定标题
    scrollTo(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // 更新URL hash但不触发滚动
        history.pushState(null, null, "#" + id);
      }
    },


    handleDetail(id) {
      console.log(id, 'id');

      this.$router.push({
        path: `/article/${id}`,
      });
      this.getDetail();
    },
  },
};
</script>

<style lang="scss" scoped>

/* 移动端隐藏目录 */
@media screen and (max-width: 1180px) {
  .toc-sidebar {
    display: none !important;
  }
}


/* 进入和离开动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.v-note-panel ::v-deep .v-show-content {
  padding: 0 !important;
}

.article-layout {
  display: flex;
  justify-content: center;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.article-main {
  flex: 1;
  background-color: white;
  max-width: 68vw;
  margin: 0 auto;
  padding: 30px;
}

.toc-sidebar {
  position: fixed;
  right: 10px; /* 根据你的布局调整 */
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
  z-index: 10;

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
}

.toc-btn {
  position: fixed;
  right: 10px; /* 根据你的布局调整 */
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
    background-color: #009688;
    color: #fff;
  }
}

.toc-container {
  .toc-title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
    color: #2c3e50;
  }

  .toc-item {
    margin: 6px 0;
    line-height: 1.5;
    transition: all 0.2s;

    a {
      color: #555;
      text-decoration: none;
      display: block;
      padding: 3px 8px;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        color: #1890ff;
        background: #f0f7ff;
        transform: translateX(3px);
      }
    }

    &.toc-level-2 {
      font-weight: 500;
      margin-left: 0;
    }
    &.toc-level-3 {
      font-size: 0.95em;
      color: #666;
    }
    &.toc-level-4 {
      font-size: 0.9em;
      color: #777;
    }
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .toc-sidebar {
    right: 20px;
  }
}

@media (max-width: 992px) {
  .article-layout {
    flex-direction: column;
  }

  .article-main {
    margin-right: 0;
    max-width: 100%;
  }
}

.article-title {
  color: #34495e;
  font-size: 28px;
  margin: 10px 0;
  font-weight: 400;
  text-align: center;
}

.article-meta {
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  color: rgb(136, 136, 136);
}
.date {
  display: flex;
  align-items: center;
}
.meta-split {
  margin: 30px 0px;
  height: 3px;
  border: none;
  background-color: rgb(221, 221, 221);
  background-image: repeating-linear-gradient(
    -45deg,
    rgb(255, 255, 255),
    rgb(255, 255, 255) 4px,
    transparent 0px,
    transparent 8px
  );
}

.meta-divider {
  margin: 0 5px;
}

.author {
  .con-yanjing {
    margin-right: 4px;
  }
}

.watch {
  @extend .author;

  .con-yanjing {
    font-size: 12px;
    margin-right: 4px;
  }
}

.v-note-panel {
  border: none;
}

.v-note-show ::v-deep .v-show-content {
  padding: 0 0 !important;
}

.v-note-wrapper {
  border: 1px solid #fff !important;
}

.footer-info {
  overflow: hidden;
  align-items: center;
  border-bottom: 1px dashed #cacaca;
  border-top: 1px dashed #cacaca;
  margin: 30px 0 0px 0;
  height: 50px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #757575;

  .footer-left {
    float: left;
    cursor: pointer;
  }

  .footer-right {
    line-height: 26px;
    margin-right: 10px;
    display: flex;
    flex-wrap: nowrap;
  }
}

.title-href {
  text-decoration: underline;
  cursor: pointer;
  color: teal;
}

.v-note-wrapper {
  position: static;
}
</style>
