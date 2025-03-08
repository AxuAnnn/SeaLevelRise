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

// 讓小船載浮載沉 + 左右搖擺
gsap.to(".boat", {
    y: -20,  // 上下浮動 20px
    duration: 3.5,  // 3.5 秒內完成
    repeat: -1,  // 無限循環
    yoyo: true,  // 來回運動
    ease: "power1.inOut"  // 平滑過渡
});

// 讓小船輕微左右搖擺
gsap.to(".boat", {
    rotate: 10,  // 往右傾斜 5 度
    duration: 2.5,  // 2 秒完成
    repeat: -1,  // 無限循環
    yoyo: true,  // 來回擺動
    ease: "power1.inOut"  // 平滑過渡
});

// 設定 paragraph 初始位置 (畫面底部)
gsap.set(".paragraph", { y: "100vh", opacity: 0 });

// 當滾動到 .section2 時，畫面定住，滾動控制 paragraph 往上
gsap.to(".paragraph", {
    y: 0,          // 讓文字回到正常位置
    opacity: 1,    // 讓文字顯示
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".section2",
        start: "top top",       // 當 .section2 的頂端碰到畫面頂端時觸發
        end: "+=100%",          // 持續一整個視口的高度
        scrub: true,            // 讓動畫隨滾動進行
        pin: true,              // **固定 .section2**
        anticipatePin: 1        // 確保固定時不會閃爍
    }
});


