interface EmailLayoutOptions {
  previewText: string;
  heading: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function renderEmailLayout({ previewText, heading, bodyHtml, ctaText, ctaUrl }: EmailLayoutOptions) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f3ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden;">${previewText}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3ef; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e3da;">

          <tr>
            <td style="background-color:#0d100a; padding: 24px 32px;">
              <span style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #ffffff;">
                circuit<span style="color:#ffb020;">.parts</span>
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px;">
              <h1 style="margin:0 0 16px; font-size: 22px; color:#14180f; font-weight: 600;">
                ${heading}
              </h1>
              <div style="font-size: 15px; line-height: 1.6; color:#3a3a34;">
                ${bodyHtml}
              </div>

              ${
                ctaText && ctaUrl
                  ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                       <tr>
                         <td style="background-color:#ffb020; border-radius: 4px;">
                           <a href="${ctaUrl}" style="display:inline-block; padding: 12px 24px; font-family: 'Courier New', monospace; font-size: 14px; color:#0d100a; text-decoration:none; font-weight: 600;">
                             ${ctaText}
                           </a>
                         </td>
                       </tr>
                     </table>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 32px; border-top: 1px solid #eeece4;">
              <p style="margin:0; font-size: 12px; color:#9a9a8f; font-family: 'Courier New', monospace;">
                circuit.parts — dev boards &amp; components for makers
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}