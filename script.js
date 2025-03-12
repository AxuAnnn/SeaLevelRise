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

// ✅ **段落滾動效果**
gsap.set(".paragraph", { y: "100vh" }); // **段落初始位置在畫面下方**

gsap.to(".paragraph", {
    y: 0, // 段落隨滾輪滑動到初始位置
    ease: "none",
    scrollTrigger: {
        trigger: ".section2",
        start: "top top", // **section2 滿版時固定**
        end: "top top-=50%", // **固定更久才解除**
        scrub: true, // **滾輪控制動畫**
        pin: ".section2", // **固定 section2**
        anticipatePin: 1 // **避免 GSAP 計算錯誤**
    }
});
// **確保 Section 3 貼合**
gsap.set(".section3", { marginTop: "-1px" }); // ✅ **手動修正縫隙**

// ✅ **字卡淡入效果**
gsap.set(".card-container", { opacity: 0, y: 50 }); // **初始狀態：隱藏且位於下方**

gsap.to(".card-container", {
    opacity: 1,  // **淡入**
    y: 0,  // **從下方浮現**
    ease: "power2.out",
    duration: 1.5, // **淡入時間**
    scrollTrigger: {
        trigger: ".section3",
        start: "top top",  // **當 section3 完全填滿畫面時開始淡入**
        end: "top top",    // **這裡設相同，確保動畫只有一次**
        toggleActions: "play none none reverse"  // **滾輪往回滾動時動畫反向**
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const data = [
        { name: "電力", value: 0.26, color: "#8979FF" },
        { name: "交通", value: 0.15, color: "#0099FF" },
        { name: "產業", value: 0.11, color: "#27C4E4" },
        { name: "石化生產", value: 0.10, color: "#A0B6F5" },
        { name: "建築", value: 0.06, color: "#5C89FF" },
        { name: "農林業", value: 0.18, color: "#9AACFF" },
        { name: "其他", value: 0.14, color: "#3C8DEA" }
    ];

    const width = 500, height = 500, radius = Math.min(width, height) / 2;

    const svg = d3.select("#doughnutChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // ✅ **圓餅圖設定**
    const pie = d3.pie()
        .sort(null)
        .startAngle(0)  // ✅ **從12點開始繪製**
        .endAngle(Math.PI * 2)   // ✅ **完整圓**
        .value(d => d.value * 100); 

    const arc = d3.arc()
        .innerRadius(radius * 0.4) 
        .outerRadius(radius);

    const arcLabel = d3.arc()
        .innerRadius(radius * 0.6)  // ✅ **讓標籤更靠近圓心**
        .outerRadius(radius * 0.8);

    const path = svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("fill", d => d.data.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", "2px")
        .each(function (d) { this._current = { startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 }; });

    // ✅ **圓餅圖展開動畫**
    path.transition()
        .duration(2000)
        .delay((d, i) => i * 200)
        .attrTween("d", function (d) {
            const interpolate = d3.interpolate(
                { startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 },
                d
            );
            return function (t) {
                return arc(interpolate(t));
            };
        })
        .on("end", function (_, i) {
            // ✅ **當最後一塊圓餅完成後才顯示文字**
            if (i === data.length - 1) {
                text.transition()
                    .duration(1000)
                    .attr("opacity", 1);
            }
        });

    // ✅ **文字標籤，先隱藏**
    const text = svg.selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .attr("font-size", "16px")
        .attr("font-weight", "800")
        .attr("opacity", 0)  // ✅ 先隱藏，等動畫結束後才出現
        .text(d => d.data.name);

    // ✅ **滾動觸發動畫**
    gsap.from("#doughnutChart", {
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".section4",
            toggleActions: "play reverse play reverse",
        }
    });

    // ✅ **數字動畫**
    let numberAnimation = { value: 490 }; // 初始數值
    gsap.to(numberAnimation, {
        value: 571, // 目標數值
        duration: 2, // 動畫時間
        ease: "power2.out",
        onUpdate: function () {
            document.querySelector(".highlight-number").innerText = Math.floor(numberAnimation.value);
        },
        scrollTrigger: {
            trigger: ".section4",
            start: "top center",
            toggleActions: "play none none reverse"
        }
    });
});
