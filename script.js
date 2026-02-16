const zones = {
    ny: "America/New_York",
    lon: "Europe/London",
    del: "Asia/Kolkata",
    man: "Asia/Manila"
};

/* ================= LIVE CLOCKS ================= */

function updateClocks() {
    for (let key in zones) {
        const time = new Intl.DateTimeFormat("en-US", {
            timeZone: zones[key],
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }).format(new Date());

        document.getElementById(key + "Clock").textContent = time;
    }
}
setInterval(updateClocks, 1000);
updateClocks();

/* ================= TIME CONVERTER ================= */

function convertTime(sourceKey, value) {
    if (!value) return;

    const dateValue = document.getElementById("meetingDate").value;
    if (!dateValue) {
        alert("Please select a meeting date first.");
        return;
    }

    const [year, month, day] = dateValue.split("-").map(Number);
    const [hour, minute] = value.split(":").map(Number);

    const utcDate = new Date(
        new Date(year, month - 1, day, hour, minute)
            .toLocaleString("en-US", { timeZone: zones[sourceKey] })
    );

    for (let key in zones) {

        const target = new Date(
            utcDate.toLocaleString("en-US", { timeZone: zones[key] })
        );

        const hh = String(target.getHours()).padStart(2, "0");
        const mm = String(target.getMinutes()).padStart(2, "0");

        if (key !== sourceKey) {
            document.getElementById(key + "Input").value = `${hh}:${mm}`;
        }

        document.getElementById(key + "Pretty").textContent =
            target.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });

        document.getElementById(key + "Date").textContent =
            target.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });

        const sourceDay = new Date(
            utcDate.toLocaleString("en-US", { timeZone: zones[sourceKey] })
        ).getDate();

        let label = "Today";
        if (target.getDate() > sourceDay) label = "+1 Day";
        if (target.getDate() < sourceDay) label = "-1 Day";

        document.getElementById(key + "Day").textContent = label;
    }
}

document.querySelectorAll("input[type='time']").forEach(input => {
    input.addEventListener("change", function () {
        convertTime(this.id.replace("Input", ""), this.value);
    });
});

/* ================= EMPLOYEE SEARCH ================= */

document.getElementById("employeeSearch").addEventListener("keyup", function () {

    const search = this.value.toLowerCase();
    const offices = document.querySelectorAll(".employee-office");

    offices.forEach(office => {
        const names = office.querySelectorAll("li");
        let found = false;

        names.forEach(name => {
            if (name.textContent.toLowerCase().includes(search)) {
                name.style.display = "block";
                found = true;
            } else {
                name.style.display = "none";
            }
        });

        office.style.display = found ? "block" : "none";
    });
});

// Ensure page content is pushed below the fixed header
function adjustBodyPaddingForHeader() {
    const hdr = document.querySelector('header');
    if (!hdr) return;
    document.body.style.paddingTop = hdr.offsetHeight + 'px';
}

window.addEventListener('load', adjustBodyPaddingForHeader);
window.addEventListener('resize', adjustBodyPaddingForHeader);
