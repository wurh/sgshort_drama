import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Input, InputNumber, Modal, Form, Space, Tag, App as AntdApp, Alert, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { listProjects, createProject } from '@/infrastructure/api/dramaApi';
import type { ProjectView } from '@/shared/types';

/** 项目管理：剧集列表 + 新建剧集（对标 Pavo /playlet/list）。M-C / TC-PR。 */
export function ProjectsPage() {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await listProjects();
      // 兜底：接口异常/信封缺失时绝不能把 undefined 塞进 state，否则渲染 .length 直接白屏
      setProjects(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setProjects([]);
      setLoadError(e?.message ?? '加载剧集列表失败');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepOf = (s: string) =>
    s === 'pending' ? 1 : s === 'asset_ready' || s === 'done_outline' ? 2 : s === 'done' ? 3 : 1;

  const submit = async () => {
    const v = await form.validateFields();
    setBusy(true);
    try {
      const p = await createProject({
        creative: v.creative,
        style: v.style,
        episode_count: v.episode_count,
        target_seconds: v.target_seconds,
      });
      message.success(`剧集已创建，进入大纲生成`);
      setOpen(false);
      navigate(`/projects/${p.id}/outline`);
    } catch (e: any) {
      message.error(e?.message ?? '创建失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="projects-page" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>我的剧集</h2>
        <Button type="primary" onClick={() => setOpen(true)}>
          + 新建剧集
        </Button>
      </div>

      {loadError && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message="加载剧集列表失败"
          description={loadError}
          action={
            <Button size="small" onClick={() => load()}>
              重试
            </Button>
          }
        />
      )}

      {loading ? (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <Spin />
        </Card>
      ) : projects.length === 0 ? (
        <Card style={{ textAlign: 'center', color: '#999' }}>还没有剧集，点击右上角新建</Card>
      ) : (
        <Row gutter={[16, 16]}>
          {projects.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => navigate(`/projects/${p.id}/outline`)}
                cover={
                  <div style={{ height: 90, background: p.cover_url ? `url(${p.cover_url}) center/cover` : 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', borderRadius: '8px 8px 0 0' }} />
                }
                actions={undefined}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <b style={{ fontSize: 14 }}>{p.title}</b>
                  <Tag color="blue">步骤 {stepOf(p.status)}</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#888', margin: '6px 0' }}>
                  {p.episode_count_actual || p.episode_count} 集 · 每集约 {p.target_seconds}s
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  状态：{p.status}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal title="新建剧集" open={open} onOk={submit} onCancel={() => setOpen(false)} confirmLoading={busy} okText="创建并生成大纲">
        <Form form={form} layout="vertical" initialValues={{ episode_count: 5, target_seconds: 90, style: '写实' }}>
          <Form.Item
            label="一句话创意 / 大纲"
            name="creative"
            rules={[{ required: true, min: 2, message: '创意至少 2 个字符' }]}
          >
            <Input.TextArea rows={3} placeholder="例如：底层服务员逆袭成豪门赘婿的复仇故事" />
          </Form.Item>
          <Form.Item label="风格" name="style">
            <Input placeholder="写实 / 古装 / 悬疑…" />
          </Form.Item>
          <Space>
            <Form.Item label="集数" name="episode_count">
              <InputNumber min={1} max={20} />
            </Form.Item>
            <Form.Item label="每集目标时长(秒)" name="target_seconds">
              <InputNumber min={30} max={600} step={15} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
