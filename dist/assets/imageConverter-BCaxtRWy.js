import{s as t}from"./alerts-Cf_U-u9c.js";import{i as u,e as y}from"./sanitize-NlmEIhMi.js";const P=i=>{i.innerHTML=`
        <input type="file" id="imgConvFile" accept="image/jpeg,image/png,image/webp">
        <label for="imgConvFormat">Convert to:</label>
        <select id="imgConvFormat">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
        </select>
        <button id="imgConvButton">Convert & Download</button>
        <p>Note: WEBP support varies by browser.</p>
        <img id="imagePreview" src="#" alt="Preview" style="display:none; max-width: 100%; margin-top: 10px;">
    `;const a=i.querySelector("#imgConvFile"),v=i.querySelector("#imgConvFormat"),f=i.querySelector("#imgConvButton"),n=i.querySelector("#imagePreview");let m="converted_image";a.onchange=o=>{if(o.target.files&&o.target.files[0]){const e=o.target.files[0];if(!u(e,["image/jpeg","image/png","image/webp"],50)){t("Invalid or unsupported file.","error"),a.value="",n.style.display="none";return}m=e.name.split(".")[0]||"image";const s=new FileReader;s.onload=c=>{n.src=c.target.result,n.style.display="block"},s.readAsDataURL(e)}else n.style.display="none",n.src="#"},f.onclick=()=>{if(!a.files||a.files.length===0){t("Please select an image file first.","error");return}const o=a.files[0];if(!u(o,["image/jpeg","image/png","image/webp"],50)){t("Invalid file.","error");return}const e=v.value,s=e.split("/")[1];t("Processing...","info");const c=new FileReader;c.onload=w=>{const r=new Image;r.onload=()=>{const g=document.createElement("canvas");g.width=r.width,g.height=r.height,g.getContext("2d").drawImage(r,0,0),g.toBlob(p=>{if(p){const d=URL.createObjectURL(p),l=document.createElement("a");l.href=d,l.download=`${y(m)}_converted.${s}`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(d),t("Conversion successful!","success")}else t(`Error converting to ${e}. This format might not be supported for export by your browser.`,"error")},e,.9)},r.onerror=()=>t("Could not load image. Ensure it is a valid JPG, PNG, or WEBP.","error"),r.src=w.target.result},c.readAsDataURL(o)}};export{P as default};
