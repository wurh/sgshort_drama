import { useEffect, useRef } from 'react';
import { Tag } from 'antd';
import { useProjectStore } from '@/application/stores/projectStore';

/** SSE 过程流折叠展示（复刻 sghouse EventLog：think/tool 细分 + 自动滚动）。 */
const STAGE_TAG: Record<string, string> = {
  outline: '大纲',
  outline_retry: '重试',
  asset: '资产',
  keyframe: '分镜',
  image: '出图',
  video: '视频',
  splice: '拼接',
  download: '下载',
  plan: '规划',
  load_image: '读图',
  write_file: '落盘',
};

export function EventLog() {
  const events = useProjectStore((s) => s.events);
  const sseOpen = useProjectStore((s) => s.sseOpen);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 自动滚到底
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [events.length]);

  if (events.length === 0) {
    return <div style={{ color: '#888', fontSize: 12 }}>暂无过程日志（SSE {sseOpen ? '连接中' : '未连接'}）</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 6, fontSize: 12, color: sseOpen ? '#2f9e44' : '#888' }}>
        ● {sseOpen ? '实时' : '已断开'} · 共 {events.length} 条
      </div>
      <div ref={boxRef} style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #eee', borderRadius: 6, padding: 8 }}>
        {events.map((e, i) => (
          <div key={i} style={{ fontSize: 12, padding: '2px 0', display: 'flex', gap: 6, alignItems: 'center' }}>
            {e.stage && <Tag color={e.type === 'done' ? 'green' : 'blue'} style={{ fontSize: 10, margin: 0 }}>
              {STAGE_TAG[e.stage] ?? e.type}
            </Tag>}
            <span style={{ color: e.type === 'done' ? '#2f9e44' : '#333' }}>{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
