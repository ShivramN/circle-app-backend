module.exports = {
  verificationCodeTemplate: (code) => {
    return `
        <html> <style> body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333; } p { margin-bottom: 15px; } ul { padding-left: 20px; } li { margin-bottom: 5px; } </style><body> <p>Dear Member,</p> <p>Thank you for joining Circle, the social media platform where connections and conversations come full circle! We're thrilled to have you in our community.</p> <p><b>Your OTP is ${code}</b>.</p><br> </br><p><b>Here's a quick start to make the most out of Circle:</b></p> <p><b>Explore:</b> Find and follow interesting people and groups. <p><b>Share:</b> Post your thoughts, photos, and experiences.</p> <p><b>Connect:</b> Engage with friends and discover new ones.</p> <p>If you have any questions or need assistance, our support team is always here to help.</p><br></br> <p>Welcome aboard, and happy socializing!</p><br> </br>
        <p>Best Wishes,</p><p>
        The Circle Team</p>
        <div class="svg-container">
      <img align="center" alt="" src="https://circle-app.s3.ap-south-1.amazonaws.com/PROD/logo727b42f2e7d8.png" width="90" style="max-width:1406px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic" class="mcnImage">

</div>
        </body>
        </html>`
  },
  forgetCodeTemplate: (code, fullName) => {
    return `<html>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
      }
      p {
        margin-bottom: 15px;
      }
      .svg-container {
        width: 100px;
        height: 100px;
      }
  
      .svg-content {
        width: 100%;
        height: 100%;
      }
    </style>
    <body>
      <p>Hello ${fullName},</p>
      <p>We received a request to reset your Circle account password. No worries, we can help with that!</p>
      <p><b>Your OTP is ${code}</b>.</p>
      <br></br>
      <p>Didn't request a password reset? If you did not initiate this request, please ignore this email or contact us for support.</p>
      <br></br>
      <p>Stay safe,</p>
      <p>The Circle Team</p>
      <div class="svg-container">
      <img align="center" alt="" src="https://circle-app.s3.ap-south-1.amazonaws.com/PROD/logo727b42f2e7d8.png" width="90" style="max-width:1406px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic" class="mcnImage">

</div>
    </body>
  </html>
      `
  },
  celebrityTemplate: (fullName) => {
    return `
        <html> <style> body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333; } p { margin-bottom: 15px; } ul { padding-left: 20px; } li { margin-bottom: 5px; } </style><body> <p>Dear ${fullName},</p> <p>Great news! Your identity verification for Circle has been successfully completed. You're now a
        verified member of our community, which opens up new and exciting ways to engage on our
        platform.</p><br> </br><p>Here's what you can do next:</p><p><b>Enhance Credibility: </b>Your verified status adds trust to your profile.</p> <p><b>Increased Visibility: </b> Get noticed in the community. <p><b>Exclusive Access:</b> Enjoy special features and offers available only to verified members.</p> <p>Thank you for taking the time to verify your account, ensuring a safe and authentic community for
        everyone.</p><br></br><p>Cheers to making more meaningful connections!</p><br></br> 
        <p>Warm Regards,</p><p>
        The Circle Team</p>
        <div class="svg-container">
      <img align="center" alt="" src="https://circle-app.s3.ap-south-1.amazonaws.com/PROD/logo727b42f2e7d8.png" width="90" style="max-width:1406px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic" class="mcnImage">

</div>
        </body>
        </html>`
  },
  subcriptionTemplate: (fullName, planName, planDescription, startDate, endDate, price) => {
    return `
        <html> <style> body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333; } p { margin-bottom: 15px; } ul { padding-left: 20px; } li { margin-bottom: 5px; } </style><body> <p>Dear ${fullName},</p> <p>Congratulations and thank you for upgrading your Circle! We are excited to have you onboard with
        our exclusive features that are now unlocked for you.</p><br></br> <p><b>Your Circle Upgrade Benefits:</b></p> <p><b>Unlimited Access: </b>Enjoy unrestricted access to all features and content</p> <p><b>Priority Support: </b> Experience faster response times from our support team. </p><br></br><p><b>Subscription Details:</b></p><p><b>Plan: ${planName}/${planDescription}</b></p><p><b>Start Date: ${startDate}</b></p><p><b>Renewal Date: ${endDate}</b></p><p><b>Amount Paid: ${price}</b></p><p>You can manage your subscription details anytime in your account settings.</p><br></br><p>
        If you have any questions or need assistance, our dedicated support team is here to help.</p><br></br><p>Thank you for choosing Circle. We are committed to providing you with an exceptional social media
        experience.</p><p>Enjoy your premium journey!</p><br></br> 
        <p>Warm Regards,</p><p>
        The Circle Team</p>
        <div class="svg-container">
        <img align="center" alt="" src="https://circle-app.s3.ap-south-1.amazonaws.com/PROD/logo727b42f2e7d8.png" width="90" style="max-width:1406px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic" class="mcnImage">
  
  </div>
        </body>
        </html>`
  }
}
