from playwright.sync_api import sync_playwright

def verify_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Increase viewport size for "Desktop" view
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # 1. Landing Page (Industrial/Premium Check)
        print("Navigating to Landing Page...")
        page.goto("http://localhost:3000/")
        # Wait for fonts and animations?
        page.wait_for_timeout(2000)
        page.screenshot(path="/home/jules/verification/1_landing_premium.png")
        print("Landing Page screenshot taken.")

        # 2. Login Page (Tabs and Styling)
        print("Navigating to Login Page...")
        page.goto("http://localhost:3000/login")
        page.screenshot(path="/home/jules/verification/2_login_premium.png")
        print("Login Page screenshot taken.")

        # 3. Admin Leads (New Page)
        # Needs auth locally, but if I navigate directly it might redirect or show empty if I mock it or if I rely on previous login state?
        # Let's try to mock the auth token in local storage if possible, or just visit the page if protection is client-side only (useEffect).
        print("Navigating to Admin Leads...")
        # Inject token logic? For now, let's just go there. The previous _app.js doesn't strictly block rendering immediately.
        page.goto("http://localhost:3000/admin/leads")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/3_admin_leads_premium.png")
        print("Admin Leads screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_visuals()
