// 確保 GSAP 和 ScrollTrigger 正確載入
gsap.registerPlugin(ScrollTrigger);

// 初始淡入 text-wrapper
gsap.from(".text-wrapper", {
    opacity: 0,           // 初始透明度設為 0
    y: 50,                // 初始位置向下 50px
    duration: 1.5,        // 持續 1.5 秒（可以調整）
    ease: "power2.out",   // 先快後慢，讓動畫更自然
    onComplete: function() {
        // 當 text-wrapper 動畫結束後，開始滑鼠圖示動畫
        gsap.to(".line-icon", {
            y: 15,              // 向下滑動 20px（可調整）
            duration: 1,        // 每次滑動的時間 1 秒（可調整）
            repeat: -1,         // 無限循環
            yoyo: true,         // 來回動畫（向下→向上→向下）
            ease: "power1.inOut" // 緩動效果，平滑來回
        });
    }
});
