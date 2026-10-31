import { Avatar, Button, Space, Tooltip } from 'antd';
import { ArrowLeftOutlined, CrownFilled, FireFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { StepBar } from './StepBar';
import { palette } from '../theme';

/**
 * 顶部导航壳（对齐设计稿）：
 * 左：返回箭头 + 项目名；中：三步步骤条；右：积分胶囊 + 升级按钮 + 头像。
 */
export function AppHeader({
  projectTitle,
  step,
  onStep,
  backTo = '/projects',
}: {
  projectTitle: string;
  step: number;
  onStep: (i: number) => void;
  backTo?: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      data-testid="app-header"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: 16,
        height: 56,
        padding: '0 18px',
        borderBottom: `1px solid ${palette.border}`,
        background: '#0c0e0f',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <Space size={10} style={{ minWidth: 0 }}>
        <Button
          type="text"
          size="small"
          data-testid="header-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(backTo)}
          style={{ color: palette.textSub }}
        />
        <span
          data-testid="header-title"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: palette.text,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {projectTitle}
        </span>
      </Space>

      <div style={{ justifySelf: 'center' }}>
        <StepBar current={step} onStep={onStep} />
      </div>

      <Space size={10} style={{ justifySelf: 'end' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 28,
            padding: '0 12px',
            borderRadius: 999,
            background: '#15403a',
            color: palette.primary,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <FireFilled style={{ fontSize: 11 }} />
          100
        </span>
        <Button
          size="small"
          icon={<CrownFilled style={{ color: '#f0c14b' }} />}
          style={{
            borderRadius: 999,
            background: '#1d2124',
            borderColor: palette.borderLight,
            color: palette.text,
            height: 28,
            fontSize: 12,
          }}
        >
          升级
        </Button>
        <Tooltip title="账户">
          <Avatar
            size={28}
            src={undefined}
            style={{ background: '#e8b4a0', color: '#5b3428', fontSize: 12, flex: 'none' }}
          >
            A
          </Avatar>
        </Tooltip>
      </Space>
    </div>
  );
}