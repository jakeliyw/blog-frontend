<template>
  <div v-if="value" class="search-modal" :class="{ 'theme-dark': isDark }">
    <div class="search-overlay" @click="close"></div>
    <div class="search-dialog" role="dialog" aria-modal="true">
      <v-btn icon class="close-btn" @click="close" aria-label="close search modal">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <div class="search-header">
        <div class="search-content">
          <v-text-field
            v-model="keyword"
            class="search-input"
            solo
            flat
            hide-details
            placeholder="请输入搜索关键词"
            aria-label="search input"
            @keydown.enter="handleSearch"
          >
            <template v-slot:append>
              <v-icon @click="handleSearch">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </div>

        <div class="search-status">
          <span v-if="loading">加载中...</span>
          <span v-else-if="searched && results.length === 0">未找到相关结果</span>
        </div>
      </div>

      <div v-if="results.length > 0" class="search-results">
        <div
          v-for="item in results"
          :key="item.id"
          class="result-card"
          @click="goDetail(item)"
        >
          <div class="result-title">{{ item.blogTitle }}</div>
          <div class="result-desc">{{ item.blogPost }}</div>
          <div class="result-meta">
            <v-icon small>mdi-calendar-month-outline</v-icon>
            <span>{{ item.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { removeMarkdown } from "@/utils/makedownSwitch.js";
import API_PREFIX from "@/utils/apiPrefix";

export default {
  name: "SearchModal",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      keyword: "",
      results: [],
      loading: false,
      searched: false,
      debounceTimer: null,
    };
  },
  computed: {
    isDark() {
      return !!this.$vuetify?.theme?.dark;
    },
  },
  methods: {
    close() {
      this.keyword = "";
      this.results = [];
      this.loading = false;
      this.searched = false;
      this.$emit("input", false);
    },
    handleSearch() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.executeSearch();
      }, 300);
    },
    async executeSearch() {
      const blogTitle = (this.keyword || "").trim();
      this.searched = true;
      if (!blogTitle) {
        this.results = [];
        return;
      }
      this.loading = true;
      try {
        const { data } = await this.$axios.$get(`${API_PREFIX}/article/list`, {
          params: { current: 1, pageSize: 6, blogTitle },
        });
        const rawList = Array.isArray(data?.list)
          ? data.list
          : Array.isArray(data)
            ? data
            : [];
        this.results = rawList.map((item) => {
          const next = { ...item };
          next.blogPost = removeMarkdown(next.blogPost || "");
          return next;
        });
      } catch (error) {
        this.results = [];
      } finally {
        this.loading = false;
      }
    },
    goDetail(article) {
      const articleId = article?.publicId || article?.id;
      if (!articleId) return;
      if (process.client) {
        window.location.href = `/article/${articleId}`;
        return;
      }
      this.$router.push({ path: `/article/${articleId}` });
      this.close();
    },
  },
  watch: {
    value(next) {
      if (next) {
        this.searched = false;
        this.results = [];
        this.$nextTick(() => {
          const input = this.$el.querySelector("input");
          if (input) input.focus();
        });
      }
    },
  },
  beforeDestroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  },
};
</script>

<style scoped lang="scss">
.search-modal {
  position: fixed;
  inset: 0;
  z-index: 1200;
}

.search-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

.search-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(800px, 90vw);
  min-height: 200px;
  max-height: 70vh;
  background: linear-gradient(180deg, #ffffff 0%, #f7f8fb 100%);
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(30, 41, 59, 0.18);
  padding: 18px 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.close-btn {
  position: absolute;
  top: 6px;
  right: 6px;
}

.search-header {
  // height: 200px;
  padding-top: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.search-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.search-input {
  width: 100%;
  max-width: 760px;
}

.search-status {
  color: #64748b;
  font-size: 14px;
  min-height: 20px;
}

.search-results {
  margin-top: 2px;
  padding-top: 6px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}

.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.12);
  border-radius: 8px;
}

.search-results::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #94a3b8, #64748b);
  border-radius: 8px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #7c8aa0, #52617a);
}

.result-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.result-card:hover {
  transform: translateY(-1px);
  border-color: #cbd5f5;
  box-shadow: 0 8px 18px rgba(30, 41, 59, 0.12);
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.result-desc {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 6px;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

::v-deep .search-input .v-input__control {
  height: 56px;
}

::v-deep .search-input .v-input__slot {
  height: 56px;
  align-items: center;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.05);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  padding: 0 12px;
}

::v-deep .search-input input {
  font-size: 16px;
  color: #1f2937;
  line-height: 56px;
  padding: 0;
}

::v-deep .search-input input::placeholder {
  color: #94a3b8;
}

::v-deep .search-input .v-icon {
  color: #64748b;
  cursor: pointer;
}

::v-deep .search-input .v-input__slot:hover {
  border-color: #cbd5f5;
}

::v-deep .search-input.v-input--is-focused .v-input__slot {
  border-color: #4f8cff;
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.18);
}

.theme-dark .search-dialog {
  background: #1f2430;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
  border-color: rgba(30, 41, 59, 0.6);
}

.theme-dark .search-overlay {
  background: rgba(0, 0, 0, 0.6);
}

.theme-dark .result-card {
  background: #1b202a;
  border-color: rgba(148, 163, 184, 0.18);
}

.theme-dark .result-title {
  color: #e5e7eb;
}

.theme-dark .result-desc {
  color: #cbd5f5;
}

.theme-dark .result-meta {
  color: #94a3b8;
}

.theme-dark ::v-deep .search-input input {
  color: #ffffff;
}

.theme-dark .search-results::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.18);
}

.theme-dark .search-results::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #4b5563, #374151);
}

.theme-dark .search-results::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #5a6474, #3f4857);
}
</style>
