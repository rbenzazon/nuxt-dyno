<template>
	<RpmDialNeedle :angle="angle" />
	<svg ref="svgRef" width="200" height="200" />
	<span>{{ rpm }}</span>
</template>

<script setup>
import * as d3 from 'd3';
import { onMounted, useTemplateRef } from 'vue';
const props = defineProps({
	rpm: {
		type: Number,
		required: true,
	},
	unit: {
		type: String,
		required: false,
		default: 'x1000',
	},
	min: {
		type: Number,
		required: false,
		default: 0,
	},
	max: {
		type: Number,
		required: false,
		default: 10000,
	},
	yellowline: {
		type: Number,
		required: false,
		default: 8000,
	},
	redline: {
		type: Number,
		required: false,
		default: 9000,
	},
});
const startAngle = Math.PI;
const endAngle = 2.5 * Math.PI;
const majorAngle = (endAngle - startAngle) / (props.max / 1000);

const angle = computed(() => (props.rpm / props.max) * (endAngle - startAngle) - Math.PI);

const svgRef = useTemplateRef('svgRef');
const gRef = ref(null);
let arc;

function createDial() {
	//create a rpm dial using d3
	const svg = d3.select(svgRef.value);
	const width = svg.attr('width');
	const height = svg.attr('height');
	const radius = Math.min(width, height) / 2 - 10;

	const majorGraduations = new Array(props.max / 1000 + 1).fill(0).map((_, i) => i);

	gRef.value = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

	arc = d3
		.arc()
		.innerRadius(radius - 35)
		.outerRadius(radius - 40)
		.startAngle(startAngle)
		.endAngle(endAngle);

	gRef.value.append('path').datum({ endAngle }).style('fill', 'grey').attr('d', arc);

	const yellowArc = d3
		.arc()
		.innerRadius(radius - 10)
		.outerRadius(radius)
		.startAngle(startAngle + ((props.yellowline - props.min) / (props.max - props.min)) * (endAngle - startAngle))
		.endAngle(startAngle + ((props.redline - props.min) / (props.max - props.min)) * (endAngle - startAngle));
	gRef.value.append('path').datum({ endAngle: yellowArc.endAngle() }).style('fill', 'yellow').attr('d', yellowArc);

	const redArc = d3
		.arc()
		.innerRadius(radius - 10)
		.outerRadius(radius)
		.startAngle(startAngle + ((props.redline - props.min) / (props.max - props.min)) * (endAngle - startAngle))
		.endAngle(endAngle);
	gRef.value.append('path').datum({ endAngle: redArc.endAngle() }).style('fill', 'red').attr('d', redArc);

	majorGraduations.forEach((graduation, index) => {
		const angle = startAngle + graduation * majorAngle - Math.PI / 2;
		const x1 = (radius - 10) * Math.cos(angle);
		const y1 = (radius - 10) * Math.sin(angle);
		const x2 = radius * Math.cos(angle);
		const y2 = radius * Math.sin(angle);

		gRef.value
			.append('line')
			.attr('x1', x1)
			.attr('y1', y1)
			.attr('x2', x2)
			.attr('y2', y2)
			.attr('stroke', '#000')
			.attr('stroke-width', 2);

		// Add labels for major graduations
		const labelX = (radius - 20) * Math.cos(angle);
		const labelY = (radius - 20) * Math.sin(angle);
		gRef.value
			.append('text')
			.attr('x', labelX)
			.attr('y', labelY + 6)
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
			.attr('font-size', '15px')
			.attr('font-family', 'Vipnagorgialla')
			.text(graduation);

		if (index < majorGraduations.length - 1) {
			for (let i = 1; i < 5; i++) {
				const minorAngle = angle + i * (majorAngle / 5);
				const mx1 = (radius - 5) * Math.cos(minorAngle);
				const my1 = (radius - 5) * Math.sin(minorAngle);
				const mx2 = radius * Math.cos(minorAngle);
				const my2 = radius * Math.sin(minorAngle);
				gRef.value
					.append('line')
					.attr('x1', mx1)
					.attr('y1', my1)
					.attr('x2', mx2)
					.attr('y2', my2)
					.attr('stroke', '#000')
					.attr('stroke-width', 1);
			}
		}
	});

	gRef.value
		.append('text')
		.attr('x', 32)
		.attr('y', 3)
		.attr('text-anchor', 'middle')
		.attr('alignment-baseline', 'middle')
		.attr('font-size', '10px')
		.attr('font-family', 'Vipnagorgialla')
		.text('RPM');

	gRef.value
		.append('text')
		.attr('x', 31)
		.attr('y', 10)
		.attr('text-anchor', 'middle')
		.attr('alignment-baseline', 'middle')
		.attr('font-size', '7px')
		.attr('font-family', 'Vipnagorgialla')
		.text(props.unit);
}

onMounted(() => {
	createDial();
});
</script>

<style scoped>
#needle {
	position: absolute;
	/* drop shadow */
	filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
}
span {
	font-weight: bold;
	font-size: 22px;
	color: #333;
	position: absolute;
	left: 250px;
	top: 308px;
}
</style>
