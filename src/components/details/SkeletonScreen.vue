<template>
  <svg
    id="skeleton-screen"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 375 574"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      id="shape"
      fill="#D7E0E5"
      fill-rule="evenodd"
    >
      <path
        d="M0 0h375v211H0zM20 314h145v21H20zM20 430h145v21H20zM20 508h248v21H20zM20 385h210v21H20zM20 553h210v21H20z"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'SkeletonScreen'
}
</script>

<style scoped>
#skeleton-screen {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1001;
}
#shape {
  animation: pulse 1.5s infinite;
  -webkit-animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%   { fill: #e7ecef }

  50%  { fill: #c1c9ce }

  100% { fill: #e7ecef }
}

@-webkit-keyframes pulse {
  0%   { fill: #e7ecef }

  50%  { fill: #c1c9ce }
  100% { fill: #e7ecef }
}

/* Uncomment for disco */
/* @keyframes pulse {
  0%   { fill: #ff0000 }
  17%  { fill: #ffff00 }
  33%  { fill: #00ff00 }
  50%  { fill: #00ffff }
  67%  { fill: #0000ff }
  83%  { fill: #ff00ff }
  100% { fill: #ff0000 }
}

@-webkit-keyframes pulse {
  0%   { fill: #ff0000 }
  17%  { fill: #ffff00 }
  33%  { fill: #00ff00 }
  50%  { fill: #00ffff }
  67%  { fill: #0000ff }
  83%  { fill: #ff00ff }
  100% { fill: #ff0000 }
} */
</style>
