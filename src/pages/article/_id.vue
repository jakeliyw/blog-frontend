<template>
  <div class="article-container" :class="{ 'theme-dark': isDark, 'focus-mode': focusMode }">
    <div class="reading-progress">
      <div class="reading-progress__bar" :style="{ width: readingProgress + '%' }"></div>
    </div>

    <transition name="slide-fade">
      <div class="toc-sidebar" v-if="toc.length > 0" ref="myElement">
        <div class="toc-container">
          <div class="toc-title">目录</div>
          <div
            v-for="(item, index) in toc"
            :key="index"
            class="toc-item"
            :style="{ paddingLeft: (item.level - 1) * 16 + 'px' }"
            :class="['toc-level-' + item.level, { active: activeHeadingId === item.id }]"
          >
            <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)">
              {{ item.text }}
            </a>
          </div>
        </div>
      </div>
    </transition>

    <v-btn
      v-if="toc.length > 0"
      class="toc-fab"
      color="teal"
      fab
      small
      @click="mobileTocOpen = true"
      aria-label="open toc"
    >
      <v-icon>mdi-format-list-bulleted</v-icon>
    </v-btn>

    <transition name="fade">
      <div v-if="mobileTocOpen" class="toc-mobile">
        <div class="toc-mobile__overlay" @click="mobileTocOpen = false"></div>
        <div class="toc-mobile__panel">
          <div class="toc-mobile__header">
            <span>目录</span>
            <v-btn icon small @click="mobileTocOpen = false" aria-label="close toc">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <div class="toc-container">
            <div
              v-for="(item, index) in toc"
              :key="'m-' + index"
              class="toc-item"
              :style="{ paddingLeft: (item.level - 1) * 16 + 'px' }"
              :class="['toc-level-' + item.level, { active: activeHeadingId === item.id }]"
            >
              <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)">
                {{ item.text }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="article-main">
      <div class="article">
        <div class="focus-actions" v-if="!isMobile">
          <v-btn small text class="focus-btn" @click="toggleFocusMode">
            <v-icon small class="mr-1">mdi-book-open-page-variant</v-icon>
            {{ focusMode ? "退出专注模式" : "进入专注模式" }}
          </v-btn>
        </div>
        <div class="article-title">{{ detailInfo.blogTitle }}</div>
        <div class="article-meta">
          <span class="date">
            <v-icon small class="con-yanjing">mdi-calendar-month-outline</v-icon>
            <span class="information" style="margin-left: 5px;">发布时间: {{ detailInfo.createTime }}</span>
          </span>

          <div class="meta-divider">|</div>

          <v-card-actions v-for="item in detailInfo.tag" :key="item" style="padding: 0">
            <v-btn class="pr-0" text icon color="blue-grey lighten-2" style="padding-left: 0;">
              <v-icon small>mdi-tag-multiple</v-icon>
            </v-btn>
            <div>{{ item }}</div>
          </v-card-actions>
        </div>
      </div>
      <div class="meta-split"></div>
      <div class="mavonEditor">
        <client-only>
          <mavon-editor
            :value="detailInfo.blogPost"
            :subfield="false"
            class="v-note-panel"
            :boxShadow="false"
            defaultOpen="preview"
            :editable="false"
            :toolbarsFlag="false"
            :previewBackground="previewBackground"
            codeStyle="atom-one-dark"
            :ishljs="true"
          />
        </client-only>
      </div>
      <div class="meta-split"></div>
      <div class="related-section" v-if="relatedList && relatedList.length">
        <div class="related-title">相关文章推荐</div>
        <div class="related-list">
          <a
            v-for="item in relatedList"
            :key="item.id"
            class="related-card"
            :href="`/article/${item.publicId || item.id}`"
            target="_blank"
            rel="noopener"
          >
            <div class="related-card__title">{{ item.blogTitle }}</div>
            <div class="related-card__desc">{{ item.blogPost }}</div>
            <div class="related-card__meta">
              <v-icon small>mdi-calendar-month-outline</v-icon>
              <span>{{ item.createTime }}</span>
            </div>
          </a>
        </div>
      </div>
      <div class="meta-split" v-if="relatedList && relatedList.length"></div>
    </div>
  </div>
</template>

<script>
import { removeMarkdown } from "@/utils/makedownSwitch.js";
import API_PREFIX from "@/utils/apiPrefix";

export default {
  name: "DetailPage",
  validate({ params }) {
    const id = params && params.id ? String(params.id).trim() : "";
    return !!id;
  },
  async asyncData({ $axios, params, error }) {
    const id = params && params.id ? String(params.id) : "";
    try {
      const res = await $axios.$get(`${API_PREFIX}/article/${encodeURIComponent(id)}`);
      const detailInfo = res.data || {};
      detailInfo.tag = (detailInfo.tag || "").split(",");
      let relatedList = [];
      const tags = (detailInfo.tag || []).map((t) => t.trim()).filter(Boolean);
      if (tags.length) {
        try {
          const requests = tags.map((tag) =>
            $axios.$get(`${API_PREFIX}/article/list`, {
              params: { current: 1, pageSize: 6, tag },
            })
          );
          const responses = await Promise.all(requests);
          const merged = [];
          responses.forEach((res) => {
            const data = res?.data;
            const rawList = Array.isArray(data?.list)
              ? data.list
              : Array.isArray(data)
                ? data
                : [];
            merged.push(...rawList);
          });
          const uniqueMap = new Map();
          merged.forEach((item) => {
            const articleKey = String(item?.publicId || item?.id || "");
            if (!articleKey || articleKey === String(id)) return;
            if (!uniqueMap.has(articleKey)) {
              const next = { ...item };
              next.blogPost = removeMarkdown(next.blogPost || "");
              uniqueMap.set(articleKey, next);
            }
          });
          relatedList = Array.from(uniqueMap.values())
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
        } catch (e) {
          relatedList = [];
        }
      }
      return { detailInfo, relatedList };
    } catch (err) {
      const statusCode = err?.response?.status ? err.response.status : 500;
      if (statusCode === 404) {
        error({ statusCode: 404, message: "Article not found" });
        return;
      }
      error({ statusCode: 500, message: "Service unavailable" });
    }
  },
  head() {
    const title = this.detailInfo.blogTitle || "文章详情";
    const desc = removeMarkdown(this.detailInfo.blogPost || "").slice(0, 120);
    return {
      title,
      meta: [
        { hid: "description", name: "description", content: desc || "文章详情内容" },
        { hid: "og:title", property: "og:title", content: title },
        { hid: "og:description", property: "og:description", content: desc || "文章详情内容" },
        { hid: "og:type", property: "og:type", content: "article" },
      ],
    };
  },
  data() {
    return {
      toc: [],
      headingOffsets: [],
      activeHeadingId: "",
      readingProgress: 0,
      mobileTocOpen: false,
      isMobileClient: false,
      tocRetryCount: 0,
      focusMode: false,
      relatedList: [],
    };
  },
  computed: {
    isDark() {
      return this.$vuetify?.theme?.dark;
    },
    previewBackground() {
      return this.isDark ? "#22252b" : "#fff";
    },
    isMobile() {
      const bp = this.$vuetify?.breakpoint;
      if (bp && typeof bp.mdAndDown === "boolean") {
        return bp.mdAndDown;
      }
      return this.isMobileClient;
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (process.client) {
        window.scrollTo(0, 0);
      }
      this.ensureTOC();
      this.updateIsMobile();
      if (process.client) {
        window.addEventListener("scroll", this.updateOnScroll, { passive: true });
        window.addEventListener("resize", this.updateHeadingOffsets);
        window.addEventListener("resize", this.updateIsMobile);
      }
    });
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener("scroll", this.updateOnScroll);
      window.removeEventListener("resize", this.updateHeadingOffsets);
      window.removeEventListener("resize", this.updateIsMobile);
    }
  },
  methods: {
    ensureTOC() {
      this.generateTOC();
      if (!this.toc.length && this.tocRetryCount < 12) {
        this.tocRetryCount += 1;
        setTimeout(() => this.ensureTOC(), 200);
        return;
      }
      this.updateHeadingOffsets();
      this.enhanceCodeBlocks();
    },
    generateTOC() {
      const markdownContent = document.querySelector(".v-show-content");
      if (!markdownContent) return;
      const headings = markdownContent.querySelectorAll("h1, h2, h3, h4");
      this.toc = Array.from(headings).map((heading) => {
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
    updateHeadingOffsets() {
      const markdownContent = document.querySelector(".v-show-content");
      if (!markdownContent) return;
      const headings = markdownContent.querySelectorAll("h1, h2, h3, h4");
      this.headingOffsets = Array.from(headings).map((heading) => ({
        id: heading.id,
        top: heading.getBoundingClientRect().top + window.pageYOffset,
      }));
    },
  updateOnScroll() {
    this.updateReadingProgress();
    this.updateActiveHeading();
  },
    updateReadingProgress() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const total = Math.max(scrollHeight - clientHeight, 1);
      this.readingProgress = Math.min(100, Math.max(0, (scrollTop / total) * 100));
    },
    updateActiveHeading() {
      if (!this.headingOffsets.length) return;
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const current = scrollTop + 120;
      let active = this.headingOffsets[0].id;
      for (let i = 0; i < this.headingOffsets.length; i += 1) {
        if (this.headingOffsets[i].top <= current) {
          active = this.headingOffsets[i].id;
        } else {
          break;
        }
      }
      this.activeHeadingId = active;
    },
    enhanceCodeBlocks() {
      const container = document.querySelector(".v-show-content");
      if (!container) return;
      const blocks = container.querySelectorAll("pre code");
      blocks.forEach((code) => {
        const pre = code.parentElement;
        if (!pre || pre.dataset.enhanced === "1") return;

        const text = code.textContent || "";
        const lines = text.split("\n").filter((line, idx, arr) => {
          if (idx === arr.length - 1 && line.trim() === "") return false;
          return true;
        });
        const lineCount = Math.max(lines.length, 1);

        const wrapper = document.createElement("div");
        wrapper.className = "code-block";

        const header = document.createElement("div");
        header.className = "code-block__header";

        const actions = document.createElement("div");
        actions.className = "code-block__actions";

        const copyBtn = document.createElement("button");
        copyBtn.className = "code-block__btn";
        copyBtn.type = "button";
        copyBtn.style.color = "#ffffff";
        copyBtn.textContent = "复制";
        copyBtn.addEventListener("click", () => this.copyCode(text, copyBtn));

        actions.appendChild(copyBtn);

        if (lineCount > 16) {
          const toggleBtn = document.createElement("button");
          toggleBtn.className = "code-block__btn";
          toggleBtn.type = "button";
          toggleBtn.textContent = "展开";
          toggleBtn.addEventListener("click", () => {
            const expanded = wrapper.classList.toggle("is-expanded");
            toggleBtn.textContent = expanded ? "收起" : "展开";
          });
          actions.appendChild(toggleBtn);
          wrapper.classList.add("is-collapsed");
        }

        header.appendChild(actions);

        const body = document.createElement("div");
        body.className = "code-block__body";


        const parent = pre.parentNode;
        if (!parent) return;

        parent.insertBefore(wrapper, pre);

        pre.dataset.enhanced = "1";
        pre.classList.add("code-block__pre");

        wrapper.appendChild(header);
        wrapper.appendChild(body);
        body.appendChild(pre);
      });
    },
    async copyCode(text, btn) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        if (btn) {
          const prev = btn.textContent;
          btn.textContent = "复制成功";
          btn.style.color = "#ffffff";

          setTimeout(() => {
            btn.textContent = prev;
          }, 1200);
        }
      } catch (e) {
        if (btn) {
          const prev = btn.textContent;
          btn.textContent = "复制失败";
          setTimeout(() => {
            btn.textContent = prev;
          }, 1200);
        }
      }
    },
    updateIsMobile() {
      if (!process.client) return;
      this.isMobileClient = window.innerWidth <= 1180;
    },
    toggleFocusMode() {
      this.focusMode = !this.focusMode;
    },
    scrollTo(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        history.pushState(null, null, "#" + id);
        this.mobileTocOpen = false;
      }
    },
    handleDetail(article) {
      const articleId = article?.publicId || article?.id || article;
      if (!articleId) return;
      this.$router.push({
        path: `/article/${articleId}`,
      });
      if (process.client) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
  },
};
</script>


<style lang="scss" scoped>

.v-note-panel ::v-deep .hljs,
.v-note-panel ::v-deep .lang-javascript,
.v-note-panel ::v-deep .lang-bash,
.v-note-panel ::v-deep .lang-text,
.v-note-panel ::v-deep .lang-html
{
  background-color: #1D2429;
}

@media screen and (max-width: 1180px) {
  .toc-sidebar {
    display: none !important;
  }
  .toc-fab {
    display: inline-flex;
  }
}

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.reading-progress {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 999;
  background: transparent;
}

.reading-progress__bar {
  height: 100%;
  width: 0;
  background: #14b8a6;
  transition: width 0.15s ease;
}

.toc-fab {
  position: fixed;
  right: 16px;
  bottom: 84px;
  z-index: 998;
  display: none;
}

.toc-mobile {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.toc-mobile__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.toc-mobile__panel {
  position: absolute;
  right: 12px;
  top: 80px;
  width: min(320px, 80vw);
  max-height: 70vh;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toc-mobile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  font-weight: 600;
  border-bottom: 1px solid #e6e6e6;
}

.toc-mobile .toc-container {
  padding: 10px 12px;
  overflow-y: auto;
}

.v-note-panel ::v-deep .v-show-content {
  padding: 0 !important;
}

.v-note-panel ::v-deep .v-show-content pre {
  background: #1d2429 !important;
}

.code-block {
  margin: 18px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #1d2429;
}

.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #1d2429;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.code-block__actions {
  display: flex;
  gap: 8px;
}

.code-block__btn {
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff !important;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.code-block__btn:visited,
.code-block__btn:active,
.code-block__btn:focus {
  color: #ffffff !important;
}

.code-block__btn:hover {
  border-color: rgba(255, 255, 255, 0.55);
  color: #ffffff !important;
}

.code-block__body {
  display: flex;
  max-height: 420px;
}

.code-block.is-collapsed .code-block__body {
  max-height: 280px;
  overflow: hidden;
}

.code-block.is-expanded .code-block__body {
  max-height: none;
}

.code-block__pre {
  margin: 0;
  padding: 12px 14px;
  overflow: auto;
  font-size: 13px;
  line-height: 22px;
  flex: 1 1 auto;
}

.code-block__pre code {
  display: block;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

.theme-dark .code-block {
  border-color: rgba(255, 255, 255, 0.12);
  background: #1d2429;
}

.theme-dark .code-block__header {
  background: #1d2429;
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.theme-dark .code-block__btn {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.28);
}

.theme-dark .code-block__btn:hover {
  border-color: rgba(255, 255, 255, 0.55);
}

.theme-dark .code-block__pre {
  background: #1d2429;
  color: #e5e7eb;
}

.theme-dark .code-block__pre code {
  color: inherit;
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
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
  z-index: 10;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
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

    &.active a {
      color: #0f766e;
      background: #e6fffb;
      font-weight: 600;
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

.focus-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.focus-btn {
  font-size: 12px;
  text-transform: none;
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
  margin: 15px 0px;
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

.related-section {
  margin-top: 10px;
}

.related-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.related-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  text-decoration: none;
}

.related-card:hover {
  transform: translateY(-1px);
  border-color: #ffffff;
  box-shadow: 0 10px 20px rgba(30, 41, 59, 0.12);
}

.related-card__title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 6px;
}

.related-card__desc {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.related-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.v-note-panel {
  border: none;
}

.v-note-show ::v-deep .v-show-content {
  padding: 0 0 !important;
}

.v-note-wrapper {
  border: none !important;
  box-shadow: none !important;
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

.theme-dark .article-main {
  background-color: #22252B;
}

.theme-dark .article-title {
  color: #ffffff;
}

.theme-dark .article-meta {
  color: #b3b3b3;
}

.theme-dark .meta-split {
  background-color: #2f3440;
  background-image: repeating-linear-gradient(
    -45deg,
    #1b1f26,
    #1b1f26 4px,
    transparent 0px,
    transparent 8px
  );
}

.theme-dark .related-title {
  color: #ffffff;
}

.theme-dark .related-card {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.18);
}

.theme-dark .related-card__title {
  color: #ffffff;
}

.theme-dark .related-card__desc {
  color: #ffffff;
}

.theme-dark .related-card__meta {
  color: #94a3b8;
}

.theme-dark .toc-container .toc-title {
  color: #dedede;
  border-bottom-color: #2f3440;
}

.theme-dark .toc-container .toc-item a {
  color: #c9c9c9;
}

.theme-dark .toc-container .toc-item a:hover {
  color: #8ab4ff;
  background: #1c2330;
}

.theme-dark .toc-container .toc-item.active a {
  color: #7dd3fc;
  background: #1c2a3a;
}

.theme-dark .reading-progress__bar {
  background: #38bdf8;
}

.theme-dark .toc-mobile__panel {
  background: #1f2430;
  border: 1px solid #2a3340;
}

.theme-dark .toc-mobile__header {
  border-bottom-color: #2a3340;
  color: #ffffff;
}

.theme-dark .toc-mobile__overlay {
  background: rgba(0, 0, 0, 0.55);
}

.theme-dark .footer-info {
  border-bottom-color: #2f3440;
  border-top-color: #2f3440;
  color: #c2c2c2;
}

.theme-dark .title-href {
  color: #6bd1c8;
}

.theme-dark .v-note-wrapper,
.theme-dark .v-note-panel,
.theme-dark .v-note-show {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.theme-dark .v-note-panel ::v-deep .v-show-content {
  color: #d7d7d7;
}

.theme-dark .v-note-panel ::v-deep .v-show-content p,
.theme-dark .v-note-panel ::v-deep .v-show-content li,
.theme-dark .v-note-panel ::v-deep .v-show-content h1,
.theme-dark .v-note-panel ::v-deep .v-show-content h2,
.theme-dark .v-note-panel ::v-deep .v-show-content h3,
.theme-dark .v-note-panel ::v-deep .v-show-content h4,
.theme-dark .v-note-panel ::v-deep .v-show-content h5,
.theme-dark .v-note-panel ::v-deep .v-show-content h6,
.theme-dark .v-note-panel ::v-deep .v-show-content blockquote {
  color: #d7d7d7;
}

.theme-dark .v-note-panel ::v-deep .v-show-content a {
  color: #8ab4ff;
}

.focus-mode .toc-sidebar,
.focus-mode .toc-fab,
.focus-mode .reading-progress {
  display: none !important;
}

.focus-mode .article-main {
  max-width: 82vw;
  padding-top: 20px;
}

@media (max-width: 992px) {
  .focus-mode .article-main {
    max-width: 100%;
  }
}

.theme-dark .v-note-panel ::v-deep .v-show-content pre {
  background: #1d2429 !important;
}
</style>
