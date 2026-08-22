document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const form = document.getElementById("enquiryForm");
    const messageBox = document.getElementById("formMessage");
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    const header = document.querySelector(".header");
    const backToTop = document.getElementById("backToTop");
    const galleryImages = document.querySelectorAll(".gallery img");

    /* =========================================================
       MOBILE NAVIGATION
       ========================================================= */

    const closeMenu = () => {
        if (!navLinks || !menuBtn) return;

        navLinks.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
        if (!navLinks || !menuBtn) return;

        navLinks.classList.add("active");
        menuBtn.setAttribute("aria-expanded", "true");
        menuBtn.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        document.body.classList.add("menu-open");
    };

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            if (navLinks.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }

        });


        // Close menu after clicking a navigation link

        navLinks.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", closeMenu);

        });


        // Close menu when clicking outside

        document.addEventListener("click", (event) => {

            if (
                navLinks.classList.contains("active") &&
                !navLinks.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                closeMenu();
            }

        });


        // Close menu with Escape

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });


        // Close mobile menu when screen becomes desktop size

        window.addEventListener("resize", () => {

            if (window.innerWidth > 800) {
                closeMenu();
            }

        });

    }


    /* =========================================================
       HEADER SCROLL STATE + BACK TO TOP
       ========================================================= */

    const updateScrollState = () => {

        const scrolled = window.scrollY > 20;

        if (header) {

            header.classList.toggle(
                "scrolled",
                scrolled
            );

        }


        if (backToTop) {

            backToTop.classList.toggle(
                "visible",
                window.scrollY > 500
            );

        }

    };


    window.addEventListener(
        "scroll",
        updateScrollState,
        { passive: true }
    );

    updateScrollState();


    // Back to top button

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =========================================================
       SCROLL REVEAL ANIMATION
       ========================================================= */

    const revealTargets = document.querySelectorAll(
        ".section, " +
        ".dark-section, " +
        ".service-card, " +
        ".industry-card, " +
        ".why-card, " +
        ".project, " +
        ".gallery img, " +
        ".contact-grid"
    );


    revealTargets.forEach((element) => {

        element.classList.add("reveal");

    });


    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, obs) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        obs.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        revealTargets.forEach((element) => {

            observer.observe(element);

        });

    } else {

        // Fallback for older browsers

        revealTargets.forEach((element) => {

            element.classList.add("show");

        });

    }


    /* =========================================================
       IMAGE LIGHTBOX
       ========================================================= */

    if (galleryImages.length) {

        const lightbox = document.createElement("div");

        lightbox.className = "image-lightbox";

        lightbox.setAttribute(
            "role",
            "dialog"
        );

        lightbox.setAttribute(
            "aria-modal",
            "true"
        );

        lightbox.setAttribute(
            "aria-label",
            "Project image viewer"
        );


        lightbox.innerHTML = `
            <button
                class="lightbox-close"
                type="button"
                aria-label="Close image viewer"
            >
                ×
            </button>

            <img
                src=""
                alt=""
            >
        `;


        document.body.appendChild(lightbox);


        const lightboxImage =
            lightbox.querySelector("img");

        const closeButton =
            lightbox.querySelector(".lightbox-close");


        let lastFocusedElement = null;


        // Close lightbox

        const closeLightbox = () => {

            lightbox.classList.remove("active");

            document.body.classList.remove(
                "menu-open"
            );

            lightboxImage.removeAttribute("src");


            if (lastFocusedElement) {

                lastFocusedElement.focus();

            }

        };


        galleryImages.forEach((image) => {

            image.setAttribute(
                "tabindex",
                "0"
            );

            image.setAttribute(
                "role",
                "button"
            );

            image.setAttribute(
                "aria-label",
                `Open ${image.alt || "project image"}`
            );


            const openLightbox = () => {

                lastFocusedElement = image;


                lightboxImage.src =
                    image.currentSrc ||
                    image.src;


                lightboxImage.alt =
                    image.alt ||
                    "Sarvkool project image";


                lightbox.classList.add(
                    "active"
                );


                closeButton.focus();

            };


            // Mouse click

            image.addEventListener(
                "click",
                openLightbox
            );


            // Keyboard support

            image.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        openLightbox();

                    }

                }
            );

        });


        // Close button

        closeButton.addEventListener(
            "click",
            closeLightbox
        );


        // Click outside image

        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === lightbox
                ) {

                    closeLightbox();

                }

            }
        );


        // Escape key

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    lightbox.classList.contains("active")
                ) {

                    closeLightbox();

                }

            }
        );

    }


    /* =========================================================
       ENQUIRY FORM → WHATSAPP
       ========================================================= */

    if (form) {

        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );


        const setMessage = (
            text,
            type = ""
        ) => {

            if (!messageBox) return;

            messageBox.textContent = text;

            messageBox.className = type;

        };


        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                /* ---------------------------------------------
                   BROWSER VALIDATION
                   --------------------------------------------- */

                if (!form.checkValidity()) {

                    form.reportValidity();

                    setMessage(
                        "Please check the highlighted fields.",
                        "error"
                    );

                    return;

                }


                /* ---------------------------------------------
                   GET FORM FIELDS
                   --------------------------------------------- */

                const getField = (fieldName) => {

                    return form.elements.namedItem(
                        fieldName
                    );

                };


                const name =
                    getField("name").value.trim();


                const phone =
                    getField("phone").value.trim();


                const email =
                    getField("email").value.trim();


                const company =
                    getField("company").value.trim();


                const requirement =
                    getField("requirement").value.trim();


                const details =
                    getField("details").value.trim();


                /* ---------------------------------------------
                   PHONE VALIDATION
                   --------------------------------------------- */

                const phoneDigits =
                    phone.replace(/\D/g, "");


                if (
                    phoneDigits.length < 10 ||
                    phoneDigits.length > 13
                ) {

                    setMessage(
                        "Please enter a valid phone number.",
                        "error"
                    );


                    getField("phone").focus();

                    return;

                }


                /* ---------------------------------------------
                   REQUIRED FIELD CHECK
                   --------------------------------------------- */

                if (
                    !name ||
                    !requirement ||
                    !details
                ) {

                    setMessage(
                        "Please fill in all required fields.",
                        "error"
                    );

                    return;

                }


                /* ---------------------------------------------
                   WHATSAPP MESSAGE
                   --------------------------------------------- */

                const whatsappText = [

                    "Hello Sarvkool,",

                    "",

                    "I would like to enquire about your industrial solutions.",

                    "",

                    `Name: ${name}`,

                    `Phone: ${phone}`,

                    `Email: ${email || "Not provided"}`,

                    `Company: ${company || "Not provided"}`,

                    `Requirement: ${requirement}`,

                    "",

                    "Project Details:",

                    details,

                    "",

                    "Thank you."

                ].join("\n");


                /* ---------------------------------------------
                   WHATSAPP URL
                   --------------------------------------------- */

                const whatsappURL =
                    "https://wa.me/919821999802?text=" +
                    encodeURIComponent(
                        whatsappText
                    );


                /* ---------------------------------------------
                   SHOW STATUS
                   --------------------------------------------- */

                setMessage(
                    "Opening WhatsApp…",
                    "success"
                );


                /* ---------------------------------------------
                   DISABLE SUBMIT BUTTON
                   --------------------------------------------- */

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.setAttribute(
                        "aria-disabled",
                        "true"
                    );

                }


                /* ---------------------------------------------
                   OPEN WHATSAPP

                   Direct navigation is used instead of
                   window.open() so Safari doesn't block it.
                   --------------------------------------------- */

                window.location.href =
                    whatsappURL;

            }
        );

    } else {

        console.error(
            "enquiryForm not found"
        );

    }

});