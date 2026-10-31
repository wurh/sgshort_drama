import { theme, type ThemeConfig } from 'antd';

/**
 * 全局深色主题令牌（对齐设计稿）。
 * 近黑底 + 青绿主色 + 大圆角；集中在此处，避免各页面散落硬编码色值。
 */
export const palette = {
  /** 页面底色（近黑）。 */
  bg: '#0a0b0c',
  /** 卡片底色。 */
  surface: '#141617',
  /** 次级卡片 / 输入框底色。 */
  surface2: '#1b1e20',
  /** 悬浮 / hover。 */
  surface3: '#23272a',
  border: '#262a2d',
  borderLight: '#33383c',
  /** 主色：青绿。 */
  primary: '#2ed3c6',
  primaryDim: '#1d8e86',
  /** 主色渐变（新增条）。 */
  primaryGlow: 'linear-gradient(100deg, #10312e 0%, #16211f 60%, #141a19 100%)',
  text: '#e9ecee',
  textSub: '#9aa1a6',
  textDim: '#6b7379',
  danger: '#ff6b6b',
  warn: '#ffb454',
  success: '#4ade80',
} as const;

/** antd 主题配置。 */
export const appTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: palette.primary,
    colorInfo: palette.primary,
    colorBgBase: palette.bg,
    colorBgContainer: palette.surface,
    colorBgElevated: palette.surface2,
    colorBorder: palette.border,
    colorBorderSecondary: palette.border,
    colorText: palette.text,
    colorTextSecondary: palette.textSub,
    colorTextTertiary: palette.textDim,
    borderRadius: 10,
    borderRadiusLG: 16,
    fontSize: 13,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif',
    controlHeight: 32,
  },
  components: {
    Button: {
      borderRadius: 999,
      defaultBg: palette.surface3,
      defaultBorderColor: palette.borderLight,
      primaryColor: '#04201e',
      fontWeight: 500,
    },
    Card: {
      colorBgContainer: palette.surface,
      borderRadiusLG: 16,
    },
    Input: {
      colorBgContainer: palette.surface2,
      activeBorderColor: palette.primary,
      hoverBorderColor: palette.borderLight,
    },
    Select: {
      colorBgContainer: palette.surface2,
      optionSelectedBg: palette.surface3,
    },
    Tabs: {
      itemColor: palette.textSub,
      itemSelectedColor: palette.text,
      inkBarColor: 'transparent',
    },
    Switch: {
      colorPrimary: palette.primary,
      colorPrimaryHover: palette.primary,
    },
    Modal: {
      contentBg: '#101213',
      headerBg: '#101213',
      borderRadiusLG: 20,
    },
    Empty: {
      colorTextDescription: palette.textDim,
    },
  },
};

/** 胶囊 Tab 的通用样式（资产列表 / 详情页形象 Tab 共用）。 */
export const pillTabStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 32,
  padding: '0 14px',
  borderRadius: 999,
  cursor: 'pointer',
  fontSize: 13,
  whiteSpace: 'nowrap',
  color: active ? palette.text : palette.textSub,
  background: active ? palette.surface3 : 'transparent',
  border: `1px solid ${active ? palette.borderLight : 'transparent'}`,
  transition: 'all .16s ease',
});