import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BloodlineAnalyzer = ({ model, bloodlineType, setBloodlineType, bloodlineData }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  // 生成血缘分析数据
  const generateBloodlineData = () => {
    // 模拟血缘数据，实际项目中应该从API获取
    const currentModelId = model?.id || 1;
    const nodes = [];
    const links = [];
    
    // 核心模型
    const currentModelName = model?.name || `模型${currentModelId}`;
    nodes.push({
      id: currentModelId,
      name: currentModelName,
      type: 'model',
      isCurrent: true
    });
    
    // 检查是否是收费站模型，生成特定的血缘数据
    const isTollStationModel = currentModelName.includes('收费站') || model?.name === '收费站';
    
    if (isTollStationModel) {
      // 根据血缘类型生成收费站模型特定的数据
      switch (bloodlineType) {
        case 'forward':
          // 正向血缘：收费站 → 车道 → 标识点 → 交易流水 → 车辆通行路径 → 通行拟合路径 → 拆分明细
          nodes.push(
            { id: currentModelId + 1, name: `车道`, type: 'model' },
            { id: currentModelId + 2, name: `标识点`, type: 'model' },
            { id: currentModelId + 3, name: `交易流水`, type: 'model' },
            { id: currentModelId + 4, name: `车辆通行路径`, type: 'model' },
            { id: currentModelId + 5, name: `通行拟合路径`, type: 'model' },
            { id: currentModelId + 6, name: `拆分明细`, type: 'model' }
          );
          links.push(
            { source: currentModelId, target: currentModelId + 1, name: '包含' },
            { source: currentModelId + 1, target: currentModelId + 2, name: '继承' },
            { source: currentModelId + 2, target: currentModelId + 3, name: '生成' },
            { source: currentModelId + 3, target: currentModelId + 4, name: '汇聚为' },
            { source: currentModelId + 4, target: currentModelId + 5, name: '拟合为' },
            { source: currentModelId + 5, target: currentModelId + 6, name: '拆分为' }
          );
          break;
          
        case 'reverse':
          // 反向血缘：收费公路 → 收费站
          // 路段业主 → 收费公路 → 收费站
          nodes.push(
            { id: currentModelId - 1, name: `收费公路`, type: 'model' },
            { id: currentModelId - 2, name: `路段业主`, type: 'model' }
          );
          links.push(
            { source: currentModelId - 2, target: currentModelId - 1, name: '管理' },
            { source: currentModelId - 1, target: currentModelId, name: '包含' }
          );
          break;
          
        case 'endToEnd':
          // 端到端血缘：路段业主 → 收费公路 → 收费站 → 车道 → 标识点 → 交易流水 → 车辆通行路径 → 通行拟合路径 → 拆分明细
          nodes.push(
            { id: currentModelId - 2, name: `路段业主`, type: 'model' },
            { id: currentModelId - 1, name: `收费公路`, type: 'model' },
            { id: currentModelId + 1, name: `车道`, type: 'model' },
            { id: currentModelId + 2, name: `标识点`, type: 'model' },
            { id: currentModelId + 3, name: `交易流水`, type: 'model' },
            { id: currentModelId + 4, name: `车辆通行路径`, type: 'model' },
            { id: currentModelId + 5, name: `通行拟合路径`, type: 'model' },
            { id: currentModelId + 6, name: `拆分明细`, type: 'model' }
          );
          links.push(
            { source: currentModelId - 2, target: currentModelId - 1, name: '管理' },
            { source: currentModelId - 1, target: currentModelId, name: '包含' },
            { source: currentModelId, target: currentModelId + 1, name: '包含' },
            { source: currentModelId + 1, target: currentModelId + 2, name: '继承' },
            { source: currentModelId + 2, target: currentModelId + 3, name: '生成' },
            { source: currentModelId + 3, target: currentModelId + 4, name: '汇聚为' },
            { source: currentModelId + 4, target: currentModelId + 5, name: '拟合为' },
            { source: currentModelId + 5, target: currentModelId + 6, name: '拆分为' }
          );
          break;
          
        case 'impact':
          // 影响分析：收费站 → 车道 → 标识点 → 交易流水 → 车辆通行路径 → 通行拟合路径 → 拆分明细
          // 同时考虑ETC门架对标识点和交易流水的影响
          nodes.push(
            { id: currentModelId + 1, name: `车道`, type: 'model' },
            { id: currentModelId + 2, name: `标识点`, type: 'model' },
            { id: currentModelId + 3, name: `交易流水`, type: 'model' },
            { id: currentModelId + 4, name: `车辆通行路径`, type: 'model' },
            { id: currentModelId + 5, name: `通行拟合路径`, type: 'model' },
            { id: currentModelId + 6, name: `拆分明细`, type: 'model' },
            { id: currentModelId + 7, name: `收费单元`, type: 'model' },
            { id: currentModelId + 8, name: `ETC门架`, type: 'model' }
          );
          links.push(
            { source: currentModelId, target: currentModelId + 1, name: '影响' },
            { source: currentModelId + 1, target: currentModelId + 2, name: '影响' },
            { source: currentModelId + 2, target: currentModelId + 3, name: '影响' },
            { source: currentModelId + 3, target: currentModelId + 4, name: '影响' },
            { source: currentModelId + 4, target: currentModelId + 5, name: '影响' },
            { source: currentModelId + 5, target: currentModelId + 6, name: '影响' },
            { source: currentModelId + 6, target: currentModelId + 7, name: '影响' },
            { source: currentModelId + 8, target: currentModelId + 2, name: '影响' },
            { source: currentModelId + 8, target: currentModelId + 3, name: '影响' }
          );
          break;
      }
    } else {
      // 非收费站模型，使用默认的血缘数据
      switch (bloodlineType) {
        case 'forward':
          // 正向血缘：当前模型 → 下游模型1 → 下游模型2
          nodes.push(
            { id: currentModelId + 1, name: `下游模型1`, type: 'model' },
            { id: currentModelId + 2, name: `下游模型2`, type: 'model' }
          );
          links.push(
            { source: currentModelId, target: currentModelId + 1, name: '关联' },
            { source: currentModelId + 1, target: currentModelId + 2, name: '关联' }
          );
          break;
          
        case 'reverse':
          // 反向血缘：上游模型1 → 上游模型2 → 当前模型
          nodes.push(
            { id: currentModelId - 2, name: `上游模型2`, type: 'model' },
            { id: currentModelId - 1, name: `上游模型1`, type: 'model' }
          );
          links.push(
            { source: currentModelId - 2, target: currentModelId - 1, name: '关联' },
            { source: currentModelId - 1, target: currentModelId, name: '关联' }
          );
          break;
          
        case 'endToEnd':
          // 端到端血缘：源头 → 中间模型1 → 当前模型 → 中间模型2 → 目标
          nodes.push(
            { id: currentModelId - 2, name: `数据源`, type: 'datasource' },
            { id: currentModelId - 1, name: `预处理模型`, type: 'model' },
            { id: currentModelId + 1, name: `分析模型`, type: 'model' },
            { id: currentModelId + 2, name: `业务指标`, type: 'indicator' }
          );
          links.push(
            { source: currentModelId - 2, target: currentModelId - 1, name: '读取' },
            { source: currentModelId - 1, target: currentModelId, name: '转换' },
            { source: currentModelId, target: currentModelId + 1, name: '分析' },
            { source: currentModelId + 1, target: currentModelId + 2, name: '生成' }
          );
          break;
          
        case 'impact':
          // 影响分析：当前模型 → 直接影响1 → 直接影响2 → 间接影响1 → 间接影响2
          nodes.push(
            { id: currentModelId + 1, name: `直接影响1`, type: 'model' },
            { id: currentModelId + 2, name: `直接影响2`, type: 'model' },
            { id: currentModelId + 3, name: `间接影响1`, type: 'model' },
            { id: currentModelId + 4, name: `间接影响2`, type: 'model' }
          );
          links.push(
            { source: currentModelId, target: currentModelId + 1, name: '影响' },
            { source: currentModelId, target: currentModelId + 2, name: '影响' },
            { source: currentModelId + 1, target: currentModelId + 3, name: '影响' },
            { source: currentModelId + 2, target: currentModelId + 4, name: '影响' }
          );
          break;
      }
    }
    
    return { nodes, links };
  };

  // 使用D3渲染血缘关系图
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const container = d3.select(containerRef.current);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    
    // 清除旧的图形
    svg.selectAll('*').remove();
    
    // 设置SVG尺寸
    svg.attr('width', width).attr('height', height);
    
    // 创建力导向模拟
    const simulation = d3.forceSimulation(bloodlineData.nodes)
      .force('link', d3.forceLink(bloodlineData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    // 创建箭头标记
    svg.append('defs').selectAll('marker')
      .data(['arrow'])
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');
    
    // 创建边组
    const link = svg.append('g')
      .selectAll('line')
      .data(bloodlineData.links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');
    
    // 创建边标签
    const linkLabels = svg.append('g')
      .selectAll('text')
      .data(bloodlineData.links)
      .enter().append('text')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .text(d => d.name);
    
    // 创建节点组
    const node = svg.append('g')
      .selectAll('g')
      .data(bloodlineData.nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // 添加节点圆圈
    node.append('circle')
      .attr('r', 25)
      .attr('fill', d => d.isCurrent ? '#3b82f6' : d.type === 'datasource' ? '#10b981' : d.type === 'indicator' ? '#f59e0b' : '#6366f1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // 添加节点文本
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .attr('text-shadow', '0 1px 2px rgba(0,0,0,0.3)');
    
    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 5);
      
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // 拖拽函数
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [bloodlineData]);

  return (
    <div className="bloodline-analyzer">
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>血缘分析</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            className={bloodlineType === 'forward' ? 'active' : ''}
            onClick={() => setBloodlineType('forward')}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: bloodlineType === 'forward' ? '#007bff' : '#fff',
              color: bloodlineType === 'forward' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            正向血缘
          </button>
          <button 
            className={bloodlineType === 'reverse' ? 'active' : ''}
            onClick={() => setBloodlineType('reverse')}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: bloodlineType === 'reverse' ? '#007bff' : '#fff',
              color: bloodlineType === 'reverse' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            反向血缘
          </button>
          <button 
            className={bloodlineType === 'endToEnd' ? 'active' : ''}
            onClick={() => setBloodlineType('endToEnd')}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: bloodlineType === 'endToEnd' ? '#007bff' : '#fff',
              color: bloodlineType === 'endToEnd' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            端到端血缘
          </button>
          <button 
            className={bloodlineType === 'impact' ? 'active' : ''}
            onClick={() => setBloodlineType('impact')}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: bloodlineType === 'impact' ? '#007bff' : '#fff',
              color: bloodlineType === 'impact' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            影响分析
          </button>
        </div>
      </div>
      
      <div ref={containerRef} style={{ width: '100%', height: 'calc(100vh - 200px)', backgroundColor: '#fff' }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
      </div>
    </div>
  );
};

export default BloodlineAnalyzer;