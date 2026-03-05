interface ContactFormEmailProps {
    name: string;
    email: string;
    message: string;
}

export const ContactFormEmail = ({ name, email, message }: ContactFormEmailProps) => (
    <html>
        <head>
            <meta charSet='utf-8' />
            <style>
                {`
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6;
                        color: #43160c;
                        background-color: #faeacd;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                    }
                    .header {
                        background: linear-gradient(135deg, #d06129 0%, #ff4d00 100%);
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .logo {
                        max-width: 180px;
                        height: auto;
                    }
                    .content {
                        padding: 40px 30px;
                        background-color: #ffffff;
                    }
                    .title {
                        font-size: 24px;
                        font-weight: 800;
                        color: #43160c;
                        margin: 0 0 20px 0;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .field {
                        margin-bottom: 24px;
                        padding: 20px;
                        background-color: #faeacd;
                        border-radius: 12px;
                        border-left: 4px solid #ff4d00;
                    }
                    .field-label {
                        font-size: 12px;
                        font-weight: 700;
                        color: #d06129;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 8px;
                    }
                    .field-value {
                        font-size: 16px;
                        color: #43160c;
                        margin: 0;
                        word-wrap: break-word;
                    }
                    .message-box {
                        background-color: #f5f5f5;
                        padding: 20px;
                        border-radius: 12px;
                        border: 1px solid #e0e0e0;
                        margin-top: 10px;
                    }
                    .footer {
                        background-color: #43160c;
                        padding: 30px;
                        text-align: center;
                        color: #faeacd;
                    }
                    .footer-text {
                        font-size: 14px;
                        margin: 8px 0;
                        color: #faeacd;
                    }
                    .footer-link {
                        color: #ff4d00;
                        text-decoration: none;
                        font-weight: 600;
                    }
                    .divider {
                        height: 1px;
                        background: linear-gradient(to right, transparent, #d06129, transparent);
                        margin: 30px 0;
                    }
                `}
            </style>
        </head>
        <body>
            <div className='container'>
                <div className='header'>
                    <img
                        src='https://buurtplatformgein.nl/images/bpglogo.png'
                        alt='Buurtplatform Gein'
                        className='logo'
                    />
                </div>
                <div className='content'>
                    <h1 className='title'>Nieuw Contactformulier Bericht</h1>
                    <p style={{ fontSize: '16px', color: '#5c220f', marginBottom: '30px' }}>
                        Je hebt een nieuw bericht ontvangen via het contactformulier op de website.
                    </p>

                    <div className='divider'></div>

                    <div className='field'>
                        <div className='field-label'>Naam</div>
                        <p className='field-value'>{name}</p>
                    </div>

                    <div className='field'>
                        <div className='field-label'>E-mailadres</div>
                        <p className='field-value'>
                            <a href={`mailto:${email}`} style={{ color: '#ff4d00', textDecoration: 'none' }}>
                                {email}
                            </a>
                        </p>
                    </div>

                    <div className='field'>
                        <div className='field-label'>Bericht</div>
                        <div className='message-box'>
                            <p className='field-value' style={{ whiteSpace: 'pre-wrap' }}>
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='footer'>
                    <p className='footer-text' style={{ fontWeight: '700', fontSize: '16px', marginBottom: '12px' }}>
                        Buurtplatform Gein
                    </p>
                    <p className='footer-text'>Voor elkaar. Met elkaar.</p>
                    <div style={{ height: '20px' }}></div>
                    <p className='footer-text' style={{ fontSize: '12px', opacity: '0.8' }}>
                        Woudrichemstraat 8, 1106 LG Amsterdam
                    </p>
                    <p className='footer-text' style={{ fontSize: '12px', opacity: '0.8' }}>
                        <a href='mailto:bewonersplatformgein@gmail.com' className='footer-link'>
                            bewonersplatformgein@gmail.com
                        </a>
                    </p>
                    <div style={{ height: '20px' }}></div>
                    <p className='footer-text' style={{ fontSize: '11px', opacity: '0.7' }}>
                        Dit bericht is automatisch gegenereerd vanuit het contactformulier.
                    </p>
                </div>
            </div>
        </body>
    </html>
);
