<template>
	<svg class="dyno-curve" ref="svgRef"></svg>
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

const width = 400;
const height = 200;

let line: d3.Line<Point>;
let xScale: d3.ScaleLinear<number, number>;
let yScale: d3.ScaleLinear<number, number>;
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

function drawCurve(points: Point[]) {
	if (!points.length) return;
	// Update scales based on data
	xScale.domain(d3.extent(points, (d) => d.x) as [number, number]);
	yScale.domain([props.minY, props.maxY]);

	svg
		.selectAll('path.dyno-curve-line')
		.data([points])
		.join('path')
		.attr('class', 'dyno-curve-line')
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-width', 2)
		.attr('d', line);
}

onMounted(() => {
	svg = d3.select(svgRef.value!).attr('width', width).attr('height', height);

	xScale = d3.scaleLinear().range([0, width]);
	yScale = d3.scaleLinear().range([height, 0]);

	line = d3
		.line<Point>()
		.x((d) => xScale(d.x))
		.y((d) => yScale(d.y))
		.curve(d3.curveMonotoneX);

	drawCurve(props.points);
});

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
