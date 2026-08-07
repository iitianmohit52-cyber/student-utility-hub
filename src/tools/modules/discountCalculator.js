import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="originalPrice">Original Price ($ / ₹):</label>
            <input type="number" id="originalPrice" placeholder="100" value="100">

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div>
                    <label for="discountPct">Discount (%) :</label>
                    <input type="number" id="discountPct" placeholder="20" value="20">
                </div>
                <div>
                    <label for="taxPct">Tax / GST (%) :</label>
                    <input type="number" id="taxPct" placeholder="0" value="0">
                </div>
            </div>

            <button id="calcDiscountBtn" style="margin-top:1.2rem;">🏷️ Calculate Final Price</button>

            <div id="discountResult" class="result-area" style="display:none; margin-top:1.2rem; text-align:center;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div>
                        <span style="font-size:0.9rem; color:var(--text-secondary);">Final Price:</span>
                        <h3 id="finalPriceOut" style="font-size:1.8rem; color:var(--accent-color); margin-top:0.3rem;">--</h3>
                    </div>
                    <div>
                        <span style="font-size:0.9rem; color:var(--text-secondary);">You Save:</span>
                        <h3 id="savingsOut" style="font-size:1.8rem; color:#4ade80; margin-top:0.3rem;">--</h3>
                    </div>
                </div>
            </div>
        </div>
    `;

    const priceInput = container.querySelector('#originalPrice');
    const discountInput = container.querySelector('#discountPct');
    const taxInput = container.querySelector('#taxPct');
    const calcBtn = container.querySelector('#calcDiscountBtn');
    const resultDiv = container.querySelector('#discountResult');
    const finalOut = container.querySelector('#finalPriceOut');
    const savingsOut = container.querySelector('#savingsOut');

    calcBtn.onclick = () => {
        const orig = parseFloat(priceInput.value);
        const disc = parseFloat(discountInput.value) || 0;
        const tax = parseFloat(taxInput.value) || 0;

        if (isNaN(orig) || orig < 0) {
            showAlert('Please enter a valid original price.', 'error');
            return;
        }
        hideAlert();

        const savedAmount = orig * (disc / 100);
        const priceAfterDisc = orig - savedAmount;
        const taxAmount = priceAfterDisc * (tax / 100);
        const finalPrice = priceAfterDisc + taxAmount;

        finalOut.textContent = `$${finalPrice.toFixed(2)}`;
        savingsOut.textContent = `$${savedAmount.toFixed(2)}`;
        resultDiv.style.display = 'block';
    };
};
