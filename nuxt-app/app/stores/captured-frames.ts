import { defineStore } from 'pinia';
import { ref } from 'vue';
import { CLEAR_FRAMES, FRAME } from '~~/shared/app-state';
import type { MessagePayload } from '~~/shared/types/message.ts';

export const useCapturedFramesStore = defineStore('capturedFrames', () => {
	const frames = ref<CaptureFrame[]>([]);

	function addFrames(newFrames: CaptureFrame[]) {
		frames.value.push(...newFrames);
	}

	function clearFrames() {
		frames.value = [];
	}

	if (typeof window !== 'undefined') {
		addMessageListener((payload: MessagePayload) => {
			if (payload.type === FRAME) {
				addFrames(payload.data);
			} else if (payload.type === CLEAR_FRAMES) {
				clearFrames();
			}
		});
	}

	return {
		frames,
	};
});
