// ===================== AI作品集时间轴 portfolio-ai 独立JS =====================
// 本JS负责渲染AI作品集时间轴，数据来源于window.PORTFOLIO_AI_TIMELINE

(async function() {
    try {
        // 1. 读取 timeline.json 数据
        const response = await fetch('timelinecss_ai/template/timeline.json');
        const data = await response.json();
        const portfolio = data.portfolio;

        // 2. 获取页面容器
        const contentArea = document.querySelector('.timeline-content-area');
        const axisArea = document.querySelector('.timeline-axis-area');
        const dateArea = document.querySelector('.timeline-date-area');

        // 3. 渲染内容卡片、时间轴圆点、日期列表
        contentArea.innerHTML = '';
        axisArea.innerHTML = '';
        dateArea.innerHTML = '';

        portfolio.forEach((item, idx) => {
            // 创建内容卡片，只显示当前选中的一条（初始为第一条）
            const contentDiv = document.createElement('div');
            contentDiv.className = 'timeline-content' + (idx === 0 ? ' active' : '');
            contentDiv.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p style="color:#888;font-size:14px;">${item.details}</p>
                <img src="${item.image}" alt="${item.title}" style="max-width:100%;border-radius:8px;margin-top:10px;">
            `;
            contentArea.appendChild(contentDiv);

            // 创建时间轴圆点
            const dotDiv = document.createElement('div');
            dotDiv.className = 'timeline-dot' + (idx === 0 ? ' active' : '');
            axisArea.appendChild(dotDiv);

            // 创建右侧阶段/日期
            const dateDiv = document.createElement('div');
            dateDiv.className = 'timeline-date' + (idx === 0 ? ' active' : '');
            dateDiv.setAttribute('data-index', idx);
            dateDiv.innerText = item.date;
            dateArea.appendChild(dateDiv);
        });

        // 4. 鼠标悬浮切换内容
        const dateNodes = dateArea.querySelectorAll('.timeline-date');
        const contentNodes = contentArea.querySelectorAll('.timeline-content');
        const dotNodes = axisArea.querySelectorAll('.timeline-dot');

        dateNodes.forEach((node, idx) => {
            node.addEventListener('mouseenter', () => {
                // 切换内容卡片
                contentNodes.forEach((c, i) => c.classList.toggle('active', i === idx));
                // 切换高亮圆点
                dotNodes.forEach((d, i) => d.classList.toggle('active', i === idx));
                // 切换高亮标题
                dateNodes.forEach((n, i) => n.classList.toggle('active', i === idx));
            });
        });

        // 日志打印
        console.log('portfolio-ai-timeline 渲染完成', portfolio);
    } catch (e) {
        // 错误处理，便于排查问题
        console.error("portfolio-ai-timeline 渲染出错", e);
    }
})(); 