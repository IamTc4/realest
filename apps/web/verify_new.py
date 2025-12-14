from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Login Page (Check for Tabs)
        print("Navigating to Login Page...")
        page.goto("http://localhost:3000/login")
        page.screenshot(path="/home/jules/verification/1_login_new.png")
        print("Login screenshot taken.")

        # 2. Client Search Page
        print("Navigating to Client Search...")
        page.goto("http://localhost:3000/client/search")
        page.screenshot(path="/home/jules/verification/2_client_search.png")
        print("Client Search screenshot taken.")

        # 3. Agent Leads Page
        print("Navigating to Agent Leads...")
        page.goto("http://localhost:3000/agent/leads")
        page.screenshot(path="/home/jules/verification/3_agent_leads.png")
        print("Agent Leads screenshot taken.")

        # 4. Admin Properties Page
        print("Navigating to Admin Properties...")
        page.goto("http://localhost:3000/admin/properties")
        page.screenshot(path="/home/jules/verification/4_admin_properties.png")
        print("Admin Properties screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
