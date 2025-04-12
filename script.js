// 確保 GSAP 和 ScrollTrigger 正確載入
gsap.registerPlugin(ScrollTrigger);
// ✅ 讓 info-card-container 可以左右拖移
gsap.registerPlugin(Draggable);

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
    let isAnimating = true; // 🔹 **動畫進行中，避免 hover 影響**
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
        .attr("viewBox", "0 0 500 500") // ✅ **確保不縮小**
        .style("overflow", "visible")  // ✅ **防止 hover 放大時被裁切**
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .style("opacity", 0);

    // ✅ **圓餅圖設定**
    const pie = d3.pie()
        .sort(null)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI * 1.5)
        .value(d => d.value * 100);

    const arc = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius);

    const arcLabel = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8);

    // ✅ **加入圓餅圖區塊**
    const path = svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("fill", d => d.data.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", "2px")
        .style("pointer-events", "all") // ✅ **確保 hover 可偵測**
        .each(function (d) { this._current = { startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 }; });

    // ✅ **標籤文字（先隱藏）**
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
        .attr("opacity", 0)
        .text(d => d.data.name);

    // ✅ **數字動畫**
    let numberAnimation = { value: 490 };

    // ✅ **滾動觸發動畫**
    ScrollTrigger.create({
        trigger: ".section4",
        start: "top center",
        once: true, // ✅ **確保圓餅圖動畫只執行一次**
        onEnter: () => {
            gsap.to(svg.node(), { opacity: 1, duration: 1 });

            path.transition()
                .duration(1000)
                .delay((d, i) => i * 100)
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
                    if (i === data.length - 1) {
                        text.transition()
                            .duration(1000)
                            .attr("opacity", 1);
            
                        isAnimating = false; // 🔹 **動畫結束，允許 hover**
                    }
                });
        
        // ✅ **確保滾動動畫覆蓋 Hover 動畫**
        gsap.to(path.nodes(), { scale: 1, duration: 0.5, overwrite: true });
        }
    });

    // ✅ **數字動畫（每次滾動到 `.section4` 重新播放）**
    ScrollTrigger.create({
        trigger: ".section4",
        start: "top center",
        toggleActions: "play none none reverse", // ✅ **每次滾動觸發**
        onEnter: () => {
            gsap.to(".highlight-number", { opacity: 1, duration: 0.5 }); // ✅ **確保數字可見**
            numberAnimation.value = 490; // ✅ **重置數字**
            gsap.to(numberAnimation, {
                value: 571,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                    document.querySelector(".highlight-number").innerText = Math.floor(numberAnimation.value);
                }
            });
        },
        onLeaveBack: () => {
            gsap.to(".highlight-number", { opacity: 0, duration: 0.5 }); // ✅ **滾回去時隱藏數字**
        }
    });



    // ✅ **加入 Hover 效果，防止 hover 卡住動畫**
    path.on("mouseover", function (event, d) {
        if (isAnimating) return; // 🔹 **如果動畫未完成，直接 return，不執行 hover 效果**
    
        d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", "scale(1.2)")
            .style("cursor", "pointer");
    
        text.filter(t => t.index === d.index)
            .transition()
            .duration(200)
            .attr("font-size", "20px")
            .attr("fill", "#FFFFFF")
            .text(`${(d.data.value * 100).toFixed(1)}%`);
    });
    

    path.on("mouseout", function (event, d) {
        if (isAnimating) return; // 🔹 **動畫未完成時，略過 hover 效果**
    
        d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", "scale(1)")
            .style("cursor", "default");
    
        text.filter(t => t.index === d.index)
            .transition()
            .duration(200)
            .attr("font-size", "16px")
            .attr("fill", "#FFFFFF")
            .text(d.data.name);
    });
    
});

gsap.to(".triangle", {
    y: -10, // 上下浮動 15px
    duration: 1, // 
    repeat: -1, // 無限循環
    yoyo: true, // 來回運動
    ease: "power1.inOut" // 平滑過渡
});
gsap.to(".blobs-svg1", {
    rotation: 360,  // 旋轉 360 度
    duration: 20,    // 8 秒完成一圈
    repeat: -1,     // 無限循環
    ease: "linear"  // 線性旋轉，確保均勻轉動
});

gsap.to(".blobs-svg2", {
    rotation: -360, // 反方向旋轉
    duration: 15,   // 10 秒完成一圈（比 blobs-svg1 慢）
    repeat: -1,
    ease: "linear"
});

gsap.to(".blobs-svg3", {
    rotation: 360,  // 順時針旋轉
    duration: 20,   // 12 秒完成一圈（最慢，營造層次感）
    repeat: -1,
    ease: "linear"
});

// ✅ 選取 section4、5、6
const sections = gsap.utils.toArray(".horizontal-sections .section");

// ✅ 計算最大水平寬度
let maxWidth = 0;
const getMaxWidth = () => {
    maxWidth = 0;
    sections.forEach((section) => {
        maxWidth += section.offsetWidth;
    });
};
getMaxWidth();
ScrollTrigger.addEventListener("refreshInit", getMaxWidth);


// ✅ 讓 section4 → section5 → section6 **水平滑動**，不允許垂直滾動
const horizontalWrapper = document.querySelector(".horizontal-wrapper");
const horizontalSections = gsap.utils.toArray(".horizontal-wrapper .section");

// 先取得總寬度（每個 section 寬度相加）
let totalWidth = 0;
const getTotalWidth = () => {
  totalWidth = 0;
  horizontalSections.forEach(section => {
    totalWidth += section.offsetWidth;
  });
};
getTotalWidth();
ScrollTrigger.addEventListener("refreshInit", getTotalWidth);

setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100); // 給瀏覽器一點時間，確保 section5,6 都完成 render
  
  ScrollTrigger.create({
    trigger: ".section4",
    start: "top top", // ✅ 當 section4 滿版時才觸發
    end: () => `+=${totalWidth}`,
    onEnter: () => {
      horizontalWrapper.style.width = `${totalWidth}px`;
      horizontalWrapper.style.display = "flex";
      horizontalWrapper.style.alignItems = "stretch";
      horizontalWrapper.style.pointerEvents = "auto";
    },
    onLeaveBack: () => {
      horizontalWrapper.style.pointerEvents = "none";
    }
  });
  


// ✅ 在滾動期間讓整個 wrapper 水平位移（原本 gsap.to 的部分）
gsap.to(".horizontal-wrapper", {
  x: () => `-${totalWidth - window.innerWidth}`,
  ease: "none",
  scrollTrigger: {
    trigger: ".section4",
    pin: ".horizontal-wrapper", // ✅ 這樣能正確固定目標
    scrub: true,
    end: () => `+=${totalWidth}`,
    invalidateOnRefresh: true
  }
});


// ✅ **確保 section6 滿版後，才能往 section7 滾動**
ScrollTrigger.create({
    trigger: ".section6",
    start: () => `left center`, // ✅ 當 section6 完全填滿畫面時
    end: "right center",
    onEnter: () => {
        ScrollTrigger.refresh(); // ✅ **允許正常滾動到 section7**
    }
});

// ✅ 讓 `.circle-item` 隨機上下左右晃動
document.querySelectorAll(".circle-item img").forEach((img, index) => {
    // ✅ 呼吸式縮放動畫（自動吸引注意）
    gsap.to(".circle-item", {
        scale: 1.07,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
    // ✅ 輕微旋轉動畫（讓圖片更有動態感）
    gsap.to(".circle-item", {
        rotation: () => gsap.utils.random(-5, 5),
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    // ✅ 滑鼠 hover 時「放大並保持」
    document.querySelectorAll(".circle-item").forEach(circle => {
        circle.addEventListener("mouseenter", function () {
            gsap.to(this, { scale: 1.2, duration: 0.3, ease: "power2.out" }); // 放大
            this.style.cursor = "pointer"; // 變成可點擊
        });
    });  
});

// ✅ 初始隱藏所有文字
gsap.set(".circle-text", { opacity: 0, scale: 0 });

// ✅ 每個泡泡點擊後只觸發一次，顯示對應文字
document.querySelectorAll(".circle-item").forEach(item => {
    let clicked = false; // 是否已經點擊過

    item.addEventListener("click", function () {
        if (clicked) return; // 如果已經點過，什麼都不做
        clicked = true;

        const text = item.querySelector(".circle-text");
        gsap.to(text, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        // 禁用再次點擊
        item.style.pointerEvents = "none";
    });
});


// ✅ **點擊 `.view-more-btn` 時，讓 `.card-text` 顯示**
document.querySelectorAll(".view-more-btn").forEach(button => {
    button.addEventListener("click", function() {
        let text = this.nextElementSibling;
        gsap.set(text, { clipPath: "inset(0% 0% 100% 0%)", opacity: 0, height: "auto" });
        gsap.to(text, { 
            clipPath: "inset(0% 0% 0% 0%)", // 逐漸展開
            opacity: 1, 
            duration: 0.8, 
            ease: "power2.out"
        });
        this.style.display = "none";
    });
});

// ✅ 選取 `.info-card-container`
const cardContainer = document.querySelector(".info-card-container");
const wrapper = document.querySelector(".info-card-wrapper");

// ✅ 計算最大拖動範圍
const updateBounds = () => {
    const wrapperWidth = wrapper.offsetWidth; // 可視範圍寬度
    const containerWidth = cardContainer.scrollWidth; // 整個卡片區的寬度
    const maxDrag = wrapperWidth - containerWidth - 40; // ✅ 限制拖動範圍

    return { minX: maxDrag, maxX: 0 };
};
// ✅ section6_2 文字淡入
gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(".section6_2-heading",
  { opacity: 0, x: -50 },
  {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section6_2",
      start: "top 70%",       // 當 section6_2 接近畫面中段時觸發淡入
      end: "top 10%",         // 淡入後就保持住
      toggleActions: "play none none reverse",  // 正向淡入、反向淡出
      markers: false          // 👉 可打開來 debug 時加上 true
    }
  }
);


  
  
// ✅ section6_2 tooltip
document.addEventListener("DOMContentLoaded", function () {
    // 🔹自訂每個地區的 tooltip 內容
    const tooltipData = {
      TWNWT: {
        info1: "新北市 1.5~2m",
        info2: "新北市 1.5%",
      },
      TWTPE: {
        info1: "臺北市 暫未受影響",
        info2: "臺北市 暫未受影響",
      },
      TWTAO: {
        info1: "桃園市 大於2m",
        info2: "桃園市 1%",
      },
      TWHSQ: {
        info1: "新竹縣 大於2m",
        info2: "新竹縣 1.09%",
      },
      TWHSZ: {
        info1: "新竹市 大於2m",
        info2: "新竹市 1.09%",
      },
      TWMIA: {
        info1: "苗栗縣 1~1.5m",
        info2: "苗栗縣 1.61%",
      },
      TWTXG: {
        info1: "臺中市 0.5~1m",
        info2: "臺中市 0.91%",
      },
      TWCHA: {
        info1: "彰化縣 1.5~2m",
        info2: "彰化縣 2.89%",
      },
      TWYUN: {
        info1: "雲林縣 大於2m",
        info2: "雲林縣 4.3%",
      },
      TWCYQ: {
        info1: "嘉義縣 大於2m",
        info2: "嘉義縣 1.4%",
      },
      TWTNN: {
        info1: "臺南市 1.5~2m",
        info2: "臺南市 3.29%",
      },
      TWKHH: {
        info1: "高雄市 1.5~2m",
        info2: "高雄市 0.48%",
      },
      TWPIF: {
        info1: "屏東縣 1.0~1.5m",
        info2: "屏東縣 1.04%",
      },
      TWTTT: {
        info1: "臺東縣 大於2m",
        info2: "臺東縣 1.24%",
      },
      TWHUA: {
        info1: "花蓮縣 1.5~2m",
        info2: "花蓮縣 0.3%",
      },
      TWILA: {
        info1: "宜蘭縣 0.5~1m",
        info2: "宜蘭縣 0.56%",
      },
      TWKEE: {
        info1: "基隆市 0.5~1m",
        info2: "基隆市 2.26%",
      },
      TWNAN: {
        info1: "南投縣 暫未受影響",
        info2: "南投縣 暫未受影響",
      },
      TWCYI: {
        info1: "嘉義市 大於2m",
        info2: "嘉義市 1%",
      },
      // ➕ 其他地區依樣新增...
    };
  
    let currentInfoType = "info1";
  
    // 🔸 取得右側資訊顯示區塊
    const infoTextElement = document.getElementById("infoText");

    // 🔸 切換按鈕功能（保留）
    const tabButtons = document.querySelectorAll(".tooltip-tabs button");
    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
        currentInfoType = btn.dataset.type;
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        });
    });

    // 🔸 滑過地圖 path 時更新右側 infoText 的內容
    const paths = document.querySelectorAll("svg path");
    paths.forEach((path) => {
        const id = path.getAttribute("id");

        path.addEventListener("mouseenter", () => {
            const data = tooltipData[id];
            if (data && data[currentInfoType]) {
              const [county, value] = data[currentInfoType].split(" ");
              infoTextElement.innerHTML = `
                <span class="${currentInfoType}">
                  <span class="county-name">${county}</span>
                  <span class="flood-info">${value}</span>
                </span>
              `;
            } else {
              infoTextElement.innerHTML = `<span class="default-text">此地區暫無資料</span>`;
            }
          });
          
            
          path.addEventListener("mouseleave", () => {
            infoTextElement.className = "";
            infoTextElement.innerHTML = `<span class="default-text">試試看移動滑鼠到地圖上</span>`;
          });
    });
  });
  
// ✅ section7文字淡入
gsap.to(".question-container", {
    opacity: 1,
    x: 0,  // 移動回原位
    duration: 5,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".section7",
        start: "top 70%",
        end: "top 50%",
        toggleActions: "play none none reverse"
    }
});

// ✅ 選取左右按鈕
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

// ✅ 只在 `cardContainer` 存在時執行
if (cardContainer) {
    // ✅ 按鈕功能 - 左右移動
    if (leftButton && rightButton && cardContainer) {
        const moveAmount = 300; // ✅ 每次點擊的移動距離
    
        // 🔹 **可調整的間距**
        let cardPadding = 50; // ✅ **字卡與按鈕的間距**
        let extraLeftMargin = 50;  // ✅ **允許往左移動的額外空間**
        let extraRightMargin = 50; // ✅ **允許往右移動的額外空間**
    
        let minX, maxX; // ✅ 限制範圍變數
    
        // ✅ **計算可移動範圍**
        const updateButtonBounds = () => {
            const wrapperWidth = wrapper.offsetWidth; // **可視範圍的寬度**
            const containerWidth = cardContainer.scrollWidth; // **總卡片寬度**
    
            // ✅ **計算範圍，確保字卡不會貼到按鈕**
            minX = Math.min(wrapperWidth - containerWidth - extraRightMargin + cardPadding, 0);
            maxX = extraLeftMargin - cardPadding; 
        };
    
        // ✅ **初始化時先計算一次範圍**
        updateButtonBounds();
    
        leftButton.addEventListener("click", function () {
            let currentX = gsap.getProperty(cardContainer, "x");
            let newX = Math.min(currentX + moveAmount, maxX); // ✅ 限制不超過 maxX
    
            gsap.to(cardContainer, {
                x: newX,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    
        rightButton.addEventListener("click", function () {
            let currentX = gsap.getProperty(cardContainer, "x");
            let newX = Math.max(currentX - moveAmount, minX); // ✅ 限制不超過 minX
    
            gsap.to(cardContainer, {
                x: newX,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    
        // ✅ **當視窗大小改變時，重新計算範圍**
        window.addEventListener("resize", updateButtonBounds);
    }    

    // ✅ Draggable 功能 - 拖動資訊卡
    Draggable.create(cardContainer, {
        type: "x",
        bounds: updateBounds(),
        inertia: true,
        edgeResistance: 0.9,
        cursor: "grab",
        onPress: function () {
            this.target.style.cursor = "grabbing";
        },
        onRelease: function () {
            this.target.style.cursor = "grab";
        },
        onDrag: function () {
            updateMaskVisibility();
        }
    });
}


// ✅ 當視窗大小改變時，重新計算邊界
window.addEventListener("resize", () => {
    Draggable.get(cardContainer).applyBounds(updateBounds());
    updateMaskVisibility();
});

// ✅ 更新遮罩的顯示狀態
const updateMaskVisibility = () => {
    const translateX = gsap.getProperty(cardContainer, "x"); // 取得當前 X 位置
    const bounds = updateBounds();

    const wrapper = document.querySelector(".info-card-wrapper");

    if (!wrapper) {
        console.error("❌ 找不到 .info-card-wrapper，請檢查 HTML");
        return; // 找不到時，直接跳出函式
    }

    // ✅ 改成操作 wrapper，不要用 `::before` 和 `::after`
    wrapper.style.setProperty("--left-mask-opacity", translateX < 0 ? "1" : "0");
    wrapper.style.setProperty("--right-mask-opacity", translateX > bounds.minX ? "1" : "0");
};



document.addEventListener("DOMContentLoaded", function () {
    const waveBackgroundRect = document.querySelector(".wave-background-rect");
    const waveContainer = document.querySelector(".wave-container");
    const actionButton = document.querySelector(".action-button");

    if (!waveBackgroundRect || !waveContainer || !actionButton) {
        console.error("❌ 找不到 wave-background-rect 或 wave-container 或 action-button");
        return;
    }

    let waveHeight = 80; // 初始高度 80vh
    let minHeight = 20;  // 最小高度 20vh

    actionButton.addEventListener("click", function () {
        if (waveHeight > minHeight) {
            waveHeight -= 1;

            // ✅ 更新 SVG 色塊的高度 & 位置
            waveBackgroundRect.setAttribute("height", waveHeight);
            waveBackgroundRect.setAttribute("y", 100 - waveHeight); // 確保色塊從底部縮小

            // ✅ 讓波浪也同步下降
            waveContainer.style.bottom = `${waveHeight}vh`;

            console.log(`✅ 變更成功！目前色塊 & 波浪高度：${waveHeight}vh`);
        } else {
            console.log("⏹️ 已達最小高度 20vh，無法再降低！");
        }
    });
});

setTimeout(() => ScrollTrigger.refresh(), 200);


