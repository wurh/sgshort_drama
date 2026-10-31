import { useEffect, useState } from 'react';
import { Card, Button, Space, Tag, App as AntdApp, Spin, Input, Typography, List } from 'antd';
import { getOutline, generateOutline, saveOutline } from '@/infrastructure/api/dramaApi';
import type { OutlineView } from '@/shared/types';

const { Text, Paragraph } = Typography;

/** 步骤 1 剧本大纲：创意→大纲生成、分集卡片、角色/场景/道具草稿编辑。M-D / TC-OL。 */
export function OutlinePage({ projectId }: { projectId: number }) {
  const { message } = AntdApp.useApp();
  const [view, setView] = useState<OutlineView | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [epTitles, setEpTitles] = useState<string[]>([]);

  const load = async () => {
    const v = await getOutline(projectId);
    if (v) {
      setView(v);
      setEpTitles(Array.isArray(v.episodes) ? v.episodes.map((e) => e.title) : []);
    }
  };
  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const generate = async () => {
    setBusy(true);
    try {
      const v = await generateOutline(projectId);
      setView(v);
      setEpTitles(v.episodes.map((e) => e.title));
      message.success(`大纲已生成：${v.episodes.length} 集`);
    } catch (e: any) {
      // 优先展示服务端 msg（已区分「未配置 Key」与「模型调用失败」），不用笼统兜底
      message.error(e?.message ?? '大纲生成失败，请稍后重试');
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!view) return;
    setBusy(true);
    try {
      const v = await saveOutline(projectId, {
        ...view,
        episodes: view.episodes.map((e, i) => ({ ...e, title: epTitles[i] ?? e.title })),
      });
      setView(v);
      setEditing(false);
      message.success('大纲已保存');
    } catch (e: any) {
      message.error(e?.message ?? '保存失败');
    } finally {
      setBusy(false);
    }
  };

  if (busy && !view) return <Spin style={{ display: 'block', padding: 48 }} />;

  return (
    <div data-testid="outline-page">
      <Card
        title="步骤 1 · 剧本大纲"
        extra={
          <Space>
            <Button type="primary" loading={busy} onClick={generate}>
              {view ? '重新生成大纲' : '生成大纲'}
            </Button>
            {view &&
              (editing ? (
                <Button onClick={save}>保存</Button>
              ) : (
                <Button onClick={() => setEditing(true)}>编辑</Button>
              ))}
          </Space>
        }
      >
        {view ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <List
              header={<Text strong>分集卡片（{view.episodes.length} 集）</Text>}
              dataSource={view.episodes}
              renderItem={(e, i) => (
                <List.Item
                  key={i}
                  actions={editing ? [<Input key="t" value={epTitles[i]} onChange={(ev) => setEpTitles((p) => p.map((x, j) => (j === i ? ev.target.value : x)))} style={{ width: 160 }} size="small" />] : [
                    <Tag key="s">{e.seconds}s</Tag>,
                  ]}
                >
                  <List.Item.Meta
                    title={editing ? null : <span>#{i + 1} {e.title}</span>}
                    description={
                      <div style={{ fontSize: 12 }}>
                        <Paragraph style={{ margin: 0, fontSize: 12 }}>{e.summary}</Paragraph>
                        {e.characters.length > 0 && <Text type="secondary" style={{ fontSize: 11 }}>角色：{e.characters.join('、')}</Text>}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />

            <div>
              <Text strong>角色草稿（{view.characters.length}）</Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {view.characters.map((c) => (
                  <Tag key={c.name}>{c.name}</Tag>
                ))}
              </div>
            </div>
            <div>
              <Text strong>场景草稿（{view.scenes.length}）</Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {view.scenes.map((s) => (
                  <Tag key={s.name} color="green">{s.name}</Tag>
                ))}
              </div>
            </div>
            <div>
              <Text strong>道具草稿（{view.props.length}）</Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {view.props.map((p) => (
                  <Tag key={p.name} color="orange">{p.name}</Tag>
                ))}
              </div>
            </div>
            <Text type="success" style={{ fontSize: 12 }}>
              ✓ 草稿已自动同步到资产库（步骤 2）
            </Text>
          </div>
        ) : (
          <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
            点击「生成大纲」，一句话创意将拆成完整分集大纲 + 角色/场景/道具草稿。
          </div>
        )}
      </Card>
    </div>
  );
}
