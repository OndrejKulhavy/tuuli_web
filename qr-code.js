document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject CSS for the modal
    const style = document.createElement('style');
    style.textContent = `
        .qr-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .qr-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .qr-modal-content {
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 90%;
            width: 340px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .qr-modal-overlay.active .qr-modal-content {
            transform: scale(1);
        }

        .qr-modal-header {
            margin-bottom: 1.5rem;
        }

        .qr-modal-header h3 {
            color: #fff;
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }

        .qr-modal-header p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
        }

        #qrcode {
            background: #fff;
            padding: 1rem;
            border-radius: 12px;
            margin: 0 auto;
            width: fit-content;
        }

        #qrcode img {
            display: block;
        }

        .qr-close-btn {
            margin-top: 1.5rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 0.75rem 2rem;
            border-radius: 100px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
        }

        .qr-close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #fff;
        }

        .qr-trigger-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            margin-left: 1.5rem;
        }

        .qr-trigger-btn:hover {
            color: #fff;
        }
    `;
    document.head.appendChild(style);

    // 2. Create Modal HTML
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'qr-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="qr-modal-content">
            <div class="qr-modal-header">
                <h3>Sdílet projekt</h3>
                <p>Naskenujte QR kód pro otevření stránky</p>
            </div>
            <div id="qrcode"></div>
            <button class="qr-close-btn">Zavřít</button>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // 3. Add Trigger Button to Nav
    const nav = document.querySelector('nav');
    if (nav) {
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'qr-trigger-btn';
        triggerBtn.setAttribute('aria-label', 'Zobrazit QR kód');
        triggerBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-qr-code-icon lucide-qr-code"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
        `;
        nav.appendChild(triggerBtn);

        // 4. Event Listeners
        let qrCodeObj = null;

        triggerBtn.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            
            const qrContainer = document.getElementById('qrcode');
            if (!qrCodeObj) {
                // Clear container just in case
                qrContainer.innerHTML = '';
                
                // Generate QR Code
                // Check if QRCode library is loaded
                if (typeof QRCode !== 'undefined') {
                    qrCodeObj = new QRCode(qrContainer, {
                        text: window.location.href,
                        width: 200,
                        height: 200,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                } else {
                    qrContainer.innerHTML = '<p style="color:black">QR Library not loaded</p>';
                }
            }
        });

        const closeBtn = modalOverlay.querySelector('.qr-close-btn');
        closeBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
});
