import { Steps } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { palette } from '../theme';

/** 3 步骤条导航：剧本大纲 → 资产库 → 分集视频（胶囊状态点，对齐设计稿）。 */
export function StepBar({
  current,
  onStep,
}: {
  current: number; // 0 大纲 / 1 资产 / 2 分集
  onStep: (i: number) => void;
}) {
  const items = [
    { title: '剧本大纲', key: 'outline' },
    { title: '资产库', key: 'assets' },
    { title: '分集视频', key: 'episodes' },
  ];
  return (
    <div data-testid="stepbar" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Steps
        size="small"
        labelPlacement="horizontal"
        current={current}
        items={items.map((it, i) => ({
          title: it.title,
          icon:
            i < current ? (
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: palette.primary,
                  color: '#04201e',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                }}
              >
                <CheckOutlined />
              </span>
            ) : undefined,
          onClick: () => onStep(i),
        }))}
        // 设计稿：进行中为白字 + 青绿圆点，未到达为灰字
        style={{ background: 'transparent' }}
      />
    </div>
  );
}