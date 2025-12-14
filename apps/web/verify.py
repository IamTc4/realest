from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Login Page
        print("Navigating to Login Page...")
        page.goto("http://localhost:3000/login")
        page.screenshot(path="/home/jules/verification/1_login.png")
        print("Login screenshot taken.")

        # 2. Client Home (Direct Navigation - might redirect if auth check was strict but it's loose for now)
        print("Navigating to Client Home...")
        page.goto("http://localhost:3000/client")
        page.screenshot(path="/home/jules/verification/2_client_home.png")
        print("Client Home screenshot taken.")

        # 3. Agent Dashboard
        print("Navigating to Agent Dashboard...")
        page.goto("http://localhost:3000/agent")
        page.screenshot(path="/home/jules/verification/3_agent_dashboard.png")
        print("Agent Dashboard screenshot taken.")

        # 4. Admin Dashboard
        print("Navigating to Admin Dashboard...")
        page.goto("http://localhost:3000/admin")
        page.screenshot(path="/home/jules/verification/4_admin_dashboard.png")
        print("Admin Dashboard screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
