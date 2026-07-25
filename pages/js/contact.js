/* ================= CONTACT FORM ================= */

function sendToWhatsApp(event)
{
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const country = document.getElementById("country").value;
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    /* ================= VALIDATION ================= */

    // Name
    const namePattern = /^[A-Za-z ]+$/;

    if (!namePattern.test(name) || name.length < 3)
    {
        alert("Please enter a valid full name.");
        return;
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(email))
    {
        alert("Please enter a valid email address.");
        return;
    }

    // Phone (optional)
    if (phone !== "")
    {
        const phonePattern = /^\+?[0-9]{7,15}$/;

        if (!phonePattern.test(phone))
        {
            alert("Please enter a valid phone number.");
            return;
        }
    }

    // Country
    if (country === "")
    {
        alert("Please select your country.");
        return;
    }

    // Subject
    if (subject.length === 0)
    {
        alert("Please enter a subject.");
        return;
    }

    if (subject.length > 80)
    {
        alert("Subject cannot exceed 80 characters.");
        return;
    }

    // Message
    if (message.length < 10)
    {
        alert("Message must contain at least 10 characters.");
        return;
    }

    /* ================= WHATSAPP ================= */

    const whatsappNumber = "919336620110";

    const whatsappMessage =
`*IMAGEOC - Contact Form*
━━━━━━━━━━━━━━━━━━━━

*Full Name :*  \`\`\`${name} \`\`\`
*Email :*  \`\`\`${email} \`\`\`
*Phone :*  \`\`\`${phone || "Not Provided"} \`\`\`
*Country :*  \`\`\`${country} \`\`\`
*Subject :*  \`\`\`${subject} \`\`\`
━━━━━━━━━━━━━━━━━━━━
*Message :*
 \`\`\`${message} \`\`\``;

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, "_blank");

    // Reset form after opening WhatsApp
    document.querySelector(".contact-form").reset();
}