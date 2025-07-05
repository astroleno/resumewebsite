/* ===================== 纵向时间轴新版渲染核心 =====================
 * 只保留新版 TimelineSingleCardManager 及其初始化逻辑
 * 数据来源：window.TIMELINE_DATA（由 timeline-data.js 注入，实际来自 index_content.json 的 timeline 字段）
 * 结构：左侧时间点，右侧单卡片内容，支持鼠标悬停/点击切换
 */

class TimelineSingleCardManager {
    constructor() {
        this.timelineData = [];
        this.activeIndex = 0;
        this.axisList = null;
        this.cardContainer = null;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * 初始化时间轴（入口）
     * @param {Array} data 时间轴数据
     */
    init(data) {
        try {
            this.timelineData = data || [];
            this.axisList = document.querySelector('.timeline-list');
            this.cardContainer = document.querySelector('.timeline-card-container');
            if (!this.axisList || !this.cardContainer) {
                console.error('时间轴容器未找到');
                return;
            }
            this.renderAxis();
            this.renderCard(this.activeIndex);
        } catch (err) {
            console.error('时间轴初始化失败', err);
        }
    }

    /**
     * 渲染左侧所有时间点
     */
    renderAxis() {
        this.axisList.innerHTML = '';
        this.timelineData.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = 'timeline-item-point' + (idx === this.activeIndex ? ' active' : '');
            li.setAttribute('data-index', idx);
            // marker
            const marker = document.createElement('div');
            marker.className = 'point-marker';
            // 插入SVG公文包图标
            marker.innerHTML = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" fill="#F7FAF5" stroke="#A8C090" stroke-width="2"/><path d="M6.5 3A1.5 1.5 0 0 0 5 4.5V5H2.5A1.5 1.5 0 0 0 1 6.5v5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 13.5 5H11v-.5A1.5 1.5 0 0 0 9.5 3h-3zm0 1h3a.5.5 0 0 1 .5.5V5H6v-.5a.5.5 0 0 1 .5-.5z" fill="#809A6F"/></svg>`;
            // label（只显示stage）
            const label = document.createElement('div');
            label.className = 'point-label';
            label.textContent = item.stage || '';
            li.appendChild(marker);
            li.appendChild(label);
            // 悬停切换（PC），点击切换（移动端）
            if (this.isTouchDevice) {
                li.addEventListener('click', () => {
                    this.switchTo(idx);
                });
            } else {
                li.addEventListener('mouseenter', () => {
                    this.switchTo(idx);
                });
            }
            this.axisList.appendChild(li);
        });
    }

    /**
     * 渲染右侧单卡片内容
     * @param {number} idx 当前激活的时间点索引
     */
    renderCard(idx) {
        try {
            const item = this.timelineData[idx];
            if (!item) {
                this.cardContainer.innerHTML = '<div class="timeline-card">无内容</div>';
                return;
            }
            // 卡片结构：顶部小标题，主标题加粗加大，description正常，details灰色小字，内容顶部对齐
            this.cardContainer.innerHTML = `
                <div class="timeline-card" style="justify-content: flex-start;">
                    <div class="timeline-card-subtitle" style="font-size:1.1rem;color:#5A7A4F;font-weight:600;margin-bottom:0.2rem;">${item.stage ? item.stage + (item.label ? '：' + item.label : '') : ''}</div>
                    <div class="timeline-card-title" style="font-size:1.6rem;font-weight:700;color:var(--timeline-text-color);margin-bottom:0.5rem;">${item.title || ''}</div>
                    <div class="timeline-card-desc" style="font-size:1.13rem;color:var(--timeline-text-color);margin-bottom:0.5rem;">${item.description || ''}</div>
                    <div class="timeline-card-details" style="font-size:1.02rem;color:#888;">${item.details || ''}</div>
                </div>
            `;
        } catch (err) {
            console.error('渲染卡片失败', err);
        }
    }

    /**
     * 切换到指定时间点
     * @param {number} idx
     */
    switchTo(idx) {
        if (idx === this.activeIndex) return;
        this.activeIndex = idx;
        // 高亮左侧
        const points = this.axisList.querySelectorAll('.timeline-item-point');
        points.forEach((li, i) => {
            if (i === idx) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
        // 切换右侧内容
        this.renderCard(idx);
    }
}

// ========== 只渲染 timeline.json 或 window.TIMELINE_DATA ========== 
// 优先使用 window.TIMELINE_DATA（由 timeline-data.js 注入，实际来自 index_content.json）
// 兼容 fallback 到 timeline.json 文件
window.timelineSingleCardManager = new TimelineSingleCardManager();
if (window.TIMELINE_DATA) {
  window.timelineSingleCardManager.init(window.TIMELINE_DATA);
} else {
  fetch('timeline.json')
    .then(res => res.json())
    .then(data => {
      window.timelineSingleCardManager.init(data);
    });
}

// 保证右侧卡片和左侧时间轴区等高
function syncTimelineCardHeight() {
    try {
        var axis = document.querySelector('.timeline-axis');
        var cardContainer = document.querySelector('.timeline-card-container');
        if (axis && cardContainer) {
            var axisHeight = axis.offsetHeight;
            cardContainer.style.height = axisHeight + 'px';
        }
    } catch (e) {
        console.warn('同步卡片高度失败', e);
    }
}
window.addEventListener('DOMContentLoaded', syncTimelineCardHeight);
window.addEventListener('resize', syncTimelineCardHeight); 