import { defineStore } from 'pinia';
import { ref } from 'vue';
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
			if (payload.type === 'frame') {
				addFrames(payload.data);
			} else if (payload.type === 'clearFrames') {
				clearFrames();
			}
		});
	}

	return {
		frames,
	};
});
