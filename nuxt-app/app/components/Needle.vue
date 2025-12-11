<template>
    <svg
   width="200"
   height="200"
   viewBox="0 0 52.916665 52.916666"
   version="1.1"
   id="needle"
   xml:space="preserve"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><defs
     id="defs1" /><g
     id="layer1"><g
       id="g12"
       :transform="`translate(-79.179757,-122.94095)  rotate(${props.angle},105.2367,141.64205)`"><path
         id="path2"
         style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.051;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers fill stroke"
         d="m 105.23647,141.6451 -0.002,5.24257 c -1.23613,0.20346 -2.15617,1.27319 -2.158,2.52595 0.002,1.2516 0.92279,2.3209 2.15748,2.52595 l 0.13958,5.09529 0.67179,-0.002 0.14211,-5.09581 c 1.18764,-0.24539 2.00946,-1.31064 2.01228,-2.52336 -0.003,-1.20123 -0.83465,-2.27293 -2.00815,-2.52957 l 0.001,-5.24102 z" /><path
         style="font-variation-settings:normal;opacity:1;vector-effect:none;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.051;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;-inkscape-stroke:none;paint-order:markers fill stroke;stop-color:#000000;stop-opacity:1"
         d="m 105.2367,141.64205 0.95477,-8.7e-4 0.001,-2.57792 c 0.34393,-0.14721 0.44292,-0.41827 0.44139,-0.74016 l -0.17294,-10.65288 c -0.008,-0.30574 -0.38937,-0.80652 -0.72144,-1.15424 -0.30341,0.32251 -0.7443,0.82669 -0.74651,1.14876 l -0.17504,10.66108 c -0.0125,0.3878 0.16094,0.60037 0.41639,0.73572 z"
         id="path4" /><path
         style="fill:#8f8f8f;fill-opacity:1;stroke:none;stroke-width:0.0244644;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers fill stroke"
         d="m 105.96527,138.00888 -0.0456,-10.04642 c -0.003,-0.26658 -0.0806,-0.39373 -0.19038,-0.61945 -0.11933,0.22566 -0.19641,0.33384 -0.197,0.61467 l -0.0462,10.05357 c -8e-5,0.2709 0.13579,0.31517 0.23952,0.31518 0.10374,2e-5 0.24007,-0.0369 0.23966,-0.31755 z"
         id="path4-3" /></g></g></svg>
</template>

<script setup>
    const props = defineProps({
        angle: {
            type: Number,
            required: false,
            default: 0
        }
    });
</script>