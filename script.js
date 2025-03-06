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
document.addEventListener("DOMContentLoaded", function() {
    const wave1 = document.getElementById("wavePath1");
    const wave2 = document.getElementById("wavePath2");
    const wave3 = document.getElementById("wavePath3");

    let t = 0; // 時間變數，控制波動

    function updateWaves() {
        t += 0.015; // 調整數值控制波動速度
        wave1.setAttribute("d", generateWavePath(20, 180, 130, t)); // 幅度、波長、基線高度
        wave2.setAttribute("d", generateWavePath(25, 220, 140, t + 0.8));
        wave3.setAttribute("d", generateWavePath(30, 260, 150, t + 1.6));
        requestAnimationFrame(updateWaves);
    }

    function generateWavePath(amplitude, wavelength, baseHeight, time) {
        let path = `M0,${baseHeight}`;
        for (let x = 0; x <= 1440; x += 5) { // 調整步進值
            let y = baseHeight + amplitude * Math.sin((x / wavelength) + time);
            path += ` L${x},${y}`;
        }
        path += ` L1440,320 L0,320 Z`; // 確保封閉
        return path;
    }

    updateWaves();
});