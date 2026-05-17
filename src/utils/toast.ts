import { message, notification } from 'antd';
import type { ReactNode } from 'react';

type ToastOptions = {
	autoClose?: false | number;
	toastId?: string;
	closeOnClick?: boolean;
	draggable?: boolean;
};

const activeNotifications = new Set<string>();

const getDuration = (autoClose?: false | number): number | undefined => {
	if (autoClose === false) {
		return 0;
	}

	if (typeof autoClose === 'number') {
		return autoClose / 1000;
	}

	return undefined;
};

const getNotificationPayload = (content: ReactNode, options?: ToastOptions) => ({
	key: options?.toastId,
	message: typeof content === 'string' ? content : 'Informasi',
	description: typeof content === 'string' ? undefined : content,
	placement: 'top' as const,
	duration: getDuration(options?.autoClose),
	onClose: () => {
		if (options?.toastId) {
			activeNotifications.delete(options.toastId);
		}
	},
});

export const toast = {
	success(content: ReactNode) {
		return message.success(content);
	},
	error(content: ReactNode) {
		return message.error(content);
	},
	info(content: ReactNode, options?: ToastOptions) {
		if (options?.toastId) {
			if (activeNotifications.has(options.toastId)) {
				return;
			}

			activeNotifications.add(options.toastId);
		}

		return notification.info(getNotificationPayload(content, options));
	},
	dismiss(key?: string) {
		if (key) {
			activeNotifications.delete(key);
			notification.destroy(key);
			return;
		}

		activeNotifications.clear();
		notification.destroy();
		message.destroy();
	},
	isActive(key: string) {
		return activeNotifications.has(key);
	},
};
