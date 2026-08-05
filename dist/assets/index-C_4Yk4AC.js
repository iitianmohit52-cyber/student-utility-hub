const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ageCalculator-BMosQai3.js","assets/alerts-Cf_U-u9c.js","assets/audioConverter-DC5ds_3R.js","assets/sanitize-NlmEIhMi.js","assets/audioTrimmer-BtkVblQ_.js","assets/base64EncoderDecoder-B8sWVKfu.js","assets/bmiCalculator-BEUCPiiB.js","assets/colorPicker-BU3Uc5A2.js","assets/emiCalculator-n8we4AH9.js","assets/imageCompressor-Dskewq0a.js","assets/imageConverter-BCaxtRWy.js","assets/imageCropper-CLWFCzKN.js","assets/jsonFormatter-FfDb8eR2.js","assets/passwordGenerator-BJ1mxsDx.js","assets/qrCodeGenerator-DvsHk-JO.js","assets/sipCalculator-Cq-ACtJI.js","assets/speechToText-faKl8dGP.js","assets/textToSpeech-Bm6064S2.js","assets/timerStopwatch-B1pZFCXz.js","assets/unitConverter-DlvFqKOu.js","assets/videoConverter-C_LRTsIL.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const I=[{id:"imageConverter",name:"Image Converter",category:"image",icon:"🖼️",description:"Convert images between JPG, PNG, and WEBP formats."},{id:"imageCompressor",name:"Image Compressor",category:"image",icon:"🗜️",description:"Reduce the file size of your images without significant loss of quality."},{id:"imageCropper",name:"Image Cropper",category:"image",icon:"✂️",description:"Crop your images perfectly."},{id:"videoConverter",name:"Video Converter",category:"media",icon:"🎬",description:"Convert video formats using your browser."},{id:"audioConverter",name:"Audio Converter",category:"media",icon:"🎵",description:"Convert audio files to WAV format."},{id:"audioTrimmer",name:"Audio Trimmer",category:"media",icon:"✂️",description:"Trim your audio files effortlessly."},{id:"ageCalculator",name:"Age Calculator",category:"calculator",icon:"🎂",description:"Calculate exact age in years, months, and days."},{id:"emiCalculator",name:"EMI Calculator",category:"calculator",icon:"💰",description:"Calculate Equated Monthly Installment for loans."},{id:"sipCalculator",name:"SIP Calculator",category:"calculator",icon:"📈",description:"Estimate the future value of your SIP investments."},{id:"bmiCalculator",name:"BMI Calculator",category:"calculator",icon:"⚖️",description:"Calculate your Body Mass Index (BMI)."},{id:"qrCodeGenerator",name:"QR Code Generator",category:"text",icon:"📱",description:"Generate QR codes from text or URLs."},{id:"passwordGenerator",name:"Password Generator",category:"text",icon:"🔑",description:"Create strong, secure, and random passwords."},{id:"wordCounter",name:"Word Counter",category:"text",icon:"📝",description:"Count words, characters, and estimate reading time."},{id:"base64",name:"Base64 Encoder/Decoder",category:"text",icon:"🔄",description:"Convert text to Base64 and vice versa."},{id:"jsonFormatter",name:"JSON Formatter",category:"text",icon:"{}",description:"Format and validate your JSON data."},{id:"colorPicker",name:"Color Picker",category:"interactive",icon:"🎨",description:"Pick and convert colors easily."},{id:"textToSpeech",name:"Text to Speech",category:"interactive",icon:"🗣️",description:"Convert text to spoken words."},{id:"speechToText",name:"Speech to Text",category:"interactive",icon:"🎙️",description:"Convert your speech into text."},{id:"unitConverter",name:"Unit Converter",category:"measurement",icon:"📏",description:"Convert various units of measurement."},{id:"timer",name:"Timer / Stopwatch",category:"measurement",icon:"⏱️",description:"Dual-function timer and stopwatch."}],M=[{id:"all",name:"All Tools"},{id:"image",name:"Image Tools"},{id:"media",name:"Audio & Video"},{id:"calculator",name:"Calculators"},{id:"text",name:"Text & Code"},{id:"interactive",name:"Accessibility"},{id:"measurement",name:"Measurement"}],S=(e,t="",o="")=>{const a=document.createElement(e);return t&&(a.className=t),o&&(a.innerHTML=o),a},R=e=>{const t=S("div","tool-card");t.setAttribute("data-category",e.category);const a=["emiCalculator","imageCompressor","qrCodeGenerator"].includes(e.id)?'<span class="card-badge popular-badge">🔥 Popular</span>':"",i=`<span class="card-badge category-badge">${e.category.charAt(0).toUpperCase()+e.category.slice(1)}</span>`;t.innerHTML=`
        <div class="card-header">
            ${a}
            ${i}
            <button class="favorite-btn" aria-label="Add to favorites" title="Favorite">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="heart-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
        </div>
        <div class="card-icon-wrapper">
            <span class="tool-icon">${e.icon}</span>
        </div>
        <div class="card-body">
            <h3>${e.name}</h3>
            <p>${e.description}</p>
        </div>
        <div class="card-footer">
            <button class="tool-button" data-tool="${e.id}">
                <span>Open Tool</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
        </div>
    `;const l=t.querySelector(".favorite-btn");return l.addEventListener("click",s=>{s.stopPropagation(),l.classList.toggle("active");const r=l.querySelector("svg");l.classList.contains("active")?(r.style.fill="#ff4757",r.style.stroke="#ff4757"):(r.style.fill="none",r.style.stroke="currentColor")}),t},C={getItem:(e,t=null)=>{try{const o=localStorage.getItem(e);if(o===null)return t;try{return JSON.parse(o)}catch{return o}}catch{return console.warn(`[SafeStorage] Failed to read key: ${e}`),t}},setItem:(e,t)=>{try{const o=typeof t=="string"?t:JSON.stringify(t);return localStorage.setItem(e,o),!0}catch(o){return console.warn(`[SafeStorage] Failed to write key: ${e}`),o.name==="QuotaExceededError"&&console.warn("[SafeStorage] Storage quota exceeded. Clearing non-essential data..."),!1}},removeItem:e=>{try{localStorage.removeItem(e)}catch{console.warn(`[SafeStorage] Failed to remove key: ${e}`)}}},N={samplingRate:1},v={PAGE_VIEW:"page_view",THEME_CHANGE:"theme_change",SEARCH:"search",CATEGORY_FILTER:"category_filter",OFFLINE_USAGE:"offline_usage",NOT_FOUND:"404_error",TOOL_OPEN:"tool_open",TOOL_CLOSE:"tool_close",TOOL_SUCCESS:"tool_success",TOOL_ERROR:"tool_error",DOWNLOAD:"download",COPY:"copy",SHARE:"share",FAVORITE:"favorite",EXTERNAL_LINK_CLICK:"external_link_click",PWA_INSTALL_PROMPT:"pwa_install_prompt",PWA_INSTALL_ACCEPTED:"pwa_install_accepted",PWA_INSTALL_DISMISSED:"pwa_install_dismissed",PWA_UPDATE_AVAILABLE:"pwa_update_available",JS_ERROR:"js_error",PROMISE_REJECTION:"promise_rejection",NETWORK_ERROR:"network_error",PERFORMANCE_ISSUE:"performance_issue",AD_IMPRESSION:"ad_impression",AD_CLICK:"ad_click"},A={ANALYTICS:"analytics_consent",MARKETING:"marketing_consent",FUNCTIONAL:"functional_consent"};class x{constructor(){this.consents=this.loadConsents()}loadConsents(){try{const t=C.getItem("privacy_consent");if(t)return JSON.parse(t)}catch{console.warn("Could not read consent data")}return{[A.ANALYTICS]:!1,[A.MARKETING]:!1,[A.FUNCTIONAL]:!0}}saveConsents(t){this.consents={...this.consents,...t,[A.FUNCTIONAL]:!0},C.setItem("privacy_consent",JSON.stringify(this.consents))}hasConsent(t){return!!this.consents[t]}}new x;class D{init(){}trackEvent(t,o){}trackPageView(t){}}class H extends D{init(){console.log("[Analytics] Debug Provider Initialized")}trackEvent(t,o){console.log(`[Analytics:Event] ${t}`,o)}trackPageView(t){console.log(`[Analytics:PageView] ${t}`)}}const B=e=>{if(!window.performance||!window.PerformanceObserver)return;const t=(o,a,n)=>{e(v.PERFORMANCE_ISSUE,{metric_name:o,value:Math.round(a)})};try{new PerformanceObserver(s=>{const r=s.getEntries(),u=r[r.length-1];t("LCP",u.startTime,u)}).observe({type:"largest-contentful-paint",buffered:!0}),new PerformanceObserver(s=>{const r=s.getEntriesByName("first-contentful-paint");r.length>0&&t("FCP",r[0].startTime,r[0])}).observe({type:"paint",buffered:!0});let n=0;new PerformanceObserver(s=>{for(const r of s.getEntries())r.hadRecentInput||(n+=r.value)}).observe({type:"layout-shift",buffered:!0}),window.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&n>0&&t("CLS",n*1e3,null)}),new PerformanceObserver(s=>{for(const r of s.getEntries())t("LongTask",r.duration,r)}).observe({type:"longtask",buffered:!0})}catch{console.warn("Performance monitoring not fully supported in this browser.")}},$=e=>{window.addEventListener("unhandledrejection",t=>{var o,a;e(v.PROMISE_REJECTION,{message:P(((o=t.reason)==null?void 0:o.message)||"Unknown Promise Rejection"),type:((a=t.reason)==null?void 0:a.name)||"Error"})}),window.addEventListener("error",t=>{e(v.JS_ERROR,{message:P(t.message),filename:U(t.filename),lineno:t.lineno,colno:t.colno})})};function P(e){return e?e.replace(/(\/[^\s]+)/g,"[PATH]").substring(0,200):"Unknown"}function U(e){return e?e.split("/").pop().split("?")[0]:"Unknown"}class j{constructor(){this.activeProviders=[],this.initialized=!1}init(){this.initialized||(this.activeProviders.push(new H),this.activeProviders.forEach(t=>t.init()),B((t,o)=>this.track(t,o)),$((t,o)=>this.track(t,o)),this.initialized=!0)}track(t,o={}){if(Math.random()>N.samplingRate)return;const a=this.sanitizeData(o);this.activeProviders.forEach(n=>{n.trackEvent(t,a)})}pageView(t=window.location.pathname){let o=t;o=o.split("?")[0],this.activeProviders.forEach(a=>{a.trackPageView(o)})}tool(t,o,a={}){this.track(t,{tool_id:o,...a})}error(t,o={}){this.track(v.JS_ERROR,{error_message:t,...o})}event(t,o){this.track(t,o)}sanitizeData(t){const o={...t},a=["password","email","credit_card","file_content","file","content","input"];for(const n of Object.keys(o))a.includes(n.toLowerCase())&&(o[n]="[REDACTED]"),typeof o[n]=="string"&&o[n].length>100&&(o[n]=o[n].substring(0,100)+"...");return o}}const g=new j,F=e=>{const t=S("button","theme-toggle-btn"),o=C.getItem("theme","dark");document.documentElement.setAttribute("data-theme",o),t.innerHTML=o==="dark"?"☀️ Light":"🌙 Dark",t.addEventListener("click",()=>{const n=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",n),C.setItem("theme",n),g.event(v.THEME_CHANGE,{to:n}),t.innerHTML=n==="dark"?"☀️ Light":"🌙 Dark"}),e.appendChild(t)},q=()=>{const e=S("header","app-header");e.innerHTML=`
        <div class="header-container">
            <div class="logo">
                <span class="logo-icon">🚀</span>
                <h1>Student Utility Hub</h1>
            </div>
            
            <div class="hamburger-menu" id="mobileMenuBtn">
                <span></span><span></span><span></span>
            </div>

            <div class="header-actions" id="navMenu">
                <nav class="main-nav">
                    <a href="#" class="nav-link">Home</a>
                    <a href="#article-image-tools" class="nav-link">About Tools</a>
                </nav>
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="globalSearch" placeholder="Search (Ctrl + K)" accesskey="k">
                    <span class="search-shortcut">Ctrl K</span>
                </div>
                <div id="themeToggleContainer"></div>
            </div>
        </div>
        <div class="mobile-nav-overlay" id="mobileNavOverlay"></div>
    `;const t=e.querySelector("#themeToggleContainer");F(t);const o=e.querySelector("#globalSearch");document.addEventListener("keydown",s=>{(s.ctrlKey||s.metaKey)&&s.key==="k"&&(s.preventDefault(),o.focus())});const a=e.querySelector("#mobileMenuBtn"),n=e.querySelector("#navMenu"),i=e.querySelector("#mobileNavOverlay"),l=()=>{a.classList.toggle("active"),n.classList.toggle("active"),i.classList.toggle("active"),document.body.style.overflow=n.classList.contains("active")?"hidden":""};return a.addEventListener("click",l),i.addEventListener("click",l),e},V=e=>{const t=S("section","hero-section");t.innerHTML=`
        <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
        </div>
        
        <div class="hero-content">
            <span class="hero-badge">100% Client-Side Processing</span>
            <h2>Your Ultimate Collection of <span class="gradient-text">Free Online Tools</span></h2>
            <p>Access a suite of 20+ powerful online tools for images, audio, video, calculations, and text processing. Fast, free, and secure.</p>
            <div class="hero-cta">
                <button class="primary-btn" onclick="document.querySelector('.tool-grid').scrollIntoView({behavior: 'smooth'})">Explore Tools</button>
            </div>
            
            <div class="hero-stats">
                <div class="stat-card">
                    <span class="stat-icon">⚡</span>
                    <div class="stat-info">
                        <strong>Lightning Fast</strong>
                        <span>Zero server latency</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">🔒</span>
                    <div class="stat-info">
                        <strong>Privacy First</strong>
                        <span>Files never leave your device</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">🛠️</span>
                    <div class="stat-info">
                        <strong>20+ Utilities</strong>
                        <span>Everything you need in one place</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="category-filters">
            ${M.map(o=>`
                <button class="filter-btn ${o.id==="all"?"active":""}" data-category="${o.id}">
                    ${o.name}
                </button>
            `).join("")}
        </div>
    `,e.appendChild(t)},G="modulepreload",W=function(e){return"/"+e},O={},d=function(t,o,a){let n=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),s=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(o.map(r=>{if(r=W(r),r in O)return;O[r]=!0;const u=r.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${h}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":G,u||(m.as="script"),m.crossOrigin="",m.href=r,s&&m.setAttribute("nonce",s),document.head.appendChild(m),u)return new Promise((c,p)=>{m.addEventListener("load",c),m.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${r}`)))})}))}function i(l){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=l,window.dispatchEvent(s),!s.defaultPrevented)throw l}return n.then(l=>{for(const s of l||[])s.status==="rejected"&&i(s.reason);return t().catch(i)})},z=(e,t,o)=>{const a=e[t];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((n,i)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(i.bind(null,new Error("Unknown variable dynamic import: "+t+(t.split("/").length!==o?". Note that variables only represent file names one level deep.":""))))})},J=async e=>{try{return(await z(Object.assign({"./modules/ageCalculator.js":()=>d(()=>import("./ageCalculator-BMosQai3.js"),__vite__mapDeps([0,1])),"./modules/audioConverter.js":()=>d(()=>import("./audioConverter-DC5ds_3R.js"),__vite__mapDeps([2,1,3])),"./modules/audioTrimmer.js":()=>d(()=>import("./audioTrimmer-BtkVblQ_.js"),__vite__mapDeps([4,1])),"./modules/base64EncoderDecoder.js":()=>d(()=>import("./base64EncoderDecoder-B8sWVKfu.js"),__vite__mapDeps([5,1])),"./modules/bmiCalculator.js":()=>d(()=>import("./bmiCalculator-BEUCPiiB.js"),__vite__mapDeps([6,1])),"./modules/colorPicker.js":()=>d(()=>import("./colorPicker-BU3Uc5A2.js"),__vite__mapDeps([7,1])),"./modules/emiCalculator.js":()=>d(()=>import("./emiCalculator-n8we4AH9.js"),__vite__mapDeps([8,1])),"./modules/imageCompressor.js":()=>d(()=>import("./imageCompressor-Dskewq0a.js"),__vite__mapDeps([9,1,3])),"./modules/imageConverter.js":()=>d(()=>import("./imageConverter-BCaxtRWy.js"),__vite__mapDeps([10,1,3])),"./modules/imageCropper.js":()=>d(()=>import("./imageCropper-CLWFCzKN.js"),__vite__mapDeps([11,1])),"./modules/jsonFormatter.js":()=>d(()=>import("./jsonFormatter-FfDb8eR2.js"),__vite__mapDeps([12,1])),"./modules/passwordGenerator.js":()=>d(()=>import("./passwordGenerator-BJ1mxsDx.js"),__vite__mapDeps([13,1])),"./modules/qrCodeGenerator.js":()=>d(()=>import("./qrCodeGenerator-DvsHk-JO.js"),__vite__mapDeps([14,1])),"./modules/sipCalculator.js":()=>d(()=>import("./sipCalculator-Cq-ACtJI.js"),__vite__mapDeps([15,1])),"./modules/speechToText.js":()=>d(()=>import("./speechToText-faKl8dGP.js"),__vite__mapDeps([16,1])),"./modules/textToSpeech.js":()=>d(()=>import("./textToSpeech-Bm6064S2.js"),__vite__mapDeps([17,1])),"./modules/timerStopwatch.js":()=>d(()=>import("./timerStopwatch-B1pZFCXz.js"),__vite__mapDeps([18,1])),"./modules/unitConverter.js":()=>d(()=>import("./unitConverter-DlvFqKOu.js"),__vite__mapDeps([19,1])),"./modules/videoConverter.js":()=>d(()=>import("./videoConverter-C_LRTsIL.js"),__vite__mapDeps([20,1,3])),"./modules/wordCounter.js":()=>d(()=>import("./wordCounter-DQhMY38z.js"),[])}),`./modules/${e}.js`,3)).default}catch(t){return console.error(`Failed to load tool module: ${e}`,t),null}},K=()=>{window.addEventListener("error",e=>{console.error("[Global Boundary] Caught error:",{message:e.message,source:e.filename,lineno:e.lineno,colno:e.colno})}),window.addEventListener("unhandledrejection",e=>{console.error("[Global Boundary] Unhandled Promise Rejection:",e.reason)})},Y=async(e,t,o="unknown")=>{try{await e(),g.tool(v.TOOL_SUCCESS,o)}catch(a){console.error("[Tool Boundary] Execution failed:",a),g.tool(v.TOOL_ERROR,o,{message:a.message}),t&&(t.innerHTML=`
                <div class="error-boundary" style="padding: 2rem; text-align: center; color: #ff4757;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Something went wrong</h3>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">The tool encountered an unexpected error. Please try reloading the page.</p>
                </div>
            `)}},Q=()=>{const e=document.createElement("div");e.className="modal",e.id="toolModal",e.innerHTML=`
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2 id="modalTitle">Tool Title</h2>
            <div id="modalBody" class="modal-body">
                <!-- Tool-specific content will be injected here -->
            </div>
            <center>
                <div class="ad-placeholder" style="margin-top: 20px;">
                    <p>Ad Placeholder (728x90)</p>
                </div>
            </center>
            <div id="modalAlert" class="modal-alert" style="display:none;"></div>
        </div>
    `;const t=e.querySelector(".close-button"),o=e.querySelector("#modalBody"),a=e.querySelector("#modalTitle"),n=e.querySelector("#modalAlert");let i=null;const l=()=>{i&&(g.tool(v.TOOL_CLOSE,i),i=null),e.style.display="none",document.body.style.overflow="",o.innerHTML="";const r=document.getElementById("dynamic-breadcrumb-schema");r&&r.remove(),window.currentToolCleanup&&(window.currentToolCleanup(),window.currentToolCleanup=null)};t.onclick=l,window.onclick=r=>{r.target===e&&l()};const s=r=>{const u=r.category.charAt(0).toUpperCase()+r.category.slice(1),h=I.filter(c=>c.category===r.category&&c.id!==r.id).slice(0,3);let m="";return h.length>0&&(m=`
                <div class="related-tools-section" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--tool-card-border);">
                    <h3 style="margin-bottom: 1.5rem;">Related ${u} Tools</h3>
                    <div class="tool-grid" id="relatedToolsGrid" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">
                        <!-- Related tools will be injected here after DOM mount -->
                    </div>
                </div>
            `),`
            <div class="tool-seo-content" style="margin-top: 3rem;">
                <div class="ad-placeholder inline-ad" style="margin-bottom: 2rem;">
                    <p>Inside Article Ad (Responsive)</p>
                </div>

                <h3>Introduction</h3>
                <p>The <strong>${r.name}</strong> is a highly optimized, 100% client-side utility designed specifically for processing your data securely and instantly. Whether you are a student, professional, or developer, this ${u} tool provides exactly what you need without the bloat.</p>

                <h3>Benefits of Using Our ${r.name}</h3>
                <ul>
                    <li><strong>Privacy First:</strong> Your files and data are processed locally in your browser.</li>
                    <li><strong>Lightning Fast:</strong> Zero server latency means instant results.</li>
                    <li><strong>Free to Use:</strong> No subscriptions, no hidden fees.</li>
                </ul>

                <h3>How to Use</h3>
                <p>${r.description} Simply interact with the controls above to execute the process. The results are generated in real-time.</p>

                <h3>Features</h3>
                <p>This tool is packed with essential features to streamline your ${u.toLowerCase()} workflow, ensuring high precision and ease of use.</p>

                <h3>Use Cases & Examples</h3>
                <p>Perfect for academic projects, professional data processing, and everyday digital tasks requiring a robust <strong>${r.name}</strong>.</p>

                <h3>Pro Tips</h3>
                <p>For best results, ensure your inputs are correctly formatted. Bookmark this page (Ctrl+D) for quick access to the ${r.name} anytime you need it.</p>

                <h3>Frequently Asked Questions</h3>
                <details style="margin-bottom: 1rem; background: var(--surface-elevated); padding: 1rem; border-radius: 8px;">
                    <summary style="font-weight: 600; cursor: pointer;">Is the ${r.name} truly free?</summary>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary);">Yes, the Student Utility Hub ${r.name} is entirely free to use with no usage limits.</p>
                </details>
                <details style="margin-bottom: 1rem; background: var(--surface-elevated); padding: 1rem; border-radius: 8px;">
                    <summary style="font-weight: 600; cursor: pointer;">Is my data safe?</summary>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary);">Absolutely. All calculations and processing for the ${r.name} happen directly on your device.</p>
                </details>

                <div class="ad-placeholder inline-ad" style="margin-top: 2rem; margin-bottom: 2rem;">
                    <p>After FAQ Ad (Responsive)</p>
                </div>

                <h3>Conclusion</h3>
                <p>The <strong>${r.name}</strong> stands out as a premier ${u} utility. Its combination of speed, privacy, and simplicity makes it an indispensable tool for your digital toolkit.</p>
                
                ${m}
            </div>
        `};return window.openModal=async r=>{const u=r.category.charAt(0).toUpperCase()+r.category.slice(1);a.innerHTML=`
            <div class="breadcrumb" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 500;">
                Home > ${u} > ${r.name}
            </div>
            ${r.name}
        `;const h=document.createElement("script");h.type="application/ld+json",h.id="dynamic-breadcrumb-schema",h.textContent=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://www.studentutilityhub.com/"},{"@type":"ListItem",position:2,name:u,item:`https://www.studentutilityhub.com/#${r.category}`},{"@type":"ListItem",position:3,name:r.name,item:`https://www.studentutilityhub.com/#${r.id}`}]}),document.head.appendChild(h),o.innerHTML='<div style="text-align:center; padding:2rem;"><div class="skeleton-icon" style="margin: 0 auto;"></div><p style="margin-top:1rem; color:var(--text-secondary);">Loading Tool...</p></div>',n.style.display="none",e.style.display="block",document.body.style.overflow="hidden",i=r.id,g.tool(v.TOOL_OPEN,r.id,{category:r.category});const m=await J(r.id);if(m){o.innerHTML="";const c=document.createElement("div");c.className="tool-workspace",o.appendChild(c),Y(()=>m(c),c,r.id);const p=document.createElement("div");p.innerHTML=s(r),o.appendChild(p);const y=p.querySelector("#relatedToolsGrid");y&&I.filter(E=>E.category===r.category&&E.id!==r.id).slice(0,3).forEach(E=>{const T=R(E);T.querySelector(".tool-button").addEventListener("click",()=>{window.openModal(E)}),y.appendChild(T)})}else o.innerHTML='<p style="color:#ff4757; text-align:center;">Failed to load tool. Please try again.</p>'},e},Z=()=>{const e=S("footer","app-footer");return e.innerHTML=`
        <div class="footer-container">
            <div class="footer-brand">
                <h3>Student Utility Hub</h3>
                <p>Your ultimate collection of free, secure, and client-side online tools designed for maximum efficiency.</p>
                <div class="trust-signals" style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center; color: var(--text-secondary); font-size: 0.85rem;">
                    <span>🔒 SSL Secure</span>
                    <span>🛡️ 100% Privacy</span>
                    <span>⚡ Lightning Fast</span>
                </div>
            </div>
            
            <div class="footer-links-grid">
                <div class="footer-column">
                    <h4>Top Calculators</h4>
                    <ul>
                        <li><a href="#emiCalculator" onclick="window.location.reload()">EMI Calculator</a></li>
                        <li><a href="#sipCalculator" onclick="window.location.reload()">SIP Calculator</a></li>
                        <li><a href="#ageCalculator" onclick="window.location.reload()">Age Calculator</a></li>
                        <li><a href="#bmiCalculator" onclick="window.location.reload()">BMI Calculator</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Media Tools</h4>
                    <ul>
                        <li><a href="#imageCompressor" onclick="window.location.reload()">Image Compressor</a></li>
                        <li><a href="#imageConverter" onclick="window.location.reload()">Image Converter</a></li>
                        <li><a href="#audioTrimmer" onclick="window.location.reload()">Audio Trimmer</a></li>
                        <li><a href="#videoConverter" onclick="window.location.reload()">Video Converter</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Legal & Trust</h4>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Disclaimer</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Student Utility Hub. All rights reserved. Made with ❤️ for Students and Professionals.</p>
            <div class="ad-placeholder footer-ad">
                <p>Footer Ad Placeholder (728x90)</p>
            </div>
        </div>
    `,e};K();g.init();g.pageView();let L;"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(t=>{t.addEventListener("updatefound",()=>{L=t.installing,L.addEventListener("statechange",()=>{L.state==="installed"&&navigator.serviceWorker.controller&&(g.event(v.PWA_UPDATE_AVAILABLE),X())})})}).catch(t=>{console.error("ServiceWorker registration failed:",t)});let e;navigator.serviceWorker.addEventListener("controllerchange",()=>{e||(window.location.reload(),e=!0)})});function X(){if(document.querySelector(".update-banner"))return;const e=document.createElement("div");e.className="pwa-banner update-banner",e.innerHTML=`
        <div class="banner-content">
            <strong>New version available</strong>
            <span>Update to get the latest features.</span>
        </div>
        <div class="banner-actions">
            <button id="pwa-refresh-btn" class="btn-primary">Refresh</button>
            <button id="pwa-dismiss-update" class="btn-secondary">Skip</button>
        </div>
    `,document.body.appendChild(e),document.getElementById("pwa-refresh-btn").addEventListener("click",()=>{L&&L.postMessage({type:"SKIP_WAITING"})}),document.getElementById("pwa-dismiss-update").addEventListener("click",()=>{e.remove()})}let _;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),_=e,C.getItem("pwa-dismissed")!=="true"&&ee()});function ee(){if(document.querySelector(".install-banner"))return;const e=document.createElement("div");e.className="pwa-banner install-banner",e.innerHTML=`
        <div class="banner-content">
            <strong>Install App</strong>
            <span>Get the Student Utility Hub for offline use.</span>
        </div>
        <div class="banner-actions">
            <button id="pwa-install-btn" class="btn-primary">Install</button>
            <button id="pwa-dismiss-install" class="btn-secondary">Not Now</button>
        </div>
    `,document.body.appendChild(e),document.getElementById("pwa-install-btn").addEventListener("click",async()=>{if(e.remove(),_){_.prompt();const{outcome:t}=await _.userChoice;t==="accepted"&&(g.event(v.PWA_INSTALL_ACCEPTED),console.log("User accepted the install prompt")),_=null}}),document.getElementById("pwa-dismiss-install").addEventListener("click",()=>{e.remove(),C.setItem("pwa-dismissed","true"),g.event(v.PWA_INSTALL_DISMISSED)})}window.addEventListener("appinstalled",()=>{const e=document.querySelector(".install-banner");e&&e.remove(),_=null;const t=document.createElement("div");t.className="pwa-toast success-toast",t.textContent="App installed successfully!",document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),500)},3e3)});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("app"),t=q();e.appendChild(t);const o=document.createElement("main"),a=document.createElement("div");a.className="ad-placeholder top-ad",a.innerHTML="<p>Top Banner Ad (728x90 or Responsive)</p>",o.appendChild(a),e.appendChild(o),V(o);const n=document.createElement("div");n.className="ad-placeholder inline-ad",n.innerHTML="<p>After Hero Ad (Responsive)</p>",o.appendChild(n);const i=document.createElement("div");i.className="tool-grid",o.appendChild(i);const l=()=>{i.innerHTML="";for(let c=0;c<8;c++)i.innerHTML+=`
                <div class="skeleton-card">
                    <div class="skeleton skeleton-header"></div>
                    <div class="skeleton skeleton-icon"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text short"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
            `},s=(c="all",p="")=>{i.innerHTML="";const y=p.toLowerCase(),f=I.filter(b=>{const k=c==="all"||b.category===c,w=b.name.toLowerCase().includes(y)||b.description.toLowerCase().includes(y);return k&&w});i.children.length===0||i.querySelector(".skeleton-card")?(l(),setTimeout(()=>{T()},400)):T();function T(){if(i.innerHTML="",f.length===0){i.innerHTML='<div class="no-results"><span style="font-size:3rem">🔍</span><p>No tools found matching your search.</p></div>';return}f.forEach((b,k)=>{const w=R(b);w.style.animation=`fadeInUp 0.5s ease forwards ${k*.05}s`,w.style.opacity="0",w.querySelector(".tool-button").addEventListener("click",()=>{window.openModal(b)}),i.appendChild(w)})}};s(),document.querySelector(".category-filters").addEventListener("click",c=>{if(c.target.classList.contains("filter-btn")){document.querySelectorAll(".filter-btn").forEach(f=>f.classList.remove("active")),c.target.classList.add("active");const p=c.target.getAttribute("data-category"),y=document.getElementById("globalSearch");s(p,y.value),g.event(v.CATEGORY_FILTER,{category:p})}});const r=(c,p)=>{let y;return(...f)=>{clearTimeout(y),y=setTimeout(()=>{c.apply(null,f)},p)}};document.getElementById("globalSearch").addEventListener("input",r(c=>{const p=document.querySelector(".filter-btn.active").getAttribute("data-category");s(p,c.target.value),c.target.value.trim().length>0&&g.event(v.SEARCH,{query:c.target.value.trim()})},500));const h=Q();e.appendChild(h);const m=Z();e.appendChild(m)});
