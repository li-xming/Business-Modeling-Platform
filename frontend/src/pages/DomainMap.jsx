import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'

const DomainMap = () => {
  const navigate = useNavigate()
  const [domains, setDomains] = useState([])
  const [edges, setEdges] = useState([])
  const [hoveredDomain, setHoveredDomain] = useState(null)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newDomain, setNewDomain] = useState({ name: '', description: '', owner: '' })
  const [isExpanded, setIsExpanded] = useState(false)
  const [allData, setAllData] = useState({ domains: [], models: [], edges: [] })
  const [hoveredNodeId, setHoveredNodeId] = useState(null)
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const timerRef = useRef(null)

  // 从API获取数据
  useEffect(() => {
    // 获取域数据
    fetch('/api/domain/list')
      .then(response => response.json())
      .then(domainData => {
        // 获取模型数据
        fetch('/api/model')
          .then(response => response.json())
          .then(modelData => {
            // 处理模型数据和边数据
            const allModels = modelData.models || modelData
            const modelEdges = modelData.edges || []
            
            setAllData({
              domains: domainData.domains,
              models: allModels,
              edges: [...domainData.edges, ...modelEdges]
            })
            setDomains(domainData.domains)
            setEdges(domainData.edges)
          })
          .catch(error => console.error('Failed to fetch models:', error))
      })
      .catch(error => console.error('Failed to fetch domains:', error))
  }, [])

  // 使用D3渲染力导向图
  useEffect(() => {
    if (!svgRef.current || allData.domains.length === 0) return

    const svg = d3.select(svgRef.current)
    const container = d3.select(containerRef.current)
    const width = container.node().clientWidth
    const height = container.node().clientHeight

    // 清除旧的图形
    svg.selectAll('*').remove()

    // 准备数据，为不同类型节点添加唯一ID前缀
    let nodes = []
    let links = []

    // 搜索过滤函数
    const matchesSearch = (name) => {
      return name.toLowerCase().includes(searchTerm.toLowerCase())
    }

    // 处理业务域节点，添加domain_前缀
    allData.domains.forEach(domain => {
      if (matchesSearch(domain.name)) {
        nodes.push({
          ...domain,
          originalId: domain.id,
          id: `domain_${domain.id}`,
          type: 'domain'
        })
      }
    })

    // 获取所有保留的域ID
    const retainedDomainIds = new Set(nodes.map(node => {
      if (node.type === 'domain') return node.originalId
    }).filter(Boolean))

    // 处理域之间的边，确保只添加存在的节点之间的边
    allData.edges.forEach(edge => {
      // 只添加两个节点都存在的边
      if (retainedDomainIds.has(edge.source) && retainedDomainIds.has(edge.target)) {
        links.push({
          source: `domain_${edge.source}`,
          target: `domain_${edge.target}`
        })
      }
    })

    if (isExpanded) {
      // 展开到模型级别，为模型节点添加model_前缀
      allData.models.forEach(model => {
        // 显示匹配搜索的模型或属于匹配域的模型
        if (matchesSearch(model.name) || retainedDomainIds.has(model.domainId)) {
          nodes.push({
            ...model,
            originalId: model.id,
            id: `model_${model.id}`,
            type: 'model'
          })
          
          // 添加域到模型的边
          links.push({
            source: `domain_${model.domainId}`,
            target: `model_${model.id}`
          })
        }
      })
      
      // 获取所有保留的模型ID
      const retainedModelIds = new Set(nodes.map(node => {
        if (node.type === 'model') return node.originalId
      }).filter(Boolean))

      // 处理模型之间的边
      allData.edges.forEach(edge => {
        // 只添加两个模型节点都存在的边
        if (retainedModelIds.has(edge.source) && retainedModelIds.has(edge.target)) {
          links.push({
            source: `model_${edge.source}`,
            target: `model_${edge.target}`
          })
        }
      })
    }
    
    // 创建力导向模拟
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(isExpanded ? 100 : 150))
      .force('charge', d3.forceManyBody().strength(isExpanded ? -300 : -500))
      .force('center', d3.forceCenter(width / 2, height / 2))
    
    // 查找相关节点的函数
    const findRelatedNodes = (nodeId) => {
      const relatedNodeIds = new Set()
      relatedNodeIds.add(nodeId)
      
      // 查找直接连接的节点
      links.forEach(link => {
        if (link.source.id === nodeId || link.target.id === nodeId) {
          relatedNodeIds.add(link.source.id)
          relatedNodeIds.add(link.target.id)
        }
      })
      
      return relatedNodeIds
    }

    // 添加渐变定义
    const defs = svg.append('defs')
    
    // 业务域渐变
    defs.append('linearGradient')
      .attr('id', 'domainGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#3b82f6' },
        { offset: '100%', color: '#2563eb' }
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
    
    // 模型渐变
    defs.append('linearGradient')
      .attr('id', 'modelGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#10b981' },
        { offset: '100%', color: '#059669' }
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
    
    // 连线渐变
    defs.append('linearGradient')
      .attr('id', 'linkGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#3b82f6', opacity: 0.8 },
        { offset: '100%', color: '#10b981', opacity: 0.8 }
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
      .attr('stop-opacity', d => d.opacity)

    // 创建边
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('class', 'sci-fi-link')

    // 创建节点组
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', d => `sci-fi-node ${d.type}-node`)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // 添加节点圆圈
    nodeGroup.append('circle')
      .attr('r', d => d.type === 'model' ? 25 : 30) // 模型节点小一些

    // 节点文本
    nodeGroup.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'model' ? 3 : 4)
      .attr('font-size', d => d.type === 'model' ? 11 : 12)
      .attr('fill', 'white')

    // 鼠标事件处理
    nodeGroup.on('click', (event, d) => {
      event.stopPropagation()
      setHoveredDomain(d)
      setIsDrawerVisible(!isDrawerVisible)
    })

    nodeGroup.on('dblclick', (event, d) => {
      event.stopPropagation()
      if (d.type === 'model') {
        // 模型节点，跳转到模型详情
        navigate(`/model/${d.originalId}`)
      } else {
        // 域节点，跳转到域工作台
        navigate(`/domain/${d.originalId}`)
      }
    })
    
    // 鼠标悬停事件 - 高亮相关节点
    nodeGroup.on('mouseover', (event, d) => {
      const relatedNodeIds = findRelatedNodes(d.id)
      
      // 高亮当前节点和相关节点，其他节点置灰
      nodeGroup.style('opacity', node => {
        return relatedNodeIds.has(node.id) ? 1 : 0.2
      })
      
      // 高亮当前节点和相关节点的圆圈和文本
      nodeGroup.select('circle').style('opacity', node => {
        return relatedNodeIds.has(node.id) ? 1 : 0.2
      })
      
      nodeGroup.select('text').style('opacity', node => {
        return relatedNodeIds.has(node.id) ? 1 : 0.2
      })
      
      // 高亮相关边，其他边置灰
      link.style('opacity', edge => {
        return relatedNodeIds.has(edge.source.id) && relatedNodeIds.has(edge.target.id) ? 0.8 : 0.1
      })
    })
    
    // 鼠标移出事件 - 恢复所有节点和边的透明度
    nodeGroup.on('mouseout', () => {
      nodeGroup.style('opacity', 1)
      nodeGroup.select('circle').style('opacity', 1)
      nodeGroup.select('text').style('opacity', 1)
      link.style('opacity', 0.8)
    })
    
    // 添加画布点击事件，点击空白处收起信息窗
    svg.on('click', () => {
      setIsDrawerVisible(false)
    })

    // 力导向模拟更新
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      nodeGroup
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
    })

    // 拖拽函数
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // 窗口大小变化时重新绘制
    const handleResize = () => {
      const newWidth = container.node().clientWidth
      const newHeight = container.node().clientHeight
      svg.attr('width', newWidth).attr('height', newHeight)
      simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
      simulation.alpha(0.3).restart()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [allData, isExpanded, searchTerm])

  // 处理新建域
  const handleCreateDomain = () => {
    fetch('/api/domain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDomain)
    })
      .then(response => response.json())
      .then(domain => {
        setDomains([...domains, domain])
        setIsModalOpen(false)
        setNewDomain({ name: '', description: '', owner: '' })
      })
      .catch(error => console.error('Failed to create domain:', error))
  }

  // 处理导出
  const handleExport = () => {
    const data = {
      domains,
      edges
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'domains.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 快捷键处理
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault()
        setIsModalOpen(true)
      } else if (event.ctrlKey && event.key === 'e') {
        event.preventDefault()
        handleExport()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [domains, edges])

  return (
    <div className="domain-map">
      {/* 面包屑 */}
      <div style={{ padding: '12px 16px', backgroundColor: '#f0f2f5', borderBottom: '1px solid #e0e0e0' }}>
        <span style={{ cursor: 'pointer', color: '#1890ff' }}>业务域地图</span>
      </div>
      
      {/* 头部工具栏 */}
      <div className="header-toolbar">
        <input
          type="text"
          placeholder="搜索域名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '收起模型' : '展开到模型级别'}
        </button>
        <button onClick={() => setIsModalOpen(true)}>新建域</button>
        <button onClick={handleExport}>导出</button>
      </div>

      {/* 画布容器 */}
      <div ref={containerRef} className="canvas-container">
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>

      {/* 悬停抽屉 */}
      <div className={`hover-drawer ${isDrawerVisible ? 'visible' : ''}`}>
        {hoveredDomain && (
          <div style={{ padding: '16px' }}>
            <h3>{hoveredDomain.name}</h3>
            <p>描述: {hoveredDomain.description}</p>
            <p>负责人: {hoveredDomain.owner}</p>
            <p>最近变更: {hoveredDomain.updatedAt}</p>
            <button
              className="enter-domain-btn"
              onClick={() => navigate(`/domain/${hoveredDomain.originalId}`)}
            >
              进入该域
            </button>
          </div>
        )}
      </div>

      {/* 新建域模态框 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>新建业务域</h2>
            <div className="form-group">
              <label>名称</label>
              <input
                type="text"
                value={newDomain.name}
                onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>描述</label>
              <textarea
                value={newDomain.description}
                onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
              ></textarea>
            </div>
            <div className="form-group">
              <label>负责人</label>
              <input
                type="text"
                value={newDomain.owner}
                onChange={(e) => setNewDomain({ ...newDomain, owner: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button className="cancel" onClick={() => setIsModalOpen(false)}>取消</button>
              <button className="submit" onClick={handleCreateDomain}>确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DomainMap