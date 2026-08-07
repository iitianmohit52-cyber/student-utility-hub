import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <div id="courseRows">
                <div class="course-row" style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:0.5rem; margin-bottom:0.5rem;">
                    <input type="text" class="course-name" placeholder="Course Name" value="Subject 1">
                    <input type="number" class="course-credits" placeholder="Credits" value="3" min="1" max="10">
                    <select class="course-grade">
                        <option value="4.0">A (4.0)</option>
                        <option value="3.7">A- (3.7)</option>
                        <option value="3.3">B+ (3.3)</option>
                        <option value="3.0">B (3.0)</option>
                        <option value="2.7">B- (2.7)</option>
                        <option value="2.3">C+ (2.3)</option>
                        <option value="2.0">C (2.0)</option>
                        <option value="1.0">D (1.0)</option>
                        <option value="0.0">F (0.0)</option>
                    </select>
                </div>
            </div>

            <button type="button" id="addCourseBtn" class="tool-button" style="margin-top:0.5rem;">➕ Add Another Course</button>
            <button type="button" id="calcGpaBtn" class="primary-btn" style="margin-top:1rem; width:100%;">📚 Calculate GPA</button>

            <div id="gpaResult" class="result-area" style="display:none; margin-top:1.2rem; text-align:center;">
                <span style="font-size:1rem; color:var(--text-secondary);">Semester GPA:</span>
                <h2 id="gpaOutVal" style="font-size:2.5rem; color:var(--accent-color); margin:0.4rem 0;">--</h2>
                <p id="totalCreditsOut" style="font-weight:600; color:var(--text-primary);"></p>
            </div>
        </div>
    `;

    const courseRows = container.querySelector('#courseRows');
    const addBtn = container.querySelector('#addCourseBtn');
    const calcBtn = container.querySelector('#calcGpaBtn');
    const resultDiv = container.querySelector('#gpaResult');
    const gpaOut = container.querySelector('#gpaOutVal');
    const creditsOut = container.querySelector('#totalCreditsOut');

    let courseCount = 1;

    addBtn.onclick = () => {
        courseCount++;
        const row = document.createElement('div');
        row.className = 'course-row';
        row.style.cssText = 'display:grid; grid-template-columns:2fr 1fr 1fr; gap:0.5rem; margin-bottom:0.5rem;';
        row.innerHTML = `
            <input type="text" class="course-name" placeholder="Course Name" value="Subject ${courseCount}">
            <input type="number" class="course-credits" placeholder="Credits" value="3" min="1" max="10">
            <select class="course-grade">
                <option value="4.0">A (4.0)</option>
                <option value="3.7">A- (3.7)</option>
                <option value="3.3">B+ (3.3)</option>
                <option value="3.0">B (3.0)</option>
                <option value="2.7">B- (2.7)</option>
                <option value="2.3">C+ (2.3)</option>
                <option value="2.0">C (2.0)</option>
                <option value="1.0">D (1.0)</option>
                <option value="0.0">F (0.0)</option>
            </select>
        `;
        courseRows.appendChild(row);
    };

    calcBtn.onclick = () => {
        const rows = courseRows.querySelectorAll('.course-row');
        let totalPoints = 0;
        let totalCredits = 0;

        rows.forEach(row => {
            const credits = parseFloat(row.querySelector('.course-credits').value) || 0;
            const gradePoints = parseFloat(row.querySelector('.course-grade').value) || 0;
            totalPoints += (credits * gradePoints);
            totalCredits += credits;
        });

        if (totalCredits === 0) {
            showAlert('Please enter valid credit hours for courses.', 'error');
            return;
        }
        hideAlert();

        const gpa = (totalPoints / totalCredits).toFixed(2);
        gpaOut.textContent = gpa;
        creditsOut.textContent = `Total Credits: ${totalCredits}`;
        resultDiv.style.display = 'block';
    };
};
