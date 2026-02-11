export function getResetPasswordEmailTemplate(resetPasswordUrl) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff; color: #1f2937;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #f97316; margin: 0;">
            🎉 Happy Birthday! 🎂
        </h2>
    </div>

    <!-- Body -->
    <p style="font-size: 16px; color: #374151;">Hey,</p>

    <p style="font-size: 16px; color: #374151;">
        🎈 Just wanted to take a moment to wish you a very Happy Birthday!
    </p>

    <p style="font-size: 16px; color: #374151;">
        I hope your day is filled with smiles, laughter, and everything that makes you happy.
    </p>

    <p style="font-size: 16px; color: #374151;">
        You truly deserve a wonderful year ahead, full of success, peace, and unforgettable memories. 🎁✨
    </p>

    <!-- Button Section -->
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://drive.google.com/drive/folders/14N55ynjYCifgpLFTgsFE_kkM7knSYG43"
           target="_blank"
           style="
               display: inline-block;
               background-color: #f97316;
               color: #ffffff;
               text-decoration: none;
               font-size: 16px;
               font-weight: bold;
               padding: 12px 26px;
               border-radius: 8px;
               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
           ">
            🎁 Open Your Birthday Surprise
        </a>

        <!-- Safety Note -->
        <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
            ✅ Don’t worry — this is a safe Google Drive link shared just for you.
            Open with this email only.
        </p>
    </div>

    <!-- Footer -->
    <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #6b7280;">
        <p>
            Take care and have an amazing birthday 💛<br><br>
        </p>

        <p style="font-size: 12px; color: #9ca3af;">
            (Just a little birthday message for you 🎉)
        </p>
    </footer>

</div>


`;

}