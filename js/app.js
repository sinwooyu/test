// Banner CMS Application
class BannerCMS {
  constructor() {
    this.canvas = document.getElementById("bannerCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.currentBg = "bg1";
    this.customBgImage = null;

    // Banner data
    this.bannerData = {
      headline: "",
      subtext: "",
      ctaText: "",
      ctaUrl: "",
      background: "bg1",
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderBanner();
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Input events
    const headline = document.getElementById("headline");
    if (headline) {
      headline.addEventListener("input", (e) => {
        this.bannerData.headline = e.target.value;
        this.renderBanner();
      });
    }

    const subtext = document.getElementById("subtext");
    if (subtext) {
      subtext.addEventListener("input", (e) => {
        this.bannerData.subtext = e.target.value;
        this.renderBanner();
      });
    }

    const ctaText = document.getElementById("ctaText");
    if (ctaText) {
      ctaText.addEventListener("input", (e) => {
        this.bannerData.ctaText = e.target.value;
        this.renderBanner();
      });
    }

    const ctaUrl = document.getElementById("ctaUrl");
    if (ctaUrl) {
      ctaUrl.addEventListener("input", (e) => {
        this.bannerData.ctaUrl = e.target.value;
      });
    }

    // Background URL input
    const bgImageUrl = document.getElementById("bgImageUrl");
    if (bgImageUrl) {
      bgImageUrl.addEventListener("input", (e) => {
        if (e.target.value) {
          this.loadBackgroundFromUrl(e.target.value);
        }
      });
    }

    // Preset background selection
    document.querySelectorAll(".preset-bg").forEach((bg) => {
      bg.addEventListener("click", (e) => {
        const bgType = e.target.dataset.bg;
        this.selectPresetBackground(bgType);
      });
    });

    // Custom background upload
    const bgUpload = document.getElementById("bgUpload");
    if (bgUpload) {
      bgUpload.addEventListener("change", (e) => {
        this.handleCustomBackground(e.target.files[0]);
      });
    }

    // Action buttons
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.exportBanner();
      });
    }

    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        this.saveBanner();
      });
    }
  }

  switchTab(tabName) {
    // Remove active class from all tabs and content
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));

    // Add active class to selected tab and content
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) selectedTab.classList.add("active");

    const selectedContent = document.getElementById(`${tabName}-tab`);
    if (selectedContent) selectedContent.classList.add("active");
  }

  selectPresetBackground(bgType) {
    this.currentBg = bgType;
    this.customBgImage = null;
    this.bannerData.background = bgType;

    // Update UI
    document.querySelectorAll(".preset-bg").forEach((bg) => {
      bg.classList.remove("active");
    });
    const selectedBg = document.querySelector(`[data-bg="${bgType}"]`);
    if (selectedBg) selectedBg.classList.add("active");

    // Clear URL input
    const bgImageUrl = document.getElementById("bgImageUrl");
    if (bgImageUrl) bgImageUrl.value = "";

    this.renderBanner();
  }

  loadBackgroundFromUrl(url) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this.customBgImage = img;
      this.currentBg = "custom";
      this.bannerData.background = "custom";

      // Clear preset selection
      document.querySelectorAll(".preset-bg").forEach((bg) => {
        bg.classList.remove("active");
      });

      this.renderBanner();
    };
    img.onerror = () => {
      alert("이미지를 불러올 수 없습니다. URL을 확인해주세요.");
    };
    img.src = url;
  }

  handleCustomBackground(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.customBgImage = img;
        this.currentBg = "custom";
        this.bannerData.background = "custom";

        // Clear preset selection
        document.querySelectorAll(".preset-bg").forEach((bg) => {
          bg.classList.remove("active");
        });

        // Clear URL input
        const bgImageUrl = document.getElementById("bgImageUrl");
        if (bgImageUrl) bgImageUrl.value = "Uploaded Image";

        this.renderBanner();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  renderBanner() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    if (this.currentBg === "custom" && this.customBgImage) {
      ctx.drawImage(this.customBgImage, 0, 0, width, height);
      this.drawTexts();
    } else {
      this.drawPresetBackground(this.currentBg);
    }
  }

  drawPresetBackground(bgType) {
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.drawTexts();
    };
    img.onerror = () => {
      // If .jpg fails, try .svg
      const svgImg = new Image();
      svgImg.onload = () => {
        this.ctx.drawImage(
          svgImg,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        this.drawTexts();
      };
      svgImg.src = `assets/bg/${bgType}.svg`;
    };
    img.src = `assets/bg/${bgType}.jpg`;
  }

  drawTexts() {
    const ctx = this.ctx;

    // Set text styling
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "top";

    // Draw Headline (large text at top)
    if (this.bannerData.headline) {
      ctx.font = "bold 48px Arial, sans-serif";
      const lines = this.wrapText(this.bannerData.headline, 650, ctx);
      lines.slice(0, 2).forEach((line, index) => {
        ctx.fillText(line, 50, 40 + index * 55);
      });
    }

    // Draw Subtext (medium text below headline)
    if (this.bannerData.subtext) {
      ctx.font = "24px Arial, sans-serif";
      const lines = this.wrapText(this.bannerData.subtext, 650, ctx);
      const startY = this.bannerData.headline ? 150 : 80;
      lines.slice(0, 2).forEach((line, index) => {
        ctx.fillText(line, 50, startY + index * 30);
      });
    }

    // Draw CTA Button (if text provided)
    if (this.bannerData.ctaText) {
      this.drawCtaButton();
    }
  }

  drawCtaButton() {
    const ctx = this.ctx;
    const buttonText = this.bannerData.ctaText;

    // Button position
    const buttonX = 50;
    const buttonY = 160;
    const buttonPadding = 20;
    const buttonHeight = 40;

    // Measure text
    ctx.font = "bold 16px Arial, sans-serif";
    const textWidth = ctx.measureText(buttonText).width;
    const buttonWidth = textWidth + buttonPadding * 2;

    // Draw button background
    ctx.fillStyle = "#5e5ce6";
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
    ctx.fill();

    // Draw button text
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.fillText(
      buttonText,
      buttonX + buttonPadding,
      buttonY + buttonHeight / 2
    );
    ctx.textBaseline = "top";
  }

  wrapText(text, maxWidth, ctx) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;

      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  exportBanner() {
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `banner_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  saveBanner() {
    const timestamp = Date.now();
    const bannerTitle = this.bannerData.headline || "Untitled Banner";

    // Convert canvas to data URL
    const imageData = this.canvas.toDataURL("image/png");

    const savedBanner = {
      id: timestamp,
      name: bannerTitle,
      date: new Date().toLocaleString("ko-KR"),
      data: this.bannerData,
      image: imageData,
    };

    // Get existing banners from localStorage
    const savedBanners = this.getSavedBanners();
    savedBanners.push(savedBanner);

    // Save to localStorage
    localStorage.setItem("banners", JSON.stringify(savedBanners));

    alert("배너가 저장되었습니다!");
  }

  getSavedBanners() {
    const saved = localStorage.getItem("banners");
    return saved ? JSON.parse(saved) : [];
  }
}

// Initialize app
let bannerCMS;
document.addEventListener("DOMContentLoaded", () => {
  bannerCMS = new BannerCMS();
});
