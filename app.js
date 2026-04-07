$(document).ready(function () {
    loadPage("home.html");

    $(".menu button").click(function () {
        let page = $(this).data("page");

        $(".menu button").removeClass("active");
        $(this).addClass("active");

        $("#content").fadeOut(200, function () {
            loadPage(page);
            $("#content").fadeIn(300);
        });
    });

    function loadPage(page) {
        $("#content").load(page, function () {

            // contact auto restore localStorage
            if (page === "contact.html") {
                $("#name").val(localStorage.getItem("cv_name") || "");
                $("#email").val(localStorage.getItem("cv_email") || "");
                $("#message").val(localStorage.getItem("cv_message") || "");
            }

            // github api load
            if (page === "github.html") {
                loadGithubInfo();
            }
        });
    }


    $(document).on("input", "#name, #email, #message", function () {
        localStorage.setItem("cv_name", $("#name").val());
        localStorage.setItem("cv_email", $("#email").val());
        localStorage.setItem("cv_message", $("#message").val());
    });


    $(document).on("submit", "#contactForm", function (e) {
        e.preventDefault();

        let name = $("#name").val().trim();
        let email = $("#email").val().trim();
        let message = $("#message").val().trim();

        let isValid = true;

        $(".error-text").text("");
        $("#successMessage").text("");

        if (name === "") {
            $("#nameError").text("Nama wajib diisi");
            isValid = false;
        }

        let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (email === "") {
            $("#emailError").text("Email wajib diisi");
            isValid = false;
        } else if (!emailPattern.test(email)) {
            $("#emailError").text("Format email tidak valid");
            isValid = false;
        }

        if (message.length < 10) {
            $("#messageError").text("Pesan minimal 10 karakter");
            isValid = false;
        }

        if (isValid) {
            $("#successMessage").text("Pesan berhasil disimpan ✨");
        }
    });


    function loadGithubInfo() {
        let username = "36not2good";

        $("#githubContent").html("<p>Loading data GitHub...</p>");

        $.ajax({
            url: `https://api.github.com/users/${username}`,
            method: "GET",
            success: function (user) {

                $.ajax({
                    url: user.repos_url,
                    method: "GET",
                    success: function (repos) {
                        let repoList = "";

                        repos.forEach(function (repo) {
                            repoList += `
                                <li>
                                    <a href="${repo.html_url}" target="_blank">
                                        ${repo.name}
                                    </a>
                                </li>
                            `;
                        });

                        $("#githubContent").html(`
                            <div class="github-card">
                                <img src="${user.avatar_url}" class="github-avatar">
                                <h3>${user.login}</h3>
                                <p>Repository: ${user.public_repos}</p>
                                <p>Followers: ${user.followers}</p>
                                <h4>Daftar Repository</h4>
                                <ul>${repoList}</ul>
                            </div>
                        `);
                    },
                    error: function () {
                        $("#githubContent").html("<p style='color:red;'>Gagal memuat repository</p>");
                    }
                });
            },
            error: function () {
                $("#githubContent").html("<p style='color:red;'>Gagal mengambil data GitHub</p>");
            }
        });
    }
});