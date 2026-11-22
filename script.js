/* =================================
 MENGAMBIL DATA LOCAL STORAGE
================================= */

// Mengambil data akun
let users = JSON.parse(
    localStorage.getItem("users")
) || [];

// Mengambil akun yang login
let currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

// Menyiapkan data jadwal
let jadwal = [];

// Urutan hari
const urutanHari = [
    "Senin", "Selasa", "Rabu",
    "Kamis", "Jumat", "Sabtu"
];


/* =================================
 MENGAMBIL ELEMEN HTML
================================= */

const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const jadwalForm = document.getElementById("jadwalForm");


/* =================================
    PINDAH HALAMAN
================================= */

document.getElementById("showRegister")
.addEventListener("click", function(e) {

    e.preventDefault();

    loginPage.classList.add("hidden");
    registerPage.classList.remove("hidden");

});

document.getElementById("showLogin")
.addEventListener("click", function(e) {

    e.preventDefault();

    registerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

});


/* =================================
 FITUR MELIHAT PASSWORD
================================= */

document.querySelectorAll(".toggle-password")
.forEach(function(button) {

    button.addEventListener("click", function() {

        const targetId = this.dataset.target;

        const passwordInput =
            document.getElementById(targetId);

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            this.textContent = "🙈";

        } else {

            passwordInput.type = "password";
            this.textContent = "👁️";

        }

    });

});


/* =================================
 FITUR REGISTRASI
================================= */

registerForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const nama = document.getElementById("regName").value.trim();

    const email = document.getElementById("regEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("regPassword").value;

    // Memeriksa email
    const sudahAda = users.some(function(user) {
        return user.email === email;
    });

    if (sudahAda) {
        alert("Email sudah terdaftar!");
        return;
    }

    // Membuat akun baru
    const userBaru = {
        nama: nama,
        email: email,
        password: password
    };

    users.push(userBaru);

    // Menyimpan akun
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Registrasi berhasil! Silakan login.");

    registerForm.reset();

    registerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

});


/* =================================
 FITUR LOGIN
================================= */

loginForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("loginPassword").value;

    // Memeriksa akun pengguna
    const user = users.find(function(item) {

        return item.email === email &&
               item.password === password;

    });

    if (user) {

        currentUser = {
            nama: user.nama,
            email: user.email
        };

        // Menyimpan pengguna yang login
        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        alert("Login berhasil!");

        loginForm.reset();

        tampilkanDashboard();

    } else {

        alert("Email atau password salah!");

    }

});


/* =================================
    MENAMPILKAN DASHBOARD
================================= */

function tampilkanDashboard() {

    if (!currentUser) {
        loginPage.classList.remove("hidden");
        dashboardPage.classList.add("hidden");
        return;
    }

    loginPage.classList.add("hidden");
    registerPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");

    document.getElementById("userName").textContent =
        currentUser.nama;

    // Mengambil jadwal berdasarkan email
    jadwal = JSON.parse(
        localStorage.getItem("jadwal_" + currentUser.email)
    ) || [];

    // Menampilkan tanggal otomatis
    document.getElementById("tanggal").textContent =
        new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    tampilkanJadwal();

}


/* =================================
   MENYIMPAN JADWAL
================================= */

function simpanJadwal() {

    localStorage.setItem(
        "jadwal_" + currentUser.email,
        JSON.stringify(jadwal)
    );

}


/* =================================
  MENAMBAHKAN JADWAL
================================= */

jadwalForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const id = document.getElementById("editId").value;

    const mulai = document.getElementById("jamMulai").value;
    const selesai = document.getElementById("jamSelesai").value;

    if (mulai >= selesai) {
        alert("Jam selesai harus lebih besar dari jam mulai!");
        return;
    }

    const dataBaru = {

        id: id || Date.now().toString(),

        matkul: document.getElementById("matkul").value.trim(),

        dosen: document.getElementById("dosen").value.trim(),

        hari: document.getElementById("hari").value,

        mulai: mulai,

        selesai: selesai,

        ruangan: document.getElementById("ruangan").value.trim()

    };

    if (id) {

        // Mengedit jadwal
        const index = jadwal.findIndex(function(item) {
            return item.id === id;
        });

        if (index !== -1) {
            jadwal[index] = dataBaru;
        }

        alert("Jadwal berhasil diperbarui!");

    } else {

        // Menambahkan jadwal
        jadwal.push(dataBaru);

        alert("Jadwal berhasil ditambahkan!");

    }

    simpanJadwal();

    jadwalForm.reset();

    resetEdit();

    tampilkanJadwal();

});


/* =================================
 MENAMPILKAN DAFTAR JADWAL
================================= */

function tampilkanJadwal() {

    const jadwalList = document.getElementById("jadwalList");

    const filter = document.getElementById("filterHari").value;

    // Mengurutkan berdasarkan hari dan jam
    let data = [...jadwal].sort(function(a, b) {

        const bedaHari =
            urutanHari.indexOf(a.hari) -
            urutanHari.indexOf(b.hari);

        return bedaHari || a.mulai.localeCompare(b.mulai);

    });

    // Filter berdasarkan hari
    if (filter !== "Semua") {

        data = data.filter(function(item) {
            return item.hari === filter;
        });

    }

    jadwalList.innerHTML = "";

    if (data.length === 0) {

        const pesan = document.createElement("p");

        pesan.className = "empty";

        pesan.textContent = "Belum ada jadwal kuliah.";

        jadwalList.appendChild(pesan);

    }

    data.forEach(function(item) {

        const card = document.createElement("div");

        card.className = "jadwal-card";

        const judul = document.createElement("h3");
        judul.textContent = "📘 " + item.matkul;

        const dosen = document.createElement("p");
        dosen.textContent = "👨‍🏫 Dosen: " + item.dosen;

        const hari = document.createElement("p");
        hari.textContent = "📅 Hari: " + item.hari;

        const jam = document.createElement("p");
        jam.textContent =
            "⏰ Jam: " + item.mulai + " - " + item.selesai;

        const ruangan = document.createElement("p");
        ruangan.textContent = "📍 Ruangan: " + item.ruangan;

        const actions = document.createElement("div");
        actions.className = "actions";

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {
            editJadwal(item.id);
        });

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Hapus";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            hapusJadwal(item.id);
        });

        actions.append(editButton, deleteButton);

        card.append(
            judul,
            dosen,
            hari,
            jam,
            ruangan,
            actions
        );

        jadwalList.appendChild(card);

    });


    // Memperbarui statistik
    document.getElementById("totalJadwal").textContent =
        jadwal.length;

    document.getElementById("totalHari").textContent =
        new Set(jadwal.map(item => item.hari)).size;

    document.getElementById("totalDosen").textContent =
        new Set(jadwal.map(item => item.dosen.toLowerCase())).size;

}


/* =================================
 EDIT JADWAL
================================= */

function editJadwal(id) {

    const item = jadwal.find(function(data) {
        return data.id === id;
    });

    if (!item) return;

    document.getElementById("editId").value = item.id;

    document.getElementById("matkul").value = item.matkul;

    document.getElementById("dosen").value = item.dosen;

    document.getElementById("hari").value = item.hari;

    document.getElementById("jamMulai").value = item.mulai;

    document.getElementById("jamSelesai").value = item.selesai;

    document.getElementById("ruangan").value = item.ruangan;

    document.getElementById("formTitle").textContent =
        "✏️ Edit Jadwal Kuliah";

    document.getElementById("submitBtn").textContent =
        "Simpan Perubahan";

    document.getElementById("cancelEdit")
        .classList.remove("hidden");

    document.getElementById("formTitle").scrollIntoView({
        behavior: "smooth"
    });

}


/* =================================
   MEMBATALKAN EDIT
================================= */

function resetEdit() {

    document.getElementById("editId").value = "";

    document.getElementById("formTitle").textContent =
        "➕ Tambah Jadwal Kuliah";

    document.getElementById("submitBtn").textContent =
        "+ Simpan Jadwal";

    document.getElementById("cancelEdit")
        .classList.add("hidden");

}

document.getElementById("cancelEdit").addEventListener(
    "click",
    function() {

        jadwalForm.reset();

        resetEdit();

    }
);


/* =================================
 MENGHAPUS JADWAL
================================= */

function hapusJadwal(id) {

    const yakin = confirm(
        "Apakah kamu yakin ingin menghapus jadwal ini?"
    );

    if (!yakin) return;

    jadwal = jadwal.filter(function(item) {
        return item.id !== id;
    });

    simpanJadwal();

    tampilkanJadwal();

    alert("Jadwal berhasil dihapus!");

}


/* =================================
FILTER HARI
================================= */

document.getElementById("filterHari")
.addEventListener("change", tampilkanJadwal);


/* =================================
 LOGOUT
================================= */

document.getElementById("logoutBtn")
.addEventListener("click", function() {

    const yakin = confirm("Apakah kamu ingin keluar?");

    if (!yakin) return;

    localStorage.removeItem("currentUser");

    currentUser = null;
    jadwal = [];

    dashboardPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

    alert("Berhasil logout!");

});


/* =================================
 LOGIN OTOMATIS
================================= */

if (currentUser) {

    // Memeriksa apakah akun masih terdaftar
    const akunAda = users.some(function(user) {
        return user.email === currentUser.email;
    });

    if (akunAda) {
        tampilkanDashboard();
    } else {
        currentUser = null;
        localStorage.removeItem("currentUser");
    }

}
