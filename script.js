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

// 定義新形狀的波浪
animateWave(".wave1", 4, "M0,150L60,166C120,182,240,214,360,219.3C480,225,600,203,720,176.7C840,150,960,118,1080,123.3C1200,129,1320,171,1380,192.7L1440,214V320H0Z");

animateWave(".wave2", 6, "M0,130L60,146C120,162,240,194,360,199.3C480,205,600,183,720,156.7C840,130,960,98,1080,103.3C1200,109,1320,151,1380,172.7L1440,194V320H0Z");

animateWave(".wave3", 8, "M0,170L60,186C120,202,240,234,360,239.3C480,245,600,223,720,196.7C840,170,960,138,1080,143.3C1200,149,1320,191,1380,212.7L1440,234V320H0Z");

