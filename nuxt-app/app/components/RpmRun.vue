<template>
	<RpmDialNeedle :angle="angle" />
	<svg ref="svgRef" width="200" height="200"></svg>
	<span>{{ rpm }}</span>
</template>

<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted, useTemplateRef } from 'vue';

const props = withDefaults(
	defineProps<{
		rpm: number;
		unit?: string;
		min?: number;
		max?: number;
		yellowline?: number;
		redline?: number;
	}>(),
	{
		unit: 'x1000',
		min: 0,
		max: 10000,
		yellowline: 8000,
		redline: 9000,
	},
);

const startAngle = Math.PI;
const endAngle = 2.5 * Math.PI;

const angle = computed(() => (props.rpm / props.max) * (endAngle - startAngle) - Math.PI);

const svgRef = useTemplateRef('svgRef');
const gRef = ref<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
let arc;

function isSVGElement(element: SVGSVGElement | null): element is SVGSVGElement {
	return element != null && element instanceof SVGSVGElement;
}
function isSVGElementSelection(
	element: d3.Selection<SVGSVGElement, unknown, null, undefined> | null,
): element is d3.Selection<SVGSVGElement, unknown, null, undefined> {
	return element != null;
}

function createDial() {
	//create a rpm dial using d3
	if (!isSVGElement(svgRef.value)) return;
	const svg = d3.select(svgRef.value);
	if (!isSVGElementSelection(svg)) return;
	console.log(svg);
	const width = Number(svg.attr('width'));
	const height = Number(svg.attr('height'));
	const radius = Math.min(width, height) / 2 - 10;
	const majorAngle = (endAngle - startAngle) / (props.max / 1000);

	const majorGraduations = new Array(props.max / 1000 + 1).fill(0).map((_, i) => i);

	gRef.value = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

	arc = d3.arc()({
		innerRadius: radius - 35,
		outerRadius: radius - 40,
		startAngle: startAngle,
		endAngle: endAngle,
	});
	/*
		.innerRadius(radius - 35)
		.outerRadius(radius - 40)
		.startAngle(startAngle)
		.endAngle(endAngle);)*/

	gRef.value.append('path').datum({ endAngle }).style('fill', 'grey').attr('d', arc);

	const yellowEndAngle = startAngle + ((props.redline - props.min) / (props.max - props.min)) * (endAngle - startAngle);
	const yellowArc = d3.arc()({
		innerRadius: radius - 10,
		outerRadius: radius,
		startAngle: startAngle + ((props.yellowline - props.min) / (props.max - props.min)) * (endAngle - startAngle),
		endAngle: yellowEndAngle,
	});
	gRef.value.append('path').datum({ endAngle: yellowEndAngle }).style('fill', 'yellow').attr('d', yellowArc);

	const redEndAngle = endAngle;
	const redArc = d3.arc()({
		innerRadius: radius - 10,
		outerRadius: radius,
		startAngle: startAngle + ((props.redline - props.min) / (props.max - props.min)) * (endAngle - startAngle),
		endAngle: redEndAngle,
	});
	gRef.value.append('path').datum({ endAngle: redEndAngle }).style('fill', 'red').attr('d', redArc);

	majorGraduations.forEach((graduation, index) => {
		if (!gRef.value) return;
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

watch(
	() => props.max,
	() => {
		d3.select(svgRef.value).selectAll('*').remove();
		createDial();
	},
);
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
