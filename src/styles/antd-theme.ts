import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
	token: {
		colorPrimary: '#7ea7cb',
		colorInfo: '#7ea7cb',
		colorBorder: '#d8e4ee',
		colorText: '#334155',
		colorTextPlaceholder: '#94a3b8',
		colorBgContainer: '#ffffff',
		colorBgElevated: 'rgba(255,255,255,0.96)',
		borderRadius: 14,
		borderRadiusLG: 18,
		controlHeight: 46,
		controlHeightLG: 50,
		boxShadowSecondary: '0 18px 40px rgba(148,163,184,0.14)',
	},
	components: {
		Form: {
			labelColor: '#64748b',
			labelFontSize: 12,
			labelHeight: 20,
			verticalLabelPadding: '0 0 8px',
		},
		Input: {
			hoverBorderColor: '#b3cbdf',
			activeBorderColor: '#7ea7cb',
			activeShadow: '0 0 0 4px rgba(126,167,203,0.14)',
		},
		InputNumber: {
			hoverBorderColor: '#b3cbdf',
			activeBorderColor: '#7ea7cb',
			activeShadow: '0 0 0 4px rgba(126,167,203,0.14)',
		},
		Select: {
			hoverBorderColor: '#b3cbdf',
			activeBorderColor: '#7ea7cb',
			activeOutlineColor: 'rgba(126,167,203,0.14)',
			optionSelectedBg: '#edf4fa',
			optionActiveBg: '#f5f8fb',
		},
		DatePicker: {
			hoverBorderColor: '#b3cbdf',
			activeBorderColor: '#7ea7cb',
			activeShadow: '0 0 0 4px rgba(126,167,203,0.14)',
			cellActiveWithRangeBg: '#edf4fa',
		},
	},
};
