import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCapturedFramesStore = defineStore('capturedFrames', () => {
	const frames = ref<CaptureFrame[]>([]);

	function addFrames(newFrames: CaptureFrame[]) {
		frames.value.push(...newFrames);
	}

	function clearFrames() {
		frames.value = [];
	}

	if (typeof window !== 'undefined') {
		addMessageListener((payload: any) => {
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
