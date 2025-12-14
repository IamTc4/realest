from playwright.sync_api import sync_playwright

def verify_enterprise():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # 1. Admin Dashboard (Charts Check)
        print("Navigating to Admin Dashboard...")
        # Mock auth
        page.add_init_script("""
            localStorage.setItem('token', 'mock_token');
            localStorage.setItem('user', JSON.stringify({role: 'ADMIN', name: 'Admin User'}));
        """)

        page.goto("http://localhost:3000/admin")
        page.wait_for_timeout(3000) # Wait for charts
        page.screenshot(path="/home/jules/verification/4_admin_enterprise.png")
        print("Admin Dashboard screenshot taken.")

        # 2. Analytics Page
        print("Navigating to Analytics...")
        page.goto("http://localhost:3000/admin/analytics")
        page.wait_for_timeout(2000)
        page.screenshot(path="/home/jules/verification/5_admin_analytics.png")
        print("Analytics screenshot taken.")

        # 3. Automations Page
        print("Navigating to Automations...")
        page.goto("http://localhost:3000/admin/automations")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/6_admin_automations.png")
        print("Automations screenshot taken.")

        # 4. Settings Page (Phase 3 SaaS)
        print("Navigating to Settings...")
        page.goto("http://localhost:3000/admin/settings")
        page.wait_for_timeout(1500)
        page.screenshot(path="/home/jules/verification/8_admin_settings.png")
        print("Settings screenshot taken.")

        # 5. Agent Dashboard (Personalized)
        print("Navigating to Agent Dashboard...")
        page.add_init_script("""
             localStorage.setItem('user', JSON.stringify({role: 'AGENT', name: 'Agent Smith', stats: {totalLeads: 45, closedDeals: 12, totalRevenue: 12500000, rating: 4.9}}));
        """)
        page.goto("http://localhost:3000/agent")
        page.wait_for_timeout(2000)
        page.screenshot(path="/home/jules/verification/7_agent_enterprise.png")
        print("Agent Dashboard screenshot taken.")

        # 6. Client Chatbot Check
        print("Navigating to Client Home...")
        page.goto("http://localhost:3000/client")
        page.wait_for_timeout(1000)
        # Click chat button
        page.click("button.bg-emerald-600.rounded-full")
        page.wait_for_timeout(500)
        page.screenshot(path="/home/jules/verification/9_client_chatbot.png")
        print("Client Chatbot screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_enterprise()
