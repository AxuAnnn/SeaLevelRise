// 確保 GSAP 和 ScrollTrigger 正確載入
gsap.registerPlugin(ScrollTrigger);

// 初始淡入 text-wrapper，並同時啟動 bubble-left 和 bubble-right 的動畫
gsap.from(".text-wrapper", {
    opacity: 0,
    y: 50,
    duration: 1.5, // 持續 1.5 秒（可調整）
    ease: "power2.out"
});

// 讓 bubble-left 先向上浮動，bubble-right 先向下浮動
gsap.to(".bubble-left", {
    y: -20, // 先往上
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

gsap.to(".bubble-right", {
    y: 20, // 先往下
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

// 當 text-wrapper 動畫完成後，再啟動 line-icon 的動畫
gsap.from(".line-icon", {
    opacity: 0, // 讓 icon 先隱藏
    duration: 0.5, // 短暫延遲出現
    onComplete: function() {
        gsap.to(".line-icon", {
            y: 15,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
});
// 讓波浪產生變形動畫
function animateWave(waveClass, duration, newPath) {
    gsap.to(`${waveClass} path`, {
        attr: { d: newPath }, // 修改 d 屬性，讓波浪形狀變化
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// ✅ 修正的波浪動畫，讓變形範圍稍微變大
animateWave(".wave1", 4, "M0,180L60,220C120,260,240,290,360,300C480,310,600,280,720,250C840,220,960,190,1080,180C1200,170,1320,210,1380,230L1440,250V480H0Z");

animateWave(".wave2", 6, "M0,190L60,230C120,270,240,300,360,310C480,320,600,290,720,260C840,230,960,200,1080,190C1200,180,1320,220,1380,240L1440,260V480H0Z");

animateWave(".wave3", 8, "M0,200L60,240C120,280,240,310,360,320C480,330,600,300,720,270C840,240,960,210,1080,200C1200,190,1320,230,1380,250L1440,270V480H0Z");