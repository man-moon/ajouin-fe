<script>
    import { onMount } from 'svelte';
  
    let canvas;
    let ctx;
  
    const paletteWidth = 120; // cm
    const paletteHeight = 100; // cm
    const itemWidth = 40; // cm
    const itemHeight = 20; // cm
    const itemDepth = 20; // cm
    const scale = 5; // 1cm = 5px
  
    const colors = {
      palette: '#E0E0E0',
      item: '#FF9999'
    };
  
    function drawPalette(x, y, width, height) {
      ctx.fillStyle = colors.palette;
      ctx.fillRect(x, y, width * scale, height * scale);
      ctx.strokeRect(x, y, width * scale, height * scale);
    }
  
    function drawItem(x, y, width, height) {
      ctx.fillStyle = colors.item;
      ctx.fillRect(x, y, width * scale, height * scale);
      ctx.strokeRect(x, y, width * scale, height * scale);
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.fillText('품목', x + 5, y + 20);
    }
  
    function drawLayerLabel(layer, y) {
      ctx.fillStyle = 'black';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`${layer}층`, 10, y + 30);
    }
  
    onMount(() => {
      ctx = canvas.getContext('2d');
  
      // 각 층 그리기
      for (let layer = 0; layer < 3; layer++) {
        const yOffset = 50 + layer * 250;
        drawPalette(50, yOffset, paletteWidth, paletteHeight);
        drawLayerLabel(layer + 1, yOffset);
  
        // 품목 그리기
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 3; col++) {
            drawItem(
              50 + col * itemWidth * scale,
              yOffset + row * itemHeight * scale,
              itemWidth,
              itemHeight
            );
          }
        }
      }
    });
  </script>
  
  <canvas bind:this={canvas} width="700" height="800"></canvas>
  
  <style>
    canvas {
      border: 1px solid black;
    }
  </style>