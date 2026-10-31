import { Progress, Tag, Space } from 'antd';
import { useEpisodeStore } from '@/application/stores/episodeStore';

/** 视频任务进度（AntD Progress + 轮询，UT-FE-03 配合）。 */
export function VideoProgress() {
  const p = useEpisodeStore((s) => s.videoProgress);
  if (!p) {
    return <Space><Tag>视频进度</Tag><span style={{ fontSize: 12, color: '#888' }}>待提交任务</span></Space>;
  }
  const percent = p.total === 0 ? 0 : Math.round(((p.completed + p.failed) / p.total) * 100);
  return (
    <div data-testid="video-progress" style={{ width: 320 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12 }}>视频 {p.completed}/{p.total} 完成 {p.failed > 0 ? `· 失败 ${p.failed}` : ''}</span>
        <Tag color={p.all_completed ? 'green' : p.all_done ? 'orange' : 'blue'}>
          {p.all_completed ? '全部完成' : p.all_done ? '已结束' : '生成中'}
        </Tag>
      </Space>
      <Progress percent={percent} size="small" status={p.all_completed ? 'success' : 'active'} />
    </div>
  );
}
