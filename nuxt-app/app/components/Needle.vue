<template>
	<svg id="needle" width="200" height="200" version="1.1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g id="layer1">
			<g id="g14" :transform="`rotate(${(props.angle * 180) / Math.PI},100,100)`">
				<path
					id="path2"
					d="m98.36902 73.45847-0.0068 17.93594-0.0018 17.28361 0.477533 17.43207 2.298335-7e-3 0.48619-17.43385 0.0141-17.28714 3e-3 -17.93064z"
					style="paint-order: markers fill stroke"
				/>
				<path
					id="path4"
					d="m98.37063 73.44803 3.262568-3e-3 -0.0361-8.819609c1.17666-0.503636 1.51532-1.43099 1.51009-2.532244l-0.59166-36.44575c-0.0274-1.046001-1.37509-2.759276-2.51117-3.948899-1.038039 1.103375-2.503448 2.828281-2.511008 3.93015l-0.598429 36.47383c-0.04277 1.326746 0.55061 2.053993 1.424558 2.517054z"
					fill="#fff"
					stop-color="#000000"
					style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: markers fill stroke"
				/>
				<path
					id="path4-3"
					d="m100.8197 61.01819-0.156-34.37093c-0.0103-0.912027-0.27575-1.347034-0.65134-2.11927-0.408253 0.772031-0.67196 1.142137-0.673979 2.102916l-0.15806 34.39539c-2.73e-4 0.926807 0.464567 1.078264 0.819444 1.078298 0.354925 6.8e-5 0.821345-0.126243 0.819935-1.086406z"
					fill="#8f8f8f"
					style="paint-order: markers fill stroke"
				/>
				<circle
					id="path14"
					cx="100"
					cy="100"
					r="9"
					style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: markers fill stroke"
				/>
			</g>
		</g>
	</svg>
</template>

<script setup>
const props = defineProps({
	angle: {
		type: Number,
		required: false,
		default: 0,
	},
});
console.log('props.angle', props.angle);
</script>
