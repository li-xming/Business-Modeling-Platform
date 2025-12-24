# Business-Modeling-Platform
参考palantir的本体论思想构建的业务建模平台，用于驱动数据治理平台应用。
Business-Modeling-Platform 是一个基于React、Ant Design和D3.js的现代化领域驱动设计(DDD)可视化建模工具。该工具提供了业务域地图、模型管理、属性定义、关系配置以及语义指标等功能，帮助团队更好地进行领域建模和系统设计。

## 功能特性

### 1. 业务域地图 (Domain Map)
- 可视化展示业务域及其相互关系
- D3.js力导向图展示域间关联
- 支持域的创建、导出等操作

### 2. 域工作台 (Domain Workbench)
- 模型地图：D3.js力导向图可视化展示模型及属性关系
- 模型管理：增删改查模型定义
- 共享属性：定义可在多个模型中复用的属性
- 关系管理：配置模型间的各种关系
- 语义/指标：定义业务语义和计算指标
- ER图和UML图可视化展示

### 3. 模型详情 (Model Detail)
- 属性管理：定义模型的具体属性
- 关系配置：配置模型间的关系
- 数据源管理：连接外部数据源
- 数据浏览：查看实际数据记录
- 语义指标：绑定和管理模型相关的语义指标
- 血缘分析：可视化展示数据血缘关系

## 技术栈

- **前端框架**: React 18
- **路由管理**: React Router v6
- **图表库**: D3.js v7
- **UI组件库**: Ant Design 6
- **样式**: CSS3 Variables, Flexbox, Grid
- **构建工具**: Vite

## 界面设计亮点

### 现代化设计语言
- 采用现代化的色彩体系和设计规范
- 统一的间距和圆角系统
- 流畅的交互动画效果
- 响应式布局适配不同屏幕尺寸

### 视觉组件
- 卡片式布局设计
- 表格组件优化
- 模态框和抽屉组件
- 状态徽章系统
- 面包屑导航

### 图形可视化
- D3.js力导向图展示复杂关系
- 节点拖拽交互
- 自适应窗口大小调整
- 不同类型节点的视觉区分
- 支持ER图和UML图展示

## 文件结构

```
frontend/
├── src/
│   ├── components/          # 通用组件
│   │   └── Pagination.jsx   # 分页组件
│   ├── pages/               # 页面组件
│   │   ├── DomainMap/       # 业务域地图
│   │   │   └── DomainMap.jsx
│   │   ├── DomainWorkbench/ # 域工作台
│   │   │   ├── components/  # 工作台组件
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── HoverDrawer.jsx
│   │   │   │   ├── ModelModal.jsx
│   │   │   │   ├── Notification.jsx
│   │   │   │   ├── RelationModal.jsx
│   │   │   │   ├── SemanticIndicatorModal.jsx
│   │   │   │   └── SharedAttributeModal.jsx
│   │   │   ├── modules/     # 工作台模块
│   │   │   │   ├── ERDiagram.jsx
│   │   │   │   ├── ForceDirectedGraph.jsx
│   │   │   │   ├── ModelManager.jsx
│   │   │   │   ├── ModelMap.jsx
│   │   │   │   ├── RelationManager.jsx
│   │   │   │   ├── SemanticIndicatorManager.jsx
│   │   │   │   ├── SharedAttributeManager.jsx
│   │   │   │   └── UMLDiagram.jsx
│   │   │   └── DomainWorkbench.jsx
│   │   └── ModelDetail/     # 模型详情
│   │       ├── components/  # 详情组件
│   │       │   ├── DataModal.jsx
│   │       │   ├── DatasourceModal.jsx
│   │       │   ├── IndicatorModal.jsx
│   │       │   ├── MappingModal.jsx
│   │       │   ├── ModalWrapper.jsx
│   │       │   ├── Notification.jsx
│   │       │   ├── PropertyModal.jsx
│   │       │   ├── RelationModal.jsx
│   │       │   └── index.js
│   │       ├── modules/     # 详情模块
│   │       │   ├── ActionManager.jsx
│   │       │   ├── BloodlineAnalyzer.jsx
│   │       │   ├── DataManager.jsx
│   │       │   ├── DatasourceManager.jsx
│   │       │   ├── PropertyManager.jsx
│   │       │   ├── RelationManager.jsx
│   │       │   ├── SemanticIndicatorManager.jsx
│   │       │   ├── SharedAttributeReference.jsx
│   │       │   └── index.js
│   │       └── ModelDetail.jsx
│   ├── App.jsx              # 应用根组件
│   ├── index.css            # 全局样式文件
│   └── main.jsx             # 应用入口文件
├── index.html               # HTML模板
├── package.json             # 项目依赖配置
└── vite.config.js            # 构建配置
```

## 快速开始

1. 安装依赖：
   ```bash
   cd frontend
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 构建生产版本：
   ```bash
   npm run build
   ```

4. 预览生产构建：
   ```bash
   npm run preview
   ```

## 后端服务

项目包含简单的后端服务，用于支持前端功能：

1. 安装后端依赖：
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. 启动后端服务：
   ```bash
   python app.py
   ```

## 样式系统

项目采用CSS变量定义了一套完整的现代化设计系统：

### 颜色系统
- 主色调：蓝色系 (#3b82f6)
- 成功色：绿色系 (#10b981)
- 警告色：橙色系 (#f59e0b)
- 危险色：红色系 (#ef4444)
- 中性色：灰度色系 (50-900)

### 字体系统
- 主字体：Inter, -apple-system, BlinkMacSystemFont等现代字体族
- 字号层级：xs, sm, base, lg, xl, 2xl
- 行高：1.5倍行高

### 间距系统
- 间距变量：spacing-1 到 spacing-10 (4px-40px)
- 圆角变量：sm, md, lg, xl, full

### 阴影系统
- sm: 微弱阴影
- md: 中等阴影
- lg: 明显阴影
- xl: 强烈阴影

## 交互设计

### 悬停效果
- 按钮悬停变色和微动效
- 卡片悬停上浮和阴影增强
- 表格行悬停背景变化

### 动画效果
- 模态框淡入动画
- 抽屉滑入滑出动画
- 页面切换过渡效果

## 开发规范

### 组件设计
- 功能组件化，职责单一
- 状态管理清晰
- 事件处理规范

### 样式规范
- 使用CSS变量统一管理样式
- 类名命名语义化
- 避免内联样式，优先使用CSS类

### 图形交互
- D3.js图形元素响应式设计
- 节点拖拽行为一致性
- 图形元素点击事件处理

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 许可证

MIT License

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。