<template>
	<svg ref="svgRef" class="dyno-curve" width="100%" height="300"></svg>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue';
import * as d3 from 'd3';

const props = withDefaults(
	defineProps<{
		points: Point[];
		minY?: number;
		maxY?: number;
	}>(),
	{
		minY: 0,
		maxY: 100,
	},
);
const svgRef = ref<SVGSVGElement | null>(null);

let width = 400;
let height = 300;
const margin = { top: 25, right: 20, bottom: 25, left: 60 };

let line: d3.Line<Point>;
let xScale: d3.ScaleLinear<number, number>;
let yScale: d3.ScaleLinear<number, number>;
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

function drawCurve(points: Point[]) {
	if (!points.length) return;
	// Clear previous content
	svg.selectAll('*').remove();

	// Update scales based on data and margins
	xScale.range([margin.left, width - margin.right]);
	yScale.range([height - margin.bottom, margin.top]);
	xScale.domain(d3.extent(points, (d) => d.x) as [number, number]);
	yScale.domain([props.minY, props.maxY]);

	const rpmGraduations = new Array(Math.ceil(props.maxY / 1000) + 1).fill(0).map((_, i) => i);

	const startTime = points[0].x;
	const endTime = points[points.length - 1].x;

	const lengthInSeconds = (endTime - startTime) / 1000;

	const timeGraduations = new Array(Math.floor(lengthInSeconds) + 1).fill(0).map((_, i) => i);

	//draw a rect representing the innerwidth and innerheight
	//only outline and no fill
	svg
		.append('rect')
		.attr('x', margin.left)
		.attr('y', margin.top)
		.attr('width', width - margin.left - margin.right)
		.attr('height', height - margin.top - margin.bottom)
		.attr('fill', 'none')
		.attr('stroke', '#f0f0f0');

	// Draw graduations
	rpmGraduations.forEach((i) => {
		const y = yScale(i * 1000);
		svg
			.append('line')
			.attr('x1', margin.left)
			.attr('y1', y)
			.attr('x2', width - margin.right)
			.attr('y2', y)
			.attr('stroke', '#ccc')
			.attr('stroke-dasharray', '4 2');
		svg
			.append('text')
			.attr('x', 5)
			.attr('y', y - 5)
			.text(`${i * 1000}`)
			.attr('fill', '#666')
			.attr('font-size', '10px');
	});

	// Draw time graduations at the bottom
	if (lengthInSeconds > 0) {
		timeGraduations.forEach((t) => {
			const x = margin.left + (t / lengthInSeconds) * (width - margin.left - margin.right);
			svg
				.append('line')
				.attr('x1', x)
				.attr('y1', height - margin.bottom)
				.attr('x2', x)
				.attr('y2', height - margin.bottom + 5)
				.attr('stroke', '#ccc')
				.attr('stroke-dasharray', '4 2');
			svg
				.append('text')
				.attr('x', x + 5)
				.attr('y', height - margin.bottom + 15)
				.text(`${t}s`)
				.attr('fill', '#666')
				.attr('font-size', '10px');
		});
	}
	// Draw curve
	svg
		.append('path')
		.datum(points)
		.attr('class', 'dyno-curve-line')
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-width', 2)
		.attr('d', line);
}

onMounted(() => {
	width = svgRef.value?.clientWidth || 400;
	height = svgRef.value?.clientHeight || 300;
	svg = d3.select(svgRef.value!);

	xScale = d3.scaleLinear();
	yScale = d3.scaleLinear();

	line = d3
		.line<Point>()
		.x((d) => xScale(d.x))
		.y((d) => yScale(d.y))
		.curve(d3.curveMonotoneX);

	drawCurve(props.points);
	addResizeObserver();
});
// type to infer svgRef.value is not undefined
function isStaleSize(ref: SVGSVGElement): boolean {
	return ref.clientHeight > 0 && (height !== ref.clientHeight || width !== ref.clientWidth);
}

function addResizeObserver() {
	const resizeObserver = new ResizeObserver(() => {
		if (svgRef.value && isStaleSize(svgRef.value)) {
			width = svgRef.value.clientWidth;
			height = svgRef.value.clientHeight;
			drawCurve(props.points);
		}
	});
	if (svgRef.value) {
		resizeObserver.observe(svgRef.value);
	}
}

watch(
	() => props.points,
	(newPoints) => {
		if (svg && line) {
			drawCurve(newPoints);
		}
	},
	{ deep: true },
);
</script>
<style scoped>
.dyno-curve {
	border: 1px solid #ccc;
	background-color: #f9f9f9;
	box-sizing: border-box;
}
</style>
