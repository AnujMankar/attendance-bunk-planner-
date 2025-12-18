let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let requiredPercent = localStorage.getItem("requiredPercent") || 75;

document.getElementById("required").value = requiredPercent;

renderSubjects();

function addSubject() {
    let subject = document.getElementById("subject").value;
    let total = Number(document.getElementById("total").value);
    let attended = Number(document.getElementById("attended").value);
    let required = Number(document.getElementById("required").value);

    if (!subject || total <= 0 || attended < 0 || attended > total || required <= 0) {
        alert("Enter valid details");
        return;
    }

    localStorage.setItem("requiredPercent", required);

    subjects.push({ subject, total, attended });
    saveAndRender();

    document.getElementById("subject").value = "";
    document.getElementById("total").value = "";
    document.getElementById("attended").value = "";
}

function renderSubjects() {
    let container = document.getElementById("cardContainer");
    container.innerHTML = "";

    let totalLectures = 0;
    let totalAttended = 0;
    let required = Number(localStorage.getItem("requiredPercent")) || 75;

    subjects.forEach((s, index) => {
        let percent = ((s.attended / s.total) * 100).toFixed(2);
        let minRequired = Math.ceil((required / 100) * s.total);

        let info, statusClass, cardClass;

    if (s.attended < minRequired) {
        info = `
            <strong>Shortage ❌</strong><br>
            Attend ${minRequired - s.attended} more lecture(s) to be safe
        `;
        statusClass = "status-shortage";
        cardClass = "shortage-card";
    } else {
        info = `
            <strong>Safe ✅</strong><br>
            You can bunk ${s.total - s.attended} more lecture(s)
        `;
        statusClass = "status-safe";
        cardClass = "safe-card";
    }


        totalLectures += s.total;
        totalAttended += s.attended;

        container.innerHTML += `
        <div class="subject-card ${cardClass}">
            <h3>${s.subject}</h3>
            <p>Total: ${s.total} | Attended: ${s.attended}</p>
            <p>Attendance: ${percent}%</p>
            <p class="${statusClass}">${info}</p>

            <div style="margin-top:10px;">
                <button onclick="editSubject(${index})">✏️ Edit</button>
                <button onclick="deleteSubject(${index})">🗑 Delete</button>
            </div>
        </div>
        `;
    });

    // Overall calculation
    let overallPercent = totalLectures
        ? ((totalAttended / totalLectures) * 100).toFixed(2)
        : 0;

    document.getElementById("overall").innerHTML =
        `📊 Overall Attendance: <b>${overallPercent}%</b>`;

    localStorage.setItem("subjects", JSON.stringify(subjects));
}

function editSubject(index) {
    let s = subjects[index];

    document.getElementById("subject").value = s.subject;
    document.getElementById("total").value = s.total;
    document.getElementById("attended").value = s.attended;

    subjects.splice(index, 1);
    saveAndRender();
}

function deleteSubject(index) {
    if (confirm("Delete this subject?")) {
        subjects.splice(index, 1);
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    renderSubjects();
}

function toggleTheme() {
    document.documentElement.classList.toggle("dark-mode");
    let btn = document.getElementById("themeBtn");
    btn.innerText = document.documentElement.classList.contains("dark-mode")
        ? "🌞 Light Mode"
        : "🌙 Dark Mode";
}

document.addEventListener("click", function (e) {
    const target = e.target.closest("button");
    if (!target) return;

    target.classList.remove("ripple");
    void target.offsetWidth; // reset animation
    target.classList.add("ripple");
});
