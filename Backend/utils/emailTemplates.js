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

    <p style="font-size: 16px; color: #374151;">
        Enjoy your special day to the fullest! 🎊
    </p>

    <!-- Footer -->
    <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #6b7280;">
        <p>
            Take care and have an amazing birthday 💛<br><br>
            <strong>— From someone who wishes you the best 😊</strong>
        </p>

        <p style="font-size: 12px; color: #9ca3af;">
            (Just a little birthday message for you 🎉)
        </p>
    </footer>

</div>
`;

}