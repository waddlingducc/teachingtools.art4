(function() {
    'use strict';
    
    var detected = false;
    var checks = { bait: false, script: false };
    
    function createBlockWall() {
        if (detected || document.getElementById('adblock-wall')) return;
        detected = true;
        
        var overlay = document.createElement('div');
        overlay.id = 'adblock-wall';
        overlay.innerHTML = `
            <div class="adblock-modal">
                <h1>Ad Blocker Detected</h1>
                <p>Please allow ads, we rely on advertising to fund our site.</p>
                
                <div class="extensions-hint">
                    <img src="/images/extentions.png" alt="Find your extensions here">
                </div>
                
                <div class="adblock-tabs">
                    <button class="tab-btn active" onclick="showTab('ublock')">uBlock Origin</button>
                    <button class="tab-btn" onclick="showTab('abp')">AdBlock Plus</button>
                    <button class="tab-btn" onclick="showTab('adblock')">AdBlock</button>
                </div>
                
                <div class="tab-content" id="tab-ublock">
                    <video autoplay loop muted playsinline>
                        <source src="https://my.getadmiral.com/instructions/assets/video/chrome-ubo.webm" type="video/webm">
                    </video>
                </div>
                
                <div class="tab-content" id="tab-abp" style="display:none;">
                    <video autoplay loop muted playsinline>
                        <source src="https://my.getadmiral.com/instructions/assets/video/chrome-abp.webm" type="video/webm">
                    </video>
                </div>
                
                <div class="tab-content" id="tab-adblock" style="display:none;">
                    <img src="/attached_assets/image_1769650012826.png" alt="AdBlock instructions">
                </div>
                
                <button onclick="location.reload()" class="adblock-btn">I've allowed ads - refresh</button>
            </div>
        `;
        
        var style = document.createElement('style');
        style.textContent = `
            #adblock-wall {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                overflow-y: auto;
                padding: 20px;
                box-sizing: border-box;
            }
            .adblock-modal {
                background: linear-gradient(145deg, #1a1a2e, #16213e);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 550px;
                width: 100%;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .adblock-modal h1 {
                color: #ff4757;
                margin: 0 0 10px;
                font-size: 26px;
                font-weight: 700;
            }
            .adblock-modal > p {
                color: #a0a0a0;
                font-size: 15px;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            .extensions-hint {
                margin-bottom: 20px;
            }
            .extensions-hint img {
                max-width: 100%;
                border-radius: 8px;
            }
            .adblock-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .tab-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                padding: 10px 18px;
                border-radius: 8px;
                color: #ccc;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .tab-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            .tab-btn.active {
                background: #7b00ff;
                color: #fff;
            }
            .tab-content {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 20px;
            }
            .tab-content video {
                max-width: 100%;
                border-radius: 8px;
            }
            .tab-content img {
                max-width: 100%;
                border-radius: 8px;
            }
            .adblock-btn {
                background: #7b00ff;
                color: #fff;
                border: none;
                padding: 15px 40px;
                font-size: 16px;
                font-weight: 600;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .adblock-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(123, 0, 255, 0.4);
            }
            body.adblock-active {
                overflow: hidden !important;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        document.body.classList.add('adblock-active');
    }
    
    window.showTab = function(tab) {
        document.querySelectorAll('.tab-content').forEach(function(el) {
            el.style.display = 'none';
        });
        document.querySelectorAll('.tab-btn').forEach(function(el) {
            el.classList.remove('active');
        });
        document.getElementById('tab-' + tab).style.display = 'block';
        event.target.classList.add('active');
        
        var video = document.querySelector('#tab-' + tab + ' video');
        if (video) {
            video.currentTime = 0;
            video.play();
        }
    };
    
    function runDetection() {
        var bait = document.createElement('div');
        bait.className = 'ad-banner banner_ad ad_unit textads adsbox';
        bait.style.cssText = 'height:10px;width:10px;position:absolute;top:-100px;left:-100px;background:transparent;pointer-events:none;';
        bait.innerHTML = '&nbsp;';
        document.body.appendChild(bait);
        
        var ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.cssText = 'display:inline-block;height:10px;width:10px;position:absolute;top:-100px;left:-100px;';
        document.body.appendChild(ins);
        
        setTimeout(function() {
            if (bait) {
                try {
                    var rect = bait.getBoundingClientRect();
                    var styles = window.getComputedStyle(bait);
                    if (styles.display === 'none' || styles.visibility === 'hidden' || 
                        styles.opacity === '0' || rect.height === 0 || rect.width === 0 ||
                        !document.body.contains(bait)) {
                        checks.bait = true;
                    }
                } catch(e) { checks.bait = true; }
                try { bait.remove(); } catch(e) {}
            }
            
            if (ins) {
                try {
                    var insRect = ins.getBoundingClientRect();
                    var insStyles = window.getComputedStyle(ins);
                    if (insStyles.display === 'none' || insStyles.visibility === 'hidden' ||
                        insRect.height === 0 || insRect.width === 0 ||
                        !document.body.contains(ins)) {
                        checks.bait = true;
                    }
                } catch(e) { checks.bait = true; }
                try { ins.remove(); } catch(e) {}
            }
            
            if (checks.bait || checks.script) {
                createBlockWall();
            }
        }, 250);
        
        var adScript = document.createElement('script');
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        adScript.async = true;
        adScript.onerror = function() {
            checks.script = true;
            if (checks.bait || checks.script) {
                createBlockWall();
            }
        };
        document.head.appendChild(adScript);
        
        setTimeout(function() {
            try { adScript.remove(); } catch(e) {}
        }, 3000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDetection);
    } else {
        runDetection();
    }
})();
